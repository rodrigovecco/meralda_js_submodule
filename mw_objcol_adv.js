function mw_objcol_item_with_children_dom_base(){
	mw_objcol_item_with_children_abs.call(this);
	mw_events_enabled_obj.call(this);
	
	
	this.append_to_container=function(container){
		if(!container){
			return false;	
		}
		var c=this.get_container();
		if(c){
			container.appendChild(c);
			
		}
	}
	this.create_container=function(){
		this.container=document.createElement("div");
		this.container.innerHTML=this.data.get_param_or_def("lbl","");
		var _this=this;
		this.container.onclick=function(e){_this.onClick(e)};
		var list=this.getChildren();
		if(list){
			for(var i=0;i<list.length;i++){
				list[i].append_to_container(this.container);	
			}
		}
		return this.container;
	}

	this.get_container=function(){
		if(!this.container){
			this.container=this.create_container();	
		}
		return this.container;
	}

	
	this.do_initEvents=function(){
		this.do_initEventHandlerFromParams("click");
		this.do_initEventHandlerFromParams("childClick");
			
	}
	this.do_initEventHandlerFromParams=function(cod){
		var d=this.data.get_param_or_def("on."+cod,false);
		if(d){
			return this.on(cod,d);	
		}
			
	}
	

	
	this.onChildClick=function(child){
		
		var e={parant:this,child:child};
		this.dispatchEvent("childClick",e);
	}
	this.onChildAdded=function(child,colelem){
		child.setParent(this);
	}
	
	this.onClick=function(evtn){
		
		
		var m=this.getParent();
		
		if(m){
			m.onChildClick(this);	
		}
		this.dispatchEvent("click",{elem:this,evtn:evtn});
	}
	
	this.setParent=function(parent){
		this.parent=parent;	
	}
	this.getParent=function(){
		return this.parent;
	}
	this.getMan=function(){
		if(this.man){
			return this.man;	
		}
		var p=this.getParent();
		if(p){
			return p.getMan();	
		}
	}

	
	this.setMan=function(man){
		this.man=man;
	}

	
}
