function mwuihelper_ajaxelem_devextreme_datagrid(){
	this.afterDataGridManSet=function(){
			
	}
	this.beforeDataGridManSet=function(){
			
	}
	
	this.onLoadedDataOK=function(){
		
		if(!this.loadedData){
			return this.onLoadedDataFail();
		}
		var dgman=this.loadedData.get_param_if_object("jsresponse.datagridman");
		if(!dgman){
			return this.onLoadedDataFail();	
		}
		if(!this.dom_body){
			return this.onLoadedDataFail();		
		}
		dgman.init_from_params();
		
		this.datagridman=dgman;
		this.beforeDataGridManSet();
		dgman.create_data_grid_on_elem(this.dom_body);
		
		//this.datagridman=dgman;
		this.afterDataGridManSet();

			
	}
	
	
	
}
mwuihelper_ajaxelem_devextreme_datagrid.prototype=new mwuihelper_ajaxelem();

function mwuihelper_ajaxelem_devextreme_datagrid_refresher(){
	this.afterDataGridManSet=function(){
			
	}
	this.set_datagrid_man=function(dgman){
		
		if(!dgman){
			return false;	
		}
		if(!this.dom_body){
			return false;		
		}
		dgman.init_from_params();
		dgman.create_data_grid_on_elem(this.dom_body);
		
		this.datagridman=dgman;
		this.afterDataGridManSet();
		
			
	}
	this.onLoadedDataOK=function(){
		
		
		
		if(!this.loadedData){
			return this.onLoadedDataFail();
		}
		if(!this.datagridman){
			return false;
		}
		
		return this.datagridman.updateData(this.loadedData.get_param_if_object("jsresponse.datagridmannewdata"));
		
		

			
	}
	
	
	
}
mwuihelper_ajaxelem_devextreme_datagrid_refresher.prototype=new mwuihelper_ajaxelem();



