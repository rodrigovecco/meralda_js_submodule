function mw_datainput_item_datagrid_row(cod,data,man){
	this.cod=cod;
	this.data=new mw_obj();	
	this.data.set_params(data);
	this.man=man;
	this.deleted=false;
	this.set_col_item=function(colitem){
		this.colitem=colitem;	
	}
	this.addValue2list=function(list){
		if(!this.deleted){
			list.push(this.data.get_param());
		}
	}
	this.addInputs2container=function(container){
		var c=document.createElement("div");
		var e=document.createElement("div");
		e.innerHTML=this.cod+"";
		c.appendChild(e);
		e=document.createElement("div");
		var pref=this.cod;	
		var p;
		if(this.man){
			if(p=this.man.get_input_name()){
				pref=p+"["+this.cod+"]";
			}
		}
		this.data.append2frm(e,pref);
		c.appendChild(e);
		container.appendChild(c);
		
	}
	
}

function mw_datainput_item_datagrid(options){
	this.init(options);
	this.new_row_index=1;
	//this.value_as_list=new Array();
	this.rows_col=new mw_objcol();
	
	this.get_input_value_as_group=function(){
		var d=new Object;
		
		
		var list=this.dsList();
		if(!list){
			return d;	
		}
		var cod=0;
		var _cod;
		var input;
		for(var i =0; i<list.length;i++){
			cod++;
			_cod=""+cod;
			d[_cod]=list[i];
			
		}
		return d;
	}
	this.insertNewRowIfCfg=function(){
		if(!this.options.get_param_or_def("autoNewRow",false)){
			return false;
		}
		//deshabilitado
		//this.insertRow();
	}
	this.insertRow=function(){
		
		
		if(!this.dataGridMan){
			return false;	
		}
		var dg=this.dataGridMan.get_data_grid();
		if(dg){
			try {
				dg.insertRow();	
			}catch(err) {
    			console.log(err);
			}
			
		}
	}
	this.dsList=function(){
		var r=new Array();
		var list=this.rows_col.get_items_by_index();
		
		if(list){
			for(var i=0;i<list.length;i++){
				list[i].addValue2list(r);	
			}
		}
		return r;
	}
	this.get_row_key=function(){
		return this.options.get_param_or_def("row.key","index");
	}
	this.get_row_id_key=function(){
		return this.options.get_param_or_def("row.id","id");
	}
	this.get_new_row_id=function(){
		return this.options.get_param_or_def("newrowid","new");
	}
	this.get_new_row_index=function(){
		var r=this.new_row_index;
		this.new_row_index++;
		return r;	
	}
	this.onInitNewRow=function(info){
		var k=this.get_row_key();
		var k_val=this.get_new_row_index();	
		if(k){
			if(k_val){
				info.data[k] = k_val;
			}
		}
		k=this.get_row_id_key();
		k_val=this.get_new_row_id();	
		if(k){
			if(k_val){
				info.data[k] = k_val;
			}
		}
		
	}
	this.update_rows_inputs=function(){
		if(!this.hidden_inputs_container){
			return false;	
		}
		mw_dom_remove_children(this.hidden_inputs_container);
		var list=this.rows_col.get_items_by_index();
		if(list){
			//console.log(list);
			for(var i=0;i<list.length;i++){
				list[i].addInputs2container(this.hidden_inputs_container);	
			}
		}
		
	}
	this.onRowInserting=function(info){
		/*
		var fnc=this.options.get_param_if_function("onRowInsertingValidate");
		if(fnc){
			fnc(info,this);	
		}
		*/
	}
	
	
	this.onRowInserted=function(info){
		var k=this.get_row_key();
		if(!k){
			return false;	
		}
		var cod=info.data[k];
		if(!cod){
			return false;	
		}
		var citem=new mw_datainput_item_datagrid_row(cod,info.data,this);
		this.rows_col.add_item_and_set(citem);
		this.new_row_index++;
		this.insertNewRowIfCfg();
		this.update_rows_inputs();

	}
	this.onRowUpdated=function(info){
		console.log(info);
		var k=this.get_row_key();
		if(!k){
			return false;	
		}
		var cod;
		if(mw_is_object(info.key)){
			cod=info.key[k];
		}else{
			cod=info.key;	
		}
		
		if(!cod){
			return false;	
		}
		var citem=this.rows_col.get_item(cod);
		if(!citem){
			return false;	
		}
		citem.data.extend_params(info.data);
		this.update_rows_inputs();

	}
	
	this.onRowRemoved=function(info){
		var k=this.get_row_key();
		if(!k){
			return false;	
		}
		var cod;
		if(mw_is_object(info.key)){
			cod=info.key[k];
		}else{
			cod=info.key;	
		}
		//console.log(cod);
		if(!cod){
			return false;	
		}
		var citem=this.rows_col.get_item(cod);
		if(!citem){
			return false;	
		}
		var del_key= this.options.get_param_or_def("deletedatakey","delete");
		citem.deleted=true;
		if(del_key){
			citem.data.set_param(1,del_key);	
		}
		//citem.data.extend_params(info.data);
		this.update_rows_inputs();

	}
	
	//
	this.initDataGridMan=function(){
		if(this.dataGridMan){
			return this.dataGridMan;
		}
		var man=this.options.get_param_if_object("dataGridMan");
		if(!man){
			return false;	
		}
		var _this=this;
		this.dataGridMan=man;
		this.dataGridMan.params.set_param(function(info){_this.onRowInserting(info)},"gridoptions.onRowInserting");
		this.dataGridMan.params.set_param(function(info){_this.onRowInserted(info)},"gridoptions.onRowInserted");
		this.dataGridMan.params.set_param(function(info){_this.onInitNewRow(info)},"gridoptions.onInitNewRow");
		this.dataGridMan.params.set_param(function(info){_this.onRowUpdated(info)},"gridoptions.onRowUpdated");
		this.dataGridMan.params.set_param(function(info){_this.onRowRemoved(info)},"gridoptions.onRowRemoved");
		this.dataGridMan.init_from_params();
		this.dataGridMan.set_ds_from_array(_this.dsList(),this.get_row_key());
		return this.dataGridMan;
		
	}
	
	this.createDataGrid=function(){
		var man=this.initDataGridMan();
		if(!this.dataGridMan){
			return false;	
		}
		var _this=this;
		this.dataGridMan.create_data_grid_on_elem(this.datagrid_container);
		
		this.update_rows_inputs();	
		
	}
	this.beforeAppend=function(){
		var p=this.options.get_param_or_def("value",false);
		if(p){
			this.set_orig_value(p);	
		}
		//this.addItemsFromOptions();
	}
	this.set_value_as_list_and_update_grid=function(val){
		this.set_value_as_list(val);
		if(!this.dataGridMan){
			return false;	
		}
		var _this=this;
		this.dataGridMan.set_ds_from_array(_this.dsList(),this.get_row_key());
		var dg=this.dataGridMan.get_data_grid();
		if(dg){
			dg.option({dataSource:this.dataGridMan.ds_cfg});
			//this.insertNewRowIfCfg();
			dg.refresh();
		}
		
	}
	
	this.set_value_as_list=function(val){
		//colitem
		//console.log(val);
		this.rows_col=new mw_objcol();
		this.new_row_index=1;
		var citem;
		
		//this.value_as_list=new Array();
		if(mw_is_object(val)){
			for(var cod in val){
				if(mw_is_object(val[cod])){
					citem=new mw_datainput_item_datagrid_row(cod,val[cod],this);
					this.rows_col.add_item_and_set(citem);
					this.new_row_index++;
					
					//this.value_as_list.push(val[cod]);	
				}
			}
		}
		this.update_rows_inputs();
		return this.rows_col;
	}
	this.set_orig_value=function(val){
		this.orig_value=val;
		this.set_value_as_list(val);	
	}
	this.set_input_value=function(val){
		this.set_value_as_list(val);
		
	}
	
	
	this.afterAppend=function(){
		this.doAfterAppendFncs();
		if(this.children_container){
			this.datagrid_container=document.createElement("div");
			this.hidden_inputs_container=document.createElement("div");
			this.children_container.appendChild(this.hidden_inputs_container);
			mw_hide_obj(this.hidden_inputs_container);
			this.datagrid_container.style.minHeight="200px";
			this.children_container.appendChild(this.datagrid_container);
			this.createDataGrid();
			
		}
		
		
		if(!this.panelheading){
			return;	
		}
		if(!this.options.get_param_or_def("newrowbtn",false)){
			return false;
		}
		var _this=this;
		var btns=document.createElement("div");
		btns.className="mw_panel_title_btns";
		var btn=document.createElement("div");
		btn.className="mw_nav_mnu_drop_down_btn mw_input_dataGrid_new_btn";
		btn.innerHTML="<span class='fa fa-plus-circle'> </span>";
		btn.style.cursor="pointer";
		btns.appendChild(btn);
		btn.onclick=function(e){
                                            e.stopPropagation();
											_this.insertRow()};
		var firstch=this.panelheading.firstChild;
		if(firstch){
			this.panelheading.insertBefore(btns,firstch);
			
		}else{
			
			this.panelheading.appendChild(btns);
		}
		
	}
}
mw_datainput_item_datagrid.prototype=new mw_datainput_item_groupwithtitle();




