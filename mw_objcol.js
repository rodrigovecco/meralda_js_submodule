function mw_objcol_item_base(){
	this.data=new mw_obj();
	this.getDebugInfo=function(){
		var r={};
		r.cod=this.cod;
		return r;
		
	}
	this.set_data=function(data){
		this.data.set_params(data);
		if(!this.cod){
			this.cod=this.data.get_param_or_def("cod");	
		}
	}
	this.init=function(){
		if(this.initDone){
			return;	
		}
		this.initDone=true;
		this.do_init();
	}
	this.do_init=function(){
	}
	
	this.set_col_item=function(colitem){
		if(this.col_item){
			return false;
		}
		this.col_item=colitem;
		if(!this.cod){
			this.cod=this.col_item.cod;	
		}
		//console.log("set_col_item "+this.cod);
	}
}
function mw_objcol_item_with_children_abs(){
	mw_objcol_item_base.call(this);
	this.children=new mw_objcol();
	this.getDebugInfo=function(){
		var r={};
		r.cod=this.cod;
		var ch=this.getChildrenDebugInfo();
		if(ch){
			r.children=ch;	
		}
		return r;
		
	}
	
	this.getChild=function(cod){
		this.init_children();
		return this.children.get_item(cod);
		
	}
	this.getChildren=function(){
		this.init_children();
		var list=this.children.get_items_by_index();	
		if(list){
			if(list.length){
				return list;	
			}
		}
	}
	this.getChildrenDebugInfo=function(){
		var list=this.getChildren();
		if(!list){
			return false;	
		}
		if(!list.length){
			return false;	
		}
		
		var r=new Array();
		var rr;
		for(var i=0;i<list.length;i++){
			if(rr=this.getChildDebugInfo(list[i])){
				r.push(rr);	
			}
		}
		return r;
	}
	this.getChildDebugInfo=function(child){
		if(mw_is_object(child)){
			if(mw_is_function(child['getDebugInfo'])){
				return 	child['getDebugInfo']();
			}
			return {cod:child.cod};
		}
		return child;
	}
	
	
	this.onChildAdded=function(child,colelem){
		//console.log("onChildAdded "+child.cod+" "+colelem.cod);	
	}
	this.init_children=function(){
		if(this.init_children_done){
			return;	
		}
		this.init_children_done=true;
		this.do_init_children();
	}
	this.do_init_children=function(){
		this.children.enable_autocod("child_");
		var _this=this;
		this.children.onItemAdded=function(child,colelem){_this.onChildAdded(child,colelem)};
		this.children.checkItemAndCreate=function(data){return _this.checkChildAndCreate(data)};
		
		this.addChildrenFromData();
	}
	this.checkChildAndCreate=function(data){
		if(mw_is_object(data,"set_data")){
			return data;
		}
		return this.createChild(data);	
		
	}
	
	this.createChild=function(data){
		return false;
	}
	
	this.addChild=function(child){
		this.init_children();
		this.children.add_item_by_obj_autocod(child);
	}
	this.addChildrenFromDataObj=function(list,pref){
		if(!mw_is_array(list)){
			return false;	
		}
		var r=new Array();
		var rr;
		for(var i=0;i<list.length;i++){
			if(rr=this.createChild(list[i])){
				r.push(rr);	
			}
		}
		return this.addChildren(r,pref);
			
	}

	this.addChildren=function(list,pref){
		this.init_children();
		return this.children.add_items_by_list_autocod(list,pref);	
	}

	this.addChildrenFromData=function(){
		this.addChildren(this.data.get_param_as_list("children"));	
	}
}

function mw_objcol_item_with_children_base(data){
	mw_objcol_item_with_children_abs.call(this);
	this.set_data(data);
	this.createChild=function(data){
		var ch=new mw_objcol_item_with_children_base(data);
		return ch;
	}
	this.getDebugInfo=function(){
		var r={};
		r.cod=this.cod;
		r.className="mw_objcol_item_with_children_base";
		var ch=this.getChildrenDebugInfo();
		if(ch){
			r.children=ch;	
		}
		return r;
		
	}
	
	this.init();
}


function mw_objcol(){
	this.items_mans_by_cod=new Object;
	this.items_mans_by_index=new Array;
	this.items_num=0;
	this.next_auto_cod_index=0;
	this.current_item_index=-1;
	this.auto_cod_pref="__auto_cod_";
	this.auto_cod_enabled=false;
	////////
	this.resetCursor=function(){
		var info={
			old:this.current_item_index,
			moveTo:null,
			current:-1,
			
		};
		
		this.current_item_index=-1;
		this.onCurrentItemChanged(info);
	}
	this.getFirstItem=function(){
		return this.setCurrentItemIndex(0,false);	
	}
	this.getLastItem=function(){
		return this.setCurrentItemIndex(this.items_num-1,false);	
	}
	this.getActualCurrentItem=function(){
		return this.get_item_by_index(this.current_item_index);
		
	}
	this.getCurrentItem=function(){
		
		
		return this.setCurrentItemIndex(0,true);
	}
	this.getNextItem=function(){
		return this.setCurrentItemIndex(1,true);
	}
	this.getPrevItem=function(){
		return this.setCurrentItemIndex(-1,true);
	}
	this.getItemByPos=function(index,relative){
		if(relative){
			index=index+this.current_item_index;	
		}
		return this.get_item_by_index(index);
	}
	this.setCurrentItemIndex=function(index,relative){
		var info={
			old:this.current_item_index,
			moveTo:index,
			relative:relative,
			
		};
		if(relative){
			index=index+this.current_item_index;	
		}
		if(index>=this.items_num){
			return false;	
		}
		if(this.items_num<=0){
			return false;	
		}
		if(index<0){
			return false;	
		}
		var i=this.get_item_by_index(index);
		if(!i){
			return false;	
		}
		this.current_item_index=index;
		info.current=this.current_item_index;
		this.onCurrentItemChanged(info);
		return i;
	}
	this.onCurrentItemChanged=function(info){
		var changed=false;
		if(info){
			if(info.old!=info.current){
				changed=true;
				info.changed=true;
			}
		}
		//console.log("onCurrentItemChanged",info);
	}
	
	
	
	
	
	/////////////////
	this.compare=function(otherCol,newItemsResult,removedItemsResult,existingResult){
		return this.compareCols(this,otherCol,newItemsResult,removedItemsResult,existingResult);
	}
	this.compareCols=function(a,b,onlyOnA,onlyOnB,onBoth){
		
		
		var fnc;
		if(!mw_is_object(onlyOnA)){
			fnc=onlyOnA;
			onlyOnA=new mw_objcol();
			if(mw_is_function(fnc)){
				onlyOnA.onItemAdded=fnc;
			}
		}
		if(!mw_is_object(onlyOnB)){
			fnc=onlyOnB;
			onlyOnB=new mw_objcol();
			if(mw_is_function(fnc)){
				onlyOnB.onItemAdded=fnc;
			}
		}
		if(!mw_is_object(onBoth)){
			fnc=onBoth;
			onBoth=new mw_objcol();
			if(mw_is_function(fnc)){
				onBoth.onItemAdded=fnc;
			}
		}
		var aCods=a.get_cods();
		var bCods=b.get_cods();
		var eItem;
		var cod;
		var temponbothcods={};
		for(var i=0;i<aCods.length;i++){
			cod=aCods[i];
			if(eItem=b.get_item(cod)){
				onBoth.add_item(cod,eItem);
				temponbothcods[cod]=cod;
			}else{
				if(eItem=a.get_item(cod)){
					onlyOnA.add_item(cod,eItem);
				}
			}
		}
		for(i=0;i<bCods.length;i++){
			cod=bCods[i];
			if(!temponbothcods[cod]){
				if(eItem=b.get_item(cod)){
					onlyOnB.add_item(cod,eItem);
				}
			}
		}
		var changes=onlyOnA.items_num+onlyOnB.items_num;
		
		var r={
			changesNum:onlyOnA.items_num+onlyOnB.items_num,
			newItemsNum:onlyOnA.items_num,//onlyExist here
			removedItemsNum:onlyOnB.items_num, //do not exist here
			existingNum:onBoth.items_num,//
			thisListNum:a.items_num,
			comparedListNum:b.items_num,//onlyExist here
			newItems:onlyOnA,//onlyExist here
			removedItems:onlyOnB, //do not exist here
			existing:onBoth//
		};
		return r;
	}
	
	this.onItemAdded=function(child,colelem){
		//console.log("onItemAdded "+child.cod+" "+colelem.cod);		
	}
	this.get_sorted_managers=function(sortFnc){
		//var manSort
		var new_list=new Array;
		var citem;
		for(var i=0;i<this.items_mans_by_index.length;i++){
			citem=this.items_mans_by_index[i];
			new_list.push(citem);
			
		}
		
		if(!mw_is_function(sortFnc)){
			return new_list;
		}
		new_list.sort(function(a,b){
			return 	sortFnc(a.get_item(),b.get_item());
		});
		return new_list;
		
		
	}
	this.sort_items=function(sortFnc){
		var list=this.get_sorted_managers(sortFnc);
		if(!list){
			return false;	
		}
		var new_list=new Array;
		var citem;
		for(var i=0;i<list.length;i++){
			citem=list[i];
			new_list.push(citem);
			
		}
		this.items_mans_by_index=new_list;
		
		return new_list;
			
	}
	this.get_sorted_items=function(sortFnc){
		var list=this.get_sorted_managers(sortFnc);
		if(!list){
			return false;	
		}
		var new_list=new Array;
		var citem;
		for(var i=0;i<list.length;i++){
			citem=list[i];
			new_list.push(citem.get_item());
			
		}
		return new_list;
		
	}
	
	this.get_items_mans=function(){
		return this.items_mans_by_index;	
	}
	this.exec_fnc_on_items=function(fnc){
		return mw_objcol_array_process(this.get_items_by_index(),fnc);	
	}
	this.get_items_by_index_reverse=function(){
		var new_list=new Array;
		var citem;
		for(var i=(this.items_mans_by_index.length-1);i>=0;i--){
			citem=this.items_mans_by_index[i];
			new_list.push(citem.get_item());
			
		}
		return new_list;
	}
	this.get_cods=function(){
		var new_list=new Array;
		var citem;
		for(var i=0;i<this.items_mans_by_index.length;i++){
			citem=this.items_mans_by_index[i];
			new_list.push(citem.cod);
			
		}
		return new_list;
	}
	
	this.get_items_by_index=function(){
		var new_list=new Array;
		var citem;
		for(var i=0;i<this.items_mans_by_index.length;i++){
			citem=this.items_mans_by_index[i];
			new_list.push(citem.get_item());
			
		}
		return new_list;
	}
	this.get_items_by_cod=function(){
		var new_list=new Object;
		var citem;
		var cod;
		for(var i=0;i<this.items_mans_by_index.length;i++){
			citem=this.items_mans_by_index[i];
			cod=citem.cod;
			new_list[cod]=citem.get_item();
			
		}
		return new_list;
	}

	this.get_item=function(cod){
		var m=this.get_item_man(cod);
		if(!m){
			return false;	
		}
		return m.get_item();
		
	}
	this.get_item_by_index=function(index){
		var m=this.get_item_man_by_index(index);
		if(!m){
			return false;	
		}
		return m.get_item();
	}
	this.get_item_man_by_index=function(index){
		if(index>=this.items_num){
			return false;	
		}
		if(this.items_num<=0){
			return false;	
		}
		if(index<0){
			return false;	
		}
		return this.items_mans_by_index[index];
		
	}
	this.get_item_man=function(cod){
		if(!cod){
			return false;	
		}
		if(this.items_mans_by_cod[cod]==undefined){
			return false;
		}
		return this.items_mans_by_cod[cod];
	}
	this.enable_autocod=function(pref){
		if(pref){
			this.auto_cod_pref=pref;	
		}
		this.auto_cod_enabled=true;
	}
	this.get_next_auto_cod_if_enabled=function(){
		if(!this.auto_cod_enabled){
			return false;	
		}
		return this.get_next_auto_cod();
	}
	this.get_next_auto_cod=function(){
		this.next_auto_cod_index++;
		var cod=this.auto_cod_pref+this.next_auto_cod_index;
		while(this.get_item_man(cod)){
			//console.log(cod+" exists");
			this.next_auto_cod_index++;
			cod=this.auto_cod_pref+this.next_auto_cod_index;
				
		}
		//console.log(cod+" new");
		return cod;
	}
	
	this.add_item=function(cod,citem,dontoverwrite,omitonadded){
		cod=this.check_cod(cod);
		if(!cod){
			cod=this.get_next_auto_cod_if_enabled();
			if(!cod){
				return false;
			}
			//console.log(cod);
		}
		var man=new mw_objcol_item(cod,citem,this.items_num,this);
		var existing=this.get_item_man(cod);
		if(existing){
			if(dontoverwrite){
				return false;	
			}
			var index=existing.index;
			man.index=index;
			this.items_mans_by_cod[cod]=man;
			this.items_mans_by_index[index]=man;
			if(!omitonadded){
				this.onItemAdded(citem,man);
			}
			return man;
			
		}
		this.items_mans_by_cod[cod]=man;
		this.items_mans_by_index.push(man);
		this.items_num++;
		if(!omitonadded){
			this.onItemAdded(citem,man);
		}
		return man;
	}
	this.add_item_by_obj_autocod=function(citem,dontset,dontoverwrite){
		var set=true;
		if(dontset){
			set=false;	
		}
		return this.add_item_by_obj(citem,set,dontoverwrite,true,true);
	}
	this.add_items_by_list_autocod=function(list,pref,dontset,dontoverwrite){
		var set=true;
		if(dontset){
			set=false;	
		}
		this.enable_autocod(pref);
		return this.add_items_by_list(list,set,dontoverwrite,true,true);
	}
	
	this.add_items_by_list=function(list,set,dontoverwrite,autocodifenabled,checkitemandcreate){
		if(!mw_is_array(list)){
			return false;	
		}
		var r=new Array();
		var rr;
		for(var i=0;i<list.length;i++){
			if(rr=this.add_item_by_obj(list[i],set,dontoverwrite,autocodifenabled,checkitemandcreate)){
				r.push(rr);	
			}
		}
		return r;
	}
	this.checkItemAndCreate=function(data){
		//extender
		if(!mw_is_object(data)){
			return false;
		}
		return data;
		
	}
	this.add_item_by_obj=function(citem,set,dontoverwrite,autocodifenabled,checkitemandcreate){
		if(checkitemandcreate){
			citem=this.checkItemAndCreate(citem);	
		}
		if(!mw_is_object(citem)){
			return false;
		}
		var cod=this.get_cod_from_item(citem);
		cod=this.check_cod(cod);
		if(!cod){
			if(autocodifenabled){
				cod=this.get_next_auto_cod_if_enabled();	
			}
		}
		
		if(!cod){
			return false;
		}
		
		if(set){
			return this.add_item_and_set(citem,cod,dontoverwrite);	
		}else{
			return this.add_item(cod,citem,dontoverwrite);		
		}
		
	}
	
	this.add_item_and_set=function(citem,cod,dontoverwrite){
		cod=this.check_cod(cod);
		if(!cod){
			cod=this.get_cod_from_item(citem);
		}
		if(!cod){
			return false;
		}
		var colitem=this.add_item(cod,citem,dontoverwrite,true);
		if(!colitem){
			return false;	
		}
		this.set_col_item(citem,colitem);
		this.onItemAdded(citem,colitem);
		return colitem;
		
	}
	this.set_col_item=function(citem,colitem){
		if(citem["set_col_item"]){
			if(typeof(citem["set_col_item"])=="function"){
				
				citem.set_col_item(colitem);
				return true;
			}
		}
			
	}
	this.check_cod=function(cod){
		if(cod==undefined){
			return false;
		}
		if(!cod){
			return false;
		}
		if(cod.toString().length>0){
			return cod.toString();	
		}
		return false;
			
	}
	this.get_cod_from_item_prop=function(citem,prop){
		var cod;
		if(citem[prop]){
			if(typeof(citem[prop])=="function"){
				cod=this.check_cod(citem[prop]());
				if(cod){
					return cod;	
				}
					
			}else if(typeof(citem[prop])!="object"){
				cod=this.check_cod(citem[prop]);
				if(cod){
					return cod;	
				}
					
			}
		}
		return false;
			
	}
	this.get_cod_from_item_props=function(citem,list){
		var cod;
		for(var i=0;i<list.length;i++){
			cod=this.get_cod_from_item_prop(citem,list[i]);
			if(cod){
				return cod;	
			}
		}
		return false;
	}

	this.get_cod_from_item=function(citem){
		if(!citem){
			return false;	
		}
		if(typeof(citem)!="object"){
			return false;	
		}
		var cod=this.get_cod_from_item_props(citem,["get_cod","get_id","cod","id"]);
		if(cod){
			return cod;	
		}
		return false;
		
	}

	
	this.has_data=function(){
		if(this.items_num>0){
			return true;
		}
		return false;
	}
	this.reset=function(){
		this.items_mans_by_cod=new Object;
		this.items_mans_by_index=new Array;
		this.items_num=0;
			
	}
	this.removeItem=function(cod){
		var e=this.get_item_man(cod);
		if(!e){
			return false;	
		}
		e.deleted=true;
		return this.rebuild_list();
		
	}
	this.rebuild_list=function(){
		var new_list=new Array;
		var new_list_obj=new Object;
		var citem;
		var cod;
		var done=false;
		this.items_num=0;
		for(i=0;i<this.items_mans_by_index.length;i++){
			citem=this.items_mans_by_index[i];
			cod=citem.cod;
			if(!citem.deleted){
				this.items_num++;
				new_list.push(citem);
				new_list_obj[cod]=citem;
			}
		}
		for(i=0;i<new_list.length;i++){
			new_list[i].index=i;	
		}
		this.items_mans_by_index=new_list;
		this.items_mans_by_cod=new_list_obj;
		return true;
		
			
	}
	this.mov2pos=function(item1,pos){
		pos=mw_getInt(pos);
		if(pos>=this.items_mans_by_index.length){
			pos=this.items_mans_by_index.length-1;
		}
		if(pos<0){
			pos=0;	
		}
		if(item1.index==pos){
			return false;	
		}
		var new_list=new Array;
		var citem;
		var i;
		var done=false;
		
		for(i=0;i<this.items_mans_by_index.length;i++){
			citem=this.items_mans_by_index[i];
			if(!done){
				if(i==pos){
					if(item1.index>pos){
						new_list.push(item1);
						done=true;	
					}
				}
			}
			if(citem.index!=item1.index){
				new_list.push(citem);	
			}
			if(!done){
				if(i==pos){
					if(item1.index<pos){
						new_list.push(item1);
						done=true;	
					}
				}
			}
			
		}
		for(i=0;i<new_list.length;i++){
			new_list[i].index=i;	
		}
		this.items_mans_by_index=new_list;
		return true;

		
	}
	this.swap=function(item1,item2){
		if(!item1){
			return false;	
		}
		if(!item2){
			return false;	
		}
		if(item1.index==item2.index){
			return false;	
		}
		if(item1.cod==item2.cod){
			return false;	
		}
		
		var new_list=new Array;
		var citem;
		for(var i=0;i<this.items_mans_by_index.length;i++){
			citem=this.items_mans_by_index[i];
			if(citem.cod==item1.cod){
				citem=item2;	
			}else if(citem.cod==item2.cod){
				citem=item1;
			}
			citem.index=i;
			new_list.push(citem);
			
		}
		this.items_mans_by_index=new_list;
		return true;
	}
	this.get_first_item=function(){
		return this.get_item_by_index(0);	
	}
	this.get_last_item=function(){
		if(!this.items_num){
			return false;	
		}
		return this.get_item_by_index(this.items_num-1);	
	}
	
}
function mw_objcol_item(cod,citem,index,col){
	this.index=index;
	this.cod=cod;
	this.item=citem;
	this.col=col;
	this.deleted=false;
	this.get_item=function(){
		return this.item;	
	}
	
	
	this.get_rel_item_man=function(pos){
		var i=pos+this.index;
		return this.col.get_item_man_by_index(i);	
	}
	this.get_prev_or_last=function(){
		if(this.is_first()){
			return 	this.col.get_last_item();	
		}else{
			return this.get_prev();	
		}
	}
	this.get_next_or_first=function(){
		if(this.is_last()){
			return 	this.col.get_first_item();	
		}else{
			return this.get_next();	
		}
	}
	
	this.get_prev=function(){
		return this.get_rel_item(-1);	
	}
	this.get_next=function(){
		return this.get_rel_item(1);	
	}
	this.get_rel_item=function(pos){
		var m=this.get_rel_item_man(pos);
		if(m){
			return m.get_item();	
		}
		return false;
	}
	
	this.is_first=function(){
		if(this.index==0){
			return true;	
		}
		return false;
	}
	this.is_last=function(){
		if(this.index>=(this.col.items_num-1)){
			return true;	
		}
		return false;
	}
	this.is_unique=function(){
		if(this.is_first()){
			if(this.is_last()){
				return true;	
			}
		}
		return false;
	}
	this.get_other_item_man=function(id){
		if(!id){
			return false;	
		}
		if(id==this.cod){
			return false;	
		}
		var other=this.col.get_item_man(id);
		if(other){
			return other;
		}
		return false;	
		
	}
	this.moveBefore=function(id){
		var other=this.get_other_item_man(id);
		if(!other){
			return false;
		}
		return this.mov2pos(other.index);
	}
	
	this.moveAfter=function(id){
		var other=this.get_other_item_man(id);
		if(!other){
			return false;
		}
		return this.mov2pos(other.index+1);
	}
	this.mov2start=function(){
		return this.mov2pos(0);
	}
	this.mov2end=function(){
		return this.mov2pos(this.col.items_num);
	}
	
	this.mov2pos=function(pos){
		return this.col.mov2pos(this,pos);
	}
	this.mov_back=function(){
		return this.swap_by_pos(-1);
	}
	this.mov_forward=function(pos){
		return this.swap_by_pos(1);	
	}
	this.swap_by_pos=function(pos){
		var other=this.get_rel_item_man(pos);
		return this.col.swap(this,other);
	}
	
}
function mw_objcol_array_processor(){
	this.queuIndex=0;
	this.queuDelay=0;
	
	this.process_elem=function(elem,index){
		return index;
	}
	
	this.abortQueu=function(){
		this.unsetQueuTimeout();
		this.aborted=true;
		this.queuIndex=0;
		this.queuList=new Array();
		
	}
	this.unsetQueuTimeout=function(){
		if(this.queuTimeout){
			clearTimeout(this.queuTimeout);	
			this.queuTimeout=false;
		}
	}
	this.createQueue=function(list,fnc){
		this.abortQueu();
		if(fnc){
			this.process_elem=fnc;	
		}
		if(mw_is_array(list)){
			this.queuList=list;
		}
	
	}
	this.onQueuReady=function(){
			
	}
	this.runQueu=function(){
		this.aborted=false;
		this.queuIndex=0;
		this.unsetQueuTimeout();
		this.doNextQueuNow();
	}
	this.doNextQueu=function(){
		this.unsetQueuTimeout();
		if(this.aborted){
			return false;	
		}
		if(!this.queuList){
			return false;	
		}
		if(this.queuList.length<=this.queuIndex){
			this.onQueuReady();
			return	
		}
		
		if(!this.queuDelay){
			this.doNextQueuNow();	
		}else{
			var _this=this;
			this.queuTimeout=setTimeout(function(){_this.doNextQueuNow()},this.queuDelay);
		}
		
	}
	this.doNextQueuNow=function(){
		if(this.aborted){
			return false;	
		}
		if(!this.queuList){
			return false;	
		}
		//console.log("doing",this.queuIndex);
		if(this.queuList.length<=this.queuIndex){
			this.onQueuReady();
			return	
		}
		
		this.process_elem(this.queuList[this.queuIndex],this.queuIndex);
		this.queuIndex++;
		this.doNextQueu();
		
	}
	
	
	this.process_list=function(list){
		if(!mw_is_array(list)){
			return false;	
		}
		var r=new Array();
		for(var i=0;i<list.length;i++){
			r.push(this.process_elem(list[i],i));
			
		}
		return r;
	
	}
}
function mw_objcol_array_process(list,fnc){
	var p = new mw_objcol_array_processor();
	if(mw_is_function(fnc)){
		p.process_elem=fnc;	
	}
	return p.process_list(list);
	
}

function mw_js_optim_create(ops){
	if(!mw_is_object(ops)){
		return false;
	}
	if(mw_is_function(ops["get_key_cod"])){
		return ops;
	}
	return new mw_js_optim_data(ops.keys,ops.data,ops.params);
}

function mw_js_optim_data(keys,data,params){
	this.keys=keys;
	this.data=data;
	this.params=new mw_obj();
	this.params.set_params(params);
	
	this.get_data_col_item=function(cod){
		this.init_data_col();
		return 	this.data_col.get_item(cod);
			
	}
	this.get_data_col=function(){
		this.init_data_col();
		return 	this.data_col;
	}
	this.init_data_col=function(){
		if(this.data_col){
			return;
		}
		this.data_col=new mw_objcol();
		var list=this.get_all_data();
		if(!list){
			return false;	
		}
		var cod;
		for(var i=0;i<list.length;i++){
			cod=this.get_elem_cod(list[i]);
			if(cod){
				this.data_col.add_item(cod,list[i]);	
			}
		}
	
		
	}
	
	this.get_key_cod=function(){
		this.init_params_for_object_creation();
		return this.key_cod;
	}
	this.init_params_for_object_creation=function(){
		if(this.init_params_for_object_creation_done){
			return;	
		}
		this.init_params_for_object_creation_done=true;
		if(!this.key_cod){
			this.key_cod=this.params.get_param_if_string("key",false);
			
		}
		
		if(!this.object_creation_function){
			var fnc=this.params.get_param_if_function("create_object");
			if(fnc){
				this.object_creation_function=fnc;	
			}
		}
	}
	
	this.create_elem_object=function(data){
		this.init_params_for_object_creation();
		if(this.object_creation_function){
			return 	this.object_creation_function(data);
		}
		return data;
	}
	this.add2objcol=function(col,set_col_item){
		this.init_params_for_object_creation();
		var list=this.get_all_data();
		if(!list){
			return false;	
		}
		var cod;
		var elem;
		var num=0;
		for(var i=0;i<list.length;i++){
			elem=this.create_elem_object(list[i]);
			if(elem){
				cod=this.get_elem_cod(list[i]);
				
				if(cod){
					if(set_col_item){
						if(col.add_item_and_set(elem,cod)){
							num++;	
						}
						
					}else{
						if(col.add_item(cod,elem)){
							num++;	
						}
					}
				}
			}
		}
		
		return num;
		
		
	}
	
	this.get_all_data_as_objects=function(){
		this.init_params_for_object_creation();
		var list=this.get_all_data();
		if(!list){
			return false;	
		}
		var elem;
		var r=new Array();
		for(var i=0;i<list.length;i++){
			elem=this.create_elem_object(list[i]);
			if(elem){
				r.push(elem);
			}
		}
		
		return r;
		
		
	}
	
	this.get_elem_cod=function(data){
		var k=this.get_key_cod();
		if(!k){
			return false;	
		}
		return data[k]+"";
	}
	

	
	
	
	this.check_keys=function(){
		if(this._check_keys_done){
			return this._check_keys_ok;	
		}
		this._check_keys_done=true;
		this._check_keys_ok=false;
		if(mw_is_array(this.keys)){
			this._check_keys_ok=true;
		}
		return this._check_keys_ok;
	}
	this.check_data=function(){
		if(this._check_data_done){
			return this._check_data_ok;	
		}
		this._check_data_done=true;
		this._check_data_ok=false;
		if(mw_is_array(this.data)){
			this._check_data_ok=true;
		}
		return this._check_data_ok;
	}
	this.check=function(){
		if(!this.check_keys()){
			return false;
		}
		if(!this.check_data()){
			return false;
		}
		return true;
		
	}
	this.get_data_obj=function(d){
		if(!d){
			return false;	
		}
		if(typeof(d)!="object"){
			return false;	
		}
		if(!d["length"]){
			return false;
		}
		var o={};
		for(var ii=0;ii<this.keys.length;ii++){
			o[this.keys[ii]]=d[ii];
		}
		return o;
		
	}
	
	this.get_all_data=function(){
		if(!this.data_list_loaded){
			this.data_list=this.load_all_data();
			this.data_list_loaded=true;
		}
		return this.data_list;	
	}
	this.load_all_data=function(){
		if(!this.check()){
			return false;
		}
		var list=new Array();
		var o;
		for(var i=0;i<this.data.length;i++){
			o=this.get_data_obj(this.data[i]);
			if(o){
				list.push(o);	
			}
			
		}
		return list;
			
	}
}




