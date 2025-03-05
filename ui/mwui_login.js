function mw_ui_login(info){
	mw_ui.call(this,info);
	
	
	
	this.set_frm_man=function(frm_man){
		
		if(!frm_man){
			return false;	
		}
		this.frm_man=frm_man;
		this.frm_man.disable_on_submit=true;
		this.submit_btn_man=this.frm_man.get_input_manager("_btns[_submit]");
		this.input_pass_man=this.frm_man.get_input_manager("login_pass");
		
		
		
		if(this.frm_container){

			mw_show_obj(this.frm_container);
		}

	}
	
	this.stop_re_enable_timeout=function(){
		if(this.re_enable_timeout_seconds){
			clearInterval(this.re_enable_timeout_seconds);	
		}
		if(this.re_enable_timeout_fraction){
			clearInterval(this.re_enable_timeout_fraction);	
		}
	}
	this.re_enable_seconds_step=function(){
		if(this.re_enable_on_seconds<=0){
			this.re_enable_frm();
		
			return;	
		}
		this.re_enable_on_seconds--;	
	}
	this.get_wait_bar_progress=function(){
		if(!this.re_enable_on_fraction_total){
			return 0;
		}
		return (this.re_enable_on_fraction_passed/this.re_enable_on_fraction_total)*100;
	}
	this.re_enable_fraction_step=function(){
		this.re_enable_on_fraction_passed++;
		if(this.wait_progressBar){
			this.wait_progressBar.option("value", this.get_wait_bar_progress());	
		}
	}
	
	this.start_re_enable_timeout=function(seconds){
		seconds=mw_getInt(seconds);
		if(seconds<1){
			seconds=1;	
		}
		
		var _this=this;
		var e;
		this.stop_re_enable_timeout();
		this.re_enable_on_seconds=seconds;
		this.re_enable_on_fraction_total=seconds*10;
		this.re_enable_on_fraction_passed=0;
		if(this.wait_progressBar){
			this.wait_progressBar.option("value", this.re_enable_on_fraction_passed);	
		}
		if(e=this.get_ui_elem("wait")){
			$(e).removeClass("complete");	
			mw_show_obj(e);
		}
		
		this.re_enable_timeout_seconds=setInterval(function(){_this.re_enable_seconds_step()},1000);
		this.re_enable_timeout_fraction=setInterval(function(){_this.re_enable_fraction_step()},100);
		
	}
	this.re_enable_frm=function(){
		this.stop_re_enable_timeout();
		if(this.frm_man){
			if(this.input_pass_man){
				this.input_pass_man.set_value("");
			}
			this.frm_man.cant_submit=false;
			this.frm_man.disable_all_submit_btns(true);
				
		}
		var e;
		if(e=this.get_ui_elem("wait")){
			$(e).removeClass("complete");	
			mw_hide_obj(e);
		}
		
			
	}
	this.submit_frm_on_self=function(){
		if(!this.frm_man){
			return false;
		}
		
		if(!this.frm_man.frm){
			return false;	
		}
		this.frm_man.cant_submit=false;
		this.frm_man.frm.target="_self";
		this.frm_man.frm.action=this.params.get_param_or_def("onokurl","index.php");
		
		this.frm_man.frm.submit();
		return true;
		
		
	}
	this.requestToken=function(){
		this.frm_man.disable_all_submit_btns(false);
		var url=this.get_dl_url("logintoken");
		var a=this.getAjaxLoader();
		var _this=this;
		a.set_url(url);
		a.addOnLoadAcctionUnique(function(){_this.on_token_response()});
		a.run();


	}
	this.on_token_response=function(){
		var data=this.getAjaxDataResponse(true);
		if(!data){
			return; 
		}


		
		if(!data.get_param("ok")){
			return;
		}
		var tokeninput=this.frm_man.get_input_manager("login_token");
		if(!tokeninput){
			return;
		}
		tokeninput.set_value(data.get_param("chiwawa"));
		this.frm_man.disable_all_submit_btns(true);

	}
	this.on_post_response=function(data){
		var dataman=new mw_obj();
		dataman.set_params(data);
		console.log("on_post_response",data);
		var p;
		if(p=dataman.get_param_or_def("ok",false)){
			if(!this.submit_frm_on_self()){
				window.location=this.params.get_param_or_def("onokurl","index.php");
			}
			return;
				
		}
		if(p=dataman.get_param_if_object("msg")){
			this.show_popup_notify(p);
		}else{
			if(p=dataman.get_param_if_string("result.msg")){
				this.show_popup_notify({message:p,type:"warning"});
			}
		}
		if(dataman.get_param("result.login_not_allowed_timeout.not_allowed")){
			this.start_re_enable_timeout(dataman.get_param("result.login_not_allowed_timeout.seconds"));
		}else{
			//this.start_re_enable_timeout(1);
			this.re_enable_frm();	
		}
		
		
	}
	this.get_waiting_msg=function(){
		return this.params.get_param("please_wait")+" "+this.re_enable_on_seconds+" "+this.params.get_param("seconds")+".";	
	}
	this.onWaitprogressBarComplete=function(){
		if(this.re_enable_timeout_fraction){
			clearInterval(this.re_enable_timeout_fraction);	
		}
	}
	this.after_init_more=function(){
			
	}
	this.after_init=function(){
		
		var e;
		var _this=this;
		if(e=this.get_ui_elem("container")){
			this.set_container(e);
		}
		if(e=this.get_ui_elem("wait")){
			this.wait_container=e;
			this.wait_progressBar = $($(e)).dxProgressBar({
				min: 0,
				max: 100,
				width: "100%",
				statusFormat:  function(value) { 
					return _this.get_waiting_msg(); 
				},
				onComplete: function(e){
					_this.onWaitprogressBarComplete();
					inProgress = false;
					
					e.element.addClass("complete");
				}
			}).dxProgressBar("instance");
		}
		
		
		if(e=this.get_ui_elem("loginfrm")){
			this.frm_container=e;
			if(this.frm_man){
				mw_show_obj(this.frm_container);
			}
		}
		//
		
		this.after_init_more();
		if(this.params.get_param("requestTokenMode")){
			this.requestToken();
		}
		return;
		
	}

	
	
}
