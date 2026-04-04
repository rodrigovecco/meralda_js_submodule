/**
 * UI2 Remember Login Data - Form validation and UI handling
 * 
 * Simple standalone validation for password reset forms.
 * Uses native HTML validation + custom JS validation.
 */

/**
 * @class mw_ui_rememberlogin
 * @description Form validation manager for remember login data UI
 */
function mw_ui_rememberlogin() {
	this.params = new mw_obj();
	this.form = null;
	this.mode = 'request'; // 'request' or 'reset'
}

/**
 * Initialize with parameters
 * @param {object} params - Configuration object
 */
mw_ui_rememberlogin.prototype.init = function(params) {
	this.params.set_params(params);
	this.mode = this.params.get_param_or_def("mode", "request");
	
	var formId = this.params.get_param("uielemsids.form");
	if (formId) {
		this.form = document.getElementById(formId);
	}
	
	this.setup_validation();
	this.setup_password_match();
};

/**
 * Get element by UI elem ID from params
 * @param {string} cod - Element code
 * @returns {HTMLElement|null}
 */
mw_ui_rememberlogin.prototype.get_ui_elem = function(cod) {
	var id = this.params.get_param("uielemsids." + cod);
	if (!id) return null;
	return document.getElementById(id);
};

/**
 * Setup form validation
 */
mw_ui_rememberlogin.prototype.setup_validation = function() {
	if (!this.form) return;
	
	var _this = this;
	this.form.addEventListener('submit', function(e) {
		// Clear previous errors
		_this.clear_errors();
		
		// Validate
		if (!_this.validate()) {
			e.preventDefault();
			return false;
		}
		
		return true;
	});
};

/**
 * Setup password match validation
 */
mw_ui_rememberlogin.prototype.setup_password_match = function() {
	if (this.mode !== 'reset') return;
	
	var passInput = this.get_ui_elem("input_pass");
	var passConfirmInput = this.get_ui_elem("input_pass_confirm");
	
	if (!passInput || !passConfirmInput) return;
	
	var _this = this;
	
	// Validate on blur
	passConfirmInput.addEventListener('blur', function() {
		_this.validate_password_match();
	});
	
	passInput.addEventListener('blur', function() {
		if (passConfirmInput.value) {
			_this.validate_password_match();
		}
	});
};

/**
 * Validate password match
 * @returns {boolean}
 */
mw_ui_rememberlogin.prototype.validate_password_match = function() {
	var passInput = this.get_ui_elem("input_pass");
	var passConfirmInput = this.get_ui_elem("input_pass_confirm");
	
	if (!passInput || !passConfirmInput) return true;
	
	if (passInput.value !== passConfirmInput.value) {
		this.show_input_error(passConfirmInput, 
			this.params.get_param_or_def("msg_passwords_dont_match", "Las contraseñas no coinciden"));
		return false;
	}
	
	this.clear_input_error(passConfirmInput);
	return true;
};

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
mw_ui_rememberlogin.prototype.validate_email = function(email) {
	var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return re.test(email);
};

/**
 * Validate all form fields
 * @returns {boolean}
 */
mw_ui_rememberlogin.prototype.validate = function() {
	var valid = true;
	
	if (this.mode === 'request') {
		// Validate email field
		var emailInput = this.get_ui_elem("input_email");
		if (emailInput) {
			if (!emailInput.value.trim()) {
				this.show_input_error(emailInput, 
					this.params.get_param_or_def("msg_required", "Campo requerido"));
				valid = false;
			} else if (!this.validate_email(emailInput.value)) {
				this.show_input_error(emailInput, 
					this.params.get_param_or_def("msg_invalid_email", "Correo electrónico inválido"));
				valid = false;
			}
		}
	} else {
		// Validate username
		var unameInput = this.get_ui_elem("input_user");
		if (unameInput && !unameInput.value.trim()) {
			this.show_input_error(unameInput, 
				this.params.get_param_or_def("msg_required", "Campo requerido"));
			valid = false;
		}
		
		// Validate token
		var tokenInput = this.get_ui_elem("input_token");
		if (tokenInput && !tokenInput.value.trim()) {
			this.show_input_error(tokenInput, 
				this.params.get_param_or_def("msg_required", "Campo requerido"));
			valid = false;
		}
		
		// Validate password fields if present
		var passInput = this.get_ui_elem("input_pass");
		var passConfirmInput = this.get_ui_elem("input_pass_confirm");
		
		if (passInput) {
			if (!passInput.value) {
				this.show_input_error(passInput, 
					this.params.get_param_or_def("msg_required", "Campo requerido"));
				valid = false;
			} else {
				// Password policy validation
				valid = this.validate_password_policy(passInput) && valid;
			}
		}
		
		if (passConfirmInput) {
			if (!passConfirmInput.value) {
				this.show_input_error(passConfirmInput, 
					this.params.get_param_or_def("msg_required", "Campo requerido"));
				valid = false;
			} else if (!this.validate_password_match()) {
				valid = false;
			}
		}
	}
	
	return valid;
};

/**
 * Validate password against policy
 * @param {HTMLElement} input
 * @returns {boolean}
 */
mw_ui_rememberlogin.prototype.validate_password_policy = function(input) {
	var value = input.value;
	var minLen = this.params.get_param_or_def("pass_min_length", 0);
	
	if (minLen > 0 && value.length < minLen) {
		this.show_input_error(input, 
			this.params.get_param_or_def("msg_pass_min_length", "La contraseña es muy corta"));
		return false;
	}
	
	if (this.params.get_param("pass_require_uppercase") && !/[A-Z]/.test(value)) {
		this.show_input_error(input, 
			this.params.get_param_or_def("msg_pass_require_uppercase", "Debe contener mayúsculas"));
		return false;
	}
	
	if (this.params.get_param("pass_require_lowercase") && !/[a-z]/.test(value)) {
		this.show_input_error(input, 
			this.params.get_param_or_def("msg_pass_require_lowercase", "Debe contener minúsculas"));
		return false;
	}
	
	if (this.params.get_param("pass_require_number") && !/[0-9]/.test(value)) {
		this.show_input_error(input, 
			this.params.get_param_or_def("msg_pass_require_number", "Debe contener números"));
		return false;
	}
	
	if (this.params.get_param("pass_require_special") && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
		this.show_input_error(input, 
			this.params.get_param_or_def("msg_pass_require_special", "Debe contener caracteres especiales"));
		return false;
	}
	
	return true;
};

/**
 * Show error message for input
 * @param {HTMLElement} input
 * @param {string} message
 */
mw_ui_rememberlogin.prototype.show_input_error = function(input, message) {
	input.classList.add('is-invalid');
	
	// Find or create feedback element
	var parent = input.closest('.form-floating') || input.parentElement;
	var feedback = parent.querySelector('.invalid-feedback');
	
	if (!feedback) {
		feedback = document.createElement('div');
		feedback.className = 'invalid-feedback';
		parent.appendChild(feedback);
	}
	
	feedback.textContent = message;
	feedback.style.display = 'block';
};

/**
 * Clear error for input
 * @param {HTMLElement} input
 */
mw_ui_rememberlogin.prototype.clear_input_error = function(input) {
	input.classList.remove('is-invalid');
	
	var parent = input.closest('.form-floating') || input.parentElement;
	var feedback = parent.querySelector('.invalid-feedback');
	if (feedback) {
		feedback.style.display = 'none';
	}
};

/**
 * Clear all errors
 */
mw_ui_rememberlogin.prototype.clear_errors = function() {
	if (!this.form) return;
	
	var invalids = this.form.querySelectorAll('.is-invalid');
	for (var i = 0; i < invalids.length; i++) {
		invalids[i].classList.remove('is-invalid');
	}
	
	var feedbacks = this.form.querySelectorAll('.invalid-feedback');
	for (var i = 0; i < feedbacks.length; i++) {
		feedbacks[i].style.display = 'none';
	}
};
