function mw_ui_grid(info){
	this.info=new mw_obj();
	this.info.set_params(info);
	this.afterDataGridManSetOnLoaderCus=function(){
		
	}
	this.afterDataGridManSetOnLoaderNative=function(){
		if(this.onGridOptionChangedEnabled()){
			var _this=this;
			this.grid.on("optionChanged",function(e){_this.onGridOptionChanged(e)});
			
		}	
	}
	
	this.loadGridManager=function(){
		var loader=this.getGridLoader();
		if(!loader){
			return false;	
		}
		return loader.loadCont();
		
	}
	this.beforeDataGridManSetOnLoader=function(){
		
	
	}
	
	
	this.afterDataGridManSetOnLoader=function(){
		if(!this.gridLoader){
			return false;	
		}
		if(this.gridLoader.datagridman){
			
			this.set_datagrid_man(this.gridLoader.datagridman);
			


			var g=this.gridLoader.datagridman.get_data_grid();
			
			if(g){
				this.grid=g;
				this.afterDataGridManSetOnLoaderNative();
				this.afterDataGridManSetOnLoaderCus();
			}
		}
	}

	this.createGridLoader=function(){
		var bodyelem=this.get_ui_elem("datagrid_body");
		var container=this.get_ui_elem("datagrid_container");
		if(!bodyelem){
			console.log("No datagrid_body");
			return false;	
		}
		var _this=this;
		var loader=new mwuihelper_ajaxelem_devextreme_datagrid();
		loader.set_dom_elems(bodyelem,container);
		loader.setUI(this);
		loader.setAllowJSResponse(true);
		var url=this.get_xmlcmd_url("loaddatagrid");
		//this.debug_url(url);
		//console.log(url);
		loader.set_cont_xml_url(url);
		
		loader.beforeDataGridManSet=function(){
			_this.beforeDataGridManSetOnLoader();
		}
		loader.afterDataGridManSet=function(){
			_this.afterDataGridManSetOnLoader();
		}
	

		return loader;
		
	}
	this.getGridLoader=function(){
		if(!this.gridLoader){
			this.gridLoader=this.createGridLoader();
		}
		if(this.gridLoader){
			return 	this.gridLoader;
		}
	}
	
	
	this.set_datagrid_man=function(man){
		var _this=this;
		this.datagrid_man=man;
		this.datagrid_man.ui=this;
		
	}
	this.clearSaveColsStateTimeout=function(){
		if(this.saveColsStateTimeout){
			clearTimeout(this.saveColsStateTimeout);
			this.saveColsStateTimeout=false;	
		}
	}
	this.startSaveColsStateTimeout=function(){
		var _this=this;
		this.clearSaveColsStateTimeout();
		this.saveColsStateTimeout=setTimeout(function(){_this.saveColsState();},1000);
	
	}
	this.saveColsState=function(){
		var a=this.getAjaxLoader();
		if(!a){
			return false;	
		}
		var data={cols:this.datagrid_man.getCurrentColumnsOptionsByName(["sortIndex","visible","width","sortOrder"])};
		console.log("saveColsState",data);

		var url=this.get_xmlcmd_url("savecolsstate",data);
		var _this=this;
		a.addOnLoadAcctionUnique(function(){_this.onSaveColsStateResponse()});
		a.set_url(url);
		//a.post(data);
		a.run();//para depuración, cambiar por post en produccion


	}
	this.onSaveColsStateResponse=function(){
		var resp=this.getAjaxDataResponse(true);
		console.log("onSaveColsStateResponse",resp.params);
		if(resp){
			//this.show_popup_notify(resp.get_param_if_object("jsresponse.notify"));
			if(resp.get_param("ok")){
				//
			}
			
		}
	}
	this.onGridOptionChanged=function(e){
		
		if(e.name=="columns"){
			if(this.saveColsStateEnable()){
				this.startSaveColsStateTimeout();
			}
		}
		//this.datagrid_man.getColCodeFromOptionsChangeData(e);
		//console.log("onGridOptionChanged options",this.datagrid_man.getCurrentColumnsOptionsByName());

	}
	this.saveColsStateEnable=function(){
		if(this.params.get_param("userColsSelectedRememberEnabled")){
			return true;
		}
		return false;
	}
	this.onGridOptionChangedEnabled=function(){
		if(this.params.get_param("onGridOptionChangedEnabled")){
			return true;
		}
		if(this.params.get_param("userColsSelectedRememberEnabled")){
			return true;
		}
		return false;
	}
	
	this.set_grid=function(name){
		
		var g= $("#"+name).dxDataGrid("instance");
		if(!g){
			return false;	
		}
		this.grid=g;
	}
	this.insertData=function(data){
		if(!data){
			return false;	
		}
		if(typeof(data)!="object"){
			return false;	
		}
		if(this.grid){
			if(mw_is_array(this.grid.option("dataSource"))){
				this.grid.option("dataSource").push(data);	
			}else{
				if(mw_is_array(this.grid.option("dataSource").store)){
					this.grid.option("dataSource").store.push(data);		
				}
			}
			
			
			this.grid.refresh();
		}

		
	}
	
	this.onRowRemoved=function(info){
	}
	
	this.onRowInserted=function(info){
	}
	this.onInitNewRow=function(info){
		
		if(this.grid){
			//this.grid.option({filterRow:{visible:false}});	
		}
		info.data.id=Globalize.localize("New");
		info.data._in_new=true;
	}
	
	this.onRowInserting=function(info){
		if(!info.data.name){
			
			info.cancel=true;
			return false;	
		}
		if(this.grid){
			this.grid.option({filterRow:{visible:true}});	
			info.cancel=true;
			this.grid.cancelEditData();
			var e=new mw_ui_grid_editing_event(this);
			e.insert_item(info);
		
		}
	}
	
	this.onRowUpdating=function(info){
		if(!info.oldData.id){
			info.cancel=true;
			return false;	
		}
		var url=this.get_xmlcmd_url("saveitem",{nd:info.newData,itemid:info.oldData.id});
		var a = new mw_ajax_launcher(url);
		a.run();
	}
	
}

mw_ui_grid.prototype=new mw_ui();
function mw_ui_grid_editing_event(ui){
	this.ui=ui;
	
	this.save_item=function(info){
		var _this=this;
		this.gridEvent=	info;
		var url=this.ui.get_xmlcmd_url("saveitem",{nd:info.newData,itemid:info.oldData.id});
		this.ajax = new mw_ajax_launcher(url,function(){_this.onItemUpdated()});
		this.ajax.run();
		
	}
	
	this.onItemUpdated=function(){
		var data= new mw_obj();
		data.set_params(this.ajax.getResponseXMLFirstNodeByTagnameAsData());
		if(!data.get_param_or_def("ok",false)){
			return false;
		}
		var id=data.get_param_or_def("itemid",false);
		if(!id){
			return false;	
		}
		var nd=data.get_param_if_object("itemdata");
		if(!nd){
			return false;	
		}
		
		if(this.ui.grid){
			//this.ui.grid.refresh();
		}
	}
	
	this.onItemInserted=function(){
		var data= new mw_obj();
		data.set_params(this.ajax.getResponseXMLFirstNodeByTagnameAsData());
		if(!data.get_param_or_def("ok",false)){
			return false;
		}
		var id=data.get_param_or_def("itemid",false);
		if(!id){
			return false;	
		}
		this.ui.insertData(data.get_param_or_def("itemdata",false));
	}
	
	this.insert_item=function(gridevent){
		var _this=this;
		this.gridEvent=	gridevent;
		var url=this.ui.get_xmlcmd_url("newitem",{nd:gridevent.data});
		this.ajax = new mw_ajax_launcher(url,function(){_this.onItemInserted()});
		this.ajax.run();
		
	}
}
function mw_ui_grid_remote(info){
	mw_ui_grid.call(this,info);
	this.after_init=function(){
		this.set_container();
		this.loadGridManager();
		
	}

}
mw_ui_grid_remote.prototype=new mw_ui();
