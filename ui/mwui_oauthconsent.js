/**
 * mw_ui_oauthconsent - OAuth 2.1 + PKCE consent screen controller.
 *
 * Two-step, AJAX-driven flow (no full page reload, no iframe):
 *
 *   Step 1 - Consent form:
 *     The user edits the token name, the token expiration and the exact
 *     permissions to grant, then presses "Authorize". We POST the decision to
 *     the `authorize` sxml endpoint which mints the master token + one-time
 *     authorization code and returns them.
 *
 *   Step 2 - Result / second confirmation:
 *     The result panel shows the created token (so it can be copied) and the
 *     destination the authorization code will be delivered to. Only when the
 *     user presses "Send code" do we actually redirect to the client's
 *     redirect_uri with ?code=... "Deny" redirects with error=access_denied.
 *
 * Registered element ids (via uielemsids): container, formpanel, scopelist,
 * tokenlabel, tokenexpiry, btnapprove, btndeny, resultpanel, tokenout,
 * btncopy, desturl, btnsend.
 */
function mw_ui_oauthconsent(info){
	mw_ui.call(this,info);

	/** @type {boolean} Guards against concurrent authorize requests. */
	this.busy=false;

	/** @type {string|null} Final redirect URL returned by the server. */
	this.redirect_url=null;

	// ---------------------------------------------------------------
	// Init
	// ---------------------------------------------------------------

	this.after_init=function(){
		var _this=this;
		this.set_container();

		var b;
		if(b=this.get_ui_elem("btnapprove")){
			b.addEventListener("click",function(){ _this.do_approve(); });
		}
		if(b=this.get_ui_elem("btndeny")){
			b.addEventListener("click",function(){ _this.do_deny(); });
		}
		if(b=this.get_ui_elem("btnsend")){
			b.addEventListener("click",function(){ _this.do_send(); });
		}
		if(b=this.get_ui_elem("btncopy")){
			b.addEventListener("click",function(){ _this.do_copy(); });
		}
	};

	// ---------------------------------------------------------------
	// Form value readers
	// ---------------------------------------------------------------

	this.get_form_root=function(){
		if(this.container){ return this.container; }
		return this.get_ui_elem("container");
	};

	/**
	 * Collect the codes of the enabled, checked permission checkboxes.
	 * @returns {string[]}
	 */
	this.get_selected_scopes=function(){
		var root=this.get_form_root();
		if(!root){ return []; }
		var boxes=root.querySelectorAll('input[name="_oauth_scope[]"]:checked:not(:disabled)');
		var out=[];
		for(var i=0;i<boxes.length;i++){ out.push(boxes[i].value); }
		return out;
	};

	this.get_token_label=function(){
		var e=this.get_ui_elem("tokenlabel");
		return e ? e.value : "";
	};

	this.get_expiry_days=function(){
		var e=this.get_ui_elem("tokenexpiry");
		return e ? e.value : "0";
	};

	this.set_action_btns_enabled=function(enabled){
		var b;
		if(b=this.get_ui_elem("btnapprove")){ b.disabled=!enabled; }
		if(b=this.get_ui_elem("btndeny")){ b.disabled=!enabled; }
	};

	// ---------------------------------------------------------------
	// Decision handling
	// ---------------------------------------------------------------

	this.do_approve=function(){
		if(this.busy){ return; }
		var scopes=this.get_selected_scopes();
		if(!scopes.length){
			this.show_popup_notify({
				message:this.params.get_param_or_def("msg_select_one","Debes conceder al menos un permiso."),
				type:"warning"
			});
			return;
		}
		this.post_decision("approve",scopes);
	};

	this.do_deny=function(){
		if(this.busy){ return; }
		this.post_decision("deny",[]);
	};

	/**
	 * POST the consent decision to the authorize sxml endpoint.
	 * @param {string} action "approve" | "deny"
	 * @param {string[]} scopes selected permission codes
	 */
	this.post_decision=function(action,scopes){
		var _this=this;
		var url=this.get_xmlcmd_url("authorize");
		if(!url){
			this.show_popup_notify({
				message:this.params.get_param_or_def("msg_error_generic","Ocurrió un error."),
				type:"error"
			});
			return;
		}

		this.busy=true;
		this.set_action_btns_enabled(false);

		var a=this.getAjaxLoader();
		a.abort_and_set_url(url);
		a.addOnLoadAcctionUnique(function(){ _this.on_authorize_response(); });
		a.post({
			_oauth_action:action,
			_oauth_nonce:this.params.get_param_or_def("nonce",""),
			_oauth_scope:scopes.join(","),
			_oauth_token_label:this.get_token_label(),
			_oauth_token_expiry_days:this.get_expiry_days()
		});
	};

	/**
	 * Handle the authorize endpoint response.
	 */
	this.on_authorize_response=function(){
		this.busy=false;

		var data=this.getAjaxDataResponse(true);
		if(!data || !data.get_param_or_def("ok",false)){
			this.set_action_btns_enabled(true);
			var msg=(data && data.get_param("msg")) || this.params.get_param_or_def("msg_error_generic","Ocurrió un error.");
			this.show_popup_notify({message:msg,type:"error"});
			return;
		}

		this.redirect_url=data.get_param("redirect_url");

		// Denial: nothing to show, just hand the error back to the client.
		if(data.get_param("action")==="deny"){
			if(this.redirect_url){ window.location.replace(this.redirect_url); }
			return;
		}

		// Approval: show the created token and wait for the second confirmation.
		this.show_result(data);
	};

	/**
	 * Populate and reveal the result panel (step 2).
	 * @param {object} data response mw_obj
	 */
	this.show_result=function(data){
		var out=this.get_ui_elem("tokenout");
		if(out){ out.value=data.get_param("token")||""; }

		var dest=this.get_ui_elem("desturl");
		if(dest){ mw_dom_set_cont(dest,data.get_param("redirect_uri")||""); }

		var fp=this.get_ui_elem("formpanel");
		if(fp){ mw_hide_obj(fp); }

		var rp=this.get_ui_elem("resultpanel");
		if(rp){ mw_show_obj(rp); }
	};

	// ---------------------------------------------------------------
	// Second confirmation + copy
	// ---------------------------------------------------------------

	this.do_send=function(){
		if(this.redirect_url){
			window.location.replace(this.redirect_url);
		}
	};

	this.do_copy=function(){
		var out=this.get_ui_elem("tokenout");
		if(!out){ return; }
		var _this=this;
		var ok=function(){
			_this.show_popup_notify({
				message:_this.params.get_param_or_def("msg_copied","Token copiado."),
				type:"success"
			});
		};
		var fail=function(){
			_this.show_popup_notify({
				message:_this.params.get_param_or_def("msg_copy_fail","No se pudo copiar el token."),
				type:"error"
			});
		};
		if(navigator.clipboard && navigator.clipboard.writeText){
			navigator.clipboard.writeText(out.value).then(ok,fail);
		}else{
			try{
				out.focus();
				out.select();
				document.execCommand("copy");
				ok();
			}catch(e){
				fail();
			}
		}
	};
}
