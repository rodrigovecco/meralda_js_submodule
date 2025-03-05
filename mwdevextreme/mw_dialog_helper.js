function mw_dx_dialog(params){
	this.params=new mw_obj();
	this.params.set_params(params);
	
	this.onDialogResultYes=function(){
		var fnc=this.params.get_param_if_function("onYes");
		if(fnc){
			fnc(this);	
		}
	}
	this.onDialogResultNo=function(){
		var fnc=this.params.get_param_if_function("onNo");
		if(fnc){
			fnc(this);	
		}
	}
	this.onDialogResult=function(dialogResult){
		this.dialogResult=dialogResult;	
		$(window).scrollTop(this.currentscroll);
		
		if(this.dialogResult){
			this.onDialogResultYes();	
		}else{
			this.onDialogResultNo();		
		}
	}
	this.alert=function(){
		this.currentscroll= $(window).scrollTop();
		var message=this.params.get_param_or_def("message","");
		var showTitle=true;
		var title=this.params.get_param_or_def("title",false);
		if(!title){
			showTitle=false;	
		}
		var _this=this;
		this.dialog = DevExpress.ui.dialog.alert(message,title,showTitle);
		this.dialog.done(function (dialogResult) {
        	if(dialogResult){
				_this.onDialogResult(dialogResult);	
			}
    	});
		
		
		
	}
	
	this.confirm=function(){
		
		this.currentscroll= $(window).scrollTop();
		var message=this.params.get_param_or_def("message","");
		var showTitle=true;
		var title=this.params.get_param_or_def("title",false);
		if(!title){
			showTitle=false;	
		}
		var _this=this;
		this.dialog = DevExpress.ui.dialog.confirm(message,title,showTitle);
		this.dialog.done(function (dialogResult) {
			_this.onDialogResult(dialogResult);	
    	});
		
		
		
	}
	
}
	

