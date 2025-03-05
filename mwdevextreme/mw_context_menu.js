

function mw_dx_context_menu_item_base(){
	mw_objcol_item_with_children_abs.call(this);
	mw_events_enabled_obj.call(this);
	this.onClick=function(e){
		//console.log("onClick",e);
		this.dispatchEvent("click",{evtn:e});
	}
	this.onClickItemMode=function(e,man){
		var ee={evtn:e};
		if(man){
			man.customSetItemClickEvent(ee);
		}
		
		//console.log("onClickItemMode",e);
		this.dispatchEvent("click",ee);
	}
	this.onRendered=function(e){
		//console.log("onRendered",e);
		this.dispatchEvent("rendered",{evtn:e});
	}
	
	this.do_initEvents=function(){
		this.do_initEventHandlerFromParams("click");
		this.do_initEventHandlerFromParams("rendered");
		this.do_initEventHandlerFromParams("optionsForDataGrid");
		
	
	}
	this.do_initEventHandlerFromParams=function(cod){
		var d=this.data.get_param_or_def("on."+cod,false);
		if(d){
			return this.on(cod,d);	
		}
			
	}
	
	this.isMnuItem=function(){
		return true;
	}
	this.newItemOptions=function(man){
		var o=this.data.get_param_if_object("options",true);
		var _this=this;
		o["mwitem"]=this;
		if(man){
			if(man.itemsClickMode()){
				o["mwCurrentData"]=man.getCurrentData();
				
				if(!o["onItemClick"]){
					o["onItemClick"]=function(e){_this.onClickItemMode(e,man)};	
				}
			}
		}
		var p;
		if(p=this.data.get_param_if_function("onSetDxOptions")){
			p(o,this,man);	
		}
		
		var list=this.getChildren();
		if(list){
			var ch=[];
			for(var i=0;i<list.length;i++){
				list[i].add2ItemsOptionsList(ch,man);	
			}
			o.items=ch;
		}
		return o;
		
		
	}
	this.add2ItemsOptionsList=function(result,man){
		var o=this.newItemOptions(man);
		if(o){
			result.push(o);
			return o;	
		}
	}
	
	this.checkChildAndCreate=function(data){
		if(mw_is_object(data,"isMnuItem")){
			return data;
		}
		return this.createChild(data);	
		
	}
	this.createChild=function(data){
		if(!mw_is_object(data)){
			if (typeof(data)=="string"){
				var lbl=data;
				data={options:{text:lbl}};
			}else{
				return false;	
			}
		}
		var ch=new mw_dx_context_menu_item(data);
		return ch;
	}
	
}



function mw_dx_context_menu_item(data){
	mw_dx_context_menu_item_base.call(this);
	this.set_data(data);
	
		
}
function mw_dx_context_menu_item_link(data){
	mw_dx_context_menu_item_base.call(this);
	this.set_data(data);
	this.newInnerDomElem=function(evtn){
		/*
		var args=this.params.get_param_if_object("link_mode.args");
		var varargs=this.params.get_param_if_object("link_mode.varargs");
		var url_creator=new mw_url();
		var url=url_creator.get_url_from_data_varargs(this.params.get_param_or_def("link_mode.url","")
					,varargs,cellInfo.data,args);
		var target=this.params.get_param_or_def("link_mode.target",false);
		*/
		var url=this.data.get_param_or_def("link_mode.url","#");
		var target=this.data.get_param_or_def("link_mode.target",false);

		var elem=document.createElement("a");
		//elem.className="dx-menu-item-text";
		elem.href=url;
		if(target){
			elem.target=target;	
		}
		elem.innerHTML=this.data.get_param_or_def("options.text","");
		return elem;
	
	}
	this.onRendered=function(e){
		//console.log("onRenderedxxx",e);
		var ee={evtn:e};
		//console.log("eeAaaa",ee);
		this.dispatchEvent("rendered",ee);
		//console.log("ee",ee);
		if(ee.cancel){
			return;
		}
		var elem=this.newInnerDomElem(e);
		var ce=e.itemElement.find('.dx-menu-item-text');
		if(ce){
			ce.empty();
			$(elem).appendTo(ce);	
		}
	}
	
		
}

function mw_dx_context_menu(data){
	mw_objcol_item_with_children_abs.call(this);
	this.set_data(data);
	this.currentData={};
	this._itemsClickMode=false;
	this.customSetItemOptions=new mw_obj();
	
	this.setCustomSetItemOptionsFnc=function(cod,fnc){
		this.customSetItemOptions.set_param(fnc,cod);
	}
	this.doCustomSetItemOptions=function(cod,ops){
		var f=this.customSetItemOptions.get_param_if_function(cod);
		if(f){
			f(ops);	
		}
	}
	
	this.customSetItemClickEvent=function(evtn){
		//overwrite
	}
	this.itemsClickMode=function(){
		return this._itemsClickMode;
	}

	this.getItemsOptions=function(){
		var r=[];
		var list=this.getChildren();
		if(list){
			for(var i=0;i<list.length;i++){
				list[i].add2ItemsOptionsList(r,this);	
			}
		}
		return r;
	}
	this.onItemClick=function(e){
		if(this.itemsClickMode()){
			console.log("itemsClickMode");
			return;
		}
		if(!e){
			e={};	
		}
		e.mwmnuman=this;
		//console.log("onItemClick",e);
		if(e.itemData){
			if(e.itemData["mwitem"]){
				if(mw_is_object(e.itemData["mwitem"],"onClick")){
					e.itemData.mwitem.onClick(e);	
				}
			}
		}
	}
	this.onItemRendered=function(e){
		if(!e){
			e={};	
		}
		e.mwmnuman=this;
		//console.log("onItemRendered",e);
		if(e.itemData){
			if(e.itemData["mwitem"]){
				if(mw_is_object(e.itemData["mwitem"],"onRendered")){
					e.itemData.mwitem.onRendered(e);	
				}
			}
		}
	}
	
	this.setDxOptions=function(opts){
		var _this=this;
		var p;
		if(!opts["items"]){
			opts["items"]=this.getItemsOptions();	
		}
		if(!opts["onItemClick"]){
			opts["onItemClick"]=function(e){_this.onItemClick(e)};
		}
		if(!opts["onItemRendered"]){
			opts["onItemRendered"]=function(e){_this.onItemRendered(e)};
		}
		
	}
	this.setDxOptionsForDataGridContextMenuPreparing=function(evtn){
		var _this=this;
		var p;
		this._itemsClickMode=true;
		evtn["items"]=this.getItemsOptions();
		//evtn["onItemClick"]=function(e){_this.onItemClick(e)};
		//evtn["onItemRendered"]=function(e){_this.onItemRendered(e)};
		
	}
	
	
	this.getDxOptions=function(){
		if(this.dxOptions){
			return this.dxOptions;	
		}
		
		this.dxOptions=this.data.get_param_if_object("options",true);
		var p;
		this.setDxOptions(this.dxOptions);
		if(p=this.data.get_param_if_function("onSetDxOptions")){
			p(this,opts);	
		}
		return this.dxOptions;	
		
	}
	this.createContextMenuOnTarget=function(target,elem){
		return this.createContextMenu(elem,target);
	}
	this.createContextMenu=function(elem,target){
		this.dxContextMenu=false;
		if(!elem){
			elem=document.createElement("div");
			document.body.appendChild(elem);
			//return false;	
		}
		this.container=elem;
		this.container_selector=$(elem);
		var ops=this.getDxOptions();
		if(target){
			ops.target=target;	
		}
		$($(elem)).dxContextMenu(ops);
		this.dxContextMenu=$($(elem)).dxContextMenu('instance');
		return this.dxContextMenu;
		
		
	}
	this.checkChildAndCreate=function(data){
		if(mw_is_object(data,"isMnuItem")){
			return data;
		}
		
		return this.createChild(data);	
		
	}
	this.createChild=function(data){
		if(!mw_is_object(data)){
			if (typeof(data)=="string"){
				var lbl=data;
				data={options:{text:lbl}};
			}else{
				return false;	
			}
		}
		var ch=new mw_dx_context_menu_item(data);
		return ch;
	}
	this.setCurrentData=function(data){
		this.currentData={};
		if(mw_is_object(data)){
			this.currentData=data;	
		}
			
	}
	/*
	this.setItemDataItemClickMode=function(){
			
	}
	*/
	this.getCurrentData=function(cod,def){
		if(!this.currentData){
			return def;	
		}
		if(!cod){
			return this.currentData;
		}
		if(this.currentData[cod]){
			return this.currentData[cod];
		}
		if(mw_isNumber(this.currentData[cod])){
			return this.currentData[cod];
		}
		return def;
		
	}
	this.setCurrentDataGridContextMenuPreparingEvent=function(evtn){
		//this.currentData={};
		this.currentDataGridMenuPreparingEvent=false;
		
		if(!evtn){
			return;	
		}
		if (evtn.row.rowType !== "data"){
			return;
		}
		this.setCurrentData(evtn.row.data);
		this.currentDataGridMenuPreparingEvent=evtn;
		return true;
		

	}
	this.add2DXdatagridOnContextMenuPreparing=function(evtn){
		if(!this.setCurrentDataGridContextMenuPreparingEvent(evtn)){
			return false;	
		}
		this.setDxOptionsForDataGridContextMenuPreparing(evtn);

	}

	
	
}
	

