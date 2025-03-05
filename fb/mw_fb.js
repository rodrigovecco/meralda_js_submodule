function mw_fb_man(params){
	mw_events_enabled_obj.call(this);
	this.params=new mw_obj();
	this.loadingStatus=0;
	this.fbCreated=false;
	
	this.params.set_params(params);
	
	this.setMainUI=function(mainui){
		this.mainUI=mainui;
	}
	this.createFB=function(fnc){
		if(this.fbCreated){
			if(fnc){
				this.onFBReady(fnc);
					
			}
			return true;
		}
		if(fnc){
			this.onFBReady(fnc);	
		}
		this.loadScript();	
	}
	this.loadScript=function(){
		if(this.loadingStatus!==0){
			return;	
		}
		this.loadingStatus=1;
		var url=this.params.get_param_or_def("fb.url");
		if(!url){
			return false;	
		}
		var _this=this;
		$.ajaxSetup({ cache: true });
 		$.getScript(url,function(){_this.onScriptLoaded()});

	}
	this.onScriptLoaded=function(){
		FB.init(this.params.get_param("fb.initparams"));
		this.fbCreated=true;
		this.loadingStatus=2;
		this.dispatchEvent("fbReady");
			
	}
	this.isReady=function(){
		return this.fbCreated;	
	}
	this.onFBReady=function(fnc,cod){
		this.initEvents();
		this.eventsMan.onEventReady("fbReady",fnc,cod);
	}
	
	
	this.do_initEvents=function(){
		this.eventsMan.get_listener("fbReady");
	}
}
