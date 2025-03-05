function mwuihelper_alt_cont_list(ui){
	this.ui=ui;
	this.items=new mw_objcol();
	
	this.addItemByData=function(cod,data){
		var i=new mwuihelper_alt_cont_item(cod,data,this.ui);
		this.add_item(i);
		return i;
	}
	this.get_item=function(cod){
		return this.items.get_item(cod);	
	}
	this.show_all=function(loadifreq){
		var list=this.items.get_items_by_index();
		if(!list){
			return false;	
		}
		
		var e;
		for(var i=0;i<list.length;i++){
			e=list[i];
			if(loadifreq){
				e.loadContIfReqAndShow();	
			}else{
				e.show();	
			}
		}
		
	}
	
	
	this.add_item=function(elem){
		return this.items.add_item_and_set(elem,elem.cod);
	}
	this.setCurrentItem=function(cod){
		this.currentItemCod=cod;
		this.currentItem=false;
		
		var list=this.items.get_items_by_index();
		if(!list){
			return false;	
		}
		var e;
		for(var i=0;i<list.length;i++){
			e=list[i];
			if(e.cod==cod){
				e.showIfNotVisible();	
				this.currentItem=e;
			}else{
				e.hideIfVisible();	
			}
		}
		return this.currentItem;
	}
	
	this.show_item=function(cod,loadifreq){
		var list=this.items.get_items_by_index();
		if(!list){
			return false;	
		}
		var r;
		var e;
		for(var i=0;i<list.length;i++){
			e=list[i];
			if(e.cod==cod){
				if(loadifreq){
					e.loadContIfReqAndShow();	
				}else{
					e.show();	
				}
				r=e;
			}else{
				if(!this.all_visible){
					e.hide();	
				}
			}
		}
		return r;
	}
}

function mwuihelper_alt_cont_item(cod,params,ui){
	this.init=function(cod,params,ui){
		this.params=new mw_obj();
		if(cod){
			this.cod=cod;	
		}
		if(params){
			this.params.set_params(params);
		}
		if(ui){
			this.ui=ui;	
		}
	}
	this.set_loading_overlay=function(){
		if(this.loading_overlay){
			return true;	
		}
		if(!this.container){
			return false;	
		}
		this.container.style.position="relative";
		this.loading_overlay=document.createElement("div");
		this.loading_overlay.className="mw_loading_ovelay";
		this.loading_overlay.innerHTML="<div class='mw_loading_ovelay_icon'><div class='glyphicon glyphicon-refresh glyphicon-refresh-animate '></div></div>";
		this.container.appendChild(this.loading_overlay);
		mw_hide_obj(this.loading_overlay);
		return true;

	}
	this.show_loading_overlay=function(){
		if(!this.set_loading_overlay()){
			return false;	
		}
		mw_show_obj(this.loading_overlay);
	}
	
	this.set_col_item=function(colitem){
		this.colitem=colitem;
	}
	this.needs_reload=function(){
		this.loaded=false;
		if(this.visible){
			this.loadContIfReqAndShow();	
		}
	}
	this.needs_reload_set_loadingOverlay=function(){
		this.loaded=false;
		if(this.visible){
			this.show_loading_overlay();
			this.loadContIfReqAndShow();	
		}
	}
	
	this.loadContIfReqAndShow=function(){
		this.show();
		if(!this.loaded){
			this.loadCont();	
		}
		mw_show_obj(this.container);	
	}
	this.showIfNotVisible=function(){
		if(!this.hideShowDone){
			return this.show();
		}
		if(!this.visible){
			return this.show();
		}
	}
	this.show=function(){
		this.visible=true;
		this.hideShowDone=true;
		
		mw_show_obj(this.container);
		this.onShow();
	}
	this.onShow=function(){
			
	}
	this.hideIfVisible=function(){
		if(!this.hideShowDone){
			return this.hide();
		}
		if(this.visible){
			return this.hide();
		}
	}
	
	this.hide=function(){
		this.visible=false;
		this.hideShowDone=true;
		
		mw_hide_obj(this.container);
		this.onHide();
	}
	this.onHide=function(){
			
	}
	
	this.onContXMLLoaded=function(){
		if(!this.load_cont_ajax){
			return false;	
		}
		
		this.loaded=true;
		this.loadedData=this.load_cont_ajax.getResponseXMLAsMWData();
		this.onLoadedData();
		//this.set_cont(this.loadedData.get_param_or_def("htmlcont",""));
	}
	this.onLoadedData=function(){
		if(!this.loadedData){
			return false;	
		}
		this.set_cont(this.loadedData.get_param_or_def("htmlcont",""));
		this.afterContSetted();
		
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
		this.set_loading_display();
		this.load_cont_ajax.run();
	}
	
	this.set_cont_xml_url=function(url){
		var _this=this;
		this.load_cont_ajax= new mw_ajax_launcher(url,function(){_this.onContXMLLoaded()});
	}
	this.set_loading_display=function(){
		this.set_cont(this.get_loading_dom_elem());	
	}
	this.get_loading_dom_elem=function(){
		if(!this.loading_elem){
			if(this.ui){
				this.loading_elem=this.ui.new_loading_elem();
			}
		}
		
		
		if(this.loading_elem){
			return 	this.loading_elem;
		}
	}
	this.set_cont=function(cont){
		this.loading_overlay=false;
		if(!mw_dom_remove_children(this.container)){
			return false;	
		}
		if(!cont){
			return false;	
		}
		if(typeof(cont)=="object"){
			this.container.appendChild(cont);	
		}else{
			this.container.innerHTML=cont+"";	
		}
		
	}
	this.afterContSetted=function(){
		
	}
	this.get_elem_by_class=function(className){
		if(!this.container){
			return false;	
		}
		var list=$(this.container).find('.'+className);
		if(!list){
			return false;	
		}
		if(!list.length){
			return false;	
		}
		return list[0];
		
		
	}
	
	this.set_container=function(cont){
		this.container=cont;
		return cont;	
	}
	
	this.create_container=function(){
		var cont=document.createElement("div");	
		return this.set_container(cont);
	}
	this.init(cod,params,ui);
	
	
}
