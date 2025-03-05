
function mw_datainput_item_date(options){
	mw_datainput_item_abs.call(this);
	this.mw_date=new mw_date();
	this.init(options);
	this.onDXValueChanged=function(e){
		var date=false;
		if(e){
			if(e.value){
				date=e.value;	
			}
		}
		if(this.set_mw_date_and_input_value(date)){
			this.on_change();
		}
	}
	this.setMWDateFromStr=function(strDate){
		if(this.options.get_param_or_def("inputTimeOnlyMode",false)){
			return 	this.mw_date.set_from_sys_value_flexibleMode(strDate);
		}else{
			return 	this.mw_date.set_from_sys_value(strDate);
				
		}
	}
	this.updateMwDateAndDxCtrFromStr=function(strDate){
		this.setMWDateFromStr(strDate);
		//console.log("updateMwDateAndDxCtrFromStr",strDate);
		//
		if(this.dx_ctr){
			this.dx_ctr.option("value",this.mw_date.get_date_or_null());	
		}
	}
	this.onDXChanged=function(e){
		
		if(!e){
			return;	
		}
		if(!e.component){
			return;	
		}
		if(e.component.option("isValid")){
			return;
		}
		var fixed_date=null;	
		var ie=e.component.field();
		if(ie){
			console.log(ie.val());
			fixed_date=this.mw_date.get_fixed_date_from_str(ie.val());
			if(!fixed_date){
				ie.val("");
			}
		}

		if(!fixed_date){
			fixed_date=null;
		}
		e.component.option("value",fixed_date);
		this.set_mw_date_and_input_value(e.component.option("value"));
	}
	this.set_mw_date_and_input_value=function(date){
		this.mw_date.set_date(date);
		if(this.input_elem){
			var n_val=this.mw_date.get_formated_sys_value();
			if(this.input_elem.value!=n_val){
				this.input_elem.value=n_val;
				return true;
			}
		}
		
	}
	
	this.get_tooltip_target_elem=function(){
		return this.dx_dom_elem;	
	}

	this.createDXControl=function(){
		if(!this.dx_dom_elem){
			return false;	
		}
		var _this=this;
		var p;
		var params=this.options.get_param_if_object("dateboxOptions",true);
		var date=this.mw_date.get_date();
		if(date){
			params.value=date;
		}else{
			params.value=null;	
		}
		date=this.mw_date.get_date_from_sys_formated_str(this.options.get_param_or_def("mindate",false));
		if(date){
			params.min=date;
		}
		date=this.mw_date.get_date_from_sys_formated_str(this.options.get_param_or_def("maxdate",false),true);
		if(date){
			params.max=date;
		}
		if(!this.options.get_param_or_def("dateboxOptions.format",false)){
			if(this.options.get_param_or_def("nohour",false)){
				params.format="date";
				params.type="date";
			}else{
				params.format="datetime";
				params.type="datetime";
				if(this.options.get_param_or_def("timeonly",false)){
					params.format="time";
					params.type="time";
				}
			}
		}
		if(!this.options.param_exists("dateboxOptions.showClearButton")){
			params.showClearButton=true;
		}
		if(!this.options.param_exists("dateboxOptions.onValueChanged")){
			params.onValueChanged=function(e){_this.onDXValueChanged(e)};
		}
		if(!this.options.param_exists("dateboxOptions.onChange")){
			params.onChange=function(e){_this.onDXChanged(e)};

		}
		p=this.options.get_param_or_def("placeholder",false);
		if(p){
			if(!this.options.param_exists("dateboxOptions.placeholder")){
				params.placeholder=p;
			}
		}
		if(this.options.get_param_or_def("showpickeronfocus")){
			if(!this.options.param_exists("dateboxOptions.onFocusIn")){
				params.onFocusIn=function(e){e.component.open()};
			}
			//
		}
		
		
		params.width="100%";
		//console.log(params);
		
		$($(this.dx_dom_elem)).dxDateBox(params);
		this.dx_ctr=$($(this.dx_dom_elem)).dxDateBox('instance');
		return this.dx_ctr;
		
	}
	this.updateMwDateAndDxCtrFromInputValue=function(){
		var val=this.get_input_value();
		
		this.updateMwDateAndDxCtrFromStr(val);	
	}
	this.afterAppend=function(){
		this.doAfterAppendFncs();
		if(this.options.get_param_or_def("nohour",false)){
			this.mw_date.omit_hour=true;
		}else if(this.options.get_param_or_def("timeonly",false)){
			this.mw_date.omit_date=true;	
		}

		this.createDXControl();
		if(this.orig_value){
			this.set_input_value(this.orig_value);	
		}
		this.update_input_atts();
		this.initTooltipFromParams();
		
	}
	this.create_container=function(){
		var p;
		var c=document.createElement("div");
		c.className="form-group";
		if(this.is_horizontal()){
			//c.className="form-group row";
			c.className="form-group mw-form-group-horizontal";
		}
		
		this.frm_group_elem=c;
		var lbl=this.create_lbl();
		if(lbl){
			c.appendChild(lbl);	
		}
		var inputelem=this.get_input_elem();
		if(inputelem){
			c.appendChild(inputelem);	
		}
		this.dx_dom_elem=document.createElement("div");
		this.dx_dom_elem.className="form-control";
		this.dx_dom_elem.className="mw-dx-normal-ctr";
		
		c.appendChild(this.dx_dom_elem);	
		this.create_notes_elem_if_req();
		return c;
	}
	
	this.create_input_elem=function(){
		var _this=this;
		var p;
		var c=document.createElement("input");
		c.className="form-control";
		c.type="hidden";
		this.set_def_input_atts(c);
		return c;
	}
	
	this.set_input_value=function(val){
		var r=false;
		if(this.input_elem){
			var n_val=this.format_input_value(val)+"";
			if(n_val!=this.input_elem.value){
				this.input_elem.value=n_val;
				r=true;	
			}
			//
		}
		this.updateMwDateAndDxCtrFromInputValue();
		return r;
	}
	
	
	
	
	this.update_input_atts=function(input){
		var required=this.options.get_param_as_boolean("state.required");
		var disabled=this.options.get_param_as_boolean("state.disabled");
		var readOnly=this.options.get_param_as_boolean("state.readOnly");
		if(disabled){
			required=false;	
		}
		if(readOnly){
			required=false;	
		}
		
		if(this.dx_ctr){
			
			this.dx_ctr.option("disabled",disabled);	
			this.dx_ctr.option("required",required);	
			this.dx_ctr.option("readOnly",readOnly);	
			var crt_input=this.dx_ctr.field();
			if(crt_input){
				crt_input.attr("required", required);
			}
		}
	}
	
	
	
	
	

}
//mw_datainput_item_date.prototype=new mw_datainput_item_abs();
