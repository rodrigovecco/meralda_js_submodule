function mw_devextreme_data(params){
	this.params=new mw_obj();
	this.params.set_params(params);
	this.editedIds=[];
	this.getDataKey=function(){
		return this.params.get_param_or_def("dataKey","id");	
	}
	this.addEditedId=function(id){
		if(!id){
			return false;	
		}
		if(!this.params.get_param("editedIds.enabled")){
			return false;
		}
		if(this.editedIds.indexOf(id)>-1){
			return false;
		}
		this.editedIds.push(id);
		return true;
		
	}
	this.isDSMan=function(){
		return true;//used for verification	
	}
	this.getTotalCount=function(options){
		if(this.totalCount){
			return this.totalCount;	
		}
		return 0;
	}
	this.setTotalCount=function(num){
		this.totalCount=mw_getInt(num);
		if(this.totalCount<0){
			this.totalCount=0;	
		}
		return this.totalCount;
			
		
	}
	this.getDataStore=function(){
		if(this.DataStore){
			return this.DataStore;	
		}
		this.createDataStore()
		return this.DataStore;	
	}
	this.getAjaxLoader=function(){
		if(this.ajax){
			return this.ajax;
		}
		this.ajax= new mw_ajax_launcher();
		return this.ajax;
	
	}
	this.getLoadUrl=function(loadOptions){
		var url=this.loadURL;
		if(!url){
			url=this.params.get_param_or_def("loadDataURL",false);		
		}
		if(!url){
			console.log("loadURL not setted");
			return false;	
		}
		var o={lopts:loadOptions};
		if(this.params.get_param("editedIds.enabled")){
			if(this.editedIds.length){
				o.editedids=this.editedIds.join(",");	
			}
		}
		
		
		
		return mw_url_build(url,o);
		
	}
	this.DSload=function(loadOptions){
		var deferred = $.Deferred();
		var loader=new mw_devextreme_data_load_request(this,deferred,loadOptions);
		if(!loader.doLoad()){
			return deferred.promise();
		}
		return deferred.promise();
			
	}
	
	this.createDataStore=function(){
		var _this=this;
		this.DataStore=new DevExpress.data.CustomStore({
			load: function(loadOptions) {
				return _this.DSload(loadOptions);
			},
			byKey: function(key, extra) {
				console.log("DataStore byKey "+key,extra);
			},
			update: function(values) {
				console.log("DataStore update",values);
			},
			insert: function(values) {
				console.log("DataStore insert",values);
			},
			totalCount: function(options) {
				return _this.getTotalCount(options);
				
			},
		});
		return this.DataStore;	
	}
	this.getDataSource=function(){
		if(this.dataSource){
			return this.dataSource;	
		}
		this.createDataSource()
		return this.dataSource;	
	}
	this.createDataSource=function(){
		var _this=this;
		var s=this.getDataStore();
		var ops=this.params.get_param_if_object("dataSourceCfg",true);		
		ops.store=s;
		this.dataSource= new DevExpress.data.DataSource(ops);
		return this.dataSource;  	
	}
	
}
function mw_devextreme_data_load_request(dataman,deferred,loadOptions){
	this.dataMan=dataman;
	this.deferred=deferred;
	this.loadOptions={};
	if(mw_is_object(loadOptions)){
		this.loadOptions=loadOptions;
	}
	this.doLoad=function(){
		var url=this.getUrl();
		console.log("loadOptions",this.loadOptions);
		if(!url){
			return false;	
		}
		var _this=this;
		this.ajax=this.dataMan.getAjaxLoader();
		this.ajax.abort_and_set_url(url);
		this.ajax.addOnLoadAcctionUnique(function(){_this.onAjaxResponse()});
		this.ajax.run_post_if_long();
		return true;
	}
	this.parseLoadOptions=function(){
		var filter=false;
		var p=this.loadOptions;
		if(!mw_is_object(p)){
			p={};	
		}
		if(mw_is_object(p["filter"])){
			p.filter=JSON.stringify(p.filter);	
		}
		if(mw_is_object(p["sort"])){
			p.sort=JSON.stringify(p.sort);
			
		}
		return p;
	}
	this.getUrl=function(){
		return this.dataMan.getLoadUrl(this.parseLoadOptions());	
	}
	this.procResponse=function(){
		this.dataList=new Array();
		this.totalCount=0;
		
		if(this.procResponseOk()){
			this.populateResponseData();
		}
		this.afterProcResponse();
		
		
		return {data:this.dataList, totalCount: this.totalCount};
	}
	this.populateResponseData=function(){
		this.setTotalCount(this.responseData.get_param_or_def("js.totalCount",0));
		var dop=this.responseData.get_param_if_object("js.dsoptim");
		var l=this.dataList;
		if(dop){
			mw_objcol_array_process(dop.get_all_data(),function(o){l.push(o)});	
		}
		

	}
	
	this.afterProcResponse=function(){
		if(this.dataMan){
			this.dataMan.setTotalCount(this.totalCount);
		}
	}
	this.procResponseOk=function(){
		if(!this.responseData){
			return false;	
		}
		//console.log("procResponseOk",this.responseData.params);
		if(!this.responseData.get_param_or_def("ok",false)){
			return false;
		}
		return true;
		
		
	}
	this.setTotalCount=function(num){
		this.totalCount=mw_getInt(num);
		if(this.totalCount<0){
			this.totalCount=0;	
		}
		return this.totalCount;
			
		
	}
	
	this.onAjaxResponseLoaded=function(){
		//console.log("onAjaxResponseLoaded");
		if(!this.deferred){
			return false;	
		}
		var response=this.procResponse();
		if(this.loadOptions.requireTotalCount === true){
			this.deferred.resolve({ data: response.data, totalCount: response.totalCount });
		}else{
			this.deferred.resolve(response.data);
        };
	}
	this.onAjaxResponse=function(){
		this.responseData=this.ajax.getResponseXMLAsMWData(true);
		this.onAjaxResponseLoaded();

	}
	
}


