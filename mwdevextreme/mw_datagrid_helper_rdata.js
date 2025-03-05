function mw_devextreme_datagrid_man_rdata(params){
	mw_devextreme_datagrid_man_adv.call(this,params);
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
		var params=this.params.get_param_if_object("dataSourceMan",true);
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
	this.create_data_grid_options=function(){
		this.getDataSource();
		var ops=this.params.get_param_if_object("gridoptions",true);
		var _this=this;
		if(this.params.get_param_or_def("hideHeaderPanel",false)){
			if(!ops['onContentReady']){
				ops['onContentReady']=function(){_this.hideHeaderPanel()};	
			}
		}
		this.create_data_grid_optionsExcelExport(ops);
		var list=this.columns.get_items_by_index();
		ops.columns=this.get_columns_options();
		if(this.dataSource){
			ops.dataSource=this.dataSource;	
		}
		this.set_create_data_grid_options_events(ops);
		this.set_create_data_grid_options_others(ops);
		
		console.log("create_data_grid_options",ops);
		return ops;
		
	}
	
}

function mw_devextreme_datagrid_man_rdataedit(params){
	mw_devextreme_datagrid_man_rdata.call(this,params);
	this.set_create_data_grid_options_events=function(ops){
		var _this=this;
		if(!ops['onRowRemoved']){
			ops['onRowRemoved']=function(e){_this.onRowRemoved(e)};	
		}
		if(!ops['onRowUpdating']){
			ops['onRowUpdating']=function(e){_this.onRowUpdating(e)};	
		}
		if(!ops['onRowInserting']){
			ops['onRowInserting']=function(e){_this.onRowInserting(e)};	
		}
		if(!ops['onRowInserted']){
			ops['onRowInserted']=function(e){_this.onRowInserted(e)};	
		}
		if(!ops['onInitNewRow']){
			ops['onInitNewRow']=function(e){_this.onInitNewRow(e)};	
		}
		if(!ops['onRowRemoving']){
			ops['onRowRemoving']=function(e){_this.onRowRemoving(e)};	
		}
		if(!ops['onRowClick']){
			if(this.params.get_param("editOnRowClick")){
				ops['onRowClick']=function(e){_this.editOnRowClick(e)};	
			}
		}
		if(!ops['onEditingStart']){
			ops['onEditingStart']=function(e){_this.onEditingStart(e)};	
		}
		if(!ops['onEditorPreparing']){
			ops['onEditorPreparing']=function(e){_this.onEditorPreparing(e)};	
		}
		if(!ops['onToolbarPreparing']){
			ops['onToolbarPreparing']=function(e){_this.onToolbarPreparing(e)};	
		}

		
			
	}
	this.onEditorPreparing=function(info){
		if(this.params.get_param_or_def("onEditorPreparingColsEnabled")||this.onEditorPreparingColsEnabled){
			if(info.parentType=="dataRow"){
				this.onEditorPreparingUpdateCols(info);	
			}
		}
	}
	this.onEditorPreparingUpdateCols=function(info){
		//console.log("onEditorPreparingUpdateCols",info);
		var cod=info.dataField;
		if(!cod){
			return;	
		}
		var col=this.columns.get_item(cod);
		if(col){
			if(col.onEditorPreparingColsEnabled){
				col.onEditorPreparing(info);	
			}
		}
	}
	
	this.isNewData=function(data){
		if(!mw_is_object(data)){
			return false;	
		}
		var newKey=this.get_is_new_data_key();
		if(newKey){
			if(data[newKey]){
				return true;	
			}
		}
		
		return false;
	}

	
	this.updateColsOptionsOnEditing=function(info){
		var list=this.columns.get_items_by_index();
		var cod;
		var o;
		if(!list){
			return;	
		}
		var newKey=this.get_is_new_data_key();
		var is_new=false;
		if(newKey){
			if(info.data[newKey]){
				is_new=true;
			}
		}

		for(var i=0;i<list.length;i++){
			//cod=list[i].cod;
			list[i].updateColOptionsOnEditing(info,is_new);
			
			
				
		}
	
	}
	
	this.onEditingStartDef=function(info){
		if(this.params.get_param_or_def("updateColsOptionsOnEditing")){
			this.updateColsOptionsOnEditing(info);	
		}
	}

	this.onEditingStart=function(info){
		var fnc=this.params.get_param_if_function("onEditingStart");
		if(fnc){
			return fnc(info,this);	
		}else{
			return this.onEditingStartDef(info);	
		}
		
		
	}
	
	
	
	this.editOnRowClick=function(info){
		//console.log("editOnRowClick",info);
		var dg=this.get_data_grid();
		if(!dg){
			return;
		}
		//dg.saveEditData();
		dg.editRow(info.rowIndex);
		
	}
	
	this.onRowRemovingDef=function(info){
		//console.log("onRowRemovingDef",info);
		//info.cancel=true;
		var newKey=this.get_is_new_data_key();
		var idKey=this.get_id_data_key();
		var uniqKey=this.get_uniq_data_key();
		
		
		if(newKey){
			if(info.data[newKey]){
				console.log("es nuevo");
				info.cancel=true;
				return false;	
					
			}
		}
		if(!idKey){
			return false;
		}
		var id=info.data[idKey];
		if(!id){
			return false;
		}
		var url=this.params.get_param("deleteItemURL");
		if(!url){
			return false;	
		}
		//var p={nd:info.data,itemid:id};
		var p=this.get_url_params_for_item_id(id,{},info.data);
		//console.log(p);
		var loader=new mw_devextreme_datagrid_ajax_deleteItem(this);
		loader.setEventInfo(info);
		loader.origData=info.data;
		if(uniqKey){
			loader.dataItemKey=info.data[uniqKey];
		}
		loader.set_url(url,p);
		info.cancel=true;
		loader.exec();
		
		
		
	}

	this.onRowRemoving=function(info){
		var fnc=this.params.get_param_if_function("onRowRemoving");
		if(fnc){
			return fnc(info,this);	
		}else{
			return this.onRowRemovingDef(info);	
		}
		
	}
	


	this.onRowRemovedDef=function(info){
		//console.log("onRowRemovedDef",info);
		return;
	}
	
	this.onItemDeleteResponse=function(loader){
		console.log("onItemDeleteResponse",loader);	
		if(!loader.responseData){
			return false;
		}
		data=loader.responseData;
		this.show_popup_notify(data.get_param_if_object("notify"));
		if(!data.get_param_or_def("ok",false)){
			return false;
		}
		this.refreshGrid();

		
	}

	this.onRowRemoved=function(info){
		var fnc=this.params.get_param_if_function("onRowRemoved");
		if(fnc){
			return fnc(info,this);	
		}else{
			return this.onRowRemovedDef(info);	
		}
		
	}
	
	this.onRowUpdatingDef=function(info){
		console.log("onRowUpdating",info);
		var uniqKey=this.get_uniq_data_key();
		var newKey=this.get_is_new_data_key();
		var idKey=this.get_id_data_key();
		if(newKey){
			if(info.oldData[newKey]){
				console.log("es nuevo");
				
				info.cancel=true;
				
				return false;	
					
			}
		}
		if(!idKey){
			info.cancel=true;
			return false;
		}
		var id=info.oldData[idKey];
		if(!id){
			info.cancel=true;
			return false;
		}
		var url=this.params.get_param("saveItemURL");
		if(!url){
			return false;	
		}
		var dsMan=this.getDataSourceMan();
		if(dsMan){
			dsMan.addEditedId(id);	
		}
		//var p={nd:info.newData,itemid:id};
		//
		var p=this.get_url_params_for_item_id(id,{},info.newData);
		//console.log(p);
		var loader=new mw_devextreme_datagrid_ajax_saveItem(this);
		
		if(uniqKey){
			loader.dataItemKey=info.oldData[uniqKey];
		}
		loader.set_url(url,p);
		loader.exec();

		
	}

	this.onRowUpdating=function(info){
		console.log("onRowUpdating");
		var fnc=this.params.get_param_if_function("onRowUpdating");
		if(fnc){
			return fnc(info,this);	
		}else{
			return this.onRowUpdatingDef(info);	
		}
		
		
	}
	
	this.onRowInsertingDef=function(info){
		console.log("onRowInserting",info);	
	}

	this.onRowInserting=function(info){
		var fnc=this.params.get_param_if_function("onRowInserting");
		if(fnc){
			return fnc(info,this);	
		}else{
			return this.onRowInsertingDef(info);	
		}
		
		
	}
	this.onRowInserted=function(info){
		this.advEventDispatch("onRowInserted",{info:info});
		var fnc=this.params.get_param_if_function("onRowInserted");
		if(fnc){
			return fnc(info,this);	
		}else{
			return this.onRowInsertedDef(info);	
		}
		
		
	}
	this.onRowInsertedDef=function(info){
		var url=this.params.get_param("newItemURL");
		if(!url){
			return false;	
		}
		//var p={nd:info.data};
		var p=this.get_url_params_for_item_id(false,{},info.data);
		
		var loader=new mw_devextreme_datagrid_ajax_createItem(this);
		
		var uniqKey=this.get_uniq_data_key();
		if(uniqKey){
			loader.dataItemKey=info.data[uniqKey];
		}
		
		loader.set_url(url,p);
		loader.exec();
	}
	this.onNewItemCreatedResponse=function(loader){
		console.log("onNewItemCreatedResponse",loader);
		this.advEventDispatch("onNewItemCreatedResponse",{loader:loader});
		if(!loader.responseData){
			return false;
		}
		var _this=this;
		var data=loader.responseData;
		var uniqKey=this.get_uniq_data_key();
		var newKey=this.get_is_new_data_key();
		var idKey=this.get_id_data_key();
		
		this.show_popup_notify(data.get_param_if_object("notify"));		
		this.refreshGrid();

		
		return;
	}
	
	this.onItemSavedResponse=function(loader){
		//verificar que actualice datos 
		this.advEventDispatch("onItemSavedResponse",{loader:loader});
		if(!loader.responseData){
			return false;
		}
		data=loader.responseData;
		if(!data.get_param_or_def("ok",false)){
			return false;
		}
		this.setUniqBoolItemsIds(data.get_param_if_object("uniqItemsIds"));
		var itemdata=data.get_param_if_object("itemdata");
		if(!itemdata){
			return false;	
		}
		var id=loader.dataItemKey;
		if(!id){
			return false;	
		}
		var _this=this;
		return this.updateItemData(id,itemdata,function(dataItem){_this.refreshGrid();});
		
		
	}
	
	this.onInitNewRowDef=function(info){
		//console.log("onInitNewRowDef",info);
		var uniqKey=this.get_uniq_data_key();
		var newKey=this.get_is_new_data_key();
		var idKey=this.get_id_data_key();
		if(idKey){
			info.data[idKey]=Globalize.localize("New");	
		}
		if(newKey){
			info.data[newKey]=true;	
		}
		if(uniqKey){
			info.data[uniqKey]="new_"+this.get_next_uniq_index();	
		}
		if(this.params.get_param_or_def("updateColsOptionsOnEditing")){
			this.updateColsOptionsOnEditing(info);	
		}
		
	}
	this.onInitNewRow=function(info){
		var fnc=this.params.get_param_if_function("onInitNewRow");
		if(fnc){
			return fnc(info,this);	
		}else{
			return this.onInitNewRowDef(info);	
		}
	}
	
}
