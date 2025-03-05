//20240122
function mw_datainput_item_DX_normal_Autocomplete(options){
	mw_datainput_item_dx_normal.call(this,options);
	this.createDXctr=function(container,ops){
		//console.log(ops);
		
		$($(container)).dxAutocomplete(ops);
		
		return $($(container)).dxAutocomplete('instance');
		
	}
	this.onItemClick=function(e){
		console.log("onItemClick",e);
		//can be rewritten by UI or others
	}
	
	this.getDataStore=function(){
		if(!this.DataStore){
			this.DataStore=this.getDataSourceMan().getDataStore();
		}
		return this.DataStore;	
	}
	this.getDataSourceMan=function(){
		if(this.dataSourceMan){
			return this.dataSourceMan;	
		}
		this.createDataSourceMan()
		return this.dataSourceMan;	
	}
	
	this.createDataSourceMan=function(){
		var _this=this;
		var params=this.options.get_param_if_object("dataSourceMan",true);
		if(mw_is_function(params["isDSMan"])){
			this.dataSourceMan=params;
		}else{
			this.dataSourceMan=new mw_devextreme_data(params);	
		}
		return this.dataSourceMan;	
	}
	this.getDataSource=function(){
		if(!this.dataSource){
			this.dataSource=this.getDataSourceMan().getDataSource();
		}
		return this.dataSource;	
	}
	this.getDXOptions=function(){
		var _this=this;
		var params=this.options.get_param_if_object("DXOptions",true);
		var p;
		if(!this.options.param_exists("DXOptions.onValueChanged")){
			params.onValueChanged=function(e){_this.onDXValueChanged(e)};
		}
		p=this.options.get_param_or_def("placeholder",false);
		if(p){
			if(!this.options.param_exists("DXOptions.placeholder")){
				params.placeholder=p;
			}
		}
		if(this.options.get_param_if_object("dataSourceMan")){
			if(!params["dataSource"]){
				params["dataSource"]=this.getDataSource();
			}


		}
		if(!params["onItemClick"]){
			params["onItemClick"]=function(e){_this.onItemClick(e)};
		}
		
		return params;

	
	}

}
function mw_datainput_item_DXnumber(options){
	mw_datainput_item_dx_normal.call(this,options);
	this.createDXctr=function(container,ops){
		//console.log(ops);
		
		$($(container)).dxNumberBox(ops);
		
		return $($(container)).dxNumberBox('instance');
		
	}

}

function mw_datainput_item_normal_dx_textbox(options){
	mw_datainput_item_dx_normal.call(this,options);

}

function mw_datainput_item_dx_normal(options){
	mw_datainput_item_base.call(this,options);
	this.getDXOptions=function(){
		var _this=this;
		var params=this.options.get_param_if_object("DXOptions",true);
		var p;
		if(!this.options.param_exists("DXOptions.onValueChanged")){
			params.onValueChanged=function(e){_this.onDXValueChanged(e)};
		}
		p=this.options.get_param_or_def("placeholder",false);
		if(p){
			if(!this.options.param_exists("DXOptions.placeholder")){
				params.placeholder=p;
			}
		}
		
		return params;

	
	}
	this.createDXctr=function(container,ops){
		//console.log(ops);
		
		$($(container)).dxTextBox(ops);
		
		return $($(container)).dxTextBox('instance');
		
		
	}
	this.createDXControl=function(){
		if(!this.dx_dom_elem){
			return false;	
		}
		var _this=this;
		var o=this.getDXOptions();
		this.dx_ctr=this.createDXctr(this.dx_dom_elem,o);
		this.onDXCreated(this.dx_ctr);
		
	}
	this.onDXCreated=function(ctr){
		if(!ctr){
			return false;	
		}
		//console.log(ctr);
		var e=ctr.element();
		if(!e){
			return false;	
		}
		
	}

	this.afterAppend=function(){
		this.doAfterAppendFncs();

		this.createDXControl();
		if(this.orig_value){
			this.set_input_value(this.orig_value);	
		}
		this.update_input_atts();
		this.initTooltipFromParams();
		
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
		var cc;

		this.dx_dom_elem_out=document.createElement("div");
		if(this.is_horizontal()){
			//cc=document.createElement("div");
			//cc.className="input-group";
			this.dx_dom_elem_out.className="input-group";
		}
		
		c.appendChild(this.dx_dom_elem_out);	
		
		this.dx_dom_elem=document.createElement("div");
		this.dx_dom_elem.className="mw-dx-normal-ctr";
		//this.dx_dom_elem.className="form-control mw-dx-normal-ctr";
		//c.appendChild(this.dx_dom_elem);
		this.dx_dom_elem_out.appendChild(this.dx_dom_elem);
		this.create_notes_elem_if_req();
		return c;
	}
	this.get_tooltip_target_elem=function(){
		return this.dx_dom_elem;	
	}
	this.set_input_value=function(val){
		
		if(this.input_elem){
			this.input_elem.value=this.format_input_value(val)+"";	
		}
		this.updateDXValue();
		
	}
	this.updateDXValue=function(){
		
		if(this.dx_ctr){
			this.dx_ctr.option("value",this.get_input_value());	
		}
	}

	
	
	this.onDXValueChanged=function(e){
		
		if(e){
			this.DXValue=e.value;
			if(this.input_elem){
				this.input_elem.value=	e.value;
			}
		}
		this.on_change();
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
		}
	}
	

}
