
function mw_datainput_item_elemschoise(options){
	this.options_list=new mw_arraylist();
	this.selected_items_in_order=new mw_objcol();
	mw_datainput_item_abs.call(this);
	this.afterInit=function(){
		
		var list=this.options.get_param_as_list("optionslist");
		//console.log(list);
		var _this=this;
		if(list){
			mw_objcol_array_process(list,function(data,index){_this.add_option_from_data(data)});		
		}
	}
	this.set_input_value=function(val){
		var list=this.options_list.getElemsList();
		this.selected_items_in_order=new mw_objcol();
		var cod;
		var eitem;
		var i;
		if(list){
			for(i =0; i<list.length;i++){
				list[i].selected=false;
			}
		}
		if(val){
			val=val+"";
			var sellist=val.split(",");
			for(i =0; i<sellist.length;i++){
				eitem=this.options_list.getElem(sellist[i]);
				if(eitem){
					this.selected_items_in_order.add_item(eitem.cod,eitem);
					eitem.selected=true;	
				}
			}
		}
		this.set_input_value_from_selector();
	}
	this.ondblclickOptionCod=function(cod){
		var e=this.options_list.getElem(cod);
		if(e){
			if(e.selected){
				e.selected=false;
				this.selected_items_in_order.removeItem(cod);
			}else{
				e.selected=true;
				this.selected_items_in_order.add_item(e.cod,e);		
			}
		}
		this.set_input_value_from_selector();
	}
	this.refrech_lists_options=function(){
		
		if(!this.src_selector){
			return false;	
		}
		if(!this.dest_selector){
			return false;	
		}
		mw_select_removeAllOptions(this.src_selector);
		mw_select_removeAllOptions(this.dest_selector);
		
		var list=this.options_list.getElemsList();
		if(!list){
			
			return false;	
		}
		var cod;
		var op;
		var _this=this;
		var i;
		for(i =0; i<list.length;i++){
			
			cod=list[i].cod;
			op=list[i].create_select_option();
			if(op){
				op.ondblclick=function(){_this.ondblclickOptionCod(this.value)};
				if(list[i].selected){
					if(!this.order_as_input()){
						this.dest_selector.appendChild(op);
					}
				}else{
					this.src_selector.appendChild(op);
					
				}
			}
			
			
		}
		if(!this.order_as_input()){
			return;	
		}
		list=this.selected_items_in_order.get_items_by_index();
		if(!list){
			return false;	
		}
		for(i =0; i<list.length;i++){
			
			cod=list[i].cod;
			op=list[i].create_select_option();
			if(op){
				op.ondblclick=function(){_this.ondblclickOptionCod(this.value)};
				this.dest_selector.appendChild(op);
			}
		}
		
	}
	
	this.afterAppend=function(){
		this.doAfterAppendFncs();
		this.refrech_lists_options();
		if(this.orig_value){
			this.set_input_value(this.orig_value);	
		}
		
	}
	this.set_input_value_from_selector=function(){
		this.refrech_lists_options();
		if(!this.input_elem){
			return false;	
		}
		this.input_elem.value=this.selected_items_in_order.get_cods().join(",");
		this.on_change();
	}
	
	this.add_selected=function(){
		var selelem=this.src_selector;
		if(!selelem){
			return false;	
		}
		var op;
		var list_item;
		for (var i=0; i<selelem.options.length; i++) {
			op=selelem.options[i];
			list_item=this.options_list.getElem(op.value);
			if(list_item){
				if(op.selected){
					list_item.selected=true;
					this.selected_items_in_order.add_item(list_item.cod,list_item);	
				}
			}
   		}
		this.set_input_value_from_selector();
		
			
	}
	this.remove_selected=function(){
		var selelem=this.dest_selector;
		if(!selelem){
			return false;	
		}
		var op;
		var list_item;
		for (var i=0; i<selelem.options.length; i++) {
			op=selelem.options[i];
			list_item=this.options_list.getElem(op.value);
			if(list_item){
				if(op.selected){
					list_item.selected=false;
					this.selected_items_in_order.removeItem(list_item.cod);
				}
			}
   		}
		this.set_input_value_from_selector();
			
	}
	this.order_as_input=function(){
		return this.options.get_param_or_def("orderasinput",false);	
	}
	this.create_input_elem=function(){
		var _this=this;
		var p;
		var c=document.createElement("input");
		c.className="form-control";
		c.type="hidden";
		p=this.get_input_name();
		if(p){
			c.name=p;	
		}
		
		return c;
	}
	
	this.create_container=function(){
		var p;
		var c=document.createElement("div");
		c.className="form-group";
		this.frm_group_elem=c;

		p=this.options.get_param_or_def("lbl",false);
		if(p){
			var lbl=document.createElement("label");
			lbl.innerHTML=p;
			p=this.get_input_id();
			if(p){
				lbl.htmlFor=id;	
			}
			c.appendChild(lbl);
		}
		var inputelem=this.get_input_elem();
		if(inputelem){
			c.appendChild(inputelem);	
		}
		var e=this.create_selects_container();
		if(e){
			c.appendChild(e);	
		}
		this.create_notes_elem_if_req();
		return c;
	}
	this.create_selects_container=function(){
		var p;
		var div;
		var _this=this;
		var row=document.createElement("div");
		row.style.verticalAlign="top";
		var colsrc=document.createElement("div");
		colsrc.style.display="inline-block";
		colsrc.style.width="40%";
		
		this.src_selector=document.createElement("select");
		this.src_selector.className="form-control";
		this.src_selector.multiple=true;
		p=this.options.get_param_or_def("selectorsize","8");
		if(p){
			this.src_selector.size=p;
		}
		colsrc.appendChild(this.src_selector);
		row.appendChild(colsrc);

		var colbtns=document.createElement("div");
		colbtns.style.display="inline-block";
		colbtns.style.width="20%";
		colbtns.style.verticalAlign="top";
		
		colbtns.style.marginTop="20px";
		colbtns.style.textAlign="center";
		var btn;
		var s;
		div=document.createElement("div");
		btn=document.createElement("div");
		btn.className="btn btn-default";
		
		btn.innerHTML="<span class='glyphicon glyphicon-chevron-right' aria-hidden='false'></span> ";
		s=document.createElement("span");
		s.innerHTML="";
		btn.appendChild(s);
		btn.onclick=function(){_this.add_selected()}
		this.btn_add=btn;
		div.appendChild(btn);
		colbtns.appendChild(div);
		
		div=document.createElement("div");
		div.style.marginTop="20px";
		btn=document.createElement("div");
		btn.className="btn btn-default";
		btn.innerHTML="<span class='glyphicon glyphicon-chevron-left' aria-hidden='false'></span> ";
		s=document.createElement("span");
		s.innerHTML="";
		btn.appendChild(s);
		btn.onclick=function(){_this.remove_selected()}
		this.btn_remove=btn;
		div.appendChild(btn);
		colbtns.appendChild(div);
		
		row.appendChild(colbtns);
		
		var coldest=document.createElement("div");
		coldest.style.display="inline-block";
		coldest.style.width="40%";
		
		this.dest_selector=document.createElement("select");
		this.dest_selector.className="form-control";
		this.dest_selector.multiple=true;
		p=this.options.get_param_or_def("selectorsize","8");
		if(p){
			this.dest_selector.size=p;
		}
		coldest.appendChild(this.dest_selector);
		
		
		row.appendChild(coldest);
		
		return row;
		
		
		
	}
	this.update_display_if_created=function(){
		if(!this.src_selector){
			return false;	
		}
		if(!this.dest_selector){
			return false;	
		}
		this.refrech_lists_options();	
	}
	this.add_option_from_data=function(data){
		
		if(!mw_is_object(data)){
			return false;
		}
		if(!data.cod){
			return false;	
		}
		this.add_option(data.cod,data);
	}

	this.add_option=function(cod,option){
		if(typeof(option)!="object"){
			var n=option;
			option={cod:cod,name:n};
			
			
		}
		var i=this.options_list.addItem(option,cod);
		if(i){
			this.update_display_if_created();
			
			return i;	
		}
	}
	
	this.init(options);

}
//mw_datainput_item_elemschoise.prototype=new mw_datainput_item_abs();





