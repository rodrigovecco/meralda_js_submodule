function mw_bootstrap_helper_panel(options){
	mw_bootstrap_helper_container.call(this,options);
	this.afterAppend=function(){
		
		var p=this.options.get_param_or_def("title",false);
		
		this.set_title(p);	
		p=this.options.get_param_or_def("body",false);
		this.set_body(p);	
		p=this.options.get_param_or_def("footer",false);
		this.set_footer(p);	
		if(this.options.get_param_or_def("hideFooter",false)){
			mw_hide_obj(this.get_footer());	
		}
		this.afterAppendFinal();
	}
	this.createDomContainer=function(){
		

		var p;
		this.domContainer=document.createElement("div");
		this.domContainer.className="card card-"+this.options.get_param_or_def("display_mode","default");
		this.panel=this.domContainer;
		this.panelHeading=document.createElement("div");
		this.panelHeading.className="card-header";
		this.panel.appendChild(this.panelHeading);
		this.panelHeadingTitle=document.createElement("div");
		this.panelHeading.appendChild(this.panelHeadingTitle);
		$($(this.panelHeadingTitle)).attr({
			  style: 'cursor:pointer',
			  'data-toggle': 'collapse',
			  'data-auto-target': '.card-collapse',
			  'data-auto-target-parent': '.card',
			  'aria-expanded': 'true',
    	});
		this.panelBodyContainer=document.createElement("div");
		this.panelBodyContainer.className="card-collapse collapse in";
		this.panel.appendChild(this.panelBodyContainer);
		
		
		
		this.panelBody=document.createElement("div");
		this.panelBody.className="card-body";
		this.panelBodyContainer.appendChild(this.panelBody);
		this.panelFooter=document.createElement("div");
		this.panelFooter.className="card-footer";
		this.panelBodyContainer.appendChild(this.panelFooter);
		
        
		
		return this.domContainer;	
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
		mw_dom_set_cont(this.get_title(),cont);
		if(!cont){
			mw_hide_obj(this.panelHeading);	
		}else{
			mw_show_obj(this.panelHeading);	
		}
		
	}
	this.get_footer=function(){
		return this.panelFooter;
	}
	this.get_title=function(){
		return this.panelHeadingTitle;
	}
	this.get_body=function(){
		return this.panelBody;
	}
	
	this.show=function(){
		mw_show_obj(this.domContainer);	
			
	}
	this.hide=function(){
		mw_hide_obj(this.domContainer);	
	}
}

function mw_bootstrap_helper_modal_dialog(options){
	this.options=new mw_obj();
	if(options){
		this.options.set_params(options);
	}
	this.setDisplayType=function(dType,modal){
		var m=this.getModal(modal);
		if(m){
			m.setDisplayType(dType);	
		}
	}
	this.show=function(modal){
		var m=this.getModal(modal);
		if(m){
			m.show();	
		}
	}
	this.getModal=function(modal){
		if(modal){
			return this.setModal(modal);
		}
		return this.modal;
	}
	
	this.setModal=function(modal){
		this.modal=modal;
		this.initModal(modal);
	}
	this.initModal=function(modal){
		if(!modal){
			modal=this.modal;
		}
		if(!modal){
			return false;	
		}
		modal.set_body(this.options.get_param_or_def("message",false));
		modal.set_title(this.options.get_param_or_def("title",false));
		var _this=this;
		modal.cancelClick=function(){_this.onCancel()};
		modal.closeClick=function(){_this.onClose()};
		modal.acceptClick=function(){_this.onAccept()};
		modal.setDisplayType(this.options.get_param_or_def("type",false));
		
		return modal;
		
		
	}
	this.hide=function(){
		if(this.modal){
			this.modal.hide();	
		}
		
	}
	this.onCancel=function(){
		this.hide();
	}
	this.onClose=function(){
		this.hide();
	}
	this.onAccept=function(){
		this.hide();
	}

		
}



function mw_bootstrap_helper_modal_with_footer_inputs(options){
	mw_bootstrap_helper_modal.call(this,options);
	this.cancelClick=function(){
		this.setUserAction("cancel");
		this.hide();
	}
	this.closeClick=function(){
		this.setUserAction("close");
		this.hide();
	}
	this.acceptClick=function(){
		this.setUserAction("accept");
		console.log("Accept");	
		if(this.options.get_param_or_def("btns.accept.hideModalOnClick",false,true)){
			this.hide();	
		}
	}
	

	this.createFooterInputs=function(){
		var gr = new mw_datainput_item_btnsgroup();
		var btn;
		var _this=this;
		
		if(this.options.get_param_or_def("btns.close.enabled")){
			btn=new mw_datainput_item_btn({
				lbl:this.options.get_param_or_def("btns.close.lbl",Globalize.localize("Close")),
				display_mode:this.options.get_param_or_def("btns.close.display_mode","default"),
				onclick:function(){_this.closeClick()},
			});
			gr.addItem(btn,"close");
				
		}
		if(this.options.get_param_or_def("btns.cancel.enabled",true,true)){
		
			btn=new mw_datainput_item_btn({
				lbl:this.options.get_param_or_def("btns.cancel.lbl",Globalize.localize("Cancel")),
				display_mode:this.options.get_param_or_def("btns.cancel.display_mode","default"),
				onclick:function(){_this.cancelClick()},
			});
			gr.addItem(btn,"cancel");
		}
		if(this.options.get_param_or_def("btns.accept.enabled",true,true)){

			btn=new mw_datainput_item_btn({
				lbl:this.options.get_param_or_def("btns.accept.lbl",Globalize.localize("Accept")),
				display_mode:this.options.get_param_or_def("btns.accept.display_mode","success"),
				onclick:function(){_this.acceptClick()},
			});
			gr.addItem(btn,"accept");
		}
		
		this.footerInputs=gr;
		return gr;
	}
	this.getFooterInputs=function(){
		if(this.footerInputs){
			return this.footerInputs;	
		}
		this.createFooterInputs();
		return this.footerInputs;	
	}
	
	this.afterAppendFinal=function(){
		var inputs=this.getFooterInputs();
		var c=this.get_footer();
		if(inputs){
			if(c){
				inputs.append_to_container(c);
				mw_show_obj(c);	
			}
		}
	}
	
	
}
function mw_bootstrap_helper_modal(options){
	mw_bootstrap_helper_container.call(this,options);
	this.userResponseData={};
	
	this.onCloseDone=function(e){
		console.log("onCloseDone");
		//needs setOnCloseDoneListener
	}
	this.setOnCloseDoneListener=function(fnc){
		var o={};
		var _this=this;
		var cont=this.getJQContainer();
		if(!cont){
			return false;
		}
		if(fnc){
			
			$(cont).on('hidden.bs.modal', function (e) {fnc(_this,e)})
		}else{
			$(cont).on('hidden.bs.modal', function (e) {_this.onCloseDone(e)})
		}
		return true;
	}
	this.setUserAction=function(act){
		this.userResponseData.action=act;
	}
	this.getUserAction=function(){
		return this.userResponseData.action;
	}
	this.checkUserAction=function(act){
		var a=this.getUserAction();
		if(mw_is_array(act)){
			if(act.indexOf(a)>=0){
				return true;	
			}
			return false;
		}
		if(act==a){
			return true;	
		}
		return false;
	}
	this.afterAppend=function(){
		var p=this.options.get_param_or_def("title",false);
		
		this.set_title(p);	
		p=this.options.get_param_or_def("body",false);
		this.set_body(p);	
		p=this.options.get_param_or_def("footer",false);
		this.set_footer(p);	
		if(this.options.get_param_or_def("hideFooter",false)){
			mw_hide_obj(this.get_footer());	
		}
		this.afterAppendFinal();
	}
	this.createDomContainer=function(){
		
		this.domContainer=document.createElement("div");
		$($(this.domContainer)).attr({
			  class: 'modal fade',
			  tabindex: '-1',
			  role: this.options.get_param_or_def("role","dialog"),
    	});
		var dclass="modal-dialog "+this.options.get_param_or_def("dialogClasses","");
		
		var txt='<div class="'+dclass+'"><div class="modal-content"><div class="modal-header">';
		txt=txt+'<h4 class="modal-title"></h4>';
		if(!this.options.get_param_or_def("noHideBtn",false)){
			//txt=txt+'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';

			txt=txt+'<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
		}
		
		txt=txt+'</div><div class="modal-body"></div>';
		txt=txt+'<div class="modal-footer">';
		txt=txt+'</div></div></div>';
		this.domContainer.innerHTML=txt;
       
        
		
		return this.domContainer;	
	}
	this.setDisplayType=function(dType){
		if(dType=="default"){
			dType=false;	
		}
		if(dType=="error"){
			dType="danger";	
		}
		
		var old=this.displayType;
		this.displayType=dType;
		var elem=this.get_elem_by_class("modal-content");
		if(elem){
			if(old){
				$(elem).removeClass("alert-"+old);	
			}
			if(dType){
				$(elem).addClass("alert-"+dType);	
			}
		}
		
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
		return this.get_elem_by_class("modal-footer");	
	}
	this.get_title=function(){
		return this.get_elem_by_class("modal-title");	
	}
	this.get_body=function(){
		return this.get_elem_by_class("modal-body");	
	}
	
	this.show=function(){
		var cont=this.getJQContainer();
		if(!cont){
			return false;
		}
		this.setUserAction("open");
		$(cont).modal("show");
			
	}
	this.modalOptions=function(opts){
		var cont=this.getJQContainer();
		if(!cont){
			return false;
		}
		$(cont).modal(opts);
	}
	
	this.hide=function(){
		var cont=this.getJQContainer();
		if(!cont){
			return false;
		}
		$(cont).modal("hide");
	}
	this.set_size=function(size){
		var elem=this.get_elem_by_class("modal-dialog");
		if(!elem){
			
			return false;	
		}
		
		$(elem).removeClass("modal-lg");
		$(elem).removeClass("modal-sm");
		
		if(size=="large"){
			$(elem).addClass("modal-lg");	
		}
		if(size=="small"){
			$(elem).addClass("modal-sm");	
		}
		return true;
	}
}

function mw_bootstrap_helper_container(options){
	
	this.options=new mw_obj();
	if(options){
		this.options.set_params(options);
	}

	this.afterAppendFinal=function(){
			
	}
	this.afterAppend=function(){
		this.afterAppendFinal();	
	}
	this.appendToDocument=function(){
		return this.appendToContainer(document.body,true);	
	}
	this.appendToContainer=function(cont,once){
		var c=this.getDomContainerToAppend();
		if(!c){
			return false;	
		}
		if(!cont){
			return false;	
		}
		
		if(this.appendDone){
			if(once){
				return false;	
			}
		}
		cont.appendChild(c);
		this.afterAppend();
		this.appendDone=true;
	}
	this.createDomContainer=function(){
		this.domContainer=document.createElement("div");
		return this.domContainer;	
	}
	this.getDomContainerToAppend=function(){
		return this.getDomContainer();	
	}
	this.getDomContainer=function(){
		if(this.domContainer){
			return this.domContainer;	
		}
		this.createDomContainer();
		return this.domContainer;	
	}
	this.getJQContainer=function(){
		if(!this.domContainer){
			return false;
		}
		return $(this.domContainer);
	}
	this.get_elem_by_class=function(className){
		var cont=this.getJQContainer();
		if(!cont){
			return false;
		}
		var list=$(cont).find('.'+className);
		if(!list){
			return false;	
		}
		if(!list.length){
			return false;	
		}
		return list[0];
		
		
	}
	
}


function mw_bootstrap_helper_col(options){
	mw_bootstrap_helper_grid_base.call(this,options);
	this.onContainerCreated=function(container){
		container.className=this.getColClassName();
	}
	this.getColClassName=function(){
		var r="col-"+this.options.get_param_or_def("colSizeCod","md")+"-"+this.getColsNum();
		var p=this.options.get_param_or_def("aditionalclasses",false);
		if(p){
			r=r+" "+p;	
		}
		return r;
	}
	this.getColsNum=function(){
		var p=mw_getInt(this.options.get_param_or_def("colSpan",0));
		if(p<=0){
			return 12;
		}
		if(p>12){
			return 12;
		}
		return p;
	}

	
}


function mw_bootstrap_helper_row(options){
	mw_bootstrap_helper_grid_base.call(this,options);
	this.cols=new mw_objcol();
	this.cols_num=0;
	
	this.getCol=function(colIndex){
		var col=this.cols.get_item(colIndex);
		if(col){
			return col;	
		}
		return this.def_col;
	}
	
	this.onContainerCreated=function(container){
		container.className="row";	
		var list =this.cols.get_items_by_index();
		if(list){
			for(var i=0;i<list.length;i++){
				list[i].append2Container(container);	
			}
		}
		
	}
	this.createCols=function(){
		var list=this.options.get_param_as_list("cols");
		if(list){
			for(var i=0;i<list.length;i++){
				this.addCol(list[i]);
			}
				
		}
		if(!this.def_col){
			console.log("No cols");
			this.addCol();
		}
	}
	this.doInitElems=function(){
		this.createCols();	
	}
	this.addCol=function(options){
		if(!mw_is_object(options)){
			options={};	
		}
		var col;
		if(mw_is_object(options,"append2Container")){
			col=options;
		}else{
			col = new mw_bootstrap_helper_col(options);	
		}
		this.cols_num++;
		var id=this.cols_num;
		col.set_id(id);
		col.set_parent(this);
		this.cols.add_item(id,col);
		if(!this.def_col){
			this.def_col=col;	
		}
		return col;
	}
		
}
function mw_bootstrap_helper_grid(options){
	mw_bootstrap_helper_grid_base.call(this,options);
	this.rows=new mw_objcol();
	this.rows_num=0;
	this.getCol=function(rowIndex,colIndex){
		var row=this.getRow(rowIndex);
		if(row){
			return row.getCol(colIndex);	
		}
	}
	this.getRow=function(rowIndex){
		var row=this.rows.get_item(rowIndex);
		if(row){
			return row;	
		}
		return this.def_row;
	}
	
	this.onContainerCreated=function(container){
		var p=this.options.get_param_or_def("cssClass",false);
		//container container-fluid
		if(p){
			container.className=p;
		}
		var list =this.rows.get_items_by_index();
		if(list){
			for(var i=0;i<list.length;i++){
				list[i].append2Container(container);	
			}
		}
		
	}
	this.createRows=function(){
		var list=this.options.get_param_as_list("rows");
		if(list){
			for(var i=0;i<list.length;i++){
				this.addRow(list[i]);
			}
				
		}
		if(!this.def_row){
			console.log("No rows");
			this.addRow();
		}
	}
	this.doInitElems=function(){
		this.createRows();	
	}
	this.addRow=function(options){
		if(!mw_is_object(options)){
			options={};	
		}
		var row;
		if(mw_is_object(options,"append2Container")){
			row=options;
		}else{
			row = new mw_bootstrap_helper_row(options);	
		}
		this.rows_num++;
		var id=this.rows_num;
		row.set_id(id);
		row.set_parent(this);
		this.rows.add_item(id,row);
		if(!this.def_row){
			this.def_row=row;	
		}
		return row;
	}
	
	
}
function mw_bootstrap_helper_grid_base(options){
	this.options=new mw_obj();
	this.options.set_params(options);
	
	this.set_id=function(id){
		this.id=id;	
	}
	this.set_parent=function(parent){
		this.parent=parent;	
	}
	this.get_container=function(){
		if(!this.container){
			this.create_container();
		}
		return this.container;
	}
	this.afterAppend=function(container){
			
	}
	this.append2Container=function(container){
		if(!container){
			return false;	
		}
		var c=this.get_container();
		if(!c){
			return false;	
		}
		container.appendChild(c);
		this.afterAppend(container);
		return c;
		
	}
	this.onContainerCreated=function(container){
			
	}
	
	this.create_container=function(){
		this.initElems();
		this.container=document.createElement("div");
		this.onContainerCreated(this.container);
		return this.container;
	}
	this.doInitElems=function(){
			
	}
	
	this.initElems=function(){
		if(this.initElemsDone){
			return;	
		}
		this.initElemsDone=true;
		this.doInitElems();
	}
	
		
}
function mw_bootstrap_helper_quick_grid(){
	this.currentRow=false;
	this.currentRowColsNum=0;
	this.maxCols=12;
	this.defColspan=1;
	this.colsSize="md";
	this.setContainer=function(container){
		this.container=container;
	}
	this.addContent=function(content,colsNum){
		var col=this.addCol(colsNum);
		if(!col){
			return false;
		}
		if(content){
			col.append(content);	
		}
		return col;
	}
	this.addCol=function(colsNum){
		if(!colsNum){
			colsNum=this.defColspan;	
		}
		if(colsNum>this.maxCols){
			colsNum=this.maxCols;	
		}
		if((this.currentRowColsNum+colsNum)>this.maxCols){
			this.closeCurrentRow();
		}
		var row=this.getCurrentRow(true);
		var cl="col-"+this.colsSize+"-"+colsNum;
		this.currentRowColsNum=this.currentRowColsNum+colsNum;
		var col=$("<div class='"+cl+"'></div>");
		if(row){
			col.appendTo(row);		
		}
		return col;
		
	}
	this.getCurrentRow=function(create){
		if(this.currentRow){
			return 	this.currentRow;
		}
		if(!create){
			return false;	
		}
		this.currentRowColsNum=0;
		this.currentRow=$("<div class='row'></div>");
		if(this.container){
			this.currentRow.appendTo(this.container);	
		}
		return 	this.currentRow;
	}
	this.closeCurrentRow=function(){
		this.currentRow=false;
		this.currentRowColsNum=0;
	}
	
}
