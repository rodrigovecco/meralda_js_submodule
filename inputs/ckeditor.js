function mw_datainput_item_ckeditor(options){
	mw_datainput_item_base.call(this,options);
	this.create_input_elem=function(){
		var _this=this;
		var p;
		var c=document.createElement("textarea");
		c.className="form-control";
		c.onchange=function(){_this.on_change()};
		if(this.options.get_param_or_def("validateonkeyup",false)){
			c.onkeyup=function(){_this.on_change()};
				
		}
		p=this.options.get_param_or_def("placeholder",false);
		if(p){
			c.placeholder=p;
		}
		p=this.options.get_param_or_def("rows",false);
		if(p){
			c.rows=p;
		}
		p=this.options.get_param_or_def("cols",false);
		if(p){
			c.cols=p;
		}
		//this.setTooltipFromParams(c);
		this.set_def_input_atts(c);
		return c;
	}
	this.append2hiddenFrm=function(container){
		if(!container){
			return false;	
		}
		if(this.input_elem){
			var c=document.createElement("div");
			var e=document.createElement("textarea");
			e.value=this.get_input_value();
			e.name=this.get_input_name();
			c.appendChild(e);
			container.appendChild(c);
		}
		
	}
	
	this.afterAppend=function(){
		//console.log("afterAppend xxx");
		this.doAfterAppendFncs();
		
		if(this.orig_value){
			this.set_input_value(this.orig_value);	
		}
		var p=this.options.get_param_or_def("hidden",false);
		if(p){
			this.hide();	
		}
		this.createEditor();
		//this.initTooltipFromParams();
		
	}
	this.createEditor=function(){
		var input=this.get_input_elem();	
		if(!input){
			return false;	
		}
		if(!window["CKEDITOR"]){
			console.log("CKEDITOR is required!");
			return;
		}
		var cfg=this.options.get_param_if_object("editorcfg");
		if(!mw_is_object(cfg)){
			cfg={};
		}
		CKEDITOR.replace(input ,cfg);
			
	}

	
}


