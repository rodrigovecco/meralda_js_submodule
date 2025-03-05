function mw_google_object_loader(params){
	mw_events_enabled_obj.call(this);
	
}


function mw_google_man(params){
	mw_events_enabled_obj.call(this);
	this.params=new mw_obj();
	
	this.params.set_params(params);
	this.loadingStatus=0;
	this.loaded=false;

	this.loadAuth2=function(fnc,params){
		if(!this.gapiOK()){
			console.log("Google Api not laoded");
			return false;
		}
		if(!mw_is_object(params)){
			params={};
		}
		params["client_id"]=this.params.get_param_or_def("clientID","");
		gapi.load('auth2', function(){
			  var a = gapi.auth2.init(params);
			  if(mw_is_function(fnc)){
				fnc(a);	  
			  }
			  
			});

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
