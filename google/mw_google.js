function mw_google_object_loader(params){
	mw_events_enabled_obj.call(this);
	
}


function mw_google_man(params){
	mw_events_enabled_obj.call(this);
	this.params=new mw_obj();
	
	this.params.set_params(params);
	this.loadingStatus=0;
	this.loaded=false;

	/**
	 * @deprecated Google deprecated `gapi.auth2` in March 2023.
	 * The framework now loads Google Identity Services (GIS) from
	 * `https://accounts.google.com/gsi/client` instead of `apis.google.com/js/platform.js`,
	 * so `window.gapi` will not be defined and this method is a no-op.
	 *
	 * Use `window.google.accounts.id.initialize({ client_id, callback })` and
	 * `window.google.accounts.id.renderButton(elem, options)` directly. See
	 * `pp_cl_ui_login.onGoogleReady` / `googleAttachSignin` in
	 * `res/pastipan/clui/ui/login.js` for a working example.
	 */
	this.loadAuth2=function(fnc,params){
		console.warn("mw_google_man.loadAuth2() is deprecated: gapi.auth2 was removed. Use Google Identity Services (google.accounts.id) instead.");
		return false;
	}
	this.gapiOK=function(){
		if(!window["gapi"]){
			return false;	
		}
		return true;
	}
	this.loadGapi=function(fnc){
		if(this.loaded){
			if(fnc){
				this.onReady(fnc);
					
			}
			return true;
		}
		if(fnc){
			this.onReady(fnc);	
		}
		this.loadScript();	
	}
	this.loadScript=function(){
		if(this.loadingStatus!==0){
			return;	
		}
		if(!this.params.get_param_or_def("enabled",true)){
			return false;
		}
		this.loadingStatus=1;
		var url=this.params.get_param_or_def("src");
		if(!url){
			return false;	
		}
		var _this=this;
		$.ajaxSetup({ cache: true });
 		$.getScript(url,function(){_this.onScriptLoaded()});

	}
	this.onScriptLoaded=function(){
		this.loaded=true;
		this.loadingStatus=2;
		this.dispatchEvent("ready");
			
	}
	this.isReady=function(){
		return this.loaded;	
	}
	this.onReady=function(fnc,cod){
		this.initEvents();
		this.eventsMan.onEventReady("ready",fnc,cod);
	}
	
	
	this.do_initEvents=function(){
		this.eventsMan.get_listener("ready");
	}
	
	
	this.setMainUI=function(mainui){
		this.mainUI=mainui;
	}
}
