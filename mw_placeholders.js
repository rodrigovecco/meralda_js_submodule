function mw_placeholders(data){
	mw_objcol_item_with_children_abs.call(this);
	this.addPHForMWInput=function(elem){
		if(this.modal){
			this.modal.hide();
		}
		var val=this.getStrFromFrm();
		if(!val){
			return false;
		}
		val="[["+val+"]]";
		if(!mw_is_object(elem)){
			return false;
		}
		if(mw_is_object(elem,"insertText")){
			elem.insertText(val);	
		}else{
			var n=elem.get_input_value();
			if(n){
				val=n+val;	
			}
			elem.set_input_value(val);	
		}
		
		
		
		
	}
	this.openModalForMWInput=function(elem){
		
		var data=this.prepareModalElemsFromInputStr("");
		if(!data){
			return false;	
		}
		var _this=this;
		this.modal.acceptClick=function(){
			_this.addPHForMWInput(elem);
		}

		
		
		this.modal.show();

		//this.setInputData();

	}
	
	this.getPHCodFromStrData=function(str){
		var o=this.getPHDataFromStrData(str);
		if(o){
			return o.cod;	
		}
		return false;
	}
	this.getPHDataFromStrData=function(str){
		if(!str){
			return false;	
		}
		if(mw_isNumber(str)){
			return {cod:str};
		}
		if (typeof(str)!="string"){
			return "";
		}
		var l=str.split(" ",2);
		var r={cod:l[0],paramsStr:l[1]};
		return r;
	}
	this.getDataFromStr=function(str){
		if(!str){
			return false;	
		}
		if (typeof(str)!="string"){
			return false;
		}
		var obj =false;
		try {
			obj = jQuery.parseJSON(str.trim());
		}
		finally {
			//return false;
		}
		if(mw_is_object(obj)){
			return obj;	
		}
		
		return false;
	}
	this.getStrFromData=function(obj){
		if(!mw_is_object(obj)){
			return false;	
		}
		var json_str=false;
		try {
			json_str = JSON.stringify(obj);
		}
		finally {
			//return false;
		}
		if(json_str){
			return 	json_str;
		}
		return false;
	}
	
	this.getPHDataFromStrFull=function(str){
		var o=this.getPHDataFromStrData(str);
		if(!o){
			return {cod:""};	
		}
		if(o.paramsStr){
			o.params=this.getDataFromStr(o.paramsStr);
		}
		o.ph=this.getChild(o.cod);
		return o;
	}
	this.CKSetDataFromFrmAdv=function(dialog){
		if(!dialog){
			if(this.modal){
				this.modal.hide();
			}
			return false;	
		}
		var val=this.getStrFromFrm();
		if(!val){
			val="";	
		}
		var phcod="";
		if(this.currentPH){
			phcod=this.currentPH.cod;
		}
		
		var elem=dialog.getContentElement( 'info', 'mwselectph' );
		if(elem){
			elem.setValue(phcod);	
		}
		elem=dialog.getContentElement( 'info', 'name' );
		if(elem){
			elem.setValue(val);	
		}
		if(this.modal){
			this.modal.hide();
		}
		
	}
	this.getStrFromFrm=function(){
		if(!this.currentPH){
			return "";
		}
		var r=this.currentPH.cod;
		if(this.currentPHParamsInput){
			//getInputValueIfNotEmpty
			var str=this.getStrFromData(this.currentPHParamsInput.getInputValueIfNotEmpty());
			if(str){
				r=r+" "+str;
				
			}
		}
		return r;
	}
	this.CKeditorAdvBtnOnClick=function(api,elem){
		var d=elem.getDialog();
		
		
		var data=this.prepareModalElemsFromInputStr(d.getContentElement( 'info', 'name' ).getValue());
		if(!data){
			return false;	
		}
		var _this=this;
		this.modal.acceptClick=function(){
			_this.CKSetDataFromFrmAdv(d);
		}

		
		
		this.modal.show();

		//this.setInputData();

	}
	this.prepareModalElemsFromInputStr=function(str){
		this.getModal();
		var data=this.getPHDataFromStrFull(str);
		this.setCurrentPH(data.cod);
		this.createElems();
		
		mw_dom_remove_children(this.frmContainer);
		mw_dom_remove_children(this.selectorContainer);
		mw_dom_remove_children(this.paramsContainer);
		this.frmContainer.appendChild(this.selectorContainer);
		this.frmContainer.appendChild(this.paramsContainer);
		this.selector.append_to_container(this.selectorContainer);
		this.selector.set_input_value(data.cod);	
		if(this.currentPHParamsInput){
			this.currentPHParamsInput.append_to_container(this.paramsContainer);
			this.currentPHParamsInput.set_input_value(data.params);	
		}
		return data;
		
			
	}
	this.CKeditorSelectOnchnage=function(api,elem){
		var d=elem.getDialog();
		d.getContentElement( 'info', 'name' ).setValue( this.getPHCodFromStrData(elem.getValue()) );
		
	}
	this.prepareCKeditorPHDialog=function(editor,dialog,result){
		if(!mw_is_array(result.contents)){
			return false;
		}
		if(!mw_is_array(result.contents[0].elements)){
			return false;
		}
		var _mwthis=this;
		var optlist=this.getOptionsForCKEditor();
		var e={
			id: 'mwselectph',
			type: 'select',
						
			label: Globalize.localize("Select"),
			items: optlist,
			style: 'width: 286px;',

			onChange: function( api ) {
				_mwthis.CKeditorSelectOnchnage(api,this);
			}
			
	
		}
		result.contents[0].elements.push(e);
		var e={
			id: 'mwadvbtn',
			type: 'button',
			align:"right",
						
			label: Globalize.localize("Advanced"),
			
			onClick: function( api ) {
				_mwthis.CKeditorAdvBtnOnClick(api,this);
			}
			
	
		}
		result.contents[0].elements.push(e);
		
	}
	this.getOptionsForCKEditor=function(){
		var r=[];
		var list=this.getChildren();
		if(list){
			for(var i=0;i<list.length;i++){
				r.push([list[i].get_lbl(),list[i].cod]);	
			}
		}
		return r;
			
	}
	
	this.setCurrentPH=function(cod){
		this.currentPHParamsInput=false;
		this.currentPH=false;
		mw_dom_remove_children(this.paramsContainer);
		this.currentPH=this.getChild(cod);
		if(!this.currentPH){
			return false;	
		}
		this.currentPHParamsInput=this.currentPH.getParamsInputs();
		if(this.currentPHParamsInput){
			if(this.paramsContainer){
				this.currentPHParamsInput.append_to_container(this.paramsContainer);
			}
		}
		
	}
	this.onPHselectorChanged=function(){
		var cod=false;
		if(this.selector){
			cod=this.selector.get_input_value();	
		}
		this.setCurrentPH(cod);
	}
	this.getModal=function(){
		if(this.modal){
			return 	this.modal;
		}
		this.createModal();
		return 	this.modal;
		
			
	}
	this.createModal=function(){
		if(this.modal){
			return 	this.modal;
		}
		var _this=this;
		var params=this.data.get_param_if_object("modalOptions",true);
		this.modal=new mw_bootstrap_helper_modal_with_footer_inputs(params);
		this.modal.options.set_param_default(Globalize.localize("Select"),"title");
		this.createElems();
		//
		this.modal.appendToDocument();
		this.modal.set_body(this.frmContainer);
		
		
	}
	
	this.createElems=function(){
		if(this.frmContainer){
			return 	this.frmContainer;
		}
		var _this=this;
		this.frmContainer=document.createElement("div");
		this.selectorContainer=document.createElement("div");
		this.paramsContainer=document.createElement("div");
		this.selector=new mw_datainput_item_select({cod:"ph"});
		this.selector.add_on_change_event("onch",function(){_this.onPHselectorChanged()});
		var list=this.getChildren();
		if(list){
			for(var i=0;i<list.length;i++){
				this.selector.add_option_on_fly(list[i].cod,list[i].get_lbl());	
			}
		}
		
		
	}
	
	this.set_data(data);
	this.onChildAdded=function(child,colelem){
	}
	
	this.createChild=function(data){
		if(!mw_is_object(data)){
			if (typeof(data)=="string"){
				var lbl=data;
				data={cod:lbl};
			}else{
				return false;	
			}
		}
		var ch=new mw_placeholder_item(data);
		return ch;
	}
	
	
}
function mw_placeholder_item_base(data){
	mw_objcol_item_base.call(this);
	this.set_data(data);
	this.get_lbl=function(){
		return this.data.get_param_or_def("lbl",this.cod);	
	}
	this.getParamsInputs=function(){
		return this.data.get_param_if_object("inputs");	
	}
}
function mw_placeholder_item(data){
	mw_placeholder_item_base.call(this,data);	
}

