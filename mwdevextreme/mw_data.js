//20250307
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
	this.DSloadOLD=function(loadOptions){
		var deferred = $.Deferred();
		console.log("DSload",loadOptions);
		
		var loader=new mw_devextreme_data_load_request(this,deferred,loadOptions);
		if(!loader.doLoad()){
			return deferred.promise();
		}
		return deferred.promise();
			
	}
	this.DSload = function(loadOptions) {
		var deferred = $.Deferred();
		console.log("🟢 DSload called", loadOptions);

		// 🔍 Detect if DevExtreme requests ALL data (e.g., Excel export or full reload)
		if (loadOptions && loadOptions.isLoadingAll) {
			console.log("⚙️ Detected isLoadingAll=true → using loadAllBatched()");
			this.loadAllBatched()
				.then(function(allData) {
					console.log("✅ Batch load completed, total:", allData.length);
					deferred.resolve(allData);
				})
				.catch(function(err) {
					console.error("❌ Batch load failed:", err);
					deferred.reject(err);
			});
			
			return deferred.promise();
		}

		// 🔄 Normal paginated / filtered load
		var loader = new mw_devextreme_data_load_request(this, deferred, loadOptions);
		if (!loader.doLoad()) {
			return deferred.promise();
		}
		return deferred.promise();
	};

	/**
	 * Creates a fully local DataSource using a preloaded array.
	 * Useful for batch-loaded data or offline modes.
	 * 
	 * @param {Array} dataArray - The full dataset already loaded in memory.
	 * @returns {DevExpress.data.DataSource}
	 */
	this.createLocalDataSourceFromArray = function(dataArray) {
		if (!Array.isArray(dataArray)) {
			console.warn("createLocalDataSourceFromArray: invalid array", dataArray);
			dataArray = [];
		}

		var keyField = this.getDataKey();

		// Local ArrayStore
		var store = new DevExpress.data.ArrayStore({
			data: dataArray,
			key: keyField
		});

		// Copy any config from dataSourceCfg, but override store
		var cfg = this.params.get_param_if_object("dataSourceCfg", true) || {};
		cfg.store = store;

		// Local DataSource (no remote ops)
		var localDS = new DevExpress.data.DataSource(cfg);

		console.log("📊 Created local DataSource with", dataArray.length, "records");
		return localDS;
	};
	/**
	 * Safely loads all records from the backend in consecutive batches.
	 * 
	 * Uses custom flags `batchMode`, `batchKey`, and `lastKey` so PHP can
	 * interpret it for incremental loading.
	 * 
	 * Features:
	 * - Works with numeric or string IDs.
	 * - Detects and stops if lastKey repeats (prevents infinite loops).
	 * - Returns a Promise that resolves with the full dataset array.
	 */
	this.loadAllBatched = function(loadOptions) {
		var _this = this;
		var deferred = $.Deferred();

		var allData = [];
		var batchSize = this.params.get_param_or_def("batchSize", 500);
		var keyField = this.getDataKey(); // typically "id"
		var lastKey = null;
		var seenKeys = new Set();
		var done = false;
		var maxLoops = 10000; // extra sanity limit for edge cases
		var loopCount = 0;

		// safely clone base options (filters, etc.)
		var baseOpts = mw_is_object(loadOptions)
			? JSON.parse(JSON.stringify(loadOptions))
			: {};

		function loadNextBatch() {
			if (done) {
				console.log("✅ All batches loaded. Total:", allData.length);
				deferred.resolve(allData);
				return;
			}
			if (loopCount++ > maxLoops) {
				console.warn("⚠️ Loop safety triggered: exceeded " + maxLoops + " iterations");
				done = true;
				deferred.resolve(allData);
				return;
			}

			// compose load options for this batch
			var opts = Object.assign({}, baseOpts, {
				take: batchSize,
				requireTotalCount: false,
				batchMode: true,
				batchKey: keyField,
				lastKey: lastKey
			});

			console.log("🔄 Loading batch | lastKey:", lastKey, "| batchSize:", batchSize);

			_this.DSload(opts)
				.then(function(response) {
					var list = response.data || response;
					if (!list || !list.length) {
						done = true;
						console.log("✅ No more data. Finishing...");
						return loadNextBatch();
					}

					allData = allData.concat(list);
					var newKey = list[list.length - 1][keyField];

					// 🧩 Safety: detect repeated key
					if (seenKeys.has(newKey)) {
						console.warn("⚠️ Duplicate lastKey detected (" + newKey + "). Stopping to avoid loop.");
						done = true;
						return loadNextBatch();
					}
					seenKeys.add(newKey);
					lastKey = newKey;

					console.log("📦 Received batch:", list.length, "| lastKey:", lastKey);

					if (list.length < batchSize) {
						done = true;
					}

					loadNextBatch();
				})
				.catch(function(err) {
					console.error("❌ Error during batch load:", err);
					deferred.reject(err);
				});
		}

		loadNextBatch();
		return deferred.promise();
	};













	

	/////BETA
	this.add2cache=function(id,data){
		if(!this.cache){
			this.cache={};	
		}
		if(!id){
			return false;	
		}
		if(!data){
			return false;	
		}
		this.cache[id]=data;

	}
	this.DSloadByKeyCache = function(key, extra) {
		var _this = this;
		var deferred = $.Deferred();
	
		if (this.cache && this.cache[key]) {
			console.log("✅ Valor encontrado en cache:", key);
			deferred.resolve(this.cache[key]);
			return deferred.promise();
		}
	
		console.log("⏳ Valor no en cache. Consultando servidor:", key);
		
		// Fallback a DSloadByKey si existe
		if (typeof this.DSloadByKey === "function") {
			this.DSloadByKey(key, extra).done(function(item) {
				_this.add2cache(key, item); // Guarda en cache
				deferred.resolve(item);
			}).fail(function(err) {
				deferred.reject(err);
			});
		} else {
			deferred.reject("No DSloadByKey implementation available");
		}
	
		return deferred.promise();
	};

	
	this.createDataStore=function(){
		var _this=this;
		this.DataStore=new DevExpress.data.CustomStore({
			load: function(loadOptions) {
				return _this.DSload(loadOptions);
			},
			byKey: function(key, extra) {
				console.log("DataStore byKey "+key,extra);
				return _this.DSloadByKeyCache(key,extra);
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
			key: this.getDataKey()
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
		this.summaryData = null;
		
		
		if(this.procResponseOk()){
			this.populateResponseData();
		}
		this.afterProcResponse();
		
		
		return {data:this.dataList, totalCount: this.totalCount, summary: this.summaryData};
	}
	this.populateResponseData=function(){
		//console.log("populateResponseData",this.responseData.params);
		this.setTotalCount(this.responseData.get_param_or_def("js.totalCount",0));
		this.summaryData = this.responseData.get_param_as_list("js.summary");
		//todo: mapped sumary
		var dop=this.responseData.get_param_if_object("js.dsoptim");
		var l=this.dataList;
		if(dop){
			mw_objcol_array_process(dop.get_all_data(),function(o){l.push(o)});	
		}

		console.log("✅ Data loaded", { totalCount: this.totalCount, records: this.dataList.length });
		

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
			this.deferred.resolve({ data: response.data, totalCount: response.totalCount,summary: response.summary });
		}else{
			this.deferred.resolve(response.data);
        };
	}
	this.onAjaxResponse=function(){
		this.responseData=this.ajax.getResponseXMLAsMWData(true);
		this.onAjaxResponseLoaded();

	}
	
}


