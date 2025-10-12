function mwuihelper_ajaxelem_devextreme_pivotgrid(){
	
	this.lookupSources=new mw_objcol();
	this.createPivotGrid=function(){
		if(!this.pivotGridOptions){
			console.log("No pivot grid options set");
			return false;
		}
		this.clearBody();
		$(this.dom_body).dxPivotGrid(this.pivotGridOptions);
		return true;
	
	
	}
	this.customizeText = function(cellInfo,field) {
		
		var lookup = this.lookupSources.get_item(field.dataField);
		if(lookup){

			return lookup.customizeText(cellInfo);
		}
		
		return cellInfo.valueText+"";
	}
	this.onLoadedDataOK=function(){
		var _this=this;
		if(!this.loadedData){
			return this.onLoadedDataFail();
		}
		
		this.createLookupSources();
		this.pivotGridOptions=this.loadedData.get_param_if_object("jsresponse.pivotgridoptions");
		if(!this.pivotGridOptions){
			console.log("No pivot grid options found in response");
			return this.onLoadedDataFail();
		}
		
		if (this.pivotGridOptions?.dataSource?.fields) {
			for (var i = 0; i < this.pivotGridOptions.dataSource.fields.length; i++) {
				var f = this.pivotGridOptions.dataSource.fields[i];
				if (!f.dataField) continue;
				if (f.customizeText) continue; // user-defined wins

				var lookup = this.lookupSources.get_item(f.dataField);
				if (!lookup) continue;

				
				f.customizeText = function(cellInfo) {
					
					return _this.customizeText(cellInfo,this);
				};
			}
		}
			
		if(this.loadedData.get_param("jsresponse.preloaddata")){
			var dsparams=this.loadedData.get_param_if_object("jsresponse.dataSourceMan",true);

			if(!dsparams){
				console.log("No data source params found in response");
				return this.onLoadedDataFail();
			}

			//console.log("createDataSourceMan",params);
			if(mw_is_function(dsparams["isDSMan"])){
				this.dataSourceMan=dsparams;
			}else{
				this.dataSourceMan=new mw_devextreme_data(dsparams);	
			}
			this.preloadData();
		}else{
			this.createPivotGrid();
		}


		
		
		

			
	}
	this.preloadData=function(){

		if(!this.dataSourceMan){
			console.log("No data source manager found");
			return this.onLoadedDataFail();
		}
		var _this=this;
		
		this.dataSourceMan.loadAllBatched().then(function(allData){
			if (!_this.pivotGridOptions.dataSource) {
				_this.pivotGridOptions.dataSource = {};
			}

			// ✅ Preserve existing field definitions, just inject the local data array
			_this.pivotGridOptions.dataSource.store = new DevExpress.data.ArrayStore({
				data: allData,
				key: _this.dataSourceMan.getDataKey()
			});

			console.log("✅ PivotGrid data injected locally:", allData.length, "records");
			_this.createPivotGrid();
		}).catch(function(e){
			console.log("Error loading data for pivot grid", e);
			_this.onLoadedDataFail();
		});
	}
	this.createLookupSources = function() {
		var lookupsRaw = this.loadedData.get_param_as_list("jsresponse.lookupDataSources");
		if (!lookupsRaw || !lookupsRaw.length) {
			console.log("No lookupDataSources found");
			return;
		}
		

		
		for (var i = 0; i < lookupsRaw.length; i++) {
			var item = new mwmod_sctrl_reports_pivotgrid_lookup(lookupsRaw[i].cod,lookupsRaw[i], this);
			item.afterCreate();
			this.lookupSources.add_item(item.cod,item);
			
		}

		console.log("✅ Lookups applied to PivotGrid fields:", this.lookupSources.items_num);
	};
		
	
	
}
mwuihelper_ajaxelem_devextreme_pivotgrid.prototype=new mwuihelper_ajaxelem();

function mwmod_sctrl_reports_pivotgrid_lookup(cod,options,man){
	this.cod=cod;
	//console.log("mwmod_sctrl_reports_pivotgrid_lookup",cod,options,man);
	this.options=new mw_obj();
	this.options.set_params(options);
	this.items=new mw_objcol();
	this.man=man;
	this.get_id=function(){
		return this.cod;
	}
	this.afterCreate=function(){
		var d=this.options.get_param_if_object("data");
		
		if(d){
			d.add2objcol(this.items);
		}
		
	}
	this.customizeText = function(cellInfo) {
		
		var item = this.items.get_item(cellInfo.value);
		if(item){
			return item.name;
		}
		return this.options.get_param("notdefinedCaption",cellInfo.valueText);
		
		 
	}
	
}
