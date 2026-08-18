/**
 * mw_overlay_fix.js
 * =================
 * Global mitigation for the DevExtreme overlay misalignment issue
 * (popups, dropdowns, filter overlays, dateboxes, validation messages, etc.).
 *
 * Problem
 * -------
 * On some machines/browsers the overlay content ends up offset. An overlay is
 * made of two nested layers with inline `transform`:
 *
 *   .dx-overlay-wrapper  -> translate(anchor absolute position)  e.g. (260px, 308px)
 *   .dx-overlay-content  -> translate(relative offset)           e.g. (-1px, -1px)
 *
 * In the CORRECT case the content stays at `translate(-1px, -1px)` (only
 * compensating the 1px border). In the BROKEN case the content duplicates the
 * wrapper offset:
 *
 *   wrapper (260px, 308px)  +  content (259px, 307px)   =>  diff (-1px, -1px)
 *
 * i.e. the content ends up at `translate(wrapper - 1px)` instead of
 * `translate(-1px, -1px)`. This happens because a `transform` on an ancestor
 * creates a new "containing block" and breaks the `offsetParent` calculation
 * that DevExtreme relies on.
 *
 * Solution
 * --------
 * Watch the DOM (MutationObserver) and, after a short settle delay (so we never
 * fight DevExtreme's open/focus/animation phase), fix any content whose transform
 * has a LARGE component that duplicates its wrapper's component.
 *
 * The correction is per-axis and idempotent:
 *
 *   content.axis = content.axis - wrapper.axis   (lands near 0 / -1)
 *
 * An axis is fixed only when BOTH the content and the wrapper are large on that
 * axis AND nearly equal (i.e. the content is duplicating the wrapper's absolute
 * offset). This handles:
 *
 * - The calendar case: broken only on X (content `translate(358px, -2px)` vs
 *   wrapper `translate(358px, 308px)`), while Y is already the correct small
 *   relative offset. An all-or-nothing check would miss it.
 * - The scroll case: DevExtreme hides dropdowns with `opacity: 0` +
 *   `dx-state-invisible` when the page/grid scrolls, but their transform is still
 *   updated (and can be broken). We correct them even while hidden (we only skip
 *   `display:none`), so they are aligned when shown again.
 *
 * The settle delay avoids touching content while it is still being shown/focused,
 * which previously made selectboxes close immediately (lost focus).
 *
 * Popups (wrapper at 0,0) and healthy overlays (small content offset) are never
 * touched.
 *
 * This script is standalone (vanilla JS, no jQuery/DevExtreme dependencies), so it
 * can be loaded in any order and applies to ALL overlays.
 */
(function () {
	'use strict';

	// Thresholds (px).
	// LARGE: a transform component above this is treated as "an absolute position
	//        leaked into the relative offset". Legit relative offsets are tiny
	//        (-1 / -2 / 0, or a small `offset`), so anything above this that also
	//        matches its wrapper is a duplication.
	// CLOSE: how close a content component must be to its wrapper component to be
	//        considered a duplication of the wrapper position.
	var THRESHOLD_LARGE = 8;
	var THRESHOLD_CLOSE = 4;

	// Delay after the last DOM change before correcting, so we never interrupt
	// DevExtreme while it is still showing/focusing an overlay. Long enough for
	// selectbox dropdown popups to finish their fade-in before we touch them.
	var SETTLE_MS = 400;

	var sweepTimer = null;
	var observer = null;
	var debug = false;
	var observeOnly = false;

	function log() {
		if (debug && window.console) {
			window.console.log.apply(window.console, arguments);
		}
	}

	// Always-on log (independent of the debug flag) so you can confirm the
	// script is loaded and see exactly when a correction is applied.
	function logAlways() {
		if (window.console) {
			window.console.log.apply(window.console, arguments);
		}
	}

	// Checks whether an element has a class (supports SVG, where className is SVGAnimatedString).
	function hasClass(el, cls) {
		if (!el || el.nodeType !== 1) {
			return false;
		}
		var cn = el.className;
		if (!cn) {
			return false;
		}
		if (typeof cn === 'string') {
			return cn.indexOf(cls) !== -1;
		}
		if (cn.baseVal && typeof cn.baseVal === 'string') {
			return cn.baseVal.indexOf(cls) !== -1;
		}
		return String(cn).indexOf(cls) !== -1;
	}

	function isOverlayContent(el) {
		return hasClass(el, 'dx-overlay-content');
	}

	function isOverlayWrapper(el) {
		return hasClass(el, 'dx-overlay-wrapper');
	}

	// Extracts the translation from an inline `transform` style:
	// "translate(260px, 308px)" or "translate3d(260px, 308px, 0px)".
	function parseTranslate(el) {
		if (!el || !el.style || !el.style.transform) {
			return null;
		}
		var m = /translate(?:3d)?\(\s*(-?[\d.]+)px\s*,\s*(-?[\d.]+)px/.exec(el.style.transform);
		if (!m) {
			return null;
		}
		return { x: parseFloat(m[1]), y: parseFloat(m[2]) };
	}

	// Returns true when an element is actually rendered (not `display:none`).
	// We intentionally do NOT skip `opacity:0` / `visibility:hidden` overlays:
	// DevExtreme hides dropdowns with `opacity:0` + `dx-state-invisible` on
	// scroll, but their transform is still updated and can be broken. Correcting
	// them while hidden keeps them aligned when they are shown again.
	function isRendered(el) {
		return !el || !el.style || el.style.display !== 'none';
	}

	// True while an overlay is still fading in/out (opacity mid-transition).
	// Modifying the transform during this window can break DevExtreme and make
	// selectbox dropdowns close immediately, so we skip and re-check later.
	function isAnimating(el) {
		if (!el || !window.getComputedStyle) {
			return false;
		}
		var o = parseFloat(window.getComputedStyle(el).opacity);
		return o > 0 && o < 1;
	}

	// Short string snapshot of an element's opening tag (includes its inline
	// style), so the exact values can be copied from the console even after the
	// overlay has been removed from the DOM.
	function snapshot(el) {
		if (!el || !el.outerHTML) {
			return '';
		}
		var s = el.outerHTML;
		return s.length > 320 ? s.slice(0, 320) + '…' : s;
	}

	// Corrects a content element whose transform duplicates the wrapper offset.
	// Correction is per-axis and requires BOTH the content and the wrapper to be
	// large on that axis AND nearly equal (duplication). Each such axis is reduced
	// by the wrapper value, leaving only the small relative offset.
	function fixContent(content) {
		if (!isOverlayContent(content)) {
			return;
		}
		var wrapper = content.parentElement;
		if (!wrapper || !isOverlayWrapper(wrapper)) {
			return;
		}
		if (!isRendered(content)) {
			return;
		}

		var c = parseTranslate(content);
		var w = parseTranslate(wrapper);

		// Diagnostic: if the content has a large (absolute-looking) offset but we
		// cannot read the wrapper transform, report it so we can see the actual
		// structure (e.g. selectbox dropdowns nested inside a filter menu).
		if (c && !w) {
			if (Math.abs(c.x) > THRESHOLD_LARGE || Math.abs(c.y) > THRESHOLD_LARGE) {
				logAlways('[mw_overlay_fix] NOT FIXED (wrapper has no parseable transform)',
					'wrapper.style.transform=', wrapper.style ? wrapper.style.transform : undefined,
					'content=(' + c.x + ',' + c.y + ')',
					'wrapperHTML=', snapshot(wrapper),
					'contentHTML=', snapshot(content));
			}
			return;
		}
		if (!c || !w) {
			return;
		}

		// Skip overlays that are still fading in/out: correcting them mid-animation
		// can make selectbox dropdowns close immediately. Re-check once settled.
		if (isAnimating(content) || isAnimating(wrapper)) {
			scheduleSweep();
			return;
		}

		var nx = c.x;
		var ny = c.y;
		var changed = false;

		if (Math.abs(c.x) > THRESHOLD_LARGE && Math.abs(w.x) > THRESHOLD_LARGE && Math.abs(c.x - w.x) <= THRESHOLD_CLOSE) {
			nx = c.x - w.x;
			changed = true;
		}
		if (Math.abs(c.y) > THRESHOLD_LARGE && Math.abs(w.y) > THRESHOLD_LARGE && Math.abs(c.y - w.y) <= THRESHOLD_CLOSE) {
			ny = c.y - w.y;
			changed = true;
		}

		// Diagnostic: content looks broken (large offset) but the per-axis gate
		// did not trigger, so we can see why (wrapper not large, or not close).
		if (!changed && (Math.abs(c.x) > THRESHOLD_LARGE || Math.abs(c.y) > THRESHOLD_LARGE)) {
			logAlways('[mw_overlay_fix] NOT FIXED (gate failed)',
				'wrapper=(' + w.x + ',' + w.y + ')',
				'content=(' + c.x + ',' + c.y + ')',
				'wrapperHTML=', snapshot(wrapper),
				'contentHTML=', snapshot(content));
			return;
		}
		if (!changed) {
			return;
		}

		// Observe-only mode: report what WOULD be fixed, but do not touch the DOM.
		if (observeOnly) {
			logAlways('[mw_overlay_fix] OBSERVE ONLY (would fix)',
				'wrapper=(' + w.x + ',' + w.y + ')',
				'content=(' + c.x + ',' + c.y + ')',
				'-> (' + nx + ',' + ny + ')');
			return;
		}

		// Apply instantly (no CSS transition) so the fix does not animate/fight
		// DevExtreme, then restore the previous transition value.
		var prevTransition = content.style.transition;
		content.style.transition = 'none';
		content.style.transform = 'translate(' + nx + 'px, ' + ny + 'px)';
		void content.getBoundingClientRect(); // force a reflow so it is applied now
		if (prevTransition) {
			content.style.transition = prevTransition;
		} else {
			content.style.removeProperty('transition');
		}

		logAlways('[mw_overlay_fix] FIX APPLIED',
			'wrapper=(' + w.x + ',' + w.y + ')',
			'content=(' + c.x + ',' + c.y + ')',
			'-> (' + nx + ',' + ny + ')',
			content);
		log('mw_overlay_fix: fixing overlay', content,
			'wrapper=(' + w.x + ',' + w.y + ')',
			'content=(' + c.x + ',' + c.y + ')',
			'-> (' + nx + ',' + ny + ')');
	}

	// Full sweep (corrects any overlay already present in the DOM).
	function sweep() {
		var contents = document.querySelectorAll('.dx-overlay-wrapper > .dx-overlay-content');
		for (var i = 0; i < contents.length; i++) {
			fixContent(contents[i]);
		}
	}

	// Debounced sweep: correct only after the DOM has been quiet for SETTLE_MS.
	// This decouples the fix from DevExtreme's render/focus phase, which is what
	// previously caused selectboxes to lose focus and close immediately.
	function scheduleSweep() {
		if (sweepTimer) {
			window.clearTimeout(sweepTimer);
		}
		sweepTimer = window.setTimeout(function () {
			sweepTimer = null;
			sweep();
		}, SETTLE_MS);
	}

	function start() {
		if (observer) {
			return;
		}
		if (!document.body) {
			return;
		}

		// Enable diagnostic logging from the console: window.__dxOverlayFixDebug = true
		debug = window.__dxOverlayFixDebug === true;
		// Observe-only mode (log, never modify): window.__dxOverlayFixObserve = true
		observeOnly = window.__dxOverlayFixObserve === true;

		logAlways('[mw_overlay_fix] loaded and active');
		if (debug) {
			logAlways('[mw_overlay_fix] debug mode enabled');
		}

		sweep();

		observer = new MutationObserver(function () {
			// Any DOM/style change (an overlay was inserted, shown, or repositioned)
			// just schedules a debounced sweep. The actual correction runs later,
			// once DevExtreme has settled, so we never interrupt focus/animation.
			scheduleSweep();
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['style']
		});

		// DevExtreme repositions overlays on scroll/resize; re-check.
		window.addEventListener('scroll', scheduleSweep, true);
		window.addEventListener('resize', scheduleSweep, true);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', start);
	} else {
		start();
	}
})();
