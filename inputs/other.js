function mw_datainput_helper_value_validator(newValue,oldValue){
	
	this.init=function(newValue,oldValue){
		this.setNewValue(newValue);
		this.setOldValue(oldValue);
		
		
	}
	this.setOldValue=function(value){
		this.oldValue=this.newValueObject(value);
			
	}
	this.setNewValue=function(value){
		this.newValue=this.newValueObject(value);
			
	}
	this.newValueObject=function(value){
		var o={};
		o.value=value;
		o.stringValue=value+"";
		o.numericValue=mw_getNumber(value);
		o.intValue=mw_getInt(value);
		o.isEmpty=this.isEmptyString(value);
		o.isNumber=mw_isNumber(value);
		return o;
		
		
	}
	this.isEmptyString=function(val){
		if(typeof(val)=="string"){
			if(val==""){
				return true;
			}
		}
		return false;
	}
	
	
	this.init(newValue,oldValue);	
}

function mw_datainput_item_with_placeholders(options,dontinit){
	mw_datainput_item_abs.call(this);
	//

	//mw_datainput_item_base.call(this,options);
	this.onRightBtnClick=function(){
		var fnc=this.options.get_param_if_function("rightBtn.onclick");
		if(fnc){
			fnc(this);	
		}
		var m=this.getPHMan();
		if(m){
			m.openModalForMWInput(this);	
		}
		
			
	}
	this.getPHMan=function(){
		return this.options.get_param_if_object("placeholderman");	
	}
	this.initPlaceholdersManFromParams=function(){
		this.options.set_param_default(true,"rightBtn.enabled");	
		this.options.set_param_default("glyphicon glyphicon-flag","rightBtn.iconClass");	
		//console.log(this.options.params);
	}
	this.afterInit=function(){
		this.initPlaceholdersManFromParams();	
	}
	this.insertText=function(txt){
		if(!txt){
			return false;	
		}
		var input=this.input_elem;
		if(!input){
			return false;	
		}
		txt=txt+"";
		input.focus();
		var newval="";
		var endpos=0;
		if ('selectionStart' in input) {
			var len = input.value.length;
			var start = input.selectionStart;
			var end = input.selectionEnd;
			var sel = input.value.substring(start, end);
			endpos=start+txt.length;
			newval=input.value.substring(0,start) + txt + input.value.substring(end,len);
		}else{
			newval=input.value+txt;
		}
		this.set_input_value(newval);
		input.focus();
		if(endpos){
			 input.setSelectionRange(endpos, endpos);	
		}
	}

	if(!dontinit){
		this.init(options);	
	}
	
	
	
}


function mw_datainput_item_number(options){
	
	mw_datainput_item_base.call(this,options);
	this.oldValue="";
	this.create_input_elem_set_other_params=function(inputElem){
		inputElem.type="text";
		var _this=this;
		inputElem.onfocus=function(){_this.save_old_value()};
		inputElem.onkeydown=function(){_this.save_old_value()};
		inputElem.onkeyup=function(e){_this.onKeyUp(e)};
	}
	this.on_change=function(){
		this.validateNumValueAndSet(true);			
		this.show_hide_validations_msgs_on_change();
		this.run_on_change_events();
	}
	
	this.onKeyUp=function(evnt){
		if(this.options.get_param_or_def("validateonkeyup",false)){
			this.on_change();	
		}else{
			this.validateNumValueAndSet();	
		}
	}
	this.validateNumValueAndSet=function(validate){
		var val=this.get_input_value();
		var valman=this.numValMan(val,this.oldValue,validate);
		if(val==valman.finalValue){
			return;	
		}
		this.set_input_value(valman.finalValue);
	}
	
	this.validateNumValue=function(val){
		val=mw_getNumber(val);
		var p;
		if(this.options.get_param_or_def("int",false)){
			val=mw_getInt(val);	
		}
		if(this.options.param_exists("min")){
			p=this.options.get_param("min");
			if(val<p){
				val=p;	
			}
		}
		if(this.options.param_exists("max")){
			p=this.options.get_param("max");
			if(val>p){
				val=p;	
			}
		}
		return val;
	}
	this.numValMan=function(newValue,oldValue,validate){
		var valman=new mw_datainput_helper_value_validator(newValue,oldValue);
		valman.finalValue="";
		
			
		if(valman.newValue.isEmpty){
			valman.finalValue="";
			
			return valman;	
		}
		if(valman.newValue.isNumber){
			if(validate){
				valman.finalValue=this.validateNumValue(valman.newValue.numericValue);
			}else{
				valman.finalValue=valman.newValue.numericValue;
				
			}
			return valman;	
		}
		if(valman.oldValue.isNumber){
			if(validate){
				valman.finalValue=this.validateNumValue(valman.oldValue.numericValue);
			}else{
				valman.finalValue=valman.oldValue.numericValue;
			}
			return valman;	
		}
		return valman;
		
			
	}
	this.save_old_value=function(){
		var valman=this.numValMan(this.get_input_value(),this.oldValue);
		//console.log(valman);
		this.oldValue=valman.finalValue;
	}

	
	
}


function mw_datainput_item_hidden(options){
	this.init(options);
	this.append_to_container=function(container){
		if(!container){
			return false;	
		}
		this.beforeAppend();
		var inputelem=this.get_input_elem();
		if(inputelem){
			container.appendChild(inputelem);
			this.afterAppend();
			return true;	
		}
	}
	this.set_def_input_atts=function(input){
		var p;
		p=this.get_input_name();
		if(p){
			input.name=p;	
		}
		p=this.get_input_id();
		if(p){
			input.id=p;	
		}
		input.type="hidden";
		this.update_input_atts(input);
	}
		
}
mw_datainput_item_hidden.prototype=new mw_datainput_item_abs();

function mw_datainput_item_groupwithtitle(options){
	this.init(options);
	
	this.append_to_container=function(container){
		if(!container){
			return false;	
		}
		this.beforeAppend();
		var e=this.get_container();
		if(e){
			container.appendChild(e);
			this.afterAppend();
			return true;	
		}
	}
	
	this.create_container=function(){
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
		pcolb.className="card-collapse collapse in show";
		if(this.options.get_param_or_def("collapsed",false)){
			
			pcolb.className="card-collapse collapse in";	
		}
		
		panel.appendChild(pcolb);
		var pbody=document.createElement("div");
		pbody.className="card-body";
		pcolb.appendChild(pbody);
		this.children_container=pbody;
		if(this.sub_items_list){
			var list=this.sub_items_list.getList();
			if(list){
				for(var i =0; i<list.length;i++){
					list[i].append_to_container(pbody);
				}
				
			}
			
		}

		return c;
	}
	
	
	

}
mw_datainput_item_groupwithtitle.prototype=new mw_datainput_item_group();
function mw_datainput_item_group_multiple_children(options){
	this.init(options);
	this.get_next_child_index=function(){
		var list=this.get_sub_items_list();
		if(!list){
			return 1;	
		}
		return list.getItemsNum()+1;
	
	}
	
	this.createNewChild=function(){
		var fnc =this.options.get_param_if_function("newchild");
		if(fnc){
			return fnc(this);	
		}
		var cod=this.get_next_child_index();
		var ch=new mw_datainput_item_input({cod:cod,lbl:cod});
		return ch;
	}
	
	this.addNewChild=function(){
		var ch=this.createNewChild();
		if(!ch){
			return false;	
		}
		this.addItem(ch);
		if(this.children_container){
			ch.append_to_container(this.children_container);	
		}
		return ch;
	}
	this.addNewChildIfOK=function(){
		if(this.allowAddNewChild()){
			return this.addNewChild();	
		}
	}
	this.allowAddNewChild=function(){
		var fnc =this.options.get_param_if_function("allowAddNewChild");
		if(fnc){
			return fnc(this);	
		}
		return true;
			
	}
	
	this.afterAppend=function(){
		this.doAfterAppendFncs();
		if(!this.panelheading){
			return;	
		}
		var _this=this;
		var btns=document.createElement("div");
		btns.className="mw_panel_title_btns";
		var btn=document.createElement("div");
		btn.className="mw_nav_mnu_drop_down_btn";
		btn.innerHTML="<span class='fa fa-plus-circle'> </span>";
		btn.style.cursor="pointer";
		btns.appendChild(btn);
		btn.onclick=function(){_this.addNewChildIfOK()};
		var firstch=this.panelheading.firstChild;
		if(firstch){
			this.panelheading.insertBefore(btns,firstch);
			
		}else{
			
			this.panelheading.appendChild(btns);
		}
		if(this.options.get_param_or_def("autoaddchild",false)){
			this.addNewChild();	
		}
		
	}
}
mw_datainput_item_group_multiple_children.prototype=new mw_datainput_item_groupwithtitle();

function mw_datainput_item_btndrpdown(options){
	this.append_to_container=function(container){
		if(!container){
			return false;	
		}
		this.beforeAppend();
		var e=this.get_container();
		if(e){
			container.appendChild(e);
			this.afterAppend();
			return true;	
		}
	}
	this.create_children_container=function(){
		if(!this.sub_items_list){
			return false;	
		}
		var list=this.sub_items_list.getList();
		if(!list){
			return false;	
		}
		var chcontainer=document.createElement("ul");
		$(chcontainer).attr("role","menu");
		chcontainer.className="dropdown-menu";
		
		
		
		for(var i =0; i<list.length;i++){
			list[i].append_to_list_container(chcontainer);
		}
		return chcontainer;
	
	}
	this._hoverIn=function(){
		this._unsetHoverOutTimeout();
		if(this.container){
			$(this.container).addClass('open');
		}
	}
	this._hoverOut=function(){
		this._setHoverOutTimeout();
	}
	this._unsetHoverOutTimeout=function(){
		if(this._hoverOutTimeout){
			clearTimeout(this._hoverOutTimeout);
			this._hoverOutTimeout=false;
		}
	}
	this._setHoverOutTimeout=function(){
		this._unsetHoverOutTimeout();
		var _this=this;
		this._hoverOutTimeout=setTimeout(function(){ _this._onHoverOutTimeout() }, 200);
	}
	this._onHoverOutTimeout=function(){
		this._unsetHoverOutTimeout();
		if(this.container){
			$(this.container).removeClass('open');
		}
		
	}
	
	
	this.create_container=function(){
		var p;
		var c=document.createElement("div");
		c.className="btn-group";
		var _this=this;
		$(c).hover(
        	function(){ _this._hoverIn() },
			function(){ _this._hoverOut() }
        );
		
		this.frm_group_elem=c;
		var inputelem=this.get_input_elem();
		
		if(inputelem){

			c.appendChild(inputelem);	
		}
		var childrenelem=this.create_children_container();
		if(childrenelem){
			c.appendChild(childrenelem);	
		}
		return c;
	}
	
	this._onClick=function(){
		var fnc=this.options.get_param_if_function("onclick");
		if(fnc){
			fnc(this);	
		}
	}
	this.create_input_elem=function(){
		var _this=this;
		var p;
		var c=document.createElement("button");
		
		c.setAttribute("type","button");
		c.className="btn btn-"+this.options.get_param_or_def("display_mode","default")+" dropdown-toggle";
		$(c).attr("data-toggle","dropdown");
		$(c).attr("aria-expanded","false");
		p=this.options.get_param_or_def("lbl",false);
		if(p){
			c.innerHTML=p+" <span class='caret'></span>";
		}else{
			c.innerHTML="<span class='caret'></span>";	
		}
		this.set_def_input_atts(c);
		
		return c;
	}
	
	
	this.init(options);	
}
mw_datainput_item_btndrpdown.prototype=new mw_datainput_item_btn();
function mw_datainput_item_btndrpdown_child(options){
	this.init(options);
	this._is_disabled=false;
	this.create_input_elem=function(){
		var _this=this;
		var p;
		var c=document.createElement("a");
		c.href=this.options.get_param_or_def("url","#");
		//c.role="button";
		
		
		p=this.options.get_param_or_def("target",false);
		if(p){
			c.target=p;
		}
		p=this.options.get_param_or_def("url",false);
		if(p){
			c.onclick=function(){if(_this._is_disabled){return false} _this._onClick()};
		}else{
			c.onclick=function(){if(_this._is_disabled){return false} _this._onClick(); return false};	
		}
		p=this.options.get_param_or_def("iconClass",false);
		if(p){
			c.innerHTML="<i class='"+p+"'></i> ";
		}
		
		p=this.options.get_param_or_def("lbl",false);
		if(p){
			c.innerHTML=c.innerHTML+p+"";
		}
		this.set_def_input_atts(c);
		
		return c;
	}

	this.update_input_atts=function(input){
		var p;
		var required=this.options.get_param_or_def("state.required",false);
		p=this.options.get_param_or_def("state.disabled",false);
		if(p){
			input.disabled=true;
			$(input).addClass('disabled');
			this._is_disabled=true;
			required=false;	
		}else{
			input.disabled=false;
			$(input).removeClass('disabled');
			this._is_disabled=false;	
		}
		p=this.options.get_param_or_def("state.readOnly",false);
		if(p){
			input.readOnly=true;
			required=false;	
		}else{
			input.readOnly=false;		
		}
		if(required){
			input.required=true;
		}else{
			input.required=false;		
		}
		
	}
	

}
mw_datainput_item_btndrpdown_child.prototype=new mw_datainput_item_btn();

function mw_datainput_item_btndrpdown_child_separetor(options){
	this.init(options);
	this.create_input_elem=function(){
		return false;
	}

	this.create_list_elem_container_empty=function(){
		var e=document.createElement("li");
		$(e).attr("role","separator");
		e.className="divider";

		return e;
	}
	

}
mw_datainput_item_btndrpdown_child_separetor.prototype=new mw_datainput_item_btn();

function mw_datainput_item_html(options){
	this.init(options);
	this.create_in_html_container=function(){
		var n=this.options.get_param_or_def("cont","");
		
		
		var e=document.createElement("div");
		if(this.is_horizontal()){
			e.className="col-sm-10";	
		}
		mw_dom_set_cont(e,n);
		this.innerHtmlContainer=e;
		return e;
		
	}
	this.getContentElem=function(){
		return this.innerHtmlContainer;
	}
	
	this.create_container=function(){
		var p;
		var c=document.createElement("div");
		c.className="form-group";
		if(this.is_horizontal()){
			c.className="form-group row";
		}
		
		this.frm_group_elem=c;

		var lbl=this.create_lbl();
		if(lbl){
			c.appendChild(lbl);	
		}
		var e=this.create_in_html_container();
		if(e){
			c.appendChild(e);	
		}
		
		this.create_notes_elem_if_req();
		return c;
	}

	

}
mw_datainput_item_html.prototype=new mw_datainput_item_abs();



function mw_datainput_item_with_optionsList_base(){
	this.options_list=new mw_objcol();
	this.update_display_if_created=function(){
		
		this.refresh_lists_options();	
	}
	this.refresh_lists_options=function(){
	}
	
	this.beforeAppend=function(){
		var p=this.options.get_param_or_def("value",false);
		if(p){
			this.set_orig_value(p);	
		}
		this.addItemsFromOptions();
		this.initOptionsList();
	}
	
	this.initOptionsList=function(){
		var list=this.options.get_param_as_list("optionslist");
		//console.log("initOptionsList",list);
		var _this=this;
		if(list){
			mw_objcol_array_process(list,function(data,index){_this.add_option_from_data(data)});		
		}
			
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
		var i=this.options_list.add_item(cod,option);
		if(i){
			this.update_display_if_created();
			
			return i;	
		}
	}

}

function mw_datainput_item_with_side_optselector(options){
	mw_datainput_item_base.call(this,options);
	mw_datainput_item_with_optionsList_base.call(this);
	this.create_input_elem_set_other_params=function(inputElem){
		inputElem.type="text";
	}
	this.afterAppend=function(){
		this.doAfterAppendFncs();
		
		if(this.orig_value){
			this.set_input_value(this.orig_value);	
		}
		var p=this.options.get_param_or_def("hidden",false);
		if(p){
			this.hide();	
		}
		this.initTooltipFromParams();
		//this.updateSelOptionFromSrc();
		
	}
	this.set_input_value=function(val){
		if(this.input_elem){
			this.input_elem.value=this.format_input_value(val)+"";	
		}
		this.updateSelOptionFromSrc();
	}
	
	this.updateSelOptionFromSrc=function(){
		var sel=false;
		var src=this.getOptionInputSrc();
		if(src){
			sel=src.get_input_value();	
		}
		var omitupdatesrc=true;
		if(!sel){
			if(sel=	this.options.get_param_or_def("optsSelector.def","")){
				omitupdatesrc=false;	
			}
		}
		this.setSelectedOption(sel,omitupdatesrc);
			
	}
	
	this.loadOptionInputSrc=function(){
		var levelsup=this.options.get_param_or_def("optsSelector.src.levelsup",1);
		var cod=this.options.get_param_or_def("optsSelector.src.cod",false);
		if(!cod){
			return false;	
		}
		return this.getParentChildByDotCod(levelsup,cod);
			
	}
	this.getOptionInputSrc=function(){
		if(this.optionInputSrc){
			return this.optionInputSrc;	
		}
		this.optionInputSrc=this.loadOptionInputSrc();
		return this.optionInputSrc;	
	}
	this.refresh_lists_options=function(){
		if(!this.optionSelectorListContainer){
			return false;
		}
		this.optionSelectorListContainer.empty();
		var _this=this;
		this.options_list.exec_fnc_on_items(function(data,index){_this.appendSelectorOption(data)});		
	
	}
	this.setSelectedOption=function(cod,dontUpdateSrc){
		//console.log("setSelectedOption",cod);
		this.selectedOptionCod=cod;
		this.afterSelectedOptionSetted(dontUpdateSrc);
	}
	this.getSelectedOption=function(){
		if(this.selectedOptionCod){
			return this.options_list.get_item(this.selectedOptionCod);	
		}
		return false;
			
	}
	
	this.afterSelectedOptionSetted=function(dontUpdateSrc){
		var lbl=this.options.get_param_or_def("optsSelector.noneselectedlbl","");
		var selops=this.getSelectedOption();
		var scod="";
		if(selops){
			lbl=selops.name;	
			scod=selops.cod;	
		}
		if(this.optionSelectBtn){
			this.optionSelectBtn.find("[name='optsSelectorLbl']")
			.html(lbl+"");
	
		}
		if(!dontUpdateSrc){
			var src=this.getOptionInputSrc();
			if(src){
				src.set_input_value(scod);	
			}
		}
		
	}
	
	this.appendSelectorOption=function(data){
		var cod=data.cod;
		var _this=this;
		var li=$('<li></li>')
			.appendTo(this.optionSelectorListContainer);
		var a=$('<a href="#">'+data.name+'</a>')
			.click(function(e){
				e.preventDefault();
				_this.setSelectedOption(cod);
				})
			.appendTo(li);
	}

	this.create_left_btn=function(){
		var _this=this;
		var p;
		this.leftBtnContainer=document.createElement("div");
		this.leftBtnContainer.className="input-group-btn";
		var lbl=this.options.get_param_or_def("optsSelector.noneselectedlbl","");
		this.optionSelectBtn=$('<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span name="optsSelectorLbl">'+lbl+'</span> <span class="caret"></span></button>')
			.appendTo(this.leftBtnContainer);
		this.optionSelectorListContainer=$('<ul class="dropdown-menu"></ul>')
			.appendTo(this.leftBtnContainer);
			
			
		this.refresh_lists_options();
		return this.leftBtnContainer;
		
	}

	
	
}

function mw_datainput_item_captcha(options){
	mw_datainput_item_base.call(this,options);
	this.create_input_elem_set_other_params=function(inputElem){
		inputElem.type="text";
	}
	this.create_left_btn=function(){
		var _this=this;
		var p;
		this.leftBtnContainer=document.createElement("div");
		this.leftBtnContainer.className="input-group-addon";
		
		this.imgContainerSelector=$('<span></span>')
			.appendTo(this.leftBtnContainer);
		this.setImgUrl(this.options.get_param_or_def("captchaurl",false));
		return this.leftBtnContainer;
		
	}
	this.setImgUrl=function(url){
		if(!url){
			return false;	
		}
		if(!this.imgContainerSelector){
			return false;	
		}
		this.imgContainerSelector.empty();
		this.imgSelector=$('<img src="'+url+'">')
			.appendTo(this.imgContainerSelector);
		
		
	}

	
	
}


function mw_datainput_item_hiddenpass(options){
	mw_datainput_item_base.call(this,options);
	this.create_input_elem_set_other_params=function(inputElem){
		inputElem.type="password";
	}

	this.create_right_btn=function(){
		var _this=this;
		this.rightBtnContainer=document.createElement("span");
		//this.rightBtnContainer.className="input-group-text";
		//this.rightBtnContainer.innerHTML="";
		$(this.rightBtnContainer).html("<i class='fa fa-eye'></i>");
		$(this.rightBtnContainer).addClass("input-group-text");
		$(this.rightBtnContainer).css("cursor","pointer");
		this.rightBtnContainer.onclick=function(){_this.toggleShowHiddenInput()};
		return this.rightBtnContainer;
		
	}
	this.setHiddenInputMode=function(visible){
		if(!visible){
			$(this.input_elem).attr("type","password");
			$(this.rightBtnContainer).html("<i class='fa fa-eye'></i>");
		}else{
			$(this.input_elem).attr("type","input");
			$(this.rightBtnContainer).html("<i class='fa fa-eye-slash'></i>");
		}

	}
	this.toggleShowHiddenInput=function(){
		
		if(!this.input_elem){
			return;
		}
		var v=true;
		if($(this.input_elem).attr("type")=="password"){
			v=false;
		}
		if(v){
			$(this.input_elem).attr("type","password");
			$(this.rightBtnContainer).html("<i class='fa fa-eye'></i>");
		}else{
			$(this.input_elem).attr("type","input");
			$(this.rightBtnContainer).html("<i class='fa fa-eye-slash'></i>");
		}

	}
	

	
	
}


