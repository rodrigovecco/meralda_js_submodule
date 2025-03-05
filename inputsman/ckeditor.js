// JavaScript Document
function mw_input_elem_ckeditor(frmman,inputname,params){
	this.pre_init(frmman,inputname,params);
}

mw_input_elem_ckeditor.prototype=new mw_input_elem_abs();
mw_input_elem_ckeditor.prototype.after_all_init_done=function(){
	var input=this.get_input();	
	if(!input){
		return false;	
	}
	
	input.value=this.get_param("value")+"";
	if(!window["CKEDITOR"]){
		console.log("CKEDITOR is required!");
		return;
	}
	var cfg=this.get_param("editorcfg");
	if(!mw_is_object(cfg)){
		cfg={};
	}
	CKEDITOR.replace( input ,cfg);
	
}
