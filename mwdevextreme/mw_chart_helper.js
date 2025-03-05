function mw_devextreme_chart_man(params){
	this.params=new mw_obj();
	
	this.params.set_params(params);
	this.series=new mw_objcol();
	
	this.render=function(renderOptions,nodef){
		if(!nodef){
			if(!mw_is_object(renderOptions)){
				renderOptions={
					force: true,
					animate: true,
					asyncSeriesRendering: false
				}	
			}
		}
		
		var ch=this.get_chart();
		if(!ch){
			return false;	
		}
		if(mw_is_object(renderOptions)){
			
			ch.render(renderOptions);
		}else{
			ch.render();	
		}
		
		return true;
	}

	
	
	
	this.set_ds_from_optim=function(doptim){
		var op={
			type: 'array',
			store:doptim.get_all_data()	
		};
		var key=doptim.get_key_cod();
		if(key){
			op[key]=key;	
		}
		this.dataSourceCollection=new mw_objcol();
		doptim.add2objcol(this.dataSourceCollection);
		this.dataSource=op;
		
	}
	this.getDataSourceItem=function(cod){
		if(!this.dataSourceCollection){
			return false;	
		}
		return this.dataSourceCollection.get_item(cod);
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
	this.getArgumentAxisLbl=function(argument){
		var p=this.params.get_param_or_def("argumentNameField",false);
		if(!p){
			return 	argument.valueText;
		}
		var data=this.getDataSourceItem(argument.value);
		if(!data){
			return 	argument.valueText;	
		}
		if(data[p]){
			return 	data[p]+"";	
		}
		return 	argument.valueText;
	}
	this.getTooltip=function(argument){
		var r={};
		r["text"]=argument.argumentText;
		var p=this.params.get_param_or_def("argumentNameField",false);
		if(!p){
			return 	r;
		}
		var data=this.getDataSourceItem(argument.argument);
		if(!data){
			return 	r;
		}
		if(data[p]){
			r["text"]=data[p]+"";	
			//return 	
		}
		return 	r;
	}
	
	this.setArgumentAxisCustomizeTextFromField=function(){
		if(this.params.get_param_or_def("chartoptions.argumentAxis.label.customizeText",false)){
			return false;	
		}
		var _this=this;
		var fnc=function(argument){  return _this.getArgumentAxisLbl(argument)};
		this.params.set_param(fnc,"chartoptions.argumentAxis.label.customizeText");
	}
	this.setTooltipFromArgumentName=function(){
		if(this.params.get_param_or_def("chartoptions.tooltip.customizeTooltip",false)){
			return false;	
		}
		var _this=this;
		
		var fnc=function(argument){return _this.getTooltip(argument)};
		this.params.set_param(true,"chartoptions.tooltip.enabled");
		this.params.set_param(fnc,"chartoptions.tooltip.customizeTooltip");
	}
	
	this.init_from_params=function(){
		
		
		var list=this.params.get_param_as_list("series");	
		var _this=this;
		var p;
		if(list){
			mw_objcol_array_process(list,function(e){_this.add_serie(e)});	
		}
		var doptim=this.params.get_param_if_object("additionaldataoptim");
		if(doptim){
			this.set_additional_data_from_optim(doptim);	
		}
		doptim=this.params.get_param_if_object("dsoptim");
		if(doptim){
			this.set_ds_from_optim(doptim);	
		}
		p=this.params.get_param_or_def("argumentNameField",false)
		if(p){
			
			this.setArgumentAxisCustomizeTextFromField();
		}
		p=this.params.get_param_or_def("tooltipFromArgumentName",false)
		if(p){
			
			this.setTooltipFromArgumentName();
		}
	}
	this.create_chart_options=function(){
		var ops=this.params.get_param_if_object("chartoptions",true);
		var list=this.series.get_items_by_index();
		ops.series=this.get_series_options();
		if(this.dataSource){
			ops.dataSource=this.dataSource;	
		}
		return ops;
		
	}
	this.isPie=function(){
		return 	this.params.get_param_or_def("pie",false);
	}
	this.create_chart_on_elem=function(elem){
		if(!elem){
			return false;	
		}
		return this.create_chart($(elem));
		
	}
	this.create_chart=function(selector){
		if(!selector){
			return false;	
		}
		this.chart=false;
		var ops=this.create_chart_options();
		this.container_selector=selector;
		if(this.isPie()){
			return $(this.container_selector).dxPieChart(ops);
		}
		return $(this.container_selector).dxChart(ops);
	}
	
	
	this.get_chart=function(){
		if(this.chart){
			return this.chart;	
		}
		
		if(!this.container_selector){
			return false;	
		}
		var chart;
		if(this.isPie()){
			chart= $(this.container_selector).dxPieChart('instance');
		}else{
			chart= $(this.container_selector).dxChart('instance');	
		}
		if(chart){
			this.chart=chart;
			return this.chart;		
		}
		return false;	
	}
	
	
	this.get_series_options=function(){
		var r=new Array();
		var list=this.series.get_items_by_index();
		for(var i=0;i<list.length;i++){
			r.push(list[i].get_options());	
		}
		return r;
	}
	this.add_serie=function(serie){
		var cod=serie.cod;
		this.series.add_item(cod,serie);
		return serie;	
	}
	
	
	
}
function mw_devextreme_chart_serie_abs(){
	this.init=function(cod,params){
		this.cod=cod;
		this.params=new mw_obj();
		this.params.set_params(params);
		this.after_init();
	}
	this.set_serie_options=function(opts){
			
	}
	this.get_options=function(){
		var o=this.params.get_param_or_def("options",{});
		this.set_serie_options(o);
		return o;	
	}
	this.after_init=function(){};
		
}

function mw_devextreme_chart_serie(cod,params){
	this.init(cod,params);
}
mw_devextreme_chart_serie.prototype=new mw_devextreme_chart_serie_abs();

