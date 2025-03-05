function mwuihelper_droptarget(ui){
	
	this.dragAndDropSupported=function(){
		if(this.ui){
			return this.ui.dragAndDropSupported();	
		}
	}
	this.set_msg=function(msg){
		if(!this.elem_msg){
			return false;	
		}
		mw_dom_remove_children(this.elem_msg);
		mw_hide_obj(this.elem_msg);
		if(!msg){
			return false;	
		}
		if(typeof(msg)!="object"){
			var c=msg;
			msg=document.createElement("div");
			msg.innerHTML=c;	
		}
		this.elem_msg.appendChild(msg);
		mw_show_obj(this.elem_msg);
		
		return true;
		
	}
	this.init=function(ui){
		if(ui){
			this.ui=ui;	
		}
		this.classNameActive="mw_ui_drop_target_active";
		this.classNameInactive="mw_ui_drop_target_inactive";
		this.use_ui_dragAndDropDataMan=true;
		
		this.dropActions=new mw_arraylist();
		
		this.data=new mw_obj();
		
		
			
	}
	this.newDropAction=function(cod){
		var a=new mwuihelper_droptarget_action(cod,this);
		return a;	
	}
	
	this.addDropAction=function(cod,action){
		if(!cod){
			return false;	
		}
		if(!action){
			action=this.newDropAction(cod);	
		}else{
			action.set_target_and_cod(cod,this);	
		}
		if(!this.dropActions.addItem(action,cod)){
			return false;
		}
		return action;
	}
	this.onDropNoUiDnDmanMode=function(ev){
		ev.preventDefault();
		this.on_inactive();	
			
	}
	this.onDropUiDnDmanMode=function(ev){
		ev.preventDefault();
		this.on_inactive();	
		var a=this.getDropActionFromUi();
		if(a){
			a.onDrop(ev);
			a.onDropSrcItem(this.ui.dragAndDropDataMan.src_item);
		}		
	}
	
	this.onDrop=function(ev){
		if(!this.use_ui_dragAndDropDataMan){
			this.onDropNoUiDnDmanMode(ev);
		}else{
			this.onDropUiDnDmanMode(ev);	
		}
	}
	this.onDragLeave=function(ev){
		this.on_inactive();	
	}

	this.onDragEnter=function(ev){
		//this.ui.debug_msg("onDragEnter");
		if(!this.use_ui_dragAndDropDataMan){
			this.is_allowed=false;
			this.set_active(true);
			return;	
		}
		
		this.is_allowed=false;
		var a=this.getDropActionFromUi();
		if(a){
			//this.ui.debug_msg("onDragEnter "+a.cod);
			this.is_allowed=a.is_allowed(ev);
			if(!this.is_allowed){
				return;	
			}
			this.set_active(true);
			a.onDragEnter(ev);
		}
	}
	this.onDragOver=function(ev){
		if(this.is_allowed){
			ev.preventDefault();
		}
	}
	this.getDropActionFromUi=function(){
		if(!this.ui){
			return false;	
		}
		if(!this.ui.dragAndDropDataMan){
			return false;	
		}
		
		var cod=this.ui.dragAndDropDataMan.actioncode;
		//this.ui.debug_msg("actioncode "+cod);
		if(!cod){
			return false;	
		}
		var a=this.dropActions.getItem(cod);
		if(a){
			return a;	
		}
	}
	this.set_active=function(val){
		if(this.elem){
			if(val){
				this.elem.className=this.classNameActive;	
			}else{
				this.elem.className=this.classNameInactive;	
			}
		}
	}
	
	this.on_inactive=function(){
		this.set_msg(false);
		this.set_active(false);
		
	}
	this.create_elem=function(){
		var _this=this;
		this.elem=document.createElement("div");
		this.elem_msg=document.createElement("div");
		this.elem_msg.className="mw_ui_drop_target_msg";
		this.elem.appendChild(this.elem_msg);
		if(this.dragAndDropSupported()){
			this.elem.ondrop=function(ev){_this.onDrop(ev)};	
			this.elem.ondragover=function(ev){_this.onDragOver(ev)};	
			this.elem.ondragenter=function(ev){_this.onDragEnter(ev)};
			this.elem.ondragleave=function(ev){_this.onDragLeave(ev)};
			
			
		}
		this.on_inactive();
		
		
		return this.elem;
	}

	this.get_elem=function(){
		if(this.elem){
			return this.elem;	
		}
		this.create_elem();
		return this.elem ;
	}
	this.init(ui);
}
function mwuihelper_droptarget_action(cod,target){
	this.set_target_and_cod=function(cod,target){
		this.cod=cod;
		this.target=target;
	}
	this.set_target_and_cod(cod,target);
	this.onDragEnter=function(ev){
		//return true;	
	}
	this.onDrop=function(ev){
		//this.target.ui.debug_msg("drop target action "+this.cod);
	}
	this.onDropSrcItem=function(src_item){
		//this.target.ui.debug_msg("drop target action "+this.cod);
	}
	
	this.is_allowed=function(ev){
		return true;	
	}
}
function mwuihelper_DragAndDropDataMan(ui){
	this.init=function(ui){
		this.ui=ui;
		this.clear();
	}
	this.onDragEnd=function(){
		this.clear();
		//this.ui.debug_msg("drag end");
		return true;
			
	}

	this.onDragStart=function(src_item,actioncode,ev){
		this.clear();
		this.src_item=src_item;
		this.actioncode=actioncode;
		this.dad_event=ev;
		return true;
			
	}
	this.clear=function(){
		this.src_item=false;
		this.actioncode=false;
		this.dad_event=false;
		this.data=new mw_obj();
			
	}
	this.init(ui);
}
