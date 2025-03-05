function mw_datainput_item_frm(options){
	this.init(options);
	
	this.getFormData=function(){
		if(this.formElem){
			return new FormData(this.formElem);	
		}
		return false;
	}
	this.create_container=function(){
		var p;
		var _this=this;
		
		var c=document.createElement("form");
		this.formElem=c;

		var frm=c;
		p=this.options.get_param_or_def("enctype","multipart/form-data");
		if(p){
			frm.enctype=p;	
		}
		p=this.options.get_param_or_def("autocomplete","off");
		if(p){
			frm.autocomplete=p;	
		}
		p=this.options.get_param_or_def("method","post");
		if(p){
			frm.method=p;	
		}
		p=this.options.get_param_or_def("action",false);
		if(p){
			frm.action=p;	
		}
		p=this.options.get_param_or_def("frm_id",false);
		if(p){
			frm.id=p;	
		}
		p=this.options.get_param_or_def("frm_name",false);
		if(p){
			frm.name=p;	
		}
		p=this.options.get_param_or_def("target",false);
		if(p){
			frm.target=p;	
		}
		frm.onsubmit=function(e){return _this.onsubmit(e)};
		
		if(this.sub_items_list){
			var list=this.sub_items_list.getList();
			if(list){
				for(var i =0; i<list.length;i++){
					list[i].append_to_container(c);
				}
				
			}
			
		}

		return c;
	}
	this.onsubmit=function(evtn){
		if(this.cant_submit){
			return false;	
		}
		
		if(!this.validate()){
			return false;
		}
		if(!this.options.get_param("allowresubmit")){
			this.cant_submit=true;
		}
		var fnc=this.options.get_param_if_function("onsubmitokfnc");
		var ok=true;
		if(fnc){
			ok=fnc(this);
			if(!ok){
				return false;
			}
		}
		fnc=this.options.get_param_if_function("onsubmit");
		if(fnc){
			fnc(evtn,this);
		}
		
		
		return ok;
		
	}

	this.validate=function(){
		var r=true;
		
		if(this.validate_omit()){
			return true;	
		}
		if(!this.doValidateSelf()){
			r=false;	
		}
		if(!this.sub_items_list){
			return r;	
		}
		var list=this.sub_items_list.getList();
		if(!list){
			return r;	
		}
		for(var i =0; i<list.length;i++){
			
			if(!list[i].validate()){
				r=false;		
			}
		}
		return r;
		//return true;
	}
	
	this.set_input_value=function(val){
		return this.set_input_value_as_group(val);
		
	}
	
	this.get_input_value=function(){
		return this.get_input_value_as_group();
	}
	this.getInputValueIfNotEmpty=function(){
		return this.get_input_value_as_group_IfNotEmpty();
	}

}
mw_datainput_item_frm.prototype=new mw_datainput_item_abs();

function mw_datainput_item_frmonpanel(options){
	this.create_container=function(){
		var p;
		var _this=this;
		
		var c=document.createElement("form");
		this.formElem=c;
		var frm=c;
		p=this.options.get_param_or_def("enctype","multipart/form-data");
		if(p){
			frm.enctype=p;	
		}
		p=this.options.get_param_or_def("autocomplete","off");
		if(p){
			frm.autocomplete=p;	
		}
		p=this.options.get_param_or_def("method","post");
		if(p){
			frm.method=p;	
		}
		p=this.options.get_param_or_def("action",false);
		if(p){
			frm.action=p;	
		}
		p=this.options.get_param_or_def("frm_id",false);
		if(p){
			frm.id=p;	
		}
		p=this.options.get_param_or_def("frm_name",false);
		if(p){
			frm.name=p;	
		}
		p=this.options.get_param_or_def("target",false);
		if(p){
			frm.target=p;	
		}
		frm.onsubmit=function(e){return _this.onsubmit(e)};
		
		this.panel=document.createElement("div");
		this.panel.className="card card-"+this.options.get_param_or_def("display_mode","default");
		p=this.options.get_param_or_def("lbl",false);
		if(p){
			this.panelHeading=document.createElement("div");
			this.panelHeading.className="card-header";
			this.panelHeading.innerHTML='<div style="cursor:pointer" data-toggle="collapse" data-auto-target=".card-collapse" data-auto-target-parent=".card" aria-expanded="true" >'+p+'</div>';
			this.panel.appendChild(this.panelHeading);
			
				
			
		}
		
		this.panelBodyContainer=document.createElement("div");
		//this.panelBodyContainer.className="card-collapse collapse in";
		this.panel.appendChild(this.panelBodyContainer);
		
		
		
		this.panelBody=document.createElement("div");
		this.panelBody.className="card-body";
		this.panelBodyContainer.appendChild(this.panelBody);
		
		var createfooter=false;
		if(this.options.get_param_or_def("footer",false)){
			createfooter=true;
		}
		var list_on_footer=new Array;
		var list;
		var i;
		if(this.sub_items_list){
			var list=this.sub_items_list.getList();
			
			if(list){
				for(i =0; i<list.length;i++){
					if(list[i].options.get_param_or_def("onFooter",false)){
						list_on_footer.push(list[i]);
						createfooter=true;
					}else{
						list[i].append_to_container(this.panelBody);
					}
				}
				
			}
			
		}
		if(createfooter){
			this.panelFooter=document.createElement("div");
			this.panelFooter.className="card-footer";
			this.panelBodyContainer.appendChild(this.panelFooter);
			list=list_on_footer;
			for(i =0; i<list.length;i++){
				list[i].append_to_container(this.panelFooter);	
			}
				
		}
		c.appendChild(this.panel);

		return c;
	}
	
	
	this.init(options);
		
}
mw_datainput_item_frmonpanel.prototype=new mw_datainput_item_frm();



