
function mw_nav_bar(data){
	mw_objcol_item_with_children_dom_base.call(this);
	this.set_data(data);
	this.append_to_container=function(container){
		if(!container){
			return false;	
		}
		var c=this.get_container();
		if(c){
			container.appendChild(c);
			$($(c)).metisMenu();
			
		}
	}
	
	this.create_container=function(){
		this.container=document.createElement("div");
		var list=this.getChildren();
		if(list){
			this.childrenContainer=document.createElement("ul");
			this.childrenContainer.className="nav mw_nav";
			this.container.appendChild(this.childrenContainer);
			
			for(var i=0;i<list.length;i++){
				list[i].append_to_container(this.childrenContainer);	
			}
		}
		return this.container;
	}
	
	this.onChildAdded=function(child,colelem){
		child.setParent(this);
		child.setMan(this);
		//console.log("onChildAdded "+child.cod+" "+colelem.cod);	
	}
	
	this.createChild=function(data){
		if(!mw_is_object(data)){
			if (typeof(data)=="string"){
				var lbl=data;
				data={lbl:lbl};
			}else{
				return false;	
			}
		}
		var ch=new mw_nav_bar_item(data);
		return ch;
	}
}
function mw_nav_bar_item_base(data){
	mw_objcol_item_with_children_dom_base.call(this);
	this.set_data(data);
	this.create_container=function(){
		this.container=document.createElement("li");
		this.lblContainer=document.createElement("a");
		this.lblContainer.href="#";
		
		
		this.lblContainer.innerHTML=this.data.get_param_or_def("lbl","");
		
		var _this=this;
		this.lblContainer.onclick=function(e){_this.onClick(e); return false;};
		this.container.appendChild(this.lblContainer);
		var list=this.getChildren();
		if(list){
			this.arrowElem=document.createElement("span");
			this.arrowElem.className="fa arrow";
			this.lblContainer.appendChild(this.arrowElem);
			this.childrenContainer=document.createElement("ul");
			this.childrenContainer.className="nav collapse mw_nav_sub";
			this.container.appendChild(this.childrenContainer);
			
			for(var i=0;i<list.length;i++){
				list[i].append_to_container(this.childrenContainer);	
			}
		}
		return this.container;
	}
	
	this.createChild=function(data){
		if(!mw_is_object(data)){
			if (typeof(data)=="string"){
				var lbl=data;
				data={lbl:lbl};
			}else{
				return false;	
			}
		}
		var ch=new mw_nav_bar_item(data);
		return ch;
	}
	

}

function mw_nav_bar_item(data){
	mw_nav_bar_item_base.call(this,data);
}
