function mw_main_ui(info){
	mw_events_enabled_obj.call(this);

	this.info=new mw_obj();
	this.info.set_params(info);
	this.debug_mode=false;
	this.fullScreenInitDone=false;
	this.managers=new mw_objcol();
	this.fullScreenMode=false;
	this.fullScreenIsEnabled=true;
	//this.events=new mw_events_man(); //use this.eventsMan
	this.events=this.eventsMan;
	this.doAfterInit=function(fnc,cod){
		this.initEvents();
		this.eventsMan.onEventReady("afterInit",fnc,cod);
	}
	this.do_initEvents=function(){
		this.eventsMan.get_listener("afterInit");//esto habilita el conteo de ocurrencias para doAfterInit
	}
	this.getMan=function(cod){
		var m=this.managers.get_item(cod);
		if(m){
			return m;	
		}
		if(!this.initDone){
			return false;	
		}
		m=this.params.get_param_if_object("managers."+cod);
		if(!m){
			return false;	
		}
		return this.setMan(cod,m);
	}
	this.setMan=function(cod,man){
		if(!mw_is_object(man,"setMainUI")){
			return false;	
		}
		this.managers.add_item(cod,man);
		man.setMainUI(this);
		return man;
	}
	
	this.init_session_check_cookie_mode=function(){
		this.start_timeout_session_check_cookie_mode();
			
	}
	this.fullScreenDisable=function(){
		mw_hide_obj("toggleFullScreenBtnContainer");
		mw_hide_obj("toggleFullScreenBtnBar");
		this.fullScreenIsEnabled=true;
		this.fullScreenOff(false,true);
		this.fullScreenIsEnabled=false;
	}
	this.fullScreenEnable=function(){
		this.fullScreenIsEnabled=true;
		mw_show_obj("toggleFullScreenBtnContainer");
		mw_show_obj("toggleFullScreenBtnBar");
		
	}
	this.init_full_screen_btn=function(){
		this.fullScreenBtn=mw_get_element_by_id("toggleFullScreenBtn");	
		this.fullScreenBtnContainer=mw_get_element_by_id("toggleFullScreenBtnContainer");
		var _this=this;
		if(!this.fullScreenBtn){
			return false;
		}
		if(!this.fullScreenBtnContainer){
			return false;
		}
		this.fullScreenBtnContainer.onclick=function(){_this.fullScreenToogle()};
		this.fullScreenBtnContainer.onmouseover=function(e){
			$('#toggleFullScreenBtnContainer').stop(true,false);
			$('#toggleFullScreenBtnContainer').animate({"width":"43px"},100);
		};
		this.fullScreenBtnContainer.onmouseout=function(){
			$('#toggleFullScreenBtnContainer').stop(true,false);
			$('#toggleFullScreenBtnContainer').animate({"width":"9px"},100);
		};
		this.toggleFullScreenBtnBar=mw_get_element_by_id("toggleFullScreenBtnBar");
		if(!this.toggleFullScreenBtnBar){
			return;
		}
		this.toggleFullScreenBtnBar.onclick=function(){_this.fullScreenToogle()};
		this.toggleFullScreenBtnBar.onmouseover=function(e){
			$('#toggleFullScreenBtnContainer').stop(true,false);
			$('#toggleFullScreenBtnContainer').animate({"width":"43px"},100);
		};
		this.toggleFullScreenBtnBar.onmouseout=function(){
			$('#toggleFullScreenBtnContainer').stop(true,false);
			$('#toggleFullScreenBtnContainer').animate({"width":"9px"},100);
		};
		
		
		
	}
	this.fullScreenInit=function(){
		if(this.fullScreenInitDone){
			return;	
		}
		this.fullScreenInitDone=true;
		var _this=this;
		$('#NavbarSidebar').on('hidden.bs.collapse', function () {
			$('#page-wrapper').stop(true,false);
			$( "#page-wrapper" ).animate({  "margin-left": "0px","padding-left": "5px", "padding-right": "5px" }, "slow","swing", function(){
				
				$("#wrapper").addClass("fullScreen");
				_this.fullScreenOnDone(true);
				
				
			});
		});
		
		
		$('#NavbarSidebar').on('shown.bs.collapse', function () {
			
			$("#wrapper").removeClass("fullScreen");
			_this.fullScreenOnDone(false);
		});
		var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
		
        if (width < 768) {
			this.fullScreenDisable();	
		}
		
	}
	this.fullScreenOnDone=function(on){
		//console.log("fullScreenOnDone",on);
		var fnc=this._fullScreenOnOnDone;
		if(!on){
			fnc=this._fullScreenOffOnDone;
			mw_hide_obj("toggleFullScreenBtnBar");	
		}else{
			mw_show_obj("toggleFullScreenBtnBar");	
		}
			
			
		this._fullScreenOnOnDone=false;
		this._fullScreenOffOnDone=false;
		if(mw_is_function(fnc)){
			fnc(this);	
		}
		
	}
	this.fullScreenOn=function(ondone,now){
		this.fullScreenInit();
		this._fullScreenOnOnDone=ondone;
		this._fullScreenOffOnDone=false;
		
		
		if(!this.fullScreenIsEnabled){
			this.fullScreenOnDone(true);
			return true;	
		}
		
		if(this.fullScreenMode){
			this.fullScreenOnDone(true);
			return true;	
		}
		this.fullScreenMode=true;
		if(now){
			$('#page-wrapper').stop(true,false);
			$( "#page-wrapper" ).css({"margin-left": "0px", "padding-left": "5px", "padding-right": "5px" });	
			$('#NavbarSidebar').addClass('collapse');
			$('#NavbarSidebar').removeClass('in');
			
			$("#wrapper").addClass("fullScreen");
			this.fullScreenOnDone(true);
			return true;
		}
		
		
		$('#NavbarSidebar').collapse('hide');
		
		
		
		
		return true;	
	}
	this.fullScreenOff=function(ondone,now){
		this.fullScreenInit();
		this._fullScreenOffOnDone=ondone;
		this._fullScreenOnOnDone=false;
		
		if(!this.fullScreenIsEnabled){
			this.fullScreenOnDone(false);
			return true;	
		}
		if(!this.fullScreenMode){
			this.fullScreenOnDone(false);
			return true;	
		}
		this.fullScreenMode=false;
		
		if(now){
			$('#page-wrapper').stop(true,false);
			$("#page-wrapper" ).css({"margin-left": "250px","padding-left": "30px", "padding-right": "30px"});	
			$('#NavbarSidebar').removeClass('collapse');
			$('#NavbarSidebar').removeClass('in');
			$('#NavbarSidebar').removeClass('collapsing');
			$("#wrapper").removeClass("fullScreen");
			console.log("fullScreenOff now");
			this.fullScreenOnDone(false);
			return true;
		}
		$('#page-wrapper').stop(true,false);
		$( "#page-wrapper" ).animate({  "margin-left": "250px","padding-left": "30px", "padding-right": "30px" }, "slow","swing", function(){
				$("#wrapper").removeClass("fullScreen");
				$('#NavbarSidebar').collapse('show');
				
				
			});
		
		return true;	
		
	}
	this.fullScreenToogle=function(onDoneOn,onDoneOff,now){
		this.fullScreenInit();
		this._fullScreenOnOnDone=onDoneOn;
		this._fullScreenOffOnDone=onDoneOff;
		
		if(this.fullScreenMode){
			return this.fullScreenOff(onDoneOff,now);	
		}else{
			return this.fullScreenOn(onDoneOn,now);
		}
		
	}
	this.session_check_cookie_mode=function(){
		
		if(!this.current_user_id){
			return true;	
		}
		if(!this.current_user_cookie_name){
			return true;
		}
		var user_id=mw_readCookie(this.current_user_cookie_name);
		if(!user_id){
			
			return true;	
		}
		if(user_id==this.current_user_id){
			
			return true;	
		}
		console.log("Different userid: "+user_id+" - "+this.current_user_id);
		return false;
		
		
	}
	this.on_timeout_session_check_cookie_mode=function(){
		
		if(this.session_check_cookie_mode()){
			
			this.start_timeout_session_check_cookie_mode();	
		}else{
			this.session_check_cookie_mode_ok=true;
			this.session_check_ajax_mode();	
			
		}
	}
	this.start_timeout_session_check_cookie_mode=function(){
		
		if(!this.sessionCheckTimeoutLim){
			return false;	
		}
		var _this=this;
		
		this.sessionCheckTimeout=setTimeout(function(){_this.on_timeout_session_check_cookie_mode()},this.sessionCheckTimeoutLim);
			
	}
	
	this.init_session_check=function(){
		
		this.current_user_id=this.info.get_param_or_def("user.id",false);
		
		this.sessionCheckTimeoutLim=this.info.get_param_or_def("sessionCheckTimeout",false);
		
		if(!this.sessionCheckTimeoutLim){
			return false;	
		}
		if(!this.info.get_param_or_def("user.ok",false)){
			return false;	
		}
		
		this.current_user_cookie_name=this.info.get_param_or_def("current_user_cookie_name",false);
		
		if(this.current_user_cookie_name){

			return this.init_session_check_cookie_mode();	
		}
			
	}
	
	this.session_check_ajax_mode=function(){
		var ajax=this.getSessionCheckAjaxLoader();
		if(!ajax){
			return false;	
		}
		ajax.run();
	}
	
	this.afterSessionexpiredAlert=function(){
		var url= this.info.get_param_or_def("url");	
		if(!url){
			return false;	
		}
		window.location=url;
	}
	
	this.onSessionCheckResponse=function(){
		if(!this.sessionCheckAjax){
			return false;	
		}
		var data= this.sessionCheckAjax.getResponseXMLAsMWData(true);
		
		if(!this.current_user_id){
			return false;	
		}
		var ok=false;
		if(!data){
			return false;	
		}
		var uid=data.get_param_or_def("user.id",false);
		if(data.get_param_or_def("user.ok",false)){
			if(uid==this.current_user_id){
				
				if(this.session_check_cookie_mode_ok){
					this.start_timeout_session_check_cookie_mode();
				}
				return true;
			}
		}
		var msg=data.get_param_or_def("notify.message",false);
		if(!msg){
			return false;	
		}
		var _this=this;
		this.alert(msg,false,function(){_this.afterSessionexpiredAlert()});
		
		
		
	}
	this.getSessionCheckAjaxLoader=function(){
		if(!this.sessionCheckAjax){
			var url=this.info.get_param_or_def("sessionCheckUrl",false);
			
			var _this=this;
			if(!url){
				return false;	
			}
			
			
			this.sessionCheckAjax= new mw_ajax_launcher(url,function(){_this.onSessionCheckResponse()});
		}
		return this.sessionCheckAjax;	
	}
	this.jquery_ok=function(){
		if(this.jquery_ok_checked){
			return this.jquery_ok_result;	
		}
		this.jquery_ok_checked=true;
		this.jquery_ok_result=false;
		if(window["jQuery"]){
			this.jquery_ok_result=true;
		}
		return this.jquery_ok_result;
	}
	this.alert=function(message,title,onDone){
		if(!window["DevExpress"]){
			console.log("No DevExpress");
			alert(message);
			if(mw_is_function(onDone)){
				onDone();	
			}
			
			return;
		}
		var dialog=new mw_dx_dialog({message:message,title:title,onYes:onDone});
		dialog.alert();
		
		
		
		
			
	}
	
	this.confirm=function(message,title,onYes,onNo){
		if(!window["DevExpress"]){
			console.log("No DevExpress");
			if(confirm(message)){
				if(mw_is_function(onYes)){
					onYes();	
				}
			}else{
				if(mw_is_function(onNo)){
					onNo();	
				}
			}
			return;
		}
		var dialog=new mw_dx_dialog({message:message,title:title,onYes:onYes,onNo:onNo});
		dialog.confirm();
		
		
			
	}
	this.show_popup_notify=function(params){
		if(!params){
			return false;	
		}
		//params.message
		//params.type: 'info'|'warning'|'error'|'success'|'custom'
		if(!mw_is_object(params)){
			
			if(typeof(params)!="string"){
				return false;	
			}
			var txt=params;
			params={message:txt,type:'info'};
			
		}
		if(!window["DevExpress"]){
			console.log("No DevExpress");
			console.log(params.message);
			return false;
		}
		return DevExpress.ui.notify(params);
	}
	this.after_init=function(){
		console.log("MainUI init");
		this.init_session_check();	
		this.init_full_screen_btn();
		
	}
	this.init=function(params){
		
		this.params=new mw_obj();
		this.params.set_params(params);
		this.after_init();
		this.initDone=true;
		this.dispatchEvent("afterInit");
		
	}
	
	this.dispatchEvent=function(listenerCod,data,extraData){
		if(!mw_is_object(data)){
			data={};
		}
		if(!data.dispatcher){
			data.dispatcher=this;	
		}
		data.mainui=this;
		this.initEvents();
		return 	this.eventsMan.dispatch(listenerCod,data,extraData);
	}
	
	/*
	this.dispatchEvent=function(cod,data,extraData){
		console.log(cod);
		if(!mw_is_object(data)){
			data={};
		}
		data.mainui=this;
		this.events.dispatch(cod,data,extraData);	
	}
	*/
	
	
}