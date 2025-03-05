function mw_datainput_dx(options){
	mw_datainput_item_abs.call(this);
	this.init(options);
	this.get_input_value=function(){
		return this.DXValue;
		
	}
	this.setInputStateProp=function(cod,val,children){
	
		//cod: disabled, readOnly , required 
		if(val){
			val=true;	
		}else{
			val=false;	
		}
		this.options.set_param(val,"state."+cod);
		if(this.input_elem){
			this.update_input_atts(this.input_elem);	
		}
		if(this.DXctr){
			if(cod=="readOnly"){
				this.DXctr.option("readOnly",val);
			}
			if(cod=="disabled"){
				this.DXctr.option("disabled",val);
			}
			
		}


		if(!children){
			return;	
		}
		if(!this.sub_items_list){
			return;	
		}
		var list=this.sub_items_list.getList();
		if(!list){
			return;	
		}
		for(var i =0; i<list.length;i++){
			
			list[i].setInputStatePropFromParent(cod,val,children);
		}
		
	}
	this.set_input_value=function(val){
		this.DXValue=val;

		if(this.DXctr){
			this.DXctr.option("value",val);
		}

		if(this.input_elem){
			this.input_elem.value=this.format_input_value(val)+"";	
		}
	}
	this.get_tooltip_target_elem=function(){
		return this.DXctrElem;	
	}

	this.createDXctr=function(container,ops){
		
		$($(container)).dxTextBox(ops);
		this.DXctr=$($(container)).dxTextBox('instance');
		
		
		
	}
	this.initDX=function(){
		if(!this.DXctrElem){
			return false;	
		}
		var ops=this.getDXOptions();
		this.createDXctr(this.DXctrElem,ops);
		
	}
	this.onDXValueChanged=function(e){
		
		if(e){
			this.DXValue=e.value;	
		}
		this.on_change();
	}
	this.getDXOptionsMore=function(params){
		//
	}
	this.getDXOptions=function(){
		var params=this.options.get_param_if_object("DXOptions",true);
		var p;
		var _this=this;
		if(!this.options.param_exists("DXOptions.onValueChanged")){
			params.onValueChanged=function(e){_this.onDXValueChanged(e)};
		}
		p=this.options.get_param_or_def("placeholder",false);
		if(p){
			if(!this.options.param_exists("DXOptions.placeholder")){
				params.placeholder=p;
			}
		}
		if(!params.inputAttr){
			params.inputAttr={};
		}
		if(!this.options.param_exists("inputAttr.id")){
			params.inputAttr.id=this.get_input_id();
		}
		if(!this.options.param_exists("name")){
			params.name=this.get_input_name();
		}
		if(this.options.get_param_or_def("state.required")){
			params.inputAttr.required="required";
		}
		this.getDXOptionsMore(params);
		return params;

	
	}
	this.append_to_container=function(container){
		if(!container){
			return false;	
		}
		this.beforeAppend();
		var e=this.get_container();
		if(e){
			container.appendChild(e);
			this.initDX();
			this.afterAppend();
			return true;	
		}
	}
	
	
	this.create_container=function(){
		var p;
		var c=document.createElement("div");
		c.className="form-group";
		this.frm_group_elem=c;
		var lbl=this.create_lbl();
		if(lbl){
			c.appendChild(lbl);	
		}
		this.DXctrElemContainer=document.createElement("div");
		this.DXctrElem=document.createElement("div");
		this.DXctrElem.className="dx-field-value";
		this.DXctrElemContainer.className="mw-dx-form-control-placeholder";

		this.DXctrElemContainer.appendChild(this.DXctrElem);
		//c.appendChild(this.DXctrElemContainer);	
		var lbnt=this.create_left_btn();
		var rbtn=this.create_right_btn();
		var inputelem=this.DXctrElemContainer;
		var cc;
		var ccc;
		if(lbnt||rbtn||this.is_horizontal()){
			cc=document.createElement("div");
			cc.className="input-group";
			if(this.is_horizontal()){
				if(lbnt||rbtn){
					ccc=document.createElement("div");
					ccc.className="mw_input_group_horizontal_container";
					cc.appendChild(ccc);
					cc=ccc;	
					
					
				}
			}
			if(lbnt){
				cc.appendChild(lbnt);	
			}
			if(inputelem){
				cc.appendChild(inputelem);
				$(inputelem).addClass("flex-fill");
			}
			if(rbtn){
				cc.appendChild(rbtn);
				
			}
			
			c.appendChild(cc);	
		}else{
			if(inputelem){
				c.appendChild(inputelem);	
			}
				
		}
		
		
		this.create_notes_elem_if_req();
		return c;
	}
	this.create_lbl=function(){
		var p;
		p=this.options.get_param_or_def("lbl",false);
		if(p){
			var lbl=document.createElement("label");
			lbl.innerHTML=p;
			p=this.get_input_id();
			if(p){
				lbl.htmlFor =id;	
			}
			return lbl;
			
		}
			
	}
	
	
}
function mw_datainput_dx_textBox(options){
	mw_datainput_dx.call(this,options);	
}

function mw_datainput_dx_selectBox(options){
	mw_datainput_dx.call(this,options);
	this.createDXctr=function(container,ops){
		console.log(ops);
		$($(container)).dxSelectBox(ops);
		this.DXctr=$($(container)).dxSelectBox('instance');
	}
	this.autoCreateItems=function(){
		var list=this.options.get_param_as_list("optionslist");
		if(!list){
			list=[];
		}
		return list;
	}
	this.getDXOptionsMore=function(params){
		if((!params["dataSource"])&&(!params["items"])){
			params["items"]=this.autoCreateItems();
			params["displayExpr"]="name";
			params["valueExpr"]="cod";
		}
	}
	this.getSelectedItemData=function(){
		if(this.DXctr){
			return this.DXctr.option("selectedItem");
		}
		return null;
	}



}

function mw_datainput_dx_selectBoxRemote(options){
	mw_datainput_dx_selectBox.call(this,options);
	this.getDXOptionsMore=function(params){
		if(this.options.get_param_if_object("dataSourceMan")){
			if(!params["dataSource"]){
				params["dataSource"]=this.getDataSource();
			}


		}
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
	this.addAndSelectItem = function(newItemData, callback) {
		var _this = this;
		var dataStore = this.getDataStore();
	
		// Add new item to the data store
		dataStore.insert(newItemData).done(function(insertedItem) {
			console.log("Inserted Item:", insertedItem);
	
			// Reload the data source to include the new item
			_this.getDataSource().load().done(function() {
				// Set the newly added item as the selected value
				_this.set_input_value(insertedItem.id);
				
				// Execute callback if provided
				if (callback && typeof callback === "function") {
					callback(insertedItem);
				}
			});
		}).fail(function(error) {
			console.error("Error adding item:", error);
		});
	};



}