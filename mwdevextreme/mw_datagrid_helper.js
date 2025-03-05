function mw_devextreme_datagrid_lookup(cod,doptim){
	this.cod=cod;
	this.doptim=doptim;
	this.getDS=function(){
		var list=this.doptim.get_all_data();
		if(list){
			return list;	
		}
		return new Array();
	}
	this.get_data_col_item=function(cod){
		if(this.doptim){
			return this.doptim.get_data_col_item(cod);	
		}
	}
	this.get_data_col_item_value=function(id,cod){
		var o=this.get_data_col_item(id);
		if(!o){
			return false;	
		}
		if(!cod){
			return o;	
		}
		return o[cod];
	}
	
	
		
}
function mw_devextreme_datagrid_events_man(cod){
	this.cod=cod;
	this.handlers=new Array();
	this.setDataGridMan=function(dataGridMan){
		this.dataGridMan=dataGridMan;
	}
	this.addHandler=function(handler){
		
		if(!mw_is_function(handler)){
			return false;
		}
		this.handlers.push(handler);
		return true;
		
			
	}
	this.addEvents2DG=function(dg){
		
		if(!dg){
			return false;	
		}
		for(var i=0;i<this.handlers.length;i++){
			if(mw_is_function(this.handlers[i])){
				dg.on(this.cod,this.handlers[i]);
			}
		}
	}

	this.addHandlers=function(list){
		if(!mw_is_array(list)){
			this.addHandler(list);
			return;
		}
		var i;
		for(i=0;i<list.length;i++){
			this.addHandler(list[i]);	
		}
	}
}

function mw_devextreme_datagrid_man(params){
	this.params=new mw_obj();
	this.dataKey="id";
	this.params.set_params(params);
	this.columns=new mw_objcol();
	this.data=new mw_objcol();//no usado
	this.data_key="id";//verificar uso
	
	
	
	this.lookups=new mw_objcol();
	this.isNewData=function(data){
		return false;
	}
	this.get_id_data_key=function(){
		return this.params.get_param_or_def("idDataKey","id",true);
	}
	
	this.isUniqBoolItemByData=function(data,cod){
		return this.isUniqBoolItem(data[this.get_id_data_key()],cod);	
	}
	this.isUniqBoolItem=function(id,cod){
		if(!id){
			return false;	
		}
		if(!cod){
			return false;	
		}
		if(this.params.get_param("uniqBoolItemsIds."+cod)==id){
			return true;	
		}
		return false;
		
	}
	this.setUniqBoolItemsIds=function(data){
		if(!data){
			return false;	
		}
		this.params.set_param(data,"uniqBoolItemsIds");
	}
	this.getRelatedObject=function(cod){
		//beta
		if(this.relatedObjects){
			return this.relatedObjects[cod];	
		}
			
	}
	
	this.setRelatedObject=function(cod,o){
		if(!this.relatedObjects){
			this.relatedObjects={};	
		}
		this.relatedObjects[cod]=o;
	}
	
	
	
	this.advEventGetMan=function(){
		if(this.advEventMan){
			return this.advEventMan;	
		}
		this.advEventMan=new mw_events_man();
		this.advEventInitMan();
		return this.advEventMan;
			
	}
	this.advEventInitMan=function(){
		if(!this.advEventMan){
			return false;	
		}
		var eventsMansData=this.params.get_param_if_object("advEvents");
		if(!eventsMansData){
			return;	
		}
		
		for(var cod in eventsMansData){
			this.advEventMan.addHandlers(cod,eventsMansData[cod]);
			
		}
		
		
	}
	this.advEventDispatch=function(cod,data,extraData){
		//console.log(cod);
		if(!mw_is_object(data)){
			data={};
		}
		data.dataGridMan=this;
		var man=this.advEventGetMan();
		if(man){
			man.dispatch(cod,data,extraData);	
			
		}
	}

	
	
	this.initDataGridEventsFromParams=function(){
		if(!this._dataGrid_events){
			return false;
		}
		var eventsMansData=this.params.get_param_if_object("events");
		if(!eventsMansData){
			return;	
		}
		var man;
		for(var cod in eventsMansData){
			if(man=this._getDataGridEventsMan(cod)){
				man.addHandlers(eventsMansData[cod]);
			}
			
		}
			
	}
	this.getDataGridEventsMainMan=function(){
		if(this._dataGrid_events){
			return this._dataGrid_events;
		}
		this._dataGrid_events=new mw_objcol();
		this.initDataGridEventsFromParams();
		return this._dataGrid_events;
		
		
	}
	this._getDataGridEventsMan=function(cod){
		if(!cod){
			return false;	
		}
		if(typeof(cod)!="string"){
			return false;	
		}
		if(!this._dataGrid_events){
			return false;
		}
		
		var m=this._dataGrid_events.get_item(cod);
		if(m){
			return m;	
		}
		m=new mw_devextreme_datagrid_events_man(cod);
		m.setDataGridMan(this);
		this._dataGrid_events.add_item(cod,m);
		return m;
		
	}
	
	this.getDataGridEventsMan=function(cod){
		if(!this._dataGrid_events){
			this.getDataGridEventsMainMan();
		}
		return this._getDataGridEventsMan(cod);
		
	}
	this.addDataGridOn=function(cod,handler){
		var man=this.getDataGridEventsMan(cod);
		if(man){
			return man.addHandler(handler);	
		}
	}
	this.onDataGridInitialized=function(e){
		//console.log("onDataGridInitialized",e);
		if(!this._dataGrid_events){
			return;	
		}
		var dg=this.get_data_grid();
		this._dataGrid_events.exec_fnc_on_items(function(evntMan,evnt){evntMan.addEvents2DG(dg)});
		
		
		
	}
	this.set_dataGrid_options_init=function(ops){
		var _this=this;
		if(ops['onInitialized']){
			this.addDataGridOn("initialized",ops['onInitialized']);
		}
		ops['onInitialized']=function(evnt){_this.onDataGridInitialized(evnt)};
	}
	
	
	
	this.get_adv_events_man=function(){
		//depreciated
		console.log("get_adv_events_man depreciated");
		if(!this.adv_events_man){
			this.adv_events_man=new mw_events_man();	
		}
		return this.adv_events_man;
	}
	
	
	this.setNewColOptions=function(cod,data){
		if(!mw_is_object(data)){
			return false;	
		}
		if(!cod){
			return false;	
		}
		var dg=this.get_data_grid();
		if(!dg){
			return false;
		}
		dg.columnOption(cod,data);
		
			
	}
	
	this.updateDataCol=function(cod,data){
		if(!mw_is_object(data)){
			return false;	
		}
		var dg=this.get_data_grid();
		if(!dg){
			return false;
		}
		if(mw_is_object(data["newoptions"])){
			dg.columnOption(cod,data["newoptions"]);
		}
		
			
	}
	
	this.updateDataCols=function(colsData){
		if(!mw_is_object(colsData)){
			return false;	
		}
		for(var cod in colsData){
			this.updateDataCol(cod,colsData[cod]);	
		}
		
	}

	this.updateData=function(data){
		if(!mw_is_object(data)){
			return false;	
		}
		var dg=this.get_data_grid();
		if(!dg){
			return false;
		}
		this.beginCustomLoading();
		var new_options={};
		if(mw_is_object(data["newoptions"])){
			new_options=data["newoptions"];	
		}
		if(mw_is_object(data["dsoptim"])){
			if(this.set_ds_from_optim(data["dsoptim"])){
				new_options.dataSource=this.ds_cfg;	
			}
		}
		
		dg.option(new_options);
		this.updateDataCols(data["cols"]);
		//dg.refresh();
		this.endCustomLoading();
		
		
	}
	this.endCustomLoading=function(){
		var dg=this.get_data_grid();
		if(!dg){
			return false;
		}
		dg.endCustomLoading();
		return true;
	}
	
	
	this.beginCustomLoading=function(msg){
		var dg=this.get_data_grid();
		if(!dg){
			return false;
		}
		dg.beginCustomLoading(msg);
		return true;
	}
	
	
	
	this.hideHeaderPanel=function(){
		if(!this.container_selector){
			return false;	
		}
		this.container_selector.find('.dx-datagrid-header-panel').hide();
	}
	this.moveHeaderPanel=function(container){
		if(!container){
			return false;	
		}
		if(!this.container_selector){
			return false;	
		}
		this.container_selector.find('.dx-datagrid-header-panel').appendTo($(container));
	}
	this.appendElem2HeaderPanel=function(elem){
		if(!elem){
			return false;	
		}
		if(!this.container_selector){
			return false;	
		}
		this.container_selector.find('.dx-datagrid-header-panel').append($(elem));
	}
	
	this.get_lookup_man=function(cod){
		if(this.lookups){
			return this.lookups.get_item(cod);	
		}
	}
	this.create_lookups_from_params=function(){
		var list=this.params.get_param_as_list("lookupsDoptimList");
		
		var _this=this;
		if(list){
			
			mw_objcol_array_process(list,function(e){_this.set_lookup_by_doptim(e)});	
		}
		list=this.params.get_param_as_list("lookupsList");
		if(list){
			mw_objcol_array_process(list,function(e){_this.add_lookup(e)});	
		}
			
	}
	this.add_lookup=function(lookup,cod){
		if(!cod){
			cod=lookup.cod;	
		}
		if(!cod){
			return false;	
		}
		
		this.lookups.add_item(cod,lookup);
		return lookup;
		
			
	}
	this.set_lookup_by_doptim=function(doptim,cod){
		
		if(!cod){
			cod=doptim.params.get_param("cod");	
		}
		if(!cod){
			return false;	
		}
		
		var lu=new mw_devextreme_datagrid_lookup(cod,doptim);
		return this.add_lookup(lu,cod);

	}
	
	//20240412
	this.set_ds_from_array=function(list,key){
		if(!mw_is_array(list)){
			return false;	
		}
		var s={data:list};
		var op={
			type: 'array',
			
		};
		if(key){
			op["key"]=key;
			s["key"]=key;			
		}
		op.store= new DevExpress.data.ArrayStore(s);
		this.ds_cfg=op;
		return true;
		
	}
	//20240412
	this.set_ds_from_optim=function(doptim){

		if(!doptim){
			return false;
		}
		var op={
			type: 'array',
			
		};
		var key=doptim.get_key_cod();
		var s={
			data:doptim.get_all_data()	
		};
		if(key){
			op["key"]=key;
			s["key"]=key;		
			
		}
		op.store= new DevExpress.data.ArrayStore(s);


		this.ds_cfg=op;
		//console.log("ds_cfg",this.ds_cfg);
		return true;
		
		
	}
	this.get_additional_data_col=function(){
		if(!this.additional_data_col){
			this.additional_data_col=new mw_objcol();	
		}
		return this.additional_data_col;
	}
	this.set_additional_data_from_optim=function(doptim){
		if(!doptim){
			return false;	
		}
		if(!this.get_additional_data_col()){
			return false;	
		}
		return doptim.add2objcol(this.additional_data_col);
	}
	
	this.init_from_params=function(){
		this.create_lookups_from_params();
		var list=this.params.get_param_as_list("columns");	
		var _this=this;
		if(list){
			mw_objcol_array_process(list,function(e){_this.add_colum(e)});	
		}
		var doptim=this.params.get_param_if_object("additionaldataoptim");
		if(doptim){
			this.set_additional_data_from_optim(doptim);	
		}
		doptim=this.params.get_param_if_object("dsoptim");
		if(doptim){
			
			this.set_ds_from_optim(doptim);	
		}
		
	}
	this.get_options_copy=function(){
		var o=new mw_obj();
		o.set_params(this.params.get_param_if_object("gridoptions",true));
		return o;
	}
	
	this.get_cols_copy=function(){
		var cols=new mw_objcol();
		var list=this.columns.get_items_by_index();
		var cod;
		var o;
		if(list){
			for(var i=0;i<list.length;i++){
				cod=list[i].cod;
				o=new mw_obj();
				o.set_params(list[i].get_options());
				cols.add_item(cod,o);
				
			}
		}
		
		return cols;
	}
	this.onToolbarPreparingItem=function(cod,ops,index){
		console.log("onToolbarPreparingItem",ops);
		var def=this.params.get_param_if_object("toolbar.itemsDef");
		if(def){
			mwDeepMerge(ops,def);
		}

		var p=this.params.get_param_if_object("toolbar.items."+cod);
		if(p){
			mwDeepMerge(ops,p);
		}
	}
	this.onToolbarPreparing=function(e){
		
		var _this=this;
		if(e){
			if(e.toolbarOptions){
				if(e.toolbarOptions.items){
					$.each(e.toolbarOptions.items, function(index, value) {
  						if(value.name){
  							_this.onToolbarPreparingItem(value.name,value,index);

  						}
  						//value.showText="allways";
					});
				}
			}
		}
		
	}
	
	this.create_data_grid_options=function(){
		var ops=this.params.get_param_if_object("gridoptions",true);
		var _this=this;
		if(this.params.get_param_or_def("hideHeaderPanel",false)){
			if(!ops['onContentReady']){
				ops['onContentReady']=function(){_this.hideHeaderPanel()};	
			}
		}
		if(!ops['onToolbarPreparing']){
			ops['onToolbarPreparing']=function(e){_this.onToolbarPreparing(e)};	
		}
		this.create_data_grid_optionsExcelExport(ops);
		var list=this.columns.get_items_by_index();
		ops.columns=this.get_columns_options();
		if(this.ds_cfg){
			ops.dataSource=this.ds_cfg;	
		}
		//console.log(ops);
		return ops;
		
	}
	
	this.DXonExporting=function(e){
		e.component.beginUpdate();
		var sheetName=this.params.get_param_or_def("gridoptions.export.fileName","data");
		var fileName=this.params.get_param_or_def("gridoptions.export.fileName","data")+".xlsx";
		console.log(fileName);
        var workbook = new ExcelJS.Workbook(); 
        var worksheet = workbook.addWorksheet(sheetName);
        //e.component.columnOption('ID', 'visible', true);
        DevExpress.excelExporter.exportDataGrid({
            component: e.component,
            worksheet: worksheet
        }).then(function() {
            	workbook.xlsx.writeBuffer().then(function(buffer) {
            	saveAs(new Blob([buffer], { type: 'application/octet-stream' }), fileName);
        	});
        }).then(function() {
            //e.component.columnOption('ID', 'visible', false);
            e.component.endUpdate();
        });

	}
	this.create_data_grid_optionsExcelExport=function(ops){
		if(!ops['export']){
			return;
		}
		if(!ops['export']["enabled"]){
			return;
		}
		if(ops['onExporting']){
			return;
		}
		var _this=this;
		ops['onExporting']=function(e){_this.DXonExporting(e)};
		console.log("onExporting created");
		/*
		if(this.params.get_param_or_def("excelExportName",false)){

		}
		*/
	}
	this.get_data_grid=function(){
		if(this.data_grid){
			return this.data_grid;	
		}
		
		if(!this.container_selector){
			return false;	
		}
		var dg=$(this.container_selector).dxDataGrid('instance');
		if(dg){
			this.data_grid=dg;
			return this.data_grid;		
		}
		return false;	
	}
	
	this.create_data_grid=function(){
		this.data_grid=false;
		var ops=this.create_data_grid_options();
		var n=this.params.get_param_or_def("gridname",false);
		if(!n){
			return false;	
		}
		this.container_selector='#'+n;
		this.container=mw_get_element_by_id(n);
		
		this.set_dataGrid_options_init(ops);
		return $('#'+n).dxDataGrid(ops);
	}
	this.create_data_grid_on_elem=function(elem){
		this.data_grid=false;
		if(!elem){
			return false;	
		}
		this.container=elem;
		this.container_selector=$(elem);
		var ops=this.create_data_grid_options();
		this.set_dataGrid_options_init(ops);
		//this.set_additional_dg_events();
		return $($(elem)).dxDataGrid(ops);
		
	}
	
	this.get_columns_options=function(){
		var r=new Array();
		var list=this.columns.get_items_by_index();
		for(var i=0;i<list.length;i++){
			//
			
			r.push(list[i].get_options());	
		}
		console.log("params",this.params.params);
		if(list=this.params.get_param_as_list("columnsExtra")){
			for(i=0;i<list.length;i++){
				r.push(list[i]);	
			}	
		}
		
		return r;
	}
	this.add_colum=function(col){
		var cod=col.cod;
		this.columns.add_item(cod,col);
		col.setDGMan(this);
		return col;	
	}
	
	
	
}
function mw_devextreme_datagrid_column_abs(){
	this.init=function(cod,params){
		this.cod=cod;
		this.params=new mw_obj();
		this.params.set_params(params);
		this.after_init();
	}
	this.isNewData=function(data){
		if(this.dgMan){
			return 	this.dgMan.isNewData(data);
		}
	}
	this.getRelatedObject=function(cod){
		if(this.dgMan){
			return this.dgMan.getRelatedObject(cod);	
		}
			
	}
	this.headerCellTemplateTooltipMode=function(header, info){
		var c=$('<div>').html(info.column.caption);
		c.appendTo(header);
		var o=this.params.get_param_if_object("header.tooltip.options");
		if(!o){
			return;	
		}
		if(!o["placement"]){
			o["placement"]="left";
		}
		c.tooltip(o);
	}
	this.setNewColOptions=function(newOpts){
		//data["newoptions"]
		if(!this.dgMan){
			return false;	
		}
		this.dgMan.setNewColOptions(this.cod,newOpts);
	
	}
	this.updateColOptionsOnEditing=function(info,is_new){
		var k="newColOptionsForNotNew";
		if(is_new){
			k="newColOptionsForNew";
		}
		var o=this.params.get_param_if_object(k);
		if(!o){
			return;	
		}
		this.setNewColOptions(o);
	}
	
	this.setDGMan=function(dgMan){
		this.dgMan=dgMan;
		this.afterDGManSetted();
	}
	this.afterDGManSetted=function(){
		if(this.params.get_param_if_function("onEditorPreparing")){
			this.dgMan.onEditorPreparingColsEnabled=true;	
			this.onEditorPreparingColsEnabled=true;	
		}
	}
	this.onEditorPreparing=function(info){
		//console.log("onEditorPreparingUpdateCols",info);
		var fnc=this.params.get_param_if_function("onEditorPreparing");
		if(fnc){
			fnc(info,this);	
		}
	}
	this.set_col_options_lookup_from_man=function(opts){
		var cod=this.params.get_param_or_def("lookupFromMan.cod",false);
		if(!cod){
			return false;
		}
		if(!this.dgMan){
			return false;	
		}
		var lu=this.dgMan.get_lookup_man(cod);
		if(!lu){
			return false;	
		}
		var valueExpr=this.params.get_param_or_def("lookupFromMan.valueExpr",false);
		var displayExpr=this.params.get_param_or_def("lookupFromMan.displayExpr",false);
		if(!valueExpr){
			return false;
		}
		if(!displayExpr){
			displayExpr= valueExpr;
		}
		opts["lookup"]={valueExpr:valueExpr,displayExpr:displayExpr,dataSource:lu.getDS()};
		return true;
	}
	
	this.set_col_options=function(opts){
		
		this.set_col_options_lookup_from_man(opts);	
		this.set_col_options_headerCellTemplate(opts);
		
	}
	this.set_col_options_headerCellTemplate=function(opts){
		if(opts["headerCellTemplate"]){
			return;		
		}
		var _this=this;
		if(this.params.get_param_or_def("header.tooltip.byTemplate",false)){
			opts["headerCellTemplate"]=function(header, info){_this.headerCellTemplateTooltipMode(header, info)};
		}
		
			
	}
	this.getDataFieldCod=function(){
		var c=this.params.get_param_or_def("options.dataField",false);
		return c;
	}
	this.getDataFieldValue=function(rawData){
		if(!mw_is_object(rawData)){
			return false;
		}
		
		var c=this.getDataFieldCod();
		if(!c){
			return false;	
		}
		return rawData[c];
	}
	
	this.get_options=function(){
		var o=this.params.get_param_or_def("options",{});
		this.set_col_options(o);
		if(!o["name"]){
			o.name=this.cod;	
		}
		return o;	
	}
	this.after_init=function(){};
		
}

function mw_devextreme_datagrid_column(cod,params){
	this.init(cod,params);
}
mw_devextreme_datagrid_column.prototype=new mw_devextreme_datagrid_column_abs();
function mw_devextreme_datagrid_column_with_filter_lookup(cod,params){
	mw_devextreme_datagrid_column_abs.call(this);
	this.set_col_options=function(opts){
		
		this.set_col_options_lookup_from_man(opts);	
		this.set_col_options_headerCellTemplate(opts);
		var _this=this;
		if(!opts["editCellTemplate"]){
			opts["editCellTemplate"]=function(cellElement, cellInfo){_this.editCellTemplate(cellElement, cellInfo)};
		}
		
	}
	this.getEditCellLookupOptions=function(data){
		var cod=this.params.get_param_or_def("lookupFromMan.cod",false);
		if(!cod){
			return false;
		}
		if(!this.dgMan){
			return false;	
		}
		var lu=this.dgMan.get_lookup_man(cod);
		if(!lu){
			return false;	
		}
		var list=lu.getDS();
		if(!list){
			return [];		
		}
		var fnc=this.params.get_param_if_function("lookupFromMan.filterForEdit");
		var r=[];
		var o;
		var ok=true;
		for(var i=0;i<list.length;i++){
			o=list[i];
			ok=true;
			if(fnc){
				if(!fnc(data,o)){
					ok=false;	
				}
			}
			if(ok){
				r.push(o);	
			}
		}
		return r;
	}
	this.editCellTemplate=function(cellElement, cellInfo){
		var div = document.createElement("div");
		cellElement.get(0).appendChild(div);
		//console.log(cellInfo);
		
		var valueExpr=this.params.get_param_or_def("lookupFromMan.valueExpr","cod");
		var displayExpr=this.params.get_param_or_def("lookupFromMan.displayExpr","name");
		var selectBoxData = this.getEditCellLookupOptions(cellInfo.data);
		$(div).dxSelectBox({
			noDataText:"",
			showClearButton:true,
			dataSource: selectBoxData,
			valueExpr: valueExpr,
			displayExpr: displayExpr,
			value:cellInfo.value,
			onValueChanged: function (e) {
                        cellInfo.setValue(e.value);
                    }
		});
	}
	
	this.init(cod,params);
	
}
function mw_devextreme_datagrid_column_band(cod,params){
	mw_devextreme_datagrid_column_abs.call(this);
	this.set_col_options=function(opts){
		var _this=this;
	}
	this.init(cod,params);
		
}


function mw_devextreme_datagrid_column_link(cod,params){
	mw_devextreme_datagrid_column_abs.call(this);
	
	this.cellTemplate=function(cellElement, cellInfo){
		var args=this.params.get_param_if_object("link_mode.args");
		var varargs=this.params.get_param_if_object("link_mode.varargs");
		var url_creator=new mw_url();
		var url=url_creator.get_url_from_data_varargs(this.params.get_param_or_def("link_mode.url","")
					,varargs,cellInfo.data,args);
		var target=this.params.get_param_or_def("link_mode.target",false);
		var elem=document.createElement("a");
		elem.href=url;
		if(target){
			elem.target=target;	
		}
		elem.innerHTML=cellInfo.text;
		$(elem)
          .appendTo(cellElement);
	}
	this.set_col_options=function(opts){
		var _this=this;
		if(this.params.get_param("link_mode.enable")){
			if(!opts["cellTemplate"]){
				opts.cellTemplate=function(cellElement, cellInfo){_this.cellTemplate(cellElement, cellInfo)};
			}
		}
	}
	this.init(cod,params);
		
}
function mw_devextreme_datagrid_column_txtlinebreak(cod,params){
	mw_devextreme_datagrid_column_abs.call(this);
	
	this.cellTemplate=function(cellElement, cellInfo){
		var str=cellInfo.text;
		var elem=document.createElement("div");
		var breakTag = '<br>';
		elem.innerHTML=(str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');		
		//elem.innerHTML=cellInfo.text;
		$(elem)
          .appendTo(cellElement);
	}
	this.editCellTemplate=function(cellElement, cellInfo){
		var div = document.createElement("div");
		cellElement.get(0).appendChild(div);
		var ops=this.params.get_param_if_object("editorTextareaOptions");
		if(!ops){
			ops={};	
		}
		ops.onKeyDown=function(e){
			if(e){
				if(e.event){
					e.event.stopPropagation();
				}
			}
			
		}
		ops.onValueChanged=function (e) {
			cellInfo.setValue(e.value);
        };
		ops.value=cellInfo.value;
		$(div).dxTextArea(ops);
	}
	this.set_col_options=function(opts){
		var _this=this;
		if(!opts["cellTemplate"]){
			opts.cellTemplate=function(cellElement, cellInfo){_this.cellTemplate(cellElement, cellInfo)};
		}
		if(!opts["editCellTemplate"]){
			opts.editCellTemplate=function(cellElement, cellInfo){_this.editCellTemplate(cellElement, cellInfo)};
		}
	}
	this.init(cod,params);
		
}
function mw_devextreme_datagrid_column_txtLongText(cod,params){
	mw_devextreme_datagrid_column_txtlinebreak.call(this);
	this.init(cod,params);
	this.cellTemplate=function(cellElement, cellInfo){
		var str=cellInfo.text;
		var breakTag = '<br>';
		var e=$("<div>")
		.addClass("dxGridLongTextWpopover")
		.html((str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2'))
		.appendTo(cellElement);
		var popover=$("<div>")
		.html((str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2'))
		.appendTo(cellElement);
		popover.dxPopover({
		target:e,
        showEvent: "dxclick",
        width: 500
   		});
		
	}
	
}

function mw_devextreme_datagrid_column_datetime(cod,params){
	mw_devextreme_datagrid_column_abs.call(this);
	this.get_mw_date=function(){
		if(!this.mw_date){
			this.mw_date=new mw_date();
		}
		return this.mw_date;
	}
	this.customizeText=function(cellInfo){
		//not used
		var dformat=this.params.get_param_or_def("dateformat",null,true);
		var tformat=this.params.get_param_or_def("timeformat",null,true);
		var mwd=this.get_mw_date();
		return mwd.formatDateGlobalize(cellInfo.value,dformat,tformat);
	}
	
	this.set_col_options=function(opts){
		var _this=this;
		if(!opts["editorOptions"]){
			opts["editorOptions"]={};	
		}
		if(!opts["editorOptions"]["format"]){
			opts["editorOptions"]["format"]="datetime";	
		}
		if(!opts["editorOptions"]["formatString"]){
			opts["editorOptions"]["formatString"]="x";	
		}
		
	}
	this.init(cod,params);
		
}
function mw_devextreme_datagrid_column_hour(cod,params){
	mw_devextreme_datagrid_column_abs.call(this);
	this.get_mw_date=function(){
		if(!this.mw_date){
			this.mw_date=new mw_date();
			this.mw_date.omit_date=true;
			this.mw_date.omit_secs=true;
		}
		return this.mw_date;
	}
	this.setCellValue=function(rowData, value){
		
		var mwD=this.get_mw_date();
		var date = mwD.get_date_from_sys_formated_str(value);
		var v=mwD.format_date_as_sys_value_defMode(date);
		var c=this.getDataFieldCod();
		if(!c){
			return;	
		}
		rowData[c]=v;
	}
	
	
	this.set_col_options=function(opts){
		var _this=this;
		opts["dataType"]="date";
		opts["format"]="shortTime";
		opts["setCellValue"]=function(a,b){_this.setCellValue(a,b)};
		
		if(!opts["editorOptions"]){
			opts["editorOptions"]={};	
		}
		if(!opts["editorOptions"]["format"]){
			opts["editorOptions"]["format"]="shortTime";	
		}
		if(!opts["editorOptions"]["pickerType"]){
			opts["editorOptions"]["pickerType"]="list";	
		}
		if(!opts["editorOptions"]["formatString"]){
			opts["editorOptions"]["formatString"]="t";	
		}
		
	}
	this.init(cod,params);
		
}

function mw_devextreme_datagrid_column_mnu(cod,params){
	mw_devextreme_datagrid_column_abs.call(this);
	this.mnu_items=new mw_objcol();
	this.add_mnu_item=function(mnu_item){
		var cod=mnu_item.cod;
		
		this.mnu_items.add_item(cod,mnu_item);
		return mnu_item;	
	}
	this.after_init=function(){
		var list =this.params.get_param_as_list("mnuitems");
		if(!list){
			return;	
		}
		for(var i=0;i<list.length;i++){
			this.add_mnu_item(list[i]);	
		}
	};
	
	this.editCellTemplate=function(cellElement, cellInfo){
		$('<span></span>')
          .appendTo(cellElement);
		
	}
	this.get_items_instances=function(cellElement, cellInfo){
		if(cellInfo.data._in_new){
			return;
		}
		var list =this.mnu_items.get_items_by_index();
		if(!list){
			return;	
		}
		var r=new Array();
		for(var i=0;i<list.length;i++){
			
			list[i].add2intancesList(r,cellElement, cellInfo);	
		}
		if(r.length>0){
			return r;	
		}
		
		
			
	}
	this.cellTemplate=function(cellElement, cellInfo){
		
		$('<span></span>')
          .appendTo(cellElement);
		if(cellInfo.data._in_new){
			return;
		}
		if(cellInfo.data._new){
			return;
		}
		
		
		var list =this.get_items_instances(cellElement, cellInfo);
		if(!list){
			return;	
		}
		var mnucontainer=$('<span class="mw_mnu_cell"></span>');
		mnucontainer.appendTo(cellElement);
		for(var i=0;i<list.length;i++){
			
			list[i].add2Container(mnucontainer);	
		}
		 
		
	}
	
	this.set_col_options=function(opts){
		var _this=this;
		if(!opts["editCellTemplate"]){
			opts.editCellTemplate=function(cellElement, cellInfo){_this.editCellTemplate(cellElement, cellInfo)};
		}
		if(!opts["cellTemplate"]){
			opts.cellTemplate=function(cellElement, cellInfo){_this.cellTemplate(cellElement, cellInfo)};
		}
		
	}
	this.init(cod,params);
		
}

function mw_devextreme_datagrid_column_mnu_item_instance(mnuitem,cellElement, cellInfo){
	this.mnuitem=mnuitem;
	this.cellElement=cellElement;
	this.cellInfo=cellInfo;
	this.add2Container=function(container){
		var elem=this.get_dom_elem();
		if(elem){
			if(container){
				$(elem).appendTo(container);	
			}
		}
	}
	this.get_data=function(cod){
		if(!mw_is_object(this.cellInfo)){
			return false;	
		}
		if(!mw_is_object(this.cellInfo.data)){
			return false;	
		}
		if(!cod){
			return 	this.cellInfo.data;
		}
		return 	this.cellInfo.data[cod];
	}
	this.create_dom_elem=function(){
		var _this=this;
		var elem=document.createElement("a");
		var url=this.mnuitem.params.get_param_or_def("href","#");
		var p=this.mnuitem.params.get_param_if_object("hrefvariables");
		if(p){
			var cc;
			var args={};
			var v
			for(var cod in p){
				cc=p[cod];
				if(cc){
					if(v=this.get_data(cc)){
						args[cod]=v;		
					}
				}
			}
			var mwurl=new mw_url();
			url=mwurl.get_url(url,args);
			
			
		}
		elem.href=url;
		p=this.mnuitem.params.get_param_or_def("target",false);
		if(p){
			elem.target=p;	
		}
		p=this.mnuitem.params.get_param_or_def("iconClass",false);
		if(p){
			elem.className=p;	
		}
		p=this.mnuitem.params.get_param_or_def("lbl",false);
		if(p){
			elem.title=p;	
		}
		if(this.mnuitem.handle_click()){
			elem.onclick=function(){return _this.onclick()};		
		}
		return elem;
		
			
	}
	this.onclick=function(){
		return this.mnuitem.onInstanceClick(this);
	}
	
	this.get_dom_elem=function(){
		if(!this.dom_elem){
			this.dom_elem=this.create_dom_elem();	
		}
		return this.dom_elem;
	}
	

	
}

function mw_devextreme_datagrid_column_mnu_item_abs(){
	this.init=function(cod,params){
		this.cod=cod;
		this.params=new mw_obj();
		this.params.set_params(params);
		this.after_init();
	}
	this.onInstanceClick=function(instance){
		var fnc=this.params.get_param_if_function("onclick");
		if(!fnc){
			return;	
		}
		return fnc(instance);
	}
	this.handle_click=function(){
		if(	this.params.get_param_if_function("onclick")){
			return true;	
		}
		return false;
	}
	this.new_instance=function(cellElement, cellInfo){
		var e=new mw_devextreme_datagrid_column_mnu_item_instance(this,cellElement, cellInfo);
		return e;
	}
	this.add2intancesList=function(list,cellElement, cellInfo){
		var e=this.new_instance(cellElement, cellInfo);
		if(e){
			list.push(e);	
		}
	}
	this.add2cellTemplate=function(cellElement, cellInfo){
		//en desuso
		
		var url=this.params.get_param_or_def("href","#");
		var p=this.params.get_param_if_object("hrefvariables");
		if(p){
			var cc;
			var args={};
			for(var cod in p){
				cc=p[cod];
				if(cellInfo.data[cc]){
					args[cod]=cellInfo.data[cc];	
				}
				//if(	
			}
			var mwurl=new mw_url();
			url=mwurl.get_url(url,args);
			
			
		}
		var html="<a href='"+url+"'  class='"+this.params.get_param_or_def("iconClass","")+"'  title='"+this.params.get_param_or_def("lbl","")+"'  aria-hidden='true'></a>";
		
		$(html)
          .appendTo(cellElement);
		
	}
	
	this.after_init=function(){};
		
}
function mw_devextreme_datagrid_column_mnu_item(cod,params){
	this.init(cod,params);
}
mw_devextreme_datagrid_column_mnu_item.prototype=new mw_devextreme_datagrid_column_mnu_item_abs();



function mw_devextreme_datagrid_column_concatdata(cod,params){
	mw_devextreme_datagrid_column_abs.call(this);
	this.data_items=new mw_objcol();
	this.after_init=function(){
		var doptim =this.params.get_param_if_object("dataitems");
		if(doptim){
			doptim.add2objcol(this.data_items);
		}
	};
	this.get_data_item_name=function(cod){
		var ditem=this.data_items.get_item(cod);
		if(ditem){
			return ditem.name;	
		}
		return false;
	}
	this.get_calculateCellValue_sep=function(){
		return ", ";	
	}
	this.calculateCellValue=function(data){
		var str=this.getDataFieldValue(data);
		if(!str){
			return "";	
		}
		var txts=new Array();
		var name;
		str=str+"";
		
		var list=str.split(",");
		for(var i=0;i<list.length;i++){
			if(name=this.get_data_item_name(list[i])){
				txts.push(name);
				
			}
		}
		if(txts.length<=0){
			return "";	
		}
		var sep=this.get_calculateCellValue_sep();
		
		
		return txts.join(sep);	
	}

	this.getLookup=function(){
		var ds=Array();
		var list=this.data_items.get_items_by_index();
		var ditem;
		if(list){
			for(var i=0;i<list.lenght;i++){
				ditem=list[i];
				ds.push({id:ditem.id,name:ditem.name});	
			}
		}
		var lu={
			dataSource: ds, valueExpr: 'id', displayExpr: 'name' 
		}
		return lu;
	}
	this.set_col_options=function(opts){
		var _this=this;
		opts["encodeHtml"]=false;	
		if(!opts["lookup"]){
			//opts.lookup=_this.getLookup();
		}
		if(!opts["calculateCellValue"]){
			opts.calculateCellValue=function(d){return _this.calculateCellValue(d)};
		}
		
	}
	this.init(cod,params);
		
}

function mw_devextreme_datagrid_column_tagBox(cod,params){
	mw_devextreme_datagrid_column_abs.call(this);
	this.set_col_options=function(opts){
		var _this=this;
		opts["encodeHtml"]=false;	
		if(!opts["editCellTemplate"]){
			opts.editCellTemplate=function(cellElement, cellInfo){return _this.editCellTemplate(cellElement, cellInfo)}
		}
		if(!opts["cellTemplate"]){
			opts.cellTemplate=function(container, options){_this.cellTemplate(container, options)}
		}
		if(opts.lookup){
			if(!opts.lookup.calculateCellValue){
				opts.lookup.calculateCellValue=function(rowData){return _this.lookupCalculateCellValue(rowData,this)}	
			}
		}
		
	}
	
	
	this.lookupCalculateCellValue=function(rowData,lookup){
		var av=[];
		if(mw_is_array(rowData)){
			av=	rowData;
		}else{
			if(rowData){
				av=String(rowData).split(",");	
			}
		}
		var txts=[];
		var txt;
		if(lookup){
			if(lookup.valueMap){
				for(var i=0;i<av.length;i++){
					if(av[i]){
						if(txt=lookup.valueMap[av[i]]){
							txts.push(txt);	
						}
					}
				}
					
			}
		}
		var r=txts.join(", ")+"";
		return r;
	}
	
	this.editCellTemplate=function(cellElement, cellInfo){
		var av=[];
		if(mw_is_array(cellInfo.value)){
			av=	cellInfo.value;
		}else{
			if(cellInfo.value){
				av=String(cellInfo.value).split(",");	
			}
		}
		return $("<div>").dxTagBox({
            dataSource: cellInfo.column.lookup.dataSource,
            value: av,
            valueExpr: cellInfo.column.lookup.valueExpr,
            displayExpr: cellInfo.column.lookup.displayExpr,
            showSelectionControls: true,
            showMultiTagOnly: false,
            applyValueMode: "useButtons",
            searchEnabled: true,
            onValueChanged: function(e) {
				var sv="";
				if(mw_is_array(e.value)){
					sv=e.value.join(",");	
				}else{
					sv=	e.value;
				}
				cellInfo.setValue(sv)
            },
            onSelectionChanged: function(e) {
                cellInfo.component.updateDimensions();
            }
        });
	}
	this.cellTemplate=function(container, options){
		
		var c=$("<div>")
		c.addClass("mwDXdgCellLongTxt");
		c.appendTo(container);
		c.text(options.column.lookup.calculateCellValue(options.value));
					
	}

	this.init(cod,params);
		
}


