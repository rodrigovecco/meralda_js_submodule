function mw_ui_login_full(info){
	mw_ui_login.call(this,info);
	
	
	this.set_reset_pass_frm_man=function(frm_man){
		
		if(!frm_man){
			return false;	
		}
		var _this=this;
		this.reset_pass_frm_man=frm_man;
		this.reset_pass_frm_man.disable_on_submit=true;
		
		

		if(this.reset_pass_frm_container){
			mw_show_obj(this.reset_pass_frm_container);
		}

	}
	
	this.setNewResetPassCaptcha=function(url){
		console.log("setNewResetPassCaptcha",url);
		if(url){
			$('#resetpasswordcaptchaimg').attr("src",url);
		}
		var frminput;
		if(this.reset_pass_frm_man){
			if(frminput=this.reset_pass_frm_man.get_input_manager("reqdata[captcha]")){
				frminput.set_value("");	
			}
		}
	}
	this.on_reset_pass_post_response=function(data){
		console.log("on_reset_pass_post_response",data);
		var dataman=new mw_obj();
		dataman.set_params(data);
		var p;
		if(p=dataman.get_param_if_object("msg")){
			this.show_popup_notify(p);
		}
		if(p=dataman.get_param_or_def("ok",false)){
			//window.location=this.params.get_param_or_def("onokurl","index.php");
			//return;
				
		}else{
			
		}
		if(p=dataman.get_param_or_def("newcaptchaurl",false)){
			this.setNewResetPassCaptcha(p);	
		}
		if(dataman.get_param_or_def("reenablefrm",false)){
			if(this.reset_pass_frm_man){
				this.reset_pass_frm_man.disable_on_submit=true;
				this.reset_pass_frm_man.cant_submit=false;
				this.reset_pass_frm_man.disable_all_submit_btns(true);
				console.log("asdasdasdas");
					
			}
		}
		

	}
	
	
	this.on_new_user_post_response=function(data){
		var dataman=new mw_obj();
		dataman.set_params(data);
		var p;
		if(p=dataman.get_param_if_object("msg")){
			this.show_popup_notify(p);
		}
		if(p=dataman.get_param_or_def("ok",false)){
			window.location=this.params.get_param_or_def("onokurl","index.php");
			return;
				
		}else{
			if(this.new_user_frm_man){
				this.new_user_frm_man.disable_on_submit=true;
				this.new_user_frm_man.cant_submit=false;
				this.new_user_frm_man.disable_all_submit_btns(true);
	
			}
		}
		
	}
	this.set_new_userfrm_man=function(frm_man){
		
		if(!frm_man){
			return false;	
		}
		var _this=this;
		this.new_user_frm_man=frm_man;
		this.new_user_frm_man.disable_on_submit=true;
		
		
		this.new_user_submit_btn_man=this.new_user_frm_man.get_input_manager("nu[_btns][_submit]");
		this.new_user_Userid_man=this.new_user_frm_man.get_input_manager("nu[data][userid]");
		if(this.new_user_frm_container){
			mw_show_obj(this.new_user_frm_container);
		}

	}
	this.after_init_more=function(){
		var e;
		if(e=this.get_ui_elem("newuserfrm")){
			this.new_user_frm_container=e;
			if(this.new_user_frm_man){
				mw_show_obj(this.new_user_frm_container);
			}
		}
		if(e=this.get_ui_elem("resetpassfrmcontainer")){
			this.reset_pass_frm_container=e;	
		}
		

			
	}


	
	
}
