function mw_datainput_item_group_adv(options){
	mw_datainput_item_gr_base.call(this,options);
	
}
function mw_datainput_item_group_btGrid(options){
	mw_datainput_item_gr_base.call(this,options);
	this.createBTGrid=function(){
		
		var options=this.options.get_param_if_object("btGrid");
		if(!mw_is_object(options)){
			options={};	
		}
		var btGrid;
		if(mw_is_object(options,"append2Container")){
			btGrid=options;
		}else{
			btGrid = new mw_bootstrap_helper_grid(options);	
		}
		
		this.btGrid=btGrid;
	}
	this.getBTGrid=function(){
		if(!this.btGrid){
			this.createBTGrid();	
		}
		return this.btGrid;
	}
	this.append_to_container=function(container){
		this.beforeAppend();
		var btGrid=this.getBTGrid();
		if(!btGrid){
			return false;	
		}
		btGrid.append2Container(container);
		this.container=btGrid.get_container();
		
		if(!this.sub_items_list){
			return false;	
		}
		var list=this.sub_items_list.getList();
		if(!list){
			return false;	
		}
		var col;
		var col_container;
		for(var i =0; i<list.length;i++){
			col=this.getColForChild(list[i]);
			if(col){
				col_container=col.get_container();
				if(	col_container){
					list[i].append_to_container(col_container);
				}
			}
			//list[i].append_to_container(container);
		}
		
		this.afterAppend();
		return true;
	}
	this.getColForChild=function(child){
		if(!this.btGrid){
			return false;	
		}
		return this.btGrid.getCol(child.options.get_param("parentGrid.row",0),child.options.get_param("parentGrid.col",0));
	}
	
	
}
function mw_datainput_item_group_btGridWithTitle(options){
	mw_datainput_item_group_btGrid.call(this,options);
	this.append_to_container=function(outcontainer){
		
		this.beforeAppend();
		var btGrid=this.getBTGrid();
		if(!btGrid){
			return false;	
		}
		var p_container=this.create_panel_container();
		
		container=this.childrenContainer;
		outcontainer.appendChild(p_container);
		btGrid.append2Container(container);
		this.container=btGrid.get_container();
		
		if(!this.sub_items_list){
			return false;	
		}
		var list=this.sub_items_list.getList();
		if(!list){
			return false;	
		}
		var col;
		var col_container;
		for(var i =0; i<list.length;i++){
			col=this.getColForChild(list[i]);
			if(col){
				col_container=col.get_container();
				if(	col_container){
					list[i].append_to_container(col_container);
				}
			}
		}
		
		this.afterAppend();
		return true;
	}

	this.create_panel_container=function(){
		var p;
		var c=document.createElement("div");
		c.className="card-group mwfrmgr";
		
		this.frm_group_elem=c;
		var panel=document.createElement("div");
		panel.className="card card-default";
		c.appendChild(panel);
		var panelheading=document.createElement("div");
		panelheading.className="card-header";
		panel.appendChild(panelheading);
		p=this.options.get_param_or_def("lbl","");
		panelheading.innerHTML="<div data-auto-target='.card-collapse' data-auto-target-parent='.card' data-toggle='collapse' href='#' style='cursor:pointer' aria-expanded='true'>"+p+"</div>";
		this.panelheading=panelheading;
		
		var pcolb=document.createElement("div");
		pcolb.className="card-collapse show";
		if(this.options.get_param_or_def("collapsed",false)){
			
			pcolb.className="card-collapse collapse in";	
		}
		
		panel.appendChild(pcolb);
		var pbody=document.createElement("div");
		pbody.className="card-body";
		pcolb.appendChild(pbody);
		this.children_container=pbody;
		this.childrenContainer=this.children_container;
		return c;
		
		
	}
	
	
}

function mw_datainput_item_gr_base(options){
	mw_datainput_item_base.call(this,options);
	this.append_to_container=function(container){
		this.beforeAppend();
		if(!this.sub_items_list){
			return false;	
		}
		var list=this.sub_items_list.getList();
		if(!list){
			return false;	
		}
		for(var i =0; i<list.length;i++){
			list[i].append_to_container(container);
		}
		
		this.afterAppend();
		return true;
	}
	this.validate=function(){
		var r=true;
		
		if(this.validate_omit()){
			return true;	
		}
		if(!this.doValidateSelf()){
			r=false;	
		}
		var fnc =this.options.get_param_if_function("omitChildrenValidationFnc");
		if(fnc){
			if(fnc(this)){
				return r;
			}
		}
		
		if(!this.sub_items_list){
			return r;	
		}
		var list=this.sub_items_list.getList();
		if(!list){
			return r;	
		}
		for(var i =0; i<list.length;i++){
			
			if(!list[i].validate()){
				r=false;		
			}
		}
		return r;
		//return true;
	}
	
	this.set_input_value=function(val){
		return this.set_input_value_as_group(val);
		
	}
	
	this.get_input_value=function(){
		return this.get_input_value_as_group();
	}
	this.getInputValueIfNotEmpty=function(){
		return this.get_input_value_as_group_IfNotEmpty();
	}
	

	
}



function mw_datainput_item_container(options){
	this.init(options);
	this.noValueMode=function(){
		return true;	
	}
	
	this.create_container=function(){
		var p;
		var c=document.createElement("div");
		if(this.options.get_param_or_def("childrenOnCols",false)){
			//c.className="container";
			this.childrenContainer=document.createElement("div");
			this.childrenContainer.className="row";
			c.appendChild(this.childrenContainer);
		}else{
			this.childrenContainer=c;
		}
		return c;
	}
	this.getChildCols=function(child){
		var p=mw_getInt(child.options.get_param_or_def("colsnumOnOtherContainer",0));
		if(p<=0){
			return 12;
		}
		if(p>12){
			return 12;
		}
		return p;
		
		
		
	}

	this.doAppendInputItem=function(inputItem){
		
		var e=inputItem.get_elem2appendOnOtherContainer();
		if(!e){
			console.log("no get_elem2appendOnOtherContainer",inputItem);
			return false;	
		}
		if(!this.childrenContainer){
			return false;	
		}
		if(this.options.get_param_or_def("childrenOnCols",false)){
			var c="col-md-"+this.getChildCols(inputItem);
			$( $(e) ).addClass( c );
		}
		this.childrenContainer.appendChild(e);
		
	}

	this.appendInputItem=function(inputItem){
		console.log(inputItem);
		if(!inputItem){
			return false;	
		}
		return inputItem.append2OtherContainer(this);
		

		
	}
		
}
mw_datainput_item_container.prototype=new mw_datainput_item_abs();






