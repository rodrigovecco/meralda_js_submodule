function mwuihelper_ajaxelem(params){
	this.params=new mw_obj();
	if(params){
		this.params.set_params(params);
	}
	
	this.initFromParams=function(){
		if(!this.params){
			return false;	
		}
		var url =this.params.get_param_if_string("url");
		if(url){
			this.url=url;
		}
		if(!this.dom_container){
			var container_id=this.params.get_param_if_string("container_id");
			if(container_id){
				this.dom_container=document.getElementById(container_id);
			}
		}
		if(!this.dom_body){
			var body_id=this.params.get_param_if_string("body_id");
			if(body_id){
				this.dom_body=document.getElementById(body_id);
			}
		}
		if(this.dom_container && !this.dom_body){
			this.dom_body=document.createElement("div");
			this.dom_container.appendChild(this.dom_body);
		}
		this.set_dom_elems(this.dom_body,this.dom_container);
		this.setAllowJSResponse(this.params.get_param_or_def("allow_js_response",true));
		this.afterinitFromParams();
	}
	this.afterinitFromParams=function(){
		this.clearBodyAndAddLoading();
		if(this.url){
			this.loadCont(this.url);	
		}
	}
	this.set_dom_elems=function(bodyelem,container){
		this.dom_body=bodyelem;
		this.dom_container=container;
		
	}
	this.abort=function(){
		if(this.load_cont_ajax){
			this.load_cont_ajax.abort();
		}
	}
	this.get_elem_by_class=function(className){
		if(!this.dom_container){
			return false;	
		}
		var list=$(this.dom_container).find('.'+className);
		if(!list){
			return false;	
		}
		if(!list.length){
			return false;	
		}
		return list[0];
		
		
	}
	this.clearBody=function(){
		if(!this.dom_body){
			return false;	
		}
		mw_dom_remove_children(this.dom_body)
		return true;
	}
	this.clearBodyAndAddLoading=function(){
		this.clearBody();
		if(!this.dom_body){
			return false;	
		}
		
		
		
		this.dom_body.innerHTML="<div class='mw_loading_placeholder'><div class='mw_loading_placeholder_in'><div class='fa fa-sync fa-spin '></div></div></div>";
		
		return true;
		
			
	}
	
	
	
	this.setUI=function(ui){
		this.ui=ui;
		this.debug_mode=this.ui.debug_mode;
	}
	this.onLoadedDataFail=function(){
		var cont="";
		if(this.loadedData){
			cont=this.loadedData.get_param_or_def("htmlcont",cont);
		}
		mw_dom_set_cont(this.dom_body,cont);
			
	}
	this.onLoadedDataOK=function(){
		var cont="";
		if(this.loadedData){
			cont=this.loadedData.get_param_or_def("htmlcont",cont);
		}
		mw_dom_set_cont(this.dom_body,cont);
			
	}
	this.onContXMLLoaded=function(){
		if(!this.load_cont_ajax){
			return false;	
		}
		
		this.loaded=true;
		this.loadedData=this.load_cont_ajax.getResponseXMLAsMWData(this.isAllowedJSResponse());
		this.onLoadedData();
	}
	this.checkLoadedData=function(){
		if(!this.loadedData){
			return false;	
		}
		if(this.loadedData.get_param("ok")){
			return true;	
		}
		return false;
		

		
	}
	this.onLoadedData=function(){
		if(!this.loadedData){
			if(this.ui){
				if(this.debug_mode){	
					this.ui.debug_obj(this.loadedData.params);
				}
			}
		}

		if(this.checkLoadedData()){
			this.onLoadedDataOK();	
		}else{
			this.onLoadedDataFail();	
		}
		
	}
	this.loadCont=function(url){
		this.loaded=false;
		if(url){
			if(!this.load_cont_ajax){
				this.set_cont_xml_url(url);	
			}else{
				this.load_cont_ajax.abort_and_set_url(url);	
			}
		}
		if(!this.load_cont_ajax){
			return false;	
		}
		if(this.ui){
			if(this.debug_mode){	
				this.ui.debug_url(this.load_cont_ajax.url);
			}
		}
		
		this.load_cont_ajax.run();
	}
	this.setAllowJSResponse=function(val){
		if(val){
			this.allowJSResponse=true;	
		}else{
			this.allowJSResponse=false;		
		}
	}
	this.isAllowedJSResponse=function(){
		if(this.allowJSResponse){
			return true;
		}
		return false;
	}
	
	this.set_cont_xml_url=function(url){
		
		var _this=this;
		this.load_cont_ajax= new mw_ajax_launcher(url,function(){_this.onContXMLLoaded()});
	}
	
	
}

