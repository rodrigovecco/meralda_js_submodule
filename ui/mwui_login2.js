/**
 * mw_ui_login2 - Modern login UI controller with native HTML
 * 
 * Standalone UI (no inheritance) for native HTML form elements.
 * Handles iframe-based login, brute force protection, and CSRF tokens.
 */
function mw_ui_login2(info) {
	mw_ui.call(this, info);
	
	/** @type {HTMLFormElement} */
	this.frm = null;
	
	/** @type {HTMLInputElement} */
	this.input_user = null;
	
	/** @type {HTMLInputElement} */
	this.input_pass = null;
	
	/** @type {HTMLInputElement} */
	this.input_token = null;
	
	/** @type {HTMLElement} */
	this.frm_container = null;
	
	/** @type {HTMLElement} */
	this.wait_container = null;
	
	/** @type {object} DevExtreme progress bar instance */
	this.wait_progressBar = null;
	
	/** @type {boolean} Flag when waiting for iframe response */
	this.waiting_response = false;
	
	/** @type {number} Interval for seconds countdown */
	this.re_enable_timeout_seconds = null;
	
	/** @type {number} Interval for progress bar fraction */
	this.re_enable_timeout_fraction = null;
	
	/** @type {number} Remaining seconds for re-enable */
	this.re_enable_on_seconds = 0;
	
	/** @type {number} Total fractions for progress */
	this.re_enable_on_fraction_total = 0;
	
	/** @type {number} Passed fractions */
	this.re_enable_on_fraction_passed = 0;
	
	// =========================================================================
	// Element getters
	// =========================================================================
	
	/**
	 * Get form element by param ID
	 * @returns {HTMLFormElement|null}
	 */
	this.get_frm = function() {
		if (this.frm) return this.frm;
		var formId = this.get_ui_elem_id("loginform");
		if (formId) {
			this.frm = document.getElementById(formId);
		}
		return this.frm;
	};
	
	/**
	 * Get user input element
	 * @returns {HTMLInputElement|null}
	 */
	this.get_input_user = function() {
		if (this.input_user) return this.input_user;
		var inputId = this.get_ui_elem_id("input_user");
		if (inputId) {
			this.input_user = document.getElementById(inputId);
		}
		return this.input_user;
	};
	
	/**
	 * Get password input element
	 * @returns {HTMLInputElement|null}
	 */
	this.get_input_pass = function() {
		if (this.input_pass) return this.input_pass;
		var inputId = this.get_ui_elem_id("input_pass");
		if (inputId) {
			this.input_pass = document.getElementById(inputId);
		}
		return this.input_pass;
	};
	
	/**
	 * Get token input element
	 * @returns {HTMLInputElement|null}
	 */
	this.get_input_token = function() {
		if (this.input_token) return this.input_token;
		var inputId = this.get_ui_elem_id("token");
		if (inputId) {
			this.input_token = document.getElementById(inputId);
		}
		return this.input_token;
	};
	
	/**
	 * Get the submit button element
	 * @returns {HTMLButtonElement|null}
	 */
	this.get_submit_btn = function() {
		var frm = this.get_frm();
		if (frm) {
			return frm.querySelector('button[type="submit"]');
		}
		return null;
	};
	
	// =========================================================================
	// Form control
	// =========================================================================
	
	/**
	 * Enable/disable form inputs and button
	 * @param {boolean} enable - true to enable, false to disable
	 */
	this.disable_form = function(enable) {
		var user = this.get_input_user();
		var pass = this.get_input_pass();
		var btn = this.get_submit_btn();
		
		if (user) user.disabled = !enable;
		if (pass) pass.disabled = !enable;
		if (btn) btn.disabled = !enable;
	};
	
	/**
	 * Clear password field
	 */
	this.clear_password = function() {
		var pass = this.get_input_pass();
		if (pass) {
			pass.value = '';
		}
	};
	
	/**
	 * Submit form to self (for direct mode or after successful login)
	 */
	this.submit_frm_on_self = function() {
		var frm = this.get_frm();
		if (!frm) return false;
		
		frm.target = "_self";
		frm.action = this.params.get_param_or_def("onokurl", "index.php");
		frm.submit();
		return true;
	};
	
	/**
	 * Setup form submit handler
	 * Disables form while waiting for iframe response
	 */
	this.setup_form_handler = function() {
		var frm = this.get_frm();
		if (!frm) return;
		
		var _this = this;
		frm.addEventListener('submit', function(e) {
			// Don't submit if already waiting
			if (_this.waiting_response) {
				e.preventDefault();
				return false;
			}
			
			// Mark as waiting
			_this.waiting_response = true;
			
			// Disable form AFTER browser captures form values for POST
			// Using setTimeout ensures the form data is collected first
			setTimeout(function() {
				_this.disable_form(false);
			}, 10);
			
			// Allow form to submit to iframe
			return true;
		});
	};
	
	// =========================================================================
	// CSRF Token
	// =========================================================================
	
	/**
	 * Request CSRF token before enabling login
	 */
	this.requestToken = function() {
		this.disable_form(false);
		
		var url = this.get_dl_url("logintoken");
		var a = this.getAjaxLoader();
		var _this = this;
		a.set_url(url);
		a.addOnLoadAcctionUnique(function() { _this.on_token_response(); });
		a.run();
	};
	
	/**
	 * Handle token response - enable form once token received
	 */
	this.on_token_response = function() {
		var data = this.getAjaxDataResponse(true);
		if (!data) {
			this.disable_form(true);
			return;
		}
		
		if (!data.get_param("ok")) {
			this.disable_form(true);
			return;
		}
		
		var token = data.get_param("chiwawa");
		var tokenInput = this.get_input_token();
		if (tokenInput) {
			tokenInput.value = token;
		}
		
		this.disable_form(true);
	};
	
	// =========================================================================
	// iframe response handling
	// =========================================================================
	
	/**
	 * Handle iframe post response
	 * Called from iframe after login attempt
	 * @param {object} data - Response data
	 */
	this.on_post_response = function(data) {
		this.waiting_response = false;
		
		var dataman = new mw_obj();
		dataman.set_params(data);
		console.log("on_post_response", data);
		
		// Login successful
		if (dataman.get_param_or_def("ok", false)) {
			if (!this.submit_frm_on_self()) {
				window.location = this.params.get_param_or_def("onokurl", "index.php");
			}
			return;
		}
		
		// Check if token expired - show reload message and disable everything
		if (dataman.get_param("result.token_expired")) {
			this.on_token_expired();
			return;
		}
		
		// Show error message
		var p;
		if (p = dataman.get_param_if_object("msg")) {
			this.show_popup_notify(p);
		} else if (p = dataman.get_param_if_string("msg")) {
			// Direct string message from login failure
			this.show_popup_notify({message: p, type: "error"});
		} else if (p = dataman.get_param_if_string("result.msg")) {
			this.show_popup_notify({message: p, type: "warning"});
		} else {
			// Default error message when no specific message is provided
			this.show_popup_notify({
				message: this.params.get_param_or_def("default_error_msg", "Usuario o contraseña incorrectos"), 
				type: "error"
			});
		}
		
		// Handle brute force timeout (check both paths for compatibility)
		var timeoutData = dataman.get_param("result.login_not_allowed_timeout") || dataman.get_param("login_not_allowed_timeout");
		if (timeoutData && timeoutData.not_allowed) {
			var seconds = timeoutData.seconds;
			console.log("Brute force timeout detected, seconds:", seconds);
			this.start_re_enable_timeout(seconds);
		} else {
			// No timeout - just re-enable form
			this.re_enable_frm();
		}
	};
	
	/**
	 * Handle token expired - show reload message and disable form permanently
	 */
	this.on_token_expired = function() {
		var msg = this.params.get_param_or_def("token_expired_msg", "La sesión ha expirado. Por favor, recarga la página.");
		
		// Show error message
		this.show_popup_notify({
			message: msg,
			type: "error"
		});
		
		// Keep form disabled - don't re-enable
		this.disable_form(false);
		
		// Show reload button in wait container
		var waitElem = this.get_ui_elem("wait");
		if (waitElem) {
			waitElem.innerHTML = '<div class="text-center p-3">' +
				'<p class="text-danger mb-3"><i class="fa fa-exclamation-triangle"></i> ' + msg + '</p>' +
				'<button type="button" class="btn btn-primary" onclick="window.location.reload()">' +
				this.params.get_param_or_def("reload_btn_text", "Recargar página") +
				'</button></div>';
			mw_show_obj(waitElem);
		}
	};
	
	// =========================================================================
	// Brute force timeout handling
	// =========================================================================
	
	/**
	 * Stop all re-enable timeouts
	 */
	this.stop_re_enable_timeout = function() {
		if (this.re_enable_timeout_seconds) {
			clearInterval(this.re_enable_timeout_seconds);
			this.re_enable_timeout_seconds = null;
		}
		if (this.re_enable_timeout_fraction) {
			clearInterval(this.re_enable_timeout_fraction);
			this.re_enable_timeout_fraction = null;
		}
	};
	
	/**
	 * Start timeout countdown (brute force protection)
	 * @param {number} seconds - Seconds to wait
	 */
	this.start_re_enable_timeout = function(seconds) {
		seconds = mw_getInt(seconds);
		if (seconds < 1) {
			seconds = 1;
		}
		
		var _this = this;
		this.stop_re_enable_timeout();
		this.re_enable_on_seconds = seconds;
		this.re_enable_on_fraction_total = seconds * 10;
		this.re_enable_on_fraction_passed = 0;
		
		if (this.wait_progressBar) {
			this.wait_progressBar.option("value", 0);
		}
		
		var e;
		if (e = this.get_ui_elem("wait")) {
			$(e).removeClass("complete");
			mw_show_obj(e);
		}
		
		this.re_enable_timeout_seconds = setInterval(function() { _this.re_enable_seconds_step(); }, 1000);
		this.re_enable_timeout_fraction = setInterval(function() { _this.re_enable_fraction_step(); }, 100);
	};
	
	/**
	 * Countdown step (every second)
	 */
	this.re_enable_seconds_step = function() {
		if (this.re_enable_on_seconds <= 0) {
			this.re_enable_frm();
			return;
		}
		this.re_enable_on_seconds--;
	};
	
	/**
	 * Progress bar fraction step (every 100ms)
	 */
	this.re_enable_fraction_step = function() {
		this.re_enable_on_fraction_passed++;
		if (this.wait_progressBar) {
			this.wait_progressBar.option("value", this.get_wait_bar_progress());
		}
	};
	
	/**
	 * Get progress percentage for wait bar
	 * @returns {number}
	 */
	this.get_wait_bar_progress = function() {
		if (!this.re_enable_on_fraction_total) {
			return 0;
		}
		return (this.re_enable_on_fraction_passed / this.re_enable_on_fraction_total) * 100;
	};
	
	/**
	 * Get waiting message for progress bar
	 * @returns {string}
	 */
	this.get_waiting_msg = function() {
		return this.params.get_param("please_wait") + " " + this.re_enable_on_seconds + " " + this.params.get_param("seconds") + ".";
	};
	
	/**
	 * Called when progress bar completes
	 */
	this.onWaitprogressBarComplete = function() {
		if (this.re_enable_timeout_fraction) {
			clearInterval(this.re_enable_timeout_fraction);
			this.re_enable_timeout_fraction = null;
		}
	};
	
	/**
	 * Re-enable form after timeout or failed login
	 */
	this.re_enable_frm = function() {
		this.stop_re_enable_timeout();
		this.waiting_response = false;
		this.clear_password();
		this.disable_form(true);
		
		// Hide wait container
		var e;
		if (e = this.get_ui_elem("wait")) {
			$(e).removeClass("complete");
			mw_hide_obj(e);
		}
	};
	
	// =========================================================================
	// Initialization
	// =========================================================================
	
	/**
	 * Override after_init from mw_ui
	 * Called automatically by mw_ui.init()
	 */
	this.after_init = function() {
		var _this = this;
		var e;
		
		// Setup container
		if (e = this.get_ui_elem("container")) {
			this.set_container(e);
		}
		
		// Setup wait container with DevExtreme progress bar
		if (e = this.get_ui_elem("wait")) {
			this.wait_container = e;
			this.wait_progressBar = $(e).dxProgressBar({
				min: 0,
				max: 100,
				width: "100%",
				statusFormat: function(value) {
					return _this.get_waiting_msg();
				},
				onComplete: function(ev) {
					_this.onWaitprogressBarComplete();
					ev.element.addClass("complete");
				}
			}).dxProgressBar("instance");
		}
		
		// Setup form container
		if (e = this.get_ui_elem("loginfrm")) {
			this.frm_container = e;
		}
		
		// Cache element references
		this.get_frm();
		this.get_input_user();
		this.get_input_pass();
		this.get_input_token();
		
		// Setup form submit handler
		this.setup_form_handler();
		
		// Show form container
		if (this.frm_container) {
			mw_show_obj(this.frm_container);
		}
		
		// Request CSRF token if enabled (via AJAX)
		if (this.params.get_param("requestTokenMode")) {
			this.requestToken();
		}
	};
}

// Inherit from mw_ui (not mw_ui_login)
mw_ui_login2.prototype = Object.create(mw_ui.prototype);
mw_ui_login2.prototype.constructor = mw_ui_login2;
