function mwuihelper_panel(ui){
	this.ui=ui;
	this.set_cont=function(title,body,footer){
		this.set_title(title);
		this.set_body(body);
		this.set_footer(footer);
		
		
	}
	this.set_footer=function(cont){
		var e=this.get_footer();
		mw_dom_set_cont(e,cont);
		if(!cont){
			
			mw_hide_obj(e);	
		}else{
			mw_show_obj(e);	
		}
	}
	this.set_body=function(cont){
		return mw_dom_set_cont(this.get_body(),cont);	
	}
	this.set_title=function(cont){
		return mw_dom_set_cont(this.get_title(),cont);	
	}
	this.get_footer=function(){
		return this.get_elem_by_class("panel-footer");	
	}
	this.get_title=function(){
		return this.get_elem_by_class("panel-title");	
	}
	this.get_body=function(){
		return this.get_elem_by_class("panel-body");	
	}
	this.get_heading=function(){
		return this.get_elem_by_class("card-header");	
	}
	this.appendCloseBtn=function(){
		var e;
		var _this=this;
		var h=this.get_heading();
		if(!h){
			return false;
		}
		e=document.createElement("a");
		e.className="mw_collaps_btn";
		e.style.marginLeft="5px";
		e.href="#";
		e.innerHTML="<span class='glyphicon glyphicon-remove'> </span>";
		e.onclick=function(){_this.hide()};
		if(h.firstChild){
			h.insertBefore(e,h.firstChild);
		}else{
			h.appendChild(e);
			
		}
		return e;
	
	}
	this.hideLoadingOverlay=function(){
		mw_hide_obj(this.loading_overlay);	
	}
	
	this.show=function(){
		mw_show_obj(this.dom_elem);
		mw_hide_obj(this.loading_overlay);	
	}
	this.afterHide=function(){
			
	}
	this.hide=function(){
		mw_hide_obj(this.dom_elem);
		this.afterHide();
	}
	this.set_dom_elem_by_id=function(id){
		var elem=mw_get_element_by_id(id);
		if(elem){
			this.id_elem=id;
			return this.set_dom_elem(elem);	
		}
	}
	this.set_dom_elem=function(elem){
		if(!elem){
			return false;	
		}
		this.dom_elem=elem;
		return true;
	}
	this.get_id=function(){
		if(this.id_elem){
			return this.id_elem;	
		}
	}
	this.set_size=function(size){
			
	}
	this.set_loading_overlay=function(){
		if(this.loading_overlay){
			return true;	
		}
		if(!this.dom_elem){
			return false;	
		}
		this.dom_elem.style.position="relative";
		this.loading_overlay=document.createElement("div");
		this.loading_overlay.className="mw_loading_ovelay";
		this.loading_overlay.innerHTML="<div class='mw_loading_ovelay_icon'><div class='glyphicon glyphicon-refresh glyphicon-refresh-animate '></div></div>";
		this.dom_elem.appendChild(this.loading_overlay);
		mw_hide_obj(this.loading_overlay);
		return true;

	}
	this.show_loading_overlay=function(){
		if(!this.set_loading_overlay()){
			return false;	
		}
		mw_show_obj(this.loading_overlay);
	}
	this.get_elem_by_class=function(className){
		var id=this.get_id();
		if(!id){
			return false;	
		}
		var list=$('#'+id).find('.'+className);
		if(!list){
			return false;	
		}
		if(!list.length){
			return false;	
		}
		return list[0];
		
		
	}
	
}

