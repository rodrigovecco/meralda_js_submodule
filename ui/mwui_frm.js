function mw_ui_frm(info){
	
	mw_ui.call(this,info);

	this.createCtrs=function(){
		var _this=this;
		var e=this.get_ui_elem("ctrs");
		if(!e){
			return false;
			
		}
		this.ctrs=this.params.get_param_if_object("ctrs");
		if(!this.ctrs){
			return false;
		}

		this.ctrs.append_to_container(e);
		this.afterAppendCtrs();
		
	

	}
	this.afterAppendCtrs=function(){

	}

	this.after_init=function(){
		this.set_container();
		
		this.createCtrs();
		
		
		
	}
		
}
function mw_ui_frm_ajax(info){
	
	mw_ui_frm.call(this,info);

	this.createCtrs=function(){
		var _this=this;
		var e=this.get_ui_elem("ctrs");
		if(!e){
			return false;
			
		}
		this.ctrs=this.params.get_param_if_object("ctrs");
		if(!this.ctrs){
			return false;
		}

		this.ctrs.append_to_container(e);
		this.afterAppendCtrs();
		
	

	}
	this.afterAppendCtrs=function(){
		var _this=this;
		var btn=this.getSubmitBtn();
		if(btn){
			btn.setOnClick(function(){_this.onSubmitCl()});	
		}
	}
	
	this.onSubmitCl=function(){
		var btn=this.getSubmitBtn();
		var _this=this;
		
		if(btn){ btn.setDisabled(true); }
		var data=this.ctrs.get_input_value();
        
        var url=this.get_xmlcmd_url("submit");
		var posturlmode=this.params.get_param("posturlmode");
		if(posturlmode){
			url=this.get_xmlcmd_url("submit",data);
		}
        var a=this.getAjaxLoader();
        a.addOnLoadAcctionUnique(function(){ _this.onSubmitResponse(); });
        a.set_url(url);
        if(posturlmode){
			a.run();
		}else{
			a.post(data);
		}
        

	}
	 this.onSubmitResponse = function(){
        var resp=this.getAjaxDataResponse(true);
        if(resp){
            this.show_popup_notify(resp.get_param_if_object("jsresponse.notify"));
            if(resp.get_param("ok")){
               this.ctrs.getChildByDotCod("data").set_input_value(this.params.get_param_if_object("defdata"));
			   var url=resp.get_param("redirecturl");
			   
			   if(url){
				   window.location=url;
			   }
            }
            var btn=this.getSubmitBtn();
            if(btn){ btn.setDisabled(false); }
            
        }
    };
	this.getSubmitBtn=function(){
		if(this.ctrs){
			return this.ctrs.getChildByDotCod("btns.submit");
		}
	}

	this.after_init=function(){
		this.set_container();
		var fnc=this.params.get_param_if_function("beforeInitFnc");
		if(fnc){
			fnc.call(this);
		}
		
		this.createCtrs();
		var fnc=this.params.get_param_if_function("bafterInitFnc");
		if(fnc){
			fnc.call(this);
		}
		
		
		
	}
		
}