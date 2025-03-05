function mw_devextreme_datagrid_man_masterdetail_template_item(){
	mw_devextreme_datagrid_ajax.call(this);
	this.prepareDisplay=function(){
		
	}
	this.onDataLoaded=function(){
			
	}
	this.getData=function(cod){
		if(this.responseData){
			if(cod){
				return this.responseData.get_param(cod);	
			}
			return this.responseData.params;
				
		}
	}
	
	this.getRowKey=function(){
		return this.detailInfo.key;
	}
	this.getRowData=function(cod){
		if(cod){
			return this.detailInfo.data[cod];	
		}
		return this.detailInfo.data;
	}
	
	this.onAjaxResponseLoaded=function(){
		this.onDataLoaded();	
	}

	this.setTemplateObjects=function(detailElement,detailInfo){
		this.setDetailInfo(detailInfo);
		this.setDetailElement(detailElement);
	}
	this.loadData=function(url,params){
		if(url){
			this.set_url(url,params);	
		}
		this.exec();
	}
	this.setDetailInfo=function(detailInfo){
		this.detailInfo=detailInfo;
	}
	this.setDetailElement=function(detailElement){
		this.detailElement=detailElement;
	}
}




function mw_devextreme_datagrid_man_masterdetail(params){
	mw_devextreme_datagrid_man_adv.call(this,params);
	this.set_main_man=function(man){
		this.main_man=man;	
	}
	this.set_main_item=function(main_item){
		this.main_item=main_item;	
	}
	
	
	
}



function mw_devextreme_datagrid_man_editrowmode(params){
	mw_devextreme_datagrid_man_adv.call(this,params);
	
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
		if(!loader.responseData){
			return false;
		}
		data=loader.responseData;
		this.show_popup_notify(data.get_param_if_object("notify"));
		
		if(!data.get_param_or_def("ok",false)){
			return false;
		}
		this.setUniqBoolItemsIds(data.get_param_if_object("uniqItemsIds"));
		var id=loader.dataItemKey;
		//console.log("removed_"+id);
		if(!id){
			return false;	
		}
		//remove
		var _this=this;
		return this.removeItem(id,function(){_this.refreshGrid();});

		
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
		//console.log("onNewItemCreatedResponse",loader);
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
		
		if(!data.get_param_or_def("ok",false)){
			if(loader.dataItemKey){
				this.removeItem(loader.dataItemKey,function(){_this.refreshGrid();});
				//return false;	
			}
			//return this.updateItemData(loader.dataItemKey,itemdata,function(dataItem){_this.refreshGrid();});
			
			
			return false;
		}
		this.setUniqBoolItemsIds(data.get_param_if_object("uniqItemsIds"));
		var id=data.get_param_or_def("itemid",false);
		
		if(!id){
			return false;	
		}
		
		var itemdata=data.get_param_if_object("itemdata");
		
		if(!itemdata){
			return false;	
		}
		if(newKey){
			itemdata[newKey]=false;	
		}
		console.log(loader.dataItemKey);
		//var id=loader.dataItemKey;
		if(!loader.dataItemKey){
			return false;	
		}
		return this.updateItemData(loader.dataItemKey,itemdata,function(dataItem){_this.refreshGrid();});
		
	}
	
	this.onItemSavedResponse=function(loader){
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


function mw_devextreme_datagrid_ajax(man){
	this.man=man;
	this.allowJsCode=false;
	this.eventInfo=new mw_obj();
	this.setEventInfo=function(info){
		this.eventInfo.set_params(info);
	}
	this.getEventInfo=function(dotkey){
		return this.eventInfo.get_param(dotkey);
	}
	this.set_url=function(url,params){
		this.base_url=url;
		this.url_params=params;	
	}
	this.onAjaxResponseLoaded=function(){
			
	}
	
	this.onAjaxResponse=function(){
		
		var data= new mw_obj();
		
		data.set_params(this.ajax.getResponseXMLFirstNodeByTagnameAsData(null,null,this.allowJsCode));
		this.responseData=data;
		this.onAjaxResponseLoaded();

	}
	
	this.get_ajax=function(){
		if(this.ajax){
			return this.ajax;
		}
		var url=this.get_url();
		var _this=this;
		//console.log(url);
		this.ajax= new mw_ajax_launcher(url,function(){_this.onAjaxResponse()});
		
		return this.ajax;
	}
	this.exec=function(){
		var a=this.get_ajax();
		if(a){
			return a.run();	
		}
	}
	this.get_url=function(){
		if(!this.base_url){
			return false;	
		}
		var u =new mw_url();
		var url=u.get_url(this.base_url,this.url_params);
		//console.log(url);
		return url;
	
		
	}
}
function mw_devextreme_datagrid_ajax_createItem(man){
	mw_devextreme_datagrid_ajax.call(this,man);
	this.onAjaxResponseLoaded=function(){
		this.man.onNewItemCreatedResponse(this);
	}
}
function mw_devextreme_datagrid_ajax_saveItem(man){
	mw_devextreme_datagrid_ajax.call(this,man);
	this.onAjaxResponseLoaded=function(){
		this.man.onItemSavedResponse(this);
	}
}
function mw_devextreme_datagrid_ajax_deleteItem(man){
	mw_devextreme_datagrid_ajax.call(this,man);
	this.onAjaxResponseLoaded=function(){
		this.man.onItemDeleteResponse(this);
	}
}


function mw_devextreme_dataStore_proccess(dataStore,params,onDone,onFail){
	this.dataStore=dataStore;
	this.params=params;
	this.cusOnDone=onDone;
	this.cusOnFail=onFail;
	this.onDone=function(dataItem){
		this.data=dataItem;
		if(mw_is_function(this.cusOnDone)){
			this.cusOnDone(dataItem,this);	
		}
	}
	this.onFail=function(error){
		this.error=error;
		if(mw_is_function(this.cusOnFail)){
			this.cusOnFail(error,this);	
		}
	}
	this.exec=function(){
		return false;	
	}
	
}
function mw_devextreme_dataStore_proccess_byKey(dataStore,params,onDone,onFail){
	mw_devextreme_dataStore_proccess.call(this,dataStore,params,onDone,onFail);
	this.exec=function(){
		var _this=this;
		this.dataStore.byKey(this.params.key)
		.done(function(dataItem) {
			_this.onDone(dataItem);
		})
		.fail(function(error) {
			_this.onFail(error);
		});
		return true;
	}

}
function mw_devextreme_dataStore_proccess_load(dataStore,params,onDone,onFail){
	mw_devextreme_dataStore_proccess.call(this,dataStore,params,onDone,onFail);
	this.exec=function(){
		var _this=this;
		this.dataStore.load(this.params)
		.done(function(result) {
			_this.onDone(result);
		})
		.fail(function(error) {
			_this.onFail(error);
		});
		return true;
	}

}

function mw_devextreme_dataStore_proccess_update(dataStore,params,onDone,onFail){
	mw_devextreme_dataStore_proccess.call(this,dataStore,params,onDone,onFail);
	this.exec=function(){
		var _this=this;
		this.dataStore.update(this.params.key,this.params.values)
		.done(function(dataItem) {
			_this.onDone(dataItem);
		})
		.fail(function(error) {
			_this.onFail(error);
		});
		return true;
	}

}
function mw_devextreme_dataStore_proccess_remove(dataStore,params,onDone,onFail){
	mw_devextreme_dataStore_proccess.call(this,dataStore,params,onDone,onFail);
	this.exec=function(){
		var _this=this;
		this.dataStore.remove(this.params.key)
		.done(function() {
			_this.onDone({result:true});
		})
		.fail(function(error) {
			_this.onFail(error);
		});
		return true;
	}

}

function mw_devextreme_datagrid_reg(cod,data){
	this.cod=cod;
	this.data=data;
	this.array_data={};
	this.set_man=function(man){
		this.man=man;
	}
	this.add_array_data=function(cod,data){
		if(!this.array_data[cod]){
			this.array_data[cod]=new Array();	
		}
		this.array_data[cod].push(data);
	}
	this.get_array_data=function(cod){
		if(!this.array_data[cod]){
			this.array_data[cod]=new Array();	
		}
		return this.array_data[cod];
	}
		
}


function mw_devextreme_datagrid_man_adv(params){
	mw_devextreme_datagrid_man.call(this,params);
	this.next_uniq_index=0;
	this.setUI=function(ui){
		this.ui=ui;
	}
	this.clearData=function(){
		this.next_uniq_index=0;
		if(this.regs_items_col){
			this.regs_items_col=new mw_objcol();
		}
		if(this.DataStore){
			this.DataStore.clear();
		}
	}
	this.clear=function(){
		this.clearData();
		this.refreshGrid();	
	}

	this.loadDataByAjax=function(params,url){
		console.log("dd");
		if(!url){
			url=this.params.get_param_or_def("loadDataURL",false);	
		}
		if(!url){
			return false;	
		}
		if(!mw_is_object(params)){
			params={};	
		}
		this.lastDataByAjaxParams=params;
		var u =new mw_url();
		var finalUrl=u.get_url(url,params);
		if(this.ui){
			this.ui.debug_url(finalUrl);	
		}
		var ajax=this.getDataAjaxLoader();
		if(!ajax){
			return false;	
		}
		ajax.abort_and_set_url(finalUrl);
		this.beginCustomLoading();
		ajax.run();
		
	}
	this.updateSeveralItemsSameData=function(keys,newData){
		if(!this.DataStore){
			console.log("creating DataStore");
			this.set_ds_from_array();	
		}
		
		if(!this.DataStore){
			console.log("no DataStore");	
			return false;
			
		}
		for(var i=0;i<keys.length;i++){
			//console.log("new_ite_data",data[i]);
			this.DataStore.update(keys[i],newData);
		}
		this.refreshGrid();
	}
	
	this.insertNewItemsData=function(list,key,isNew){
		if(!this.DataStore){
			console.log("creating DataStore");
			this.set_ds_from_array();	
		}
		
		if(!this.DataStore){
			console.log("no DataStore");	
			return false;
			
		}
		var data=this.newDataArray(list,key,isNew);
		if(!data){
			return false;	
		}
		
		for(var i=0;i<data.length;i++){
			//console.log("new_ite_data",data[i]);
			this.DataStore.insert(data[i]);
		}
		this.refreshGrid();
	}
	this.setRecordsByDoptim=function(doptim){
		if(!this.DataStore){
			console.log("creating DataStore");
			this.set_ds_from_array();	
		}
		
		if(!this.DataStore){
			console.log("no DataStore");	
			return false;
			
		}
		this.beginCustomLoading();
		this.clearData();
		if(!doptim){
			this.refreshGrid();
			this.endCustomLoading();
			return;
				
		}
		
		var list=this.newDataArray(doptim.get_all_data(),false,false);
		var ok=false;
		if(list){
			ok=true;
			for(var i=0;i<list.length;i++){
				this.DataStore.insert(list[i]);
			}
		}
		
		if(!ok){
			//this.set_ds_from_array();
		}
		this.refreshGrid();
		this.endCustomLoading();
		return true;
		
		
	}
	this.onDataAjaxLoaderDone=function(){
		if(!this.dataAjaxLoader){
			return false;	
		}
		var result=this.dataAjaxLoader.getResponseXMLAsMWData(true);
		//console.log(result);
		var ok=false;
		var list;
		var doptim;
		if(!this.DataStore){
			console.log("creating DataStore");
			this.set_ds_from_array();	
		}
		
		if(!this.DataStore){
			console.log("no DataStore");	
			return false;
			
		}
		this.clearData();
		if(result.get_param_or_def("ok",false)){
			if(doptim=result.get_param_if_object("jsresponse.dsoptim")){
				list=this.newDataArray(doptim.get_all_data(),false,false);
				//console.log(list);
				//if(list=doptim.get_all_data()){
				if(list){
					ok=true;
					for(var i=0;i<list.length;i++){
						this.DataStore.insert(list[i]);
					}
					
					
					
				}
				//console.log(this.DataStore);
			}
		}
		
		if(!ok){
			//this.set_ds_from_array();
		}
		this.refreshGrid();
		this.endCustomLoading();
			
	}
	
	this.getDataAjaxLoader=function(){
		if(this.dataAjaxLoader){
			return this.dataAjaxLoader;	
		}
		var _this=this;
		this.dataAjaxLoader=  new mw_ajax_launcher(false,function(){_this.onDataAjaxLoaderDone()});
		return this.dataAjaxLoader;	
		
	}
	
	
	this.refreshGrid=function(){
		var dg=this.get_data_grid();
		if(dg){
			return dg.refresh();	
		}
	}
	this.repaintGrid=function(){
		var dg=this.get_data_grid();
		if(dg){
			return dg.repaint();	
		}
	}
	this.show_popup_notify=function(params){
		
		return mw_ui_helper_notify(params);
	}
	
	
	this.test_debug=function(){
		var v=this.debug_input.value;
		this.loadDataById(v,function(dataitem){console.log("ok");console.log(dataitem);});
	}
	this.set_create_data_grid_options_events=function(ops){
		var _this=this;
		if(!ops['onToolbarPreparing']){
			ops['onToolbarPreparing']=function(e){_this.onToolbarPreparing(e)};	
		}	
	}
	this.set_create_data_grid_options_others=function(ops){
			
	}
	this.create_data_grid_options=function(){
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
		if(this.ds_cfg){
			ops.dataSource=this.ds_cfg;	
		}
		this.set_create_data_grid_options_events(ops);
		this.set_create_data_grid_options_others(ops);
		
		console.log(ops);
		return ops;
		
	}
	this.removeItem=function(id,onDone,onFail,dontExec){
		
		if(!this.DataStore){
			return false;	
		}
		var o={};
		o.key=id;
		
		var loader=new mw_devextreme_dataStore_proccess_remove(this.DataStore,o,onDone,onFail);
		if(!dontExec){
			loader.exec();	
		}
		return loader;
		
		
	}
	this.updateItemData=function(id,newdata,onDone,onFail,dontExec){
		if(!this.DataStore){
			return false;	
		}
		var o={};
		o.key=id;
		o.values=newdata;
		//console.log("updateItemData",o);
		var loader=new mw_devextreme_dataStore_proccess_update(this.DataStore,o,onDone,onFail);
		if(!dontExec){
			loader.exec();	
		}
		return loader;
		
	}
	
	this.loadItemDataByKey=function(id,key,onDone,onFail,dontExec){
		if(!this.DataStore){
			return false;	
		}
		if(!key){
			return false;	
		}
		var o={};
		o.key=id;
		var loader=new mw_devextreme_dataStore_proccess_byKey(this.DataStore,o,onDone,onFail);
		if(!dontExec){
			loader.exec();	
		}
		return loader;
		
		
	}
	this.loadItemsData=function(params,onDone,onFail,dontExec){
		if(!this.DataStore){
			return false;	
		}
		if(!mw_is_object(params)){
			params={};	
		}
		var loader=new mw_devextreme_dataStore_proccess_load(this.DataStore,params,onDone,onFail);
		if(!dontExec){
			loader.exec();	
		}
		return loader;
		
		
	}
	
	this.loadDataById=function(id,onDone,onFail,dontExec){
		var key=this.get_uniq_data_key();
		return this.loadItemDataByKey(id+"",key,onDone,onFail,dontExec);
	}
	this.loadDataByUniq=function(id,onDone,onFail,dontExec){
		var key=this.get_uniq_data_key();
		return this.loadItemDataByKey(id+"",key,onDone,onFail,dontExec);
	}
	
	this.appendDebugElems=function(c){
		var _this=this;
		this.debug_container=document.createElement("div");
		this.debug_input=document.createElement("input");
		this.debug_container.appendChild(this.debug_input);
		this.debug_btn=document.createElement("input");
		this.debug_btn.type="button";
		this.debug_btn.value="TEST";
		this.debug_btn.onclick=function(){_this.test_debug()};
		
		this.debug_container.appendChild(this.debug_btn);
		c.appendChild(this.debug_container);
			
		
	}
	
	this.get_next_uniq_index=function(){
		this.next_uniq_index++;
		return this.next_uniq_index;	
	}
	this.get_uniq_data_key=function(){
		return this.params.get_param_or_def("uniqDataKey","_index");
	}
	this.get_is_new_data_key=function(){
		return this.params.get_param_or_def("isNewDataKey","_new",true);
	}
	this.get_id_data_key=function(){
		return this.params.get_param_or_def("idDataKey","id",true);
	}
	this.newRegItem=function(key,data){
		var e= new mw_devextreme_datagrid_reg(key,data);
		e.set_man(this);
		return e;	
	}
	this.doLoadRegsItemsAditionalData=function(){
		//extend	
	}
	this.loadRegsItemsAditionalData=function(){
		if(this.regsItemsAditionalDataLoaded){
			return;	
		}
		this.regsItemsAditionalDataLoaded=true;
		this.doLoadRegsItemsAditionalData();
	}
	this.addRegItem=function(key,data){
		
		if(!this.regs_items_col){
			this.regs_items_col=new mw_objcol();
		}
		var e=this.newRegItem(key,data);
		if(!e){
			return false;	
		}
		//console.log(key);
		this.regs_items_col.add_item(key,e);
		return e;
		
		
	}
	
	this.newDataArray=function(list,key,isNew){
		var data=new Array;
		if(key){
			this.params.set_param(key,"idDataKey");
		}else{
			key=this.get_id_data_key();	
		}
		
		if(isNew){
			isNew=true;	
		}else{
			isNew=false;		
		}
		var uniqKey=this.get_uniq_data_key();
		var newKey=this.get_is_new_data_key();
		var d;
		var itemKey;
		if(mw_is_array(list)){
			for(var i=0;i<list.length;i++){
				d=list[i];
				itemKey=false;
				if(newKey){
					d[newKey]=isNew;	
				}
				if(key){
					itemKey=d[key]+"";
					if(uniqKey){
						d[uniqKey]=d[key]+"";
					}
				}else{
					if(uniqKey){
						d[uniqKey]=this.get_next_uniq_index()+"";
						itemKey=d[uniqKey]+"";	
					}
						
				}
				if(this.regs_items_enabled){
					this.addRegItem(itemKey,d);	
				}
				
				data.push(d);
			}
		}
		return data;
			
	}
	
	this.createDataStore=function(list,key){
		var data=this.newDataArray(list,key);
		var uniqKey=this.get_uniq_data_key();
		
		
		var op={
			data:data,
		};
		if(uniqKey){
			op.key=	uniqKey;
		}
		this.DataStore=new DevExpress.data.ArrayStore(op);
		return this.DataStore;
		
		
	}
	
	this.set_ds_from_array=function(list,key){
		var s=this.createDataStore(list,key);
		if(!s){
			return false;
		}
		
		var op={
			store:s	
		};
		this.ds_cfg=op;
		return true;
		
		
	}
	
	this.set_ds_from_optim=function(doptim){
		if(!doptim){
			return false;
		}
		return this.set_ds_from_array(doptim.get_all_data(),doptim.get_key_cod());
		
	}
	this.get_url_params_for_item_id=function(id,params,nd){
		
		if(!mw_is_object(params)){
			params={};	
		}
		var key=this.params.get_param_or_def("urlIDvar","itemid",true);
		if(id){
			if(key){
				if(!params[key]){
					params[key]=id;	
				}
			}
		}
		if(mw_is_object(nd)){
			key=this.params.get_param_or_def("urlDataVar","nd",true);
			//params={};
			if(key){
				if(!params[key]){
					params[key]=nd;	
				}
			}
		}
		
		var def=this.params.get_param_if_object("urlparams");
		if(def){
			$.extend( true, params, def );
		}
		return params;
		
	}
	
		
}



