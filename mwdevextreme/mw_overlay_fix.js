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
 * Watch the DOM (MutationObserver) and, whenever a `.dx-overlay-content` has a
 * large transform that is nearly identical to its `.dx-overlay-wrapper` (i.e. it
 * is duplicating the offset), correct it back to just the relative offset:
 *
 *   content = content - wrapper   (usually lands at -1px, -1px)
 *
 * The correction is idempotent: once the content reaches a small value (-1px) it
 * no longer re-triggers. It does not interfere with popups (their wrapper sits at
 * 0,0) nor with correctly positioned overlays (their content is already small).
 *
 * This script is standalone (vanilla JS, no jQuery/DevExtreme dependencies), so it
 * can be loaded in any order and applies to ALL overlays.
 */
(function () {
	'use strict';

	// Thresholds (px). Absolute values above LARGE are considered "real position".
	var THRESHOLD_LARGE = 8;
	var THRESHOLD_CLOSE = 4;

	var scheduled = false;
	var observer = null;
	var debug = false;

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

	function isLarge(v) {
		return Math.abs(v.x) > THRESHOLD_LARGE || Math.abs(v.y) > THRESHOLD_LARGE;
	}

	function isClose(a, b) {
		return Math.abs(a.x - b.x) <= THRESHOLD_CLOSE && Math.abs(a.y - b.y) <= THRESHOLD_CLOSE;
	}

	// Corrects a content element whose transform duplicates the wrapper offset.
	function fixContent(content) {
		if (!isOverlayContent(content)) {
			return;
		}
		var wrapper = content.parentElement;
		if (!wrapper || !isOverlayWrapper(wrapper)) {
			return;
		}

		var c = parseTranslate(content);
		var w = parseTranslate(wrapper);
		if (!c || !w) {
			return;
		}

		// Only when BOTH have a "large" position AND are nearly identical
		// (the misalignment symptom). Avoids touching popups (wrapper at 0,0)
		// and healthy overlays.
		if (isLarge(w) && isLarge(c) && isClose(c, w)) {
			var dx = c.x - w.x;
			var dy = c.y - w.y;
			logAlways('[mw_overlay_fix] FIX APPLIED',
				'wrapper=(' + w.x + ',' + w.y + ')',
				'content=(' + c.x + ',' + c.y + ')',
				'-> (' + dx + ',' + dy + ')',
				content);
			log('mw_overlay_fix: fixing overlay', content,
				'wrapper=(' + w.x + ',' + w.y + ')',
				'content=(' + c.x + ',' + c.y + ')',
				'-> (' + dx + ',' + dy + ')');
			content.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
		}
	}

	function fixElementTree(root) {
		if (!root || root.nodeType !== 1) {
			return;
		}
		if (isOverlayContent(root)) {
			fixContent(root);
		}
		var contents = root.querySelectorAll('.dx-overlay-content');
		for (var i = 0; i < contents.length; i++) {
			fixContent(contents[i]);
		}
	}

	// Full sweep (corrects any overlay already present in the DOM).
	function sweep() {
		var contents = document.querySelectorAll('.dx-overlay-wrapper > .dx-overlay-content');
		for (var i = 0; i < contents.length; i++) {
			fixContent(contents[i]);
		}
	}

	// Deferred sweep (avoids repeated work during bursts of mutations).
	function scheduleSweep() {
		if (scheduled) {
			return;
		}
		scheduled = true;
		if (window.requestAnimationFrame) {
			window.requestAnimationFrame(function () {
				scheduled = false;
				sweep();
			});
		} else {
			window.setTimeout(function () {
				scheduled = false;
				sweep();
			}, 16);
		}
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

		logAlways('[mw_overlay_fix] loaded and active');
		if (debug) {
			logAlways('[mw_overlay_fix] debug mode enabled');
		}

		sweep();

		observer = new MutationObserver(function (mutations) {
			for (var i = 0; i < mutations.length; i++) {
				var m = mutations[i];
				if (m.type === 'attributes') {
					// An element whose `style` changed (DevExtreme updates the inline transform).
					if (isOverlayContent(m.target)) {
						fixContent(m.target);
					} else if (isOverlayWrapper(m.target)) {
						fixElementTree(m.target);
					}
				} else if (m.type === 'childList') {
					// New nodes (an overlay was just inserted into the DOM).
					for (var j = 0; j < m.addedNodes.length; j++) {
						fixElementTree(m.addedNodes[j]);
					}
				}
			}
			// Safety net: deferred sweep after bursts or at the end of animations.
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
