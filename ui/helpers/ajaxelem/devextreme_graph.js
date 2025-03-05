function mwuihelper_ajaxelem_devextreme_graph(){
	this.afterGraphManSet=function(){
			
	}
	this.render=function(renderOptions,nodef){
		if(!this.graphMan){
			return false;
		}
		return this.graphMan.render(renderOptions,nodef);
	}
	
	this.onLoadedDataOK=function(){
		
		if(!this.loadedData){
			return this.onLoadedDataFail();
		}
		var dgman=this.loadedData.get_param_if_object("jsresponse.chartman");
		if(!dgman){
			return this.onLoadedDataFail();	
		}
		if(!this.dom_body){
			return this.onLoadedDataFail();		
		}
		dgman.init_from_params();
		mw_dom_remove_children(this.dom_body);
		dgman.create_chart_on_elem(this.dom_body);
		
		this.graphMan=dgman;
		this.afterGraphManSet();
			
	}
	
	
}
mwuihelper_ajaxelem_devextreme_graph.prototype=new mwuihelper_ajaxelem();


