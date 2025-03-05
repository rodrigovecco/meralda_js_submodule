function mw_arraylist(){
	this.addOptions2select=function(selectinput,dontaddempty,dontremoveexisting){
		if(!selectinput){
			return false;	
		}
		var i;
		if(!dontremoveexisting){
			selectinput.selectIndex=0;
			for(i=selectinput.options.length-1;i>=0;i--){
				selectinput.remove(i);
			}
		}
		if(!dontaddempty){
			selectinput.appendChild(document.createElement('option'));	
		}
		var l=this.getElemsList();
		if(!l){
			return false;
		}
		for(i =0; i<l.length;i++){
			l[i].add_2_select_options(selectinput);	
		}
		
	}
	this.import_from_other=function(other){
		var list=other.getElemsList();
		if(!list){
			return false;	
		}
		var cod;
		var elem;
		for(var i =0; i<list.length;i++){
			cod=list[i].cod;
			elem=list[i].elem;
			this.addItem(elem,cod);
		}
	
	}

};

mw_arraylist.prototype.initData=function(){
	if(this.data_init_done){
		return;	
	}
	this.data_init_done=true;
	this.data_list=new Array();
	this.cod_list=new Array();
	this.data_map=new Object();
	this.items=new Object();
	this.def_code_pref="item";
	this.new_def_cod_index=1;
	this.selected_item_index=-1;
}
mw_arraylist.prototype.reset=function(){
	this.initData();
	this.data_list=new Array();
	this.cod_list=new Array();
	this.data_map=new Object();
	this.items=new Object();
	this.selected_item_index=-1;
	
}
mw_arraylist.prototype.removeItem=function(cod){
	var elem=this.getElem(cod);
	if(!elem){
		return false;	
	}
	elem.deleted=true;
	var l=this.getElemsList();
	if(!l){
		return false;
	}
	this.data_list=new Array();
	this.cod_list=new Array();
	this.data_map=new Object();
	this.items=new Object();
	this.selected_item_index=-1;
	//var r=new Array();
	var nelem;
	for(var i =0; i<l.length;i++){
		nelem=l[i];
		if(!nelem.deleted){
			this.addElem(nelem);
		}
	}
	return elem;
	
	

}
mw_arraylist.prototype.getItemsNum=function(){
	if(!this.data_init_done){
		return 0;	
	}
	return this.data_list.length;
	
}
mw_arraylist.prototype.getMap=function(){
	if(this.getItemsNum()<=0){
		return false;	
	}
	return this.data_map;
}
mw_arraylist.prototype.setSelectedItemByCod=function(cod){
	this.selected_item_index=-1;
	var elem=this.getElem(cod);
	if(!elem){
		return false;	
	}
	this.selected_item_index=elem.index;
	return elem.elem;
	
}

mw_arraylist.prototype.getSelectedItemByIndex=function(i){
	i=mw_getInt(i);
	var ii=this.selected_item_index+i;
	return this.getItemByIndex(ii);

}
mw_arraylist.prototype.getItemByIndex=function(i){
	var n=this.getItemsNum();
	if(i<0){
		return false;	
	}
	if(n<=0){
		return false;	
	}
	if(i>=n){
		return false;	
	}
	
	return this.data_list[i].elem;
	

}

mw_arraylist.prototype.getItem=function(cod){
	var e=this.getElem(cod);
	if(!e){
		return false;	
	}
	return e.elem;
}
mw_arraylist.prototype.getElem=function(cod){
	if(!cod){
		return false;
	}
	if(this.getItemsNum()<=0){
		return false;	
	}
	return this.data_map[cod];
}

mw_arraylist.prototype.getElemsList=function(){
	if(this.getItemsNum()<=0){
		return false;	
	}
	return this.data_list;
}
mw_arraylist.prototype.itemExists=function(cod){
	if(!cod){
		return false;	
	}
	if(!this.data_init_done){
		return false;	
	}
	if(this.data_map[cod]){
		return true;	
	}
	return false;
}
mw_arraylist.prototype.createNewDefCode=function(){
	var n=this.def_code_pref+this.new_def_cod_index;
	this.new_def_cod_index++;
	while(this.itemExists(n)){
		n=this.def_code_pref+this.new_def_cod_index;
		this.new_def_cod_index++;
	}
	return n;
}
mw_arraylist.prototype.newElem=function(index,cod,eitem){
	var elem=new mw_arraylist_item(this,index,cod,eitem);
	return elem;
}
mw_arraylist.prototype.addElem=function(elem){
	this.initData();
	var cod=elem.cod;
	elem.index=this.data_list.length;
	var eitem=elem.elem;
	this.data_map[cod]=elem;
	this.items[cod]=eitem;
	
	this.data_list.push(elem);
	this.cod_list.push(cod);
	return elem;
		
}

mw_arraylist.prototype.addItem=function(eitem,cod){
	this.initData();
	if(!cod){
		cod=this.createNewDefCode(cod);	
	}
	if(this.itemExists(cod)){
		return false;	
	}
	var i=this.data_list.length;
	var elem=this.newElem(i,cod,eitem);
	return this.addElem(elem);
}
mw_arraylist.prototype.getHTMLInfo=function(){
	var r="<div>";
	var l=this.getElemsList();
	if(l){
		for(var i =0; i<l.length;i++){
			r=r+l[i].getHTMLInfo();	
		}
	}
	r=r+"</div>";
	return r;
}

mw_arraylist.prototype.getList=function(){
	var l=this.getElemsList();
	if(!l){
		return false;
	}
	var r=new Array();
	for(var i =0; i<l.length;i++){
		r.push(l[i].elem);	
	}
	return r;
}
function mw_arraylist_item(man,index,cod,eitem){
	this.man=man;
	this.cod=cod;
	this.elem=eitem;
	this.index=index;
	this.deleted=false;
	this.getHTMLInfo=function(){
		return "<div><b>"+this.index+"</b> "+this.cod+"</div>";
	}
	this.add_2_select_options=function(selectinput){
		if(!selectinput){
			return false;	
		}
		var option=this.create_select_option();
		if(!option){
			return false;	
		}
		selectinput.appendChild(option);
		return option;
			
	}
	this.get_elem_method_result=function(method){
		if(this.elem){
			if(this.elem[method]){
				if(typeof(this.elem[method])=="function"){
					return this.elem[method]();	
				}
			}
		}
		return false;
		
	}
	this.get_select_option_lbl=function(){
		if(this.name){
			return this.name+"";	
		}
		var r;
		r=this.get_elem_method_result("get_select_option_lbl");
		if(r){
			return r+"";
		}
		r=this.get_elem_method_result("get_name");
		if(r){
			return r+"";
		}
		if(this.elem["name"]){
			return 	this.elem["name"]+"";
		}
		return this.cod+"";
	}
	
	this.create_select_option=function(){
		
		var option=document.createElement('option');
		option.innerHTML = this.get_select_option_lbl()+"";
		option.value = this.cod;
		return option;
		
	
	}
	
}

