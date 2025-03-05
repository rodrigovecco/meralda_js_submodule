function mw_ui_helper_notify(params){
	//params.message
	//params.type: 'info'|'warning'|'error'|'success'|'custom'
	if(!params){
		return false;	
	}
	var msg;
	if(!mw_is_object(params)){
		msg=params;
		params={message:msg};	
	}
	var m;
	
	var fmsg="";
	if(mw_is_array(params.list)){
		var p;
		m=params["message"]+"";
		if(m){
			if(params["multiline"]){
				m=m.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ "<br />" +'$2');
			}
			fmsg=fmsg+"<div>"+m+"</div>";
		}
		params["multiline"]=false;
		params["isHTML"]=true;
		for(var i=0;i<params.list.length;i++){
			if(mw_is_object(params.list[i])){
				p=params.list[i];
			}else{
				p={message:params.list[i]};		
			}
			m=p["message"]+"";
			if(m){
				if(p["multiline"]){
					m=m.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ "<br />" +'$2');
				}
				fmsg=fmsg+"<div>"+m+"</div>";
				if(p["type"]){
					params["type"]=p["type"];
				}
			}
				
		}
		params["message"]=fmsg;
		
		
		delete params["list"];
		
	}
	
	
	if(!params["message"]){
		return false;
	}
	if(params["multiline"]){
		msg=params["message"]+"";
		//params["message"]=msg.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ "<br>" +'$2');
		params["isHTML"]=true;
	}
	if(params["isHTML"]){
		params["onShowing"]=function(e){
			
			var msg_container=$('.dx-toast-content');
			if(!msg_container){
				return;	
			}
			var m=String(e.component.option("message")).replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ "<br>" +'$2');
			msg_container.html(m);
					
		};
	
	}
	if(!window["DevExpress"]){
		console.log("No DevExpress",params);
		return false;
	}
	
	
	
	
	
	
	return DevExpress.ui.notify(params);

	

	
}


function mw_ui(info){
	this.info=new mw_obj();
	this.info.set_params(info);
	this.debug_mode=false;
	
	
	
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
	
	this.get_popup_msg_container=function(){
		if(this.popup_msg_container){
			return 	this.popup_msg_container;
		}
		this.popup_msg_container=document.createElement("div");
		this.popup_msg_container.className="mw_pop_msg_container";
		document.body.appendChild(this.popup_msg_container);
		mw_hide_obj(this.popup_msg_container);
		return 	this.popup_msg_container;
		
	}
	this.getAjaxDataResponse=function(allowJsCode,tagname,rootname){
		if(!this.ajax){
			return false;	
		}
		return this.ajax.getResponseXMLAsMWData(allowJsCode,tagname,rootname);
	}
	this.getAjaxLoader=function(){
		if(!this.ajax){
			this.ajax= new mw_ajax_launcher();
		}
		return this.ajax;	
	}
	this.hide_popup_msg_by_effect=function(){
		this.cancelTimeoutHidePopUpMsg();
		if(!this.jquery_ok()){
			mw_hide_obj(this.popup_msg_container);	
			return;	
		}
		var c=this.popup_msg_container;
		if(!c){
			return;	
		}
		var _this=this;
		$(c).finish();
		$(c).slideUp("slow","swing",function(){_this.hide_popup_msg()});
	}
	this.hide_popup_msg=function(){
		this.cancelTimeoutHidePopUpMsg();
		mw_hide_obj(this.popup_msg_container);	
	}
	this.cancelTimeoutHidePopUpMsg=function(){
		if(this.timeoutHidePopUpMsg){
			clearTimeout(this.timeoutHidePopUpMsg);
			this.timeoutHidePopUpMsg=false;
		}
	}
	this.setTimeoutHidePopUpMsg=function(byeffect){
		var _this=this;
		this.cancelTimeoutHidePopUpMsg();
		if(byeffect){
			this.timeoutHidePopUpMsg=setTimeout(function(){_this.hide_popup_msg_by_effect()},3000);
		}else{
			this.timeoutHidePopUpMsg=setTimeout(function(){_this.hide_popup_msg()},3000);
		}
	}
	this.showNotifyModal=function(params){
		var d=this.getNotifyModalDialog(params);
		if(!d){
			return false;
		}
		d.show();
		return d;
			
	}
	this.getNotifyModalDialog=function(params){
		if(!params){
			return false;	
		}
		if(!mw_is_object(params)){
			var msg;
			msg=params;
			params={message:msg};	
		}
		var m=this.getNotifyModal();		
		var d =new mw_bootstrap_helper_modal_dialog(params);
		d.setModal(m);
		return d;
		
			
	}
	this.createNotifyModal=function(){
		var p=this.params.get_param_if_object("notifymodal");
		var m=new mw_bootstrap_helper_modal_with_footer_inputs(p);
		m.options.set_param_default(false,"btns.cancel.enabled");
		m.options.set_param_default("default","btns.accept.display_mode");
		return m;

	}
	this.getNotifyModal=function(){
		if(!this.notifyModal){
			if(this.notifyModal=this.createNotifyModal()){
				this.notifyModal.appendToDocument();	
			}
		}
		return this.notifyModal;
	}
	
	this.show_popup_notify=function(params){
		if(this.notifyModalModeEnabled){
			if(mw_is_object(params)){
				if(params.modalMode){
					return this.showNotifyModal(params);	
				}
			}
				
		}

		
		return mw_ui_helper_notify(params);
	}
	this.show_popup_msg=function(cont){
		if(!cont){
			return false;	
		}
		if(mw_is_object(cont)){
			return this.show_popup_notify(cont);	
		}
		
		var c=this.get_popup_msg_container();
		if(!c){
			return false;	
		}
		var _this=this;
		mw_hide_obj(c);
		mw_dom_set_cont(c,cont);
		mw_show_obj(c);
		if(!this.jquery_ok()){
			this.setTimeoutHidePopUpMsg();
			return;	
		}
		$(c).finish();
		var h=$(c).height();
		c.style.top="-"+(h+5)+"px";
		
		$(c).animate({ "top": "+="+(h+10)+"px" },"slow" ,function(){_this.setTimeoutHidePopUpMsg(true)});
		
		
	}
	
	this.reload_page=function(){
		var url=this.info.get_param_or_def("url",false);
		if(!url){
			return false;	
		}
		window.location=url;
	}
	this.new_loading_elem=function(){
		var e=document.createElement("div");
		e.className="mw_loading";
		e.innerHTML="<div class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></div>";
		return e;	
	}
	
	
	
	this.getDragAndDropDataMan=function(){
		if(!this.dragAndDropDataMan){
			this.dragAndDropDataMan=new mwuihelper_DragAndDropDataMan(this);	
		}
		return this.dragAndDropDataMan;
	}
	
	
	this.dragAndDropSupported=function(){
		if(this.__dragAndDropSupported_setted){
			return 	this.__dragAndDropSupported;
		}
		this.__dragAndDropSupported_setted=true;
		this.__dragAndDropSupported=false;
		
		if('draggable' in document.createElement('span')) {
 			this.__dragAndDropSupported=true;
		}
		return 	this.__dragAndDropSupported;
	}
	this.hide_ui_elem=function(cod){
		var e=this.get_ui_elem(cod);
		if(e){
			mw_hide_obj(e);
			return e;	
		}
		return false;
	}
	this.show_ui_elem=function(cod){
		var e=this.get_ui_elem(cod);
		if(e){
			mw_show_obj(e);
			return e;	
		}
		return false;
	}
	this.get_ui_elem_id=function(cod){
		if(!cod){
			return false;	
		}
		if(!this.init_data_exists()){
			return false;	
		}
		var id=this.params.get_param_or_def("uielemsids."+cod,false);
		if(id){
			return id;	
		}
		var pref=this.info.get_param_or_def("uielemspref",false);
		if(!pref){
			return false;	
		}
		return pref+cod;
		
		
	}
	
	this.get_ui_elem=function(cod){
		if(!this.init_data_exists()){
			return false;	
		}
		if(this.ui_elems[cod]){
			return 	this.ui_elems[cod];
		}
		
		//var id=this.params.get_param_or_def("uielemsids."+cod,false);
		var id=this.get_ui_elem_id(cod);
		if(!id){
			return false;	
		}
		var e=mw_get_element_by_id(id);
		if(e){
			this.ui_elems[cod]=e;
			return e;
		}
		
	}
	this.after_init=function(){
	}
	this.init_data_exists=function(){
		if(!this.ui_elems){
			return false;	
		}
		if(!this.params){
			return false;	
		}
		return true;
		
	}
	this.init=function(params){
		this.set_debug_mode_if_enabled();
		this.ui_elems=new Object();
		this.params=new mw_obj();
		this.params.set_params(params);	
		this.after_init();
	}
	this.debug_obj=function(obj,title,deep,clear){
		if(!this.debug_mode){
			return false;	
		}
		var o=new mw_obj();
		o.set_params(obj);
		return this.debug_msg(o.get_list_debug_elem(deep),title,clear);
			
	}
	this.clear_debug_elem=function(){
		if(!this.debug_elem){
			return false;	
		}
		mw_dom_remove_children(this.debug_elem);
			
	}
	
	this.debug_msg=function(msg,title,clear){
		if(!this.debug_mode){
			return false;	
		}
		if(clear){
			this.clear_debug_elem();	
		}
		var e=	document.createElement("div");
		e.style.border="#ff0000 solid 2px";
		if(title){
			e.innerHTML="<h1>"+title+"</h1>";
		}
		if(typeof(msg)=="string"){
			var inmsg=msg;
			msg=document.createElement("div");
			msg.innerHTML=inmsg;
			
		}
		if(typeof(msg)=="object"){
			e.appendChild(msg);		
		}
		var d=this.get_debug_elem();
		
		if(d){
			d.appendChild(e);	
		}else{
			//console.log(msg);	
		}
		
	}
	this.debug_url=function(url,title,clear){
		return this.debug_msg("<a href='"+url+"' target='_blank'>"+url+"</a>",title,clear);
	}
	
	this.get_debug_elem=function(){
		if(!this.debug_mode){
			return false;	
		}
		if(this.debug_elem){
			return 	this.debug_elem;
		}
		this.debug_elem=document.createElement("div");
		if(this.container){
			this.container.appendChild(this.debug_elem);	
		}
		return 	this.debug_elem;
	}
	this.set_container=function(elem){
		if(!elem){
			elem=this.get_ui_elem("container");	
		}
		var e=mw_get_element_by_id(elem);
		if(e){
			this.container=e;
			return true;	
		}
	}
	this.get_xmlcmd_url=function(cod,queryparams,urlparams){
		var url=this.info.get_param_or_def("xmlurl",false);
		if(!url){
			return false;	
		}
		var u =new mw_url();
		var rest=false;
		if(cod){
			rest=cod+".xml";		
		}
		url=u.get_url_from_path_as_obj(url,urlparams,rest);
		return u.get_url(url,this.get_url_params_plus_default(queryparams));
	}
	this.get_url_params_plus_default=function(queryparams){
		if(!this.default_url_params){
			return queryparams;
		}
		if(!mw_is_object(queryparams)){
			queryparams={};	
		}
		$.extend( true, queryparams, this.default_url_params );
		
		//console.log(queryparams);
		return queryparams;
		
	}
	this.add_default_url_param=function(cod,val){
		if(!this.default_url_params){
			this.default_url_params={};	
		}
		this.default_url_params[cod]=val;
	}
	this.set_iframe_url=function(url){
		var e=this.get_ui_elem("iframe");
		if(!e){
			console.log("UI Iframe elem does not exist");
			return false;
		}
		e.src=url;
		return true;
	}
	this.get_dl_url=function(cod,filename,urlparams,queryparams){
		var url=this.info.get_param_or_def("dlurl",false);
		if(!url){
			return false;	
		}
		var u =new mw_url();
		var rest=false;
		if(cod){
			rest=cod;
			if(filename){
				rest=rest+"."+filename;	
			}
		}
		url=u.get_url_from_path_as_obj(url,urlparams,rest);
		return u.get_url(url,this.get_url_params_plus_default(queryparams));
	}
	this.get_sub_ui_url=function(dotcod,queryparams){
		var cod=this.info.get_param_or_def("full_cod",false);
		if(!cod){
			return false;	
		}
		if(dotcod){
			cod=cod+"."+dotcod;	
		}
		return this.get_other_ui_url(cod,queryparams);
			
	}
	this.get_parent_ui_dotcode=function(backSteps,subdotcod){
		backSteps=mw_getInt(backSteps);
		if(backSteps<1){
			backSteps=1;
		}
		var cod=this.info.get_param_or_def("full_cod",false);
		if(!cod){
			return false;	
		}
		var codeslist=String(cod).split(".");
		if(!codeslist){
			return false;
		}
		if(codeslist.length<backSteps){
			if(subdotcod){
				return subdotcod;
			}
			return false;
		}
		var finalCodes=codeslist.slice(0,codeslist.length-backSteps);
		var r=finalCodes.join(".");
		if(subdotcod){
			r=r+"."+subdotcod;	
		}
		return r;

	}
	this.set_debug_mode_if_enabled=function(){
		this.debug_mode=this.info.get_param_or_def("debug_mode",false);
	}

	this.get_other_ui_url=function(dotcod,queryparams){
		var url=this.info.get_param_or_def("mainui.url",false);
		if(!url){
			return false;	
		}
		var ui_var=this.info.get_param_or_def("mainui.ui_var",false);
		if(!ui_var){
			return false;	
		}
		var sui_var=this.info.get_param_or_def("mainui.sub_ui_var",false);
		if(!sui_var){
			return false;	
		}
		var p={};
		if(queryparams){
			if(typeof(queryparams)=="object"){
				p=queryparams;		
			}
		}
		if(dotcod){
			if(typeof(dotcod)=="string"){
				var list=dotcod.split(".");
				var c;
				for(var i=0;i<list.length;i++){
					if(i==0){
						c=ui_var;
					}else if(i==1){
						c=sui_var;	
					}else{
						c=sui_var+(i-1);		
					}
					p[c]=list[i];
				}
			}
		}
		var u =new mw_url();
		return u.get_url(url,p);

			
		
	}
}
