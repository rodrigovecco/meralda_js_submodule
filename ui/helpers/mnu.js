function mwuihelper_nav_mnu(ui){
	this.ui=ui;
	this.items=new mw_objcol();
	
	
	this.add_item=function(elem){
		elem.setMan(this);
		return this.items.add_item_and_set(elem,elem.cod);
	}
	
	this.set_list_dom_elem=function(elem){
		if(!elem){
			return false;	
		}
		this.list_elem=elem;
	}
	this.appendElems=function(){
		if(!this.list_elem){
			return false;	
		}
		var _this=this;
		return mw_objcol_array_process(this.items.get_items_by_index(),function(elem){_this.appendElem(elem)});
	}
	this.appendElem=function(elem){
		if(!this.list_elem){
			return false;	
		}
		this.list_elem.appendChild(elem.getListItemElem());
	}
	this.execItem=function(cod){
		var elem=this.items.get_item(cod);
		if(!elem){
			return false;
				
		}
		elem.exec();
		return elem;
	}
	
	this.setSelected=function(cod){
		var list=this.items.get_items_by_index();
		if(!list){
			return false;	
		}
		var r;
		var e;
		for(var i=0;i<list.length;i++){
			e=list[i];
			if(e.cod==cod){
				e.setSelected(true);	
				r=e;
			}else{
				e.setSelected(false);	
			}
		}
		return r;
	}
	
}

function mwuihelper_nav_mnu_item(cod,params,ui){
	this.classNameActive="active";
	this.classNameNormal="";
	
	this.setSelectedChild=function(cod){
		var list=this.items.get_items_by_index();
		if(!list){
			return false;	
		}
		var r;
		var e;
		for(var i=0;i<list.length;i++){
			e=list[i];
			if(e.cod==cod){
				e.setSelected(true);	
				r=e;
			}else{
				e.setSelected(false);	
			}
		}
		if(r){
			this.onSelected();	
		}
		return r;
	}
	this.onSelected=function(){
		if(this.parent){
			this.parent.setSelectedChild(this.cod);	
		}else if(this.man){
			this.man.setSelected(this.cod);	
		}
			
	}
	
	this.add_item=function(elem){
		elem.setParent(this);
		return this.items.add_item_and_set(elem,elem.cod);
	}
	
	this.init=function(cod,params,ui){
		this.items=new mw_objcol();
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
	this.setSelected=function(val){
		if(val){
			this.selected=true;	
		}else{
			this.selected=false;
			this.setSelectedChild();	
		}
		if(this.listItemElem){
			if(this.selected){
				this.listItemElem.className=this.classNameActive;	
			}else{
				this.listItemElem.className=this.classNameNormal;	
			}
		}
	}
	this.setMan=function(man){
		this.man=man;
	}
	this.setParent=function(parent){
		this.parent=parent;
	}
	this.set_col_item=function(colitem){
		this.colitem=colitem;
	}
	this.onClick=function(){
		//	
	}
	this.exec=function(){
		return this._onClick();	
	}
	
	this._onClick=function(){
		if(!this.params.get_param_or_def("dontSetAsSelectedOnClick",false)){
			this.onSelected();
				
		}
		this.onClick(this);	
	}
	
	this.createListItemElem=function(){
		var cont=document.createElement("li");
		var _this=this;
		this.link_elem=document.createElement("a");
		this.link_elem.href=this.params.get_param_or_def("url","#");
		this.link_elem.innerHTML=this.params.get_param_or_def("title","...");
		this.link_elem.onclick=function(){_this._onClick()};
		if(this.selected){
			cont.className=this.classNameActive;	
		}else{
			cont.className=this.classNameNormal;	
		}

		cont.appendChild(this.link_elem);
		
		return cont;
	}
	
	this.getListItemElem=function(){
		if(!this.listItemElem){
			this.listItemElem=this.createListItemElem();	
		}
		return this.listItemElem;
	}
	this.init(cod,params,ui);
	
	
}
function mwuihelper_nav_mnu_item_dropdown(cod,params,ui){
	this.classNameActive="dropdown active";
	this.classNameNormal="dropdown";
	this.createListItemElem=function(){
		var cont=document.createElement("li");
		cont.style.position="relative";
		var _this=this;
		
		//cont.onmouseover=function(){_this.onMouseOver()};
		 $(cont).hover(
            function(){ $(this).addClass('open') },
            function(){ $(this).removeClass('open') }
        );
		this.link_elem=document.createElement("a");
		this.link_elem.className="mw_nav_mnu_drop_down_link";
		this.link_elem.href=this.params.get_param_or_def("url","#");
		this.link_elem.innerHTML=this.params.get_param_or_def("title","...");
		this.link_elem.onclick=function(){_this._onClick()};
		if(this.selected){
			cont.className=this.classNameActive;	
		}else{
			cont.className=this.classNameNormal;	
		}
		
		cont.appendChild(this.link_elem);
		
		this.ddBtn=document.createElement("a");
		this.ddBtn.type="button";
		this.ddBtn.className="mw_nav_mnu_drop_down_btn dropdown-toggle";
		this.ddBtn.role="button";
		$(this.ddBtn).attr("data-toggle", "dropdown");
		$(this.ddBtn).attr("aria-expanded", "false");
		var span=document.createElement("span");
		span.className="caret";
		this.ddBtn.appendChild(span);
		span=document.createElement("span");
		span.className="sr-only";
		span.innerHTML="Toggle Dropdown";
		this.ddBtn.appendChild(span);
		cont.appendChild(this.ddBtn);
		this.createListChildrenDomList();
		
		cont.appendChild(this.children_dom_list);
		

		
		return cont;
	}
	this.appendChild=function(elem){
		if(!this.children_dom_list){
			return false;	
		}
		this.children_dom_list.appendChild(elem.getListItemElem());
	}
	
	this.createListChildrenDomList=function(){
		this.children_dom_list=document.createElement("ul");
		this.children_dom_list.className="dropdown-menu";
		this.children_dom_list.role="menu";
		
		var _this=this;
		mw_objcol_array_process(this.items.get_items_by_index(),function(elem){_this.appendChild(elem)});
		return this.children_dom_list;
		
		
		
	}
	
	this.init(cod,params,ui);	
}
mwuihelper_nav_mnu_item_dropdown.prototype=new mwuihelper_nav_mnu_item();
