/**
 * mw_ui_login2 - Modern login UI controller
 * 
 * Extends mw_ui_login to work with the modern JS inputs system (mwmod_mw_jsobj_inputs_frmonpanel).
 * Maintains compatibility with iframe-based login submission.
 */
function mw_ui_login2(info) {
	mw_ui_login.call(this, info);
	
	/**
	 * Set the modern inputs manager (instead of legacy frm_man)
	 * @param {object} inputsman - Instance of mwmod_mw_jsobj_inputs_frmonpanel
	 */
	this.set_inputsman = function(inputsman) {
		this.inputsman = inputsman;
		
		// Show form container if hidden
		if (this.frm_container) {
			mw_show_obj(this.frm_container);
		}
	};
	
	/**
	 * Set form element for submission
	 * @param {HTMLFormElement} frm - The form element
	 */
	this.set_frm = function(frm) {
		this.frm = frm;
		
		var _this = this;
		
		// Add submit handler with validation
		if (frm) {
			frm.addEventListener('submit', function(e) {
				if (_this.inputsman && !_this.inputsman.validate()) {
					e.preventDefault();
					return false;
				}
				
				// Disable form during submission
				if (_this.inputsman) {
					_this.disable_form(false);
				}
			});
		}
	};
	
	/**
	 * Disable/enable form inputs
	 * @param {boolean} enable - true to enable, false to disable
	 */
	this.disable_form = function(enable) {
		if (!this.inputsman) return;
		
		// Disable all inputs
		var items = this.inputsman.items || [];
		for (var i = 0; i < items.length; i++) {
			if (items[i].setDisabled) {
				items[i].setDisabled(!enable);
			}
		}
		
		// Disable submit button
		var submitBtn = this.get_submit_btn();
		if (submitBtn) {
			submitBtn.disabled = !enable;
		}
	};
	
	/**
	 * Get the submit button element
	 */
	this.get_submit_btn = function() {
		if (this.frm) {
			return this.frm.querySelector('button[type="submit"]');
		}
		return null;
	};
	
	/**
	 * Clear password field
	 */
	this.clear_password = function() {
		if (!this.inputsman) return;
		
		var passInput = this.inputsman.getChildByCod('login_pass');
		if (passInput && passInput.setValue) {
			passInput.setValue('');
		}
	};
	
	/**
	 * Override re_enable_frm for modern inputs
	 */
	var parent_re_enable_frm = this.re_enable_frm;
	this.re_enable_frm = function() {
		this.stop_re_enable_timeout();
		
		// If using modern inputs
		if (this.inputsman) {
			this.clear_password();
			this.disable_form(true);
		} 
		// Fall back to legacy frm_man
		else if (this.frm_man) {
			if (this.input_pass_man) {
				this.input_pass_man.set_value("");
			}
			this.frm_man.cant_submit = false;
			this.frm_man.disable_all_submit_btns(true);
		}
		
		var e;
		if (e = this.get_ui_elem("wait")) {
			$(e).removeClass("complete");
			mw_hide_obj(e);
		}
	};
	
	/**
	 * Override submit_frm_on_self for modern inputs
	 */
	this.submit_frm_on_self = function() {
		var frm = this.frm;
		
		// Try legacy frm_man first
		if (this.frm_man && this.frm_man.frm) {
			frm = this.frm_man.frm;
		}
		
		if (!frm) {
			var formId = this.params.get_param("loginform");
			if (formId) {
				frm = document.getElementById(formId);
			}
		}
		
		if (!frm) {
			return false;
		}
		
		frm.target = "_self";
		frm.action = this.params.get_param_or_def("onokurl", "index.php");
		frm.submit();
		return true;
	};
	
	/**
	 * Override requestToken for modern inputs
	 */
	var parent_requestToken = this.requestToken;
	this.requestToken = function() {
		// Disable submit during token request
		this.disable_form(false);
		
		var url = this.get_dl_url("logintoken");
		var a = this.getAjaxLoader();
		var _this = this;
		a.set_url(url);
		a.addOnLoadAcctionUnique(function() { _this.on_token_response(); });
		a.run();
	};
	
	/**
	 * Override on_token_response for modern inputs
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
		
		// Set token in hidden input
		var tokenInputId = this.params.get_param("token");
		if (tokenInputId) {
			var tokenInput = document.getElementById(tokenInputId);
			if (tokenInput) {
				tokenInput.value = data.get_param("chiwawa");
			}
		}
		
		// Also try legacy method
		if (this.frm_man) {
			var tokeninput = this.frm_man.get_input_manager("login_token");
			if (tokeninput) {
				tokeninput.set_value(data.get_param("chiwawa"));
			}
		}
		
		this.disable_form(true);
	};
	
	/**
	 * Override after_init for modern inputs
	 */
	var parent_after_init = this.after_init;
	this.after_init_more = function() {
		var _this = this;
		
		// Set frm from params if provided
		var formId = this.params.get_param("loginform");
		if (formId) {
			var frm = document.getElementById(formId);
			if (frm && !this.frm) {
				this.set_frm(frm);
			}
		}
		
		// Show form container
		if (this.frm_container && this.inputsman) {
			mw_show_obj(this.frm_container);
		}
	};
}

// Inherit from mw_ui_login
mw_ui_login2.prototype = Object.create(mw_ui_login.prototype);
mw_ui_login2.prototype.constructor = mw_ui_login2;
