
function mw_datainput_item_abs(){
	this.init=function(options){
		this.options=new mw_obj();
		this.options.set_params(options);
		this.set_cod(this.options.get_param_or_def("cod",false));
		this.afterInit();
	}
	this.disabledOnReadOnly=function(){
		return false;
	}
	this.getDebugInfoExtra=function(info){
		
	}
	this.getDebugInfo=function(){
		var r={
			cod:this.cod,
			fullCod:this.getFullCod()	
		};
		this.getDebugInfoExtra(r);
		var list=this.get_children();
		if(!list){
			return r;	
		}
		r.children={};
		var c;
		for(var i=0;i<list.length;i++){
			if(c=list[i].cod){
				r.children[c]=list[i].getDebugInfo();
			}
		}
		return r;
			
	}
	this.getFullCod=function(){
		var r=new Array();
		this.addParentCodsList(r);
		return r.reverse().join(".");
	}
	this.addParentCodsList=function(list){
		list.push(this.cod);
		if(this.parent){
			this.parent.addParentCodsList(list);	
		}
					
	}
	
	this.getItemsIdentificationFilter=function(filterOrCod,value){
		var r=new Array();
		if(mw_is_array(filterOrCod)){
			return 	filterOrCod;
		}
		if(!filterOrCod){
			return false;	
		}
		if(mw_is_object(filterOrCod)){
			r.push(filterOrCod);
			return r;
		}
		if(typeof(filterOrCod)!="string"){
			return false;	
		}
		r.push({cod:filterOrCod,value:value});
		return r;
		
		
	}
	this.doItemsByIdentification=function(identification,fnc){
		var list =this.getItemsByIdentification(identification);
		mw_objcol_array_process(list,fnc);
		return list;
	}

	this.getItemsByIdentification=function(filterOrCod,value){
		//ex: filterOrCod=action value="delete"
		//ex: filterOrCod=[{cod:'action',value:"delete"}]
		//ex: filterOrCod={cod:'action',value:"delete"}
		var list=new Array();
		var identification=this.getItemsIdentificationFilter(filterOrCod,value);
		this.addSelfAndChildrenByIdentification(list,identification);
		return list;
		
	}
	this.addSelfByIdentification=function(list,identification){
		if(this.checkIdentification(identification)){
			list.push(this);	
		}
	}
	this.checkIdentificationItem=function(identification){
		if(!mw_is_object(identification)){
			return false;
		}
		//aca de podrían implementar otros metodos como funciones, etc
		//comportamiento por defecto {cod:'action',value:"delete"}
		var cod=identification.cod;
		if(typeof(cod)!="string"){
			return false;	
		}
		var idvalue=this.options.get_param_or_def("itemidentification."+cod,false);
		//podria ser una lista
		if(idvalue===identification.value){
			return true;
		}
		return false;
		
	}
	this.checkIdentification=function(identification){
		if(!identification){
			return false;	
		}
		if(!mw_is_array(identification)){
			if(mw_is_object(identification)){
				return this.checkIdentificationItem(identification);	
			}
			return false;
		}
		var numOK=0;
		var numFail=0;
		var r;
		for(var i=0;i<identification.length;i++){
			if(this.checkIdentificationItem(identification[i])){
				numOK++;
			}else{
				return false;	
			}
		}
		if(numOK>0){
			return true;	
		}
		return false;
		
			
	}
	
	this.addChildrenByIdentification=function(list,identification){
		var chlist=this.get_children();
		if(!chlist){
			return false;	
		}
		
		for(var i=0;i<chlist.length;i++){
			chlist[i].addSelfAndChildrenByIdentification(list,identification);
		}
			
	}
	this.addSelfAndChildrenByIdentification=function(list,identification){
		this.addSelfByIdentification(list,identification);
		this.addChildrenByIdentification(list,identification);
		
	}
	
	
	
	this.get_real_input_elem=function(){
		return this.get_input_elem();	
	}
	this.get_user_input_elem=function(){
		return this.get_input_elem();	
	}
	this.get_tooltip_target_elem=function(){
		return this.get_user_input_elem();	
	}
	//this.setTooltipFromParams(c);
	this.initTooltipFromParams=function(){
		var e=this.get_tooltip_target_elem();
		this.setTooltipFromParams(e);	
	}
	this.setTooltipFromParams=function(elem){
		if(!elem){
			return false;	
		}
		var p=this.options.get_param_if_object("tooltip");
		if(!p){
			return false;	
		}
		if(!p["placement"]){
			p["placement"]="auto bottom";
		}

		
		$($(elem)).tooltip(p);
	}
	this.onChildChanged=function(ch){
		this.on_change();
	}
	this.listen_children_change=function(cod){
		if(!cod){
			if(this.cod){
				cod="parent_changed_"+this.cod;	
			}else{
				cod="parent_changed";		
			}
		}
		var _this=this;
		var ev=function(ch){_this.onChildChanged(ch)};
		var list=this.get_children();
		if(!list){
			return false;	
		}
		
		for(var i=0;i<list.length;i++){
			list[i].add_children_and_self_on_change_event(cod,ev);	
		}
		return true;
		
	}
	this.add_children_and_self_on_change_event=function(cod,ev){
		this.add_on_change_event(cod,ev);
		var list=this.get_children();
		
		if(list){
			
			
			for(var i=0;i<list.length;i++){
				//add_on_change_event
				list[i].add_children_and_self_on_change_event(cod,ev);	
			}
		}
		return true;
		
		
			
	}
	this.set_self_and_children_param=function(cod,val,overwrite){
		if(!cod){
			return false;	
		}
		this.set_children_param(cod,val,overwrite);
		if(!overwrite){
			if(this.options.param_exists(cod)){
				return false;
			}
		}
		this.options.set_param(val,cod);
		
			
	}
	
	this.set_children_param=function(cod,val,overwrite){
		if(!cod){
			return false;	
		}
		var list=this.get_children();
		if(!list){
			return false;	
		}
		
		for(var i=0;i<list.length;i++){
			list[i].set_self_and_children_param(cod,val,overwrite);	
		}
		return true;
	}
	this.get_children=function(){
		if(!this.sub_items_list){
			return false;	
		}
		return this.sub_items_list.getList();
	}
	this.show=function(){
		this.set_hidden(false);
	}
	this.hide=function(){
		this.set_hidden(true);
	}
	this.set_hidden=function(val){
		if(val){
			this.hidden=true;	
		}else{
			this.hidden=false;	
		}
		if(this.container){
			if(this.hidden){
				mw_hide_obj(this.container);	
			}else{
				mw_show_obj(this.container);	
			}
		}
		if(this.input_elem){
			if(this.hidden){
				mw_hide_obj(this.input_elem);	
			}else{
				mw_show_obj(this.input_elem);	
			}
		}
		
		if(!this.sub_items_list){
			return;	
		}
		var list=this.sub_items_list.getList();
		if(!list){
			return;	
		}
		for(var i =0; i<list.length;i++){
			list[i].set_hidden(this.hidden);
		}
		
	}
	
	
	this.afterInit=function(){
			
	}
	this.create_help_elem=function(){
		var e=document.createElement("p");
		e.className="help-block";
		return e;
		
	}
	this.create_notes_elem_if_req=function(){
		var n=this.options.get_param_or_def("notes",false);
		if(!n){
			return false;	
		}
		
		
		var e=document.createElement("p");
		e.className="help-block";
		e.innerHTML=n;
		if(this.frm_group_elem){
			this.frm_group_elem.appendChild(e);
		}
		return e;
		
	}
	
	
	this.update_display_if_created=function(){
			
	}
	this.set_help_elem_cont=function(cont){
		if(!cont){
			mw_hide_obj(this.help_elem);
			return;
		}
		var e=this.get_help_elem();
		if(e){
			var ch=true;
			if(mw_isNumber(cont)){
				ch=false;
			}
			if(typeof(cont)=="boolean"){
				ch=false;	
			}
			if(cont===true){
				ch=false;	
			}
			if(ch){
				mw_dom_remove_children(e);
				if(typeof(cont)=="object"){
					e.appendChild(cont);
				}else{
					e.innerHTML=cont+"";	
				}
				mw_show_obj(this.help_elem);
			}
		}
	}
	
	this.get_help_elem=function(){
		if(this.help_elem){
			return this.help_elem;	
		}
		if(!this.frm_group_elem){
			return false;	
		}
		var e=this.create_help_elem();
		if(!e){
			return false;	
		}
		this.help_elem=e;
		this.frm_group_elem.appendChild(this.help_elem);
		return this.help_elem;
	}
	
	this.set_validation_status_normal=function(msg,children){
		return this.set_validation_status(msg,0,children);	
	}
	this.set_validation_status_success=function(msg,children){
		return this.set_validation_status(msg,1,children);	
	}
	this.set_validation_status_warning=function(msg,children){
		return this.set_validation_status(msg,2,children);	
	}
	this.set_validation_status_error=function(msg,children){
		return this.set_validation_status(msg,3,children);	
	}
	this.onRequiredUpdated=function(){
		var req=false;
		
		if(this.options.get_param_or_def("state.required",false)){
			req=true;
		}
		var elemgr=this.frm_group_elem;	
		if(elemgr){
			
			if(req){
				$( $(elemgr) ).addClass( "required" );
			
			}else{
				$( $(elemgr) ).removeClass( "required" );
			}
		}
		if(this.sub_items_list){

			var list=this.sub_items_list.getList();
			if(!list){
				return false;	
			}
			for(var i =0; i<list.length;i++){
				list[i].onRequiredUpdated();
			}
		}
	}
	this.set_validation_status=function(msg,status,children){
	//status=0 normal, 1 success, 2 warning 3 erro
		
		this.set_help_elem_cont(msg);
		var elemgr=this.frm_group_elem;	
		if(elemgr){
			$( $(elemgr) ).removeClass( "has-success has-warning has-error" );
			if(status==1){
				$( $(elemgr) ).addClass( "has-success" );
			}else if(status==2){
				$( $(elemgr) ).addClass( "has-warning" );
			}else if(status==3){
				$( $(elemgr) ).addClass( "has-error" );
			}
		}
		if(children){
			if(this.sub_items_list){

				var list=this.sub_items_list.getList();
				if(!list){
					return false;	
				}
				for(var i =0; i<list.length;i++){
					list[i].set_validation_status(msg,status,children);
				}
			}
		}
	
	}
	this.validate_omit=function(){
		if(this.hidden){
			return true;	
		}
		if(this.disabled){
			return true;	
		}
		return false;
	}

	this.doValidateSelfReq=function(){
		if(this.options.get_param_or_def("state.required",false)){
			if(!this.get_input_value()){
				
				this.set_validation_status("",3);
				return false;
			}
		}
		return true;
	}
	this.doValidateSelf=function(){
		this._validation_result=true;
		var fnc =this.options.get_param_if_function("validation");
		if(fnc){
			this._validation_result=fnc(this);
			return this._validation_result;
		}
		var list=this.options.get_param_as_list("validationList");
		if(list){
			for(var i=0;i<list.length;i++){
				fnc=list[i];
				if(mw_is_function(fnc)){
					if(!fnc(this)){
						this._validation_result=false;
						return this._validation_result;	
					}
				}
			}
				
		}
		if(!this.doValidateSelfReq()){
			this._validation_result=false;
			return this._validation_result;	
		}

		
		
		return this._validation_result;
			
	}
	
	this.validate=function(){
		if(this.validate_omit()){
			return true;	
		}
		return this.doValidateSelf();
	}
	this.validate_before_submit=function(){
		if(this.validate()){
			this.set_validation_status_normal(false);
			return true;
			
		}
		return false;
			
	}
	this.show_hide_validations_msgs_on_change=function(){
		if(this.validate()){
			this.set_validation_status_normal(false);
			
		}
	}
	this.run_on_change_event=function(eventman){
		if(!eventman){
			return false;	
		}
		if(mw_is_function(eventman)){
			eventman(this);
			return;	
		}
		if(mw_is_object(eventman)){
			if(mw_is_function(eventman["on_input_change"])){
				eventman.on_input_change(this);	
			}
			//eventman(this);
			return;	
		}
		
	}
	this.add_on_change_event=function(cod,eventman){
		if(!this.on_change_events){
			this.on_change_events=new mw_objcol();	
		}
		return this.on_change_events.add_item(cod,eventman);
			
	}
	
	this.run_on_change_events=function(){
		if(!this.on_change_events){
			return false;	
		}
		var _this=this;
		var list=this.on_change_events.get_items_by_index();
		mw_objcol_array_process(list,function(e){_this.run_on_change_event(e)});
		
	}
	this.on_change=function(){
		this.show_hide_validations_msgs_on_change();
		this.run_on_change_events();
	}
	
	this.set_cod=function(cod){
		if(!cod){
			return false;	
		}
		
		cod=cod+"";
		if(typeof(cod)=="string"){
			this.cod=cod;
			return true;
		}
		if(typeof(cod)=="number"){
			this.cod=cod;
			return true;
		}
		
	}
	this.set_parent=function(parent,cod){
		this.parent=parent;
		if(cod){
			this.set_cod(cod);	
		}
	}
	this.get_input_value=function(){
		if(this.input_elem){
			return this.input_elem.value;	
		}
	}
	this.addItemsMwFromList=function(mwlist){
		if(!mwlist){
			return false;	
		}
		var list=mwlist.getElemsList();
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
	this.getParentChildByDotCodValue=function(levelsup,childcod,def){
		var i=this.getParentChildByDotCod(levelsup,childcod);
		if(i){
			return i.get_input_value();	
		}
		return def;
	}
	this.getParentChildByDotCod=function(levelsup,childcod){
		
		levelsup=mw_getInt(levelsup);
		if(levelsup<=0){
			if(!childcod){
				return this;	
			}else{
				return this.getChildByDotCod(childcod);	
				
			}
		}
		if(this.parent){
			
			return this.parent.getParentChildByDotCod(levelsup-1,childcod);	
		}
		return false;
		
	}
	this.setChildValueByDotCod=function(cod,value){
		var ch=this.getChildByDotCod(cod);
		if(!ch){
			return false;	
		}
		ch.set_input_value(value);
		return ch;
	}

	this.getChildValueByDotCod=function(cod,def){
		var ch=this.getChildByDotCod(cod);
		if(!ch){
			return def;	
		}
		return ch.get_input_value();
	}

	this.getChildByDotCod=function(cod){
		if(!cod){
			return false;	
		}
		cod=cod+"";
		
		var list=cod.split(".");
		if(list.length<=0){
			return false;	
		}
		var fcod=list.shift();
		if(!fcod){
			return false;	
		}
		var child=this.getChild(fcod);
		if(!child){
			return false;	
		}
		if(list.length<=0){
			return child;	
		}
		var ncod=list.join(".");
		return child.getChildByDotCod(ncod);
	}
	
	this.getChild=function(cod){
		if(!cod){
			return false;	
		}
		if(!this.sub_items_list){
			return false;	
		}
		return this.sub_items_list.getItem(cod);
	}
	this.addItemsFromOptions=function(){
		if(this.addItemsFromOptionsDone){
			return;	
		}
		this.addItemsFromOptionsDone=true;
		var list=this.options.get_param_as_list("childrenList");
		if(!list){
			return false;	
		}
		var cod;
		var elem;
		for(var i =0; i<list.length;i++){
			elem=list[i];
			if(mw_is_object(elem)){
				cod=elem.cod;
				if(cod){
					this.addItem(elem,cod);	
				}
			}
		}

	}
	
	this.addItem=function(subitem,cod){
		var list=this.get_sub_items_list();
		if(!list){
			return false;	
		}
		if(!cod){
			cod=subitem.cod;	
		}
		if(!list.addItem(subitem,cod)){
			return false;	
		}
		subitem.set_parent(this,cod);
		return subitem;
		
	}
	this.get_sub_item=function(cod){
		if(!this.sub_items_list){
			return false;
		}
		return this.sub_items_list.getItem(cod);
		
	}
	this.append2hiddenFrm=function(container){
		if(!container){
			return false;	
		}
		if(this.input_elem){
			var c=document.createElement("div");
			var e=document.createElement("input");
			//var lbl=document.createElement("label");
			//lbl.innerHTML=this.get_input_name();
			//c.appendChild(lbl);
			e.value=this.get_input_value();
			e.name=this.get_input_name();
			c.appendChild(e);
			container.appendChild(c);
		}
		if(!this.sub_items_list){
			return;	
		}
		var list=this.sub_items_list.getList();
		if(!list){
			return;	
		}
		for(var i =0; i<list.length;i++){
			list[i].append2hiddenFrm(container);
		}
		
	}
	this.onDisplayUpdated=function(){
		var fnc=this.options.get_param_if_function("onDisplayUpdated",false);
		if(fnc){
			fnc(this);
		}
	}
	this.onDisplayUpdatedAll=function(){
		if(this.onDisplayUpdated){
			this.onDisplayUpdated();	
		}
		if(!this.sub_items_list){
			return false;	
		}
		var list=this.sub_items_list.getList();
		if(!list){
			return false;	
		}
		for(var i =0; i<list.length;i++){
			list[i].onDisplayUpdatedAll();
		}
		
	}
	
	this.set_visible_by_condition=function(){
		var fnc=this.options.get_param_if_function("visible_condition",false);
		if(fnc){
			if(fnc(this)){
				this.show();
			}else{
				this.hide();	
			}
		}
		if(!this.sub_items_list){
			return false;	
		}
		var list=this.sub_items_list.getList();
		if(!list){
			return false;	
		}
		for(var i =0; i<list.length;i++){
			list[i].set_visible_by_condition();
		}
		
	}
	
	
	this.init_before_append_mode=function(){
		this.init_before_append_mode_self();
		this.init_before_append_mode_children();
		
	}
	this.init_before_append_mode_self=function(){
		this.addItemsFromOptions();
	}
	this.init_before_append_mode_children=function(){
		if(!this.sub_items_list){
			return false;	
		}
		var list=this.sub_items_list.getList();
		if(!list){
			return false;	
		}
		for(var i =0; i<list.length;i++){
			list[i].init_before_append_mode();
		}
	
	}
		
	this.get_sub_items_list=function(){
		if(!this.sub_items_list){
			this.sub_items_list=new mw_arraylist();	
		}
		return this.sub_items_list;
	}
	this.appendChildren2OtherContainer=function(containerItem){
		if(!this.sub_items_list){
			return false;	
		}
		var list=this.sub_items_list.getList();
		if(!list){
			return false;	
		}
		for(var i =0; i<list.length;i++){
			list[i].append2OtherContainer(containerItem);
		}
		return true;
		
	}
	this.get_elem2appendOnOtherContainer=function(){
		if(!this.container){
			return false;
		}
		return this.container;
	}

	this.append2OtherContainer=function(containerItem){
		if(!this.container){
			return this.appendChildren2OtherContainer(containerItem);	
		}
		return containerItem.doAppendInputItem(this);
	}
	this.noValueMode=function(){
		return false;	
	}
	this.doAfterAppendFncs=function(){
		var list=this.options.get_param_as_list("afterAppendFncs");
		if(!list){
			return false;	
		}
		for(var i =0; i<list.length;i++){
			if(mw_is_function(list[i])){
				list[i](this);
			}
		}
		
	
	}
	
	this.afterAppend=function(){
		
		//this.doAfterAppendFncs();//20231031
		if((this.orig_value)||(mw_isNumber(this.orig_value))){
			this.set_input_value(this.orig_value);	
		}
		this.doAfterAppendFncs();
		var p=this.options.get_param_or_def("hidden",false);
		if(p){
			this.hide();	
		}
		this.initTooltipFromParams();
		this.onRequiredUpdated();
		
	}
	this.beforeAppend=function(){
		var p=this.options.get_param_or_def("value",false,true);
		if((p)||(mw_isNumber(p))){
			this.set_orig_value(p);	
		}
		this.addItemsFromOptions();
	}
	this.create_list_elem_container_empty=function(){
		var e=document.createElement("li");
		return e;
	}
	
	this.append_to_list_container=function(listcontainer){
		if(!listcontainer){
			return false;	
		}
		var container=this.create_list_elem_container_empty();
		if(!container){
			return false;	
		}
		this.list_item_container=container;
		this.append_to_container(container);
		listcontainer.appendChild(container);
		return true;
	}
	
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
	this.get_input_id=function(){
		return false;
	}
	this.get_input_name_for_child=function(cod){
		if(!cod){
			return false;	
		}
		var n=this.get_input_name();
		if(!n){
			return false;	
		}
		return n+"["+cod+"]";
		
	}
	this.get_input_name=function(){
		var p;
		p=this.options.get_param_or_def("input_name",false);
		if(p){
			
			return p;
		}
		if(this.parent){
			
			p=this.parent.get_input_name_for_child(this.cod);
			if(p){
				
				
				return p;
			}
				
		}

		return this.get_input_id();
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
		this.set_def_input_atts_by_cfg(input);//new
		this.set_def_input_atts_more(input);//new
		this.update_input_atts(input);
		
	}
	this.set_def_input_atts_by_cfg=function(input){
		if(!this.options.get_param_or_def("inputAttsCfgEnabled",false)){
			return false;	
		}
		if(!input){
			return false;	
		}
		mw_html_apply_atts_tag(input,this.options.get_param_if_object("inputAtts"));
			
	}
	this.set_def_input_atts_more=function(input){
			
	}
	this.setDisabled=function(val,children){
		return this.setInputStateProp("disabled",val,children);
	}
	this.setRequired=function(val,children){
		return this.setInputStateProp("required",val,children);
	}
	this.setReadOnly=function(val,children){
		return this.setInputStateProp("readOnly",val,children);
	}
	this.setInputStateProp=function(cod,val,children){
		//cod: disabled, readOnly , required 
		if(val){
			val=true;	
		}else{
			val=false;	
		}
		this.options.set_param(val,"state."+cod);
		if(this.input_elem){
			this.update_input_atts(this.input_elem);	
		}

		if(!children){
			return;	
		}
		if(!this.sub_items_list){
			return;	
		}
		var list=this.sub_items_list.getList();
		if(!list){
			return;	
		}
		for(var i =0; i<list.length;i++){
			//list[i].setInputStateProp(cod,val,children);
			list[i].setInputStatePropFromParent(cod,val,children);
		}
		
	}
	this.setInputStatePropFromParent=function(cod,val,children){
		if(this.onParentSetInputStateProp(cod,val,children)){
			this.setInputStateProp(cod,val,children);	
		}
	}
	this.onParentSetInputStateProp=function(cod,val,children){
		//if returns true, do as normal
		var fnc=this.options.get_param_if_function("independentMode.setState");
		if(fnc){
			return fnc(this,cod,val,children);	
		}
		var fnc=this.options.get_param_if_function("independentMode.setState."+cod);
		if(fnc){
			return fnc(this,val,children);	
		}
		if(this.options.get_param_or_def("independentMode.setState."+cod,false)){
			return false;	
		}
		return true;
	}
	
	
	this.update_input_atts=function(input){
		var p;
		var required=this.options.get_param_or_def("state.required",false);
		
		var disabled=this.options.get_param_or_def("state.disabled",false);
		var readOnly=this.options.get_param_or_def("state.readOnly",false);
		if(readOnly){
			readOnly=true;
			if(this.disabledOnReadOnly()){
				disabled=true;
			}
				
		}
		if(disabled){
			disabled=true;
			//input.disabled=true;
			required=false;	
		}else{
			//input.disabled=false;		
		}
		if(required){
			required=true;
		}
		this.disabled=disabled;
		$(input).prop('readonly', readOnly);
		$(input).prop('disabled', disabled);
		$(input).prop('required', required);
		
		
	}
	
	this.get_input_elem=function(){
		if(!this.input_elem){
			this.input_elem=this.create_input_elem();	
		}
		return this.input_elem;
	}
	this.create_input_elem=function(){
		var _this=this;
		var p;
		var c=document.createElement("input");
		c.className="form-control";
		c.onchange=function(){_this.on_change()};
		if(this.options.get_param_or_def("validateonkeyup",false)){
			c.onkeyup=function(){_this.on_change()};
				
		}
		p=this.options.get_param_or_def("placeholder",false);
		if(p){
			c.placeholder=p;
		}
		this.set_def_input_atts(c);
		this.create_input_elem_set_other_params(c);
		//this.setTooltipFromParams(c);
		return c;
	}
	this.create_input_elem_set_other_params=function(inputElem){
			
	}
	this.is_horizontal=function(){
		return 	this.options.get_param_or_def("horizontal",false);
	}
	this.create_lbl=function(){
		var p;
		p=this.options.get_param_or_def("lbl",false);
		if(p){
			var lbl=document.createElement("label");
			lbl.innerHTML=p;
			if(this.is_horizontal()){
				//lbl.className="col-sm-2 control-label";	
			}
			p=this.get_input_id();
			if(p){
				lbl.htmlFor =id;	
			}
			return lbl;
			//c.appendChild(lbl);
		}
			
	}
	this.onLeftBtnClick=function(){
		var fnc=this.options.get_param_if_function("leftBtn.onclick");
		if(fnc){
			fnc(this);	
		}
			
	}
	this.create_left_btn=function(){
		if(!this.options.get_param_or_def("leftBtn.enabled",false)){
			return false;	
		}
		var _this=this;
		var p;
		if(this.options.get_param_or_def("leftBtn.lblmode",false)){
			this.leftBtnContainer=document.createElement("span");
			//this.leftBtnContainer.className="input-group-btn";
			this.leftBtnContainer.className="input-group-text";
			this.leftBtnContainer.innerHTML=this.options.get_param_or_def("leftBtn.lbl","");
			this.leftBtnContainer.onclick=function(){_this.onLeftBtnClick()};
			return this.leftBtnContainer;
				
		}
		this.leftBtnContainer=document.createDocumentFragment();
		
		this.leftBtn=document.createElement("button");
		this.leftBtn.type="button";
		this.leftBtn.className="btn btn-"+this.options.get_param_or_def("leftBtn.display_mode","outline-secondary");
		p=this.options.get_param_or_def("leftBtn.btnWidth",false);
		if(p){
			$(this.leftBtn).css("width",p);
		}	
		var innerhtml="";
		p=this.options.get_param_or_def("leftBtn.iconClass",false);
		if(p){
			innerhtml=innerhtml+"<i class='"+p+"'></i> ";
		}
		p=this.options.get_param_or_def("leftBtn.lbl",false);
		if(p){
			innerhtml=innerhtml+p;
		}

		this.leftBtn.innerHTML=innerhtml;
		this.leftBtn.onclick=function(){_this.onLeftBtnClick()};	
		this.leftBtnContainer.appendChild(this.leftBtn);
		return this.leftBtnContainer;
		
	}
	this.onRightBtnClick=function(){
		var fnc=this.options.get_param_if_function("rightBtn.onclick");
		if(fnc){
			fnc(this);	
		}
			
	}
	this.create_right_btn=function(){
		if(!this.options.get_param_or_def("rightBtn.enabled",false)){
			return false;	
		}
		var p;
		var _this=this;
		
		if(this.options.get_param_or_def("rightBtn.lblmode",false)){
			this.rightBtnContainer=document.createElement("span");
			//this.rightBtnContainer.className="input-group-btn";
			this.rightBtnContainer.className="input-group-text";
			this.rightBtnContainer.innerHTML=this.options.get_param_or_def("rightBtn.lbl","");
			this.rightBtnContainer.onclick=function(){_this.onRightBtnClick()};
			return this.rightBtnContainer;
				
		}
		

		this.rightBtnContainer=document.createDocumentFragment();


		this.rightBtn=document.createElement("button");
		p=this.options.get_param_or_def("rightBtn.btnWidth",false);
		if(p){
			$(this.rightBtn).css("width",p);
		}		
		this.rightBtn.type="button";
		this.rightBtn.className="btn btn-"+this.options.get_param_or_def("rightBtn.display_mode","outline-secondary");
		var innerhtml="";
		p=this.options.get_param_or_def("rightBtn.iconClass",false);
		if(p){
			innerhtml=innerhtml+"<i class='"+p+"'></i> ";
		}
		p=this.options.get_param_or_def("rightBtn.lbl",false);
		if(p){
			innerhtml=innerhtml+p;
		}

		this.rightBtn.innerHTML=innerhtml;		
		
		//this.rightBtn.innerHTML=this.options.get_param_or_def("rightBtn.lbl","");
		
		this.rightBtn.onclick=function(){_this.onRightBtnClick()};	
		this.rightBtnContainer.appendChild(this.rightBtn);
		return this.rightBtnContainer;
		
	}
	
	this.create_container=function(){
		var p;
		var c=document.createElement("div");
		c.className="form-group";
		if(this.is_horizontal()){
			c.className="form-group mw-form-group-horizontal";
		}
		
		this.frm_group_elem=c;
		var lbl=this.create_lbl();
		if(lbl){
			c.appendChild(lbl);	
		}
		var lbnt=this.create_left_btn();
		var rbtn=this.create_right_btn();
		var inputelem=this.get_input_elem();
		var cc;
		var ccc;
		if(lbnt||rbtn||this.is_horizontal()){
			cc=document.createElement("div");
			cc.className="input-group";
			if(this.is_horizontal()){
				if(lbnt||rbtn){
					ccc=document.createElement("div");
					ccc.className="mw_input_group_horizontal_container";
					cc.appendChild(ccc);
					cc=ccc;	
					
					
				}
			}
			if(lbnt){
				cc.appendChild(lbnt);	
			}
			if(inputelem){
				cc.appendChild(inputelem);	
			}
			if(rbtn){
				cc.appendChild(rbtn);	
			}
			
			c.appendChild(cc);	
		}else{
			if(inputelem){
				c.appendChild(inputelem);	
			}
				
		}
		
		
		this.create_notes_elem_if_req();
		return c;
	}
	this.get_container=function(){
		if(!this.container){
			
			this.container=this.create_container();	
		}
		return this.container;
	}
	this.format_input_value=function(val){
		if(val == undefined){
			return "";	
		}
		if(mw_isNumber(val)){
			val+"";
		}
		if(typeof(val)=="boolean"){
			if(val){
				return "1";	
			}else{
				return "0";
			}
		}
		
		return val+"";
	}
	this.set_orig_value=function(val){
		this.orig_value=val;	
	}
	this.set_input_value=function(val){
		if(this.input_elem){
			this.input_elem.value=this.format_input_value(val)+"";	
		}
	}
	this.set_input_value_as_group=function(val){
		if(!val){
			val=new Object();	
		}
		if(typeof(val)!=="object"){
			val=new Object();	
		}
		if(!this.sub_items_list){
			return false;	
		}
		var list=this.sub_items_list.getElemsList();
		if(!list){
			return false;	
		}
		var cod;
		var input;
		for(var i =0; i<list.length;i++){
			
			cod=list[i].cod;
			input=list[i].elem;
			if(input.parentAllowSetValue()){
				input.set_input_value(val[cod]);
			}
		}
		
	}
	this.parentAllowGetValue=function(){
		if(this.noValueMode()){
			return false;	
		}
		if(this.options.get_param_or_def("independentMode.getValue",false)){
			return false;	
		}
		return true;
	}
	this.parentAllowSetValue=function(){
		if(this.noValueMode()){
			return false;	
		}
		if(this.options.get_param_or_def("independentMode.setValue",false)){
			return false;	
		}
		return true;
	}
	this.get_debug_info=function(){
		var info={};
		info.cod=this.cod;
		var p=this.options.get_param_or_def("lbl",false);
		if(p){
			info.lbl=p;
		}
		var list=this.get_children();
		if(list){
			info.children=new Array();
			for(var i=0;i<list.length;i++){
				info.children.push(list[i].get_debug_info());	
			}
		}
		return info;
	}
	
	this.addInputValueIfNotEmpty=function(data,cod){
		var d=this.getInputValueIfNotEmpty();
		if(d){
			data[cod]=d;
			return true;	
		}
	}
	this.getInputValueIfNotEmpty=function(){
		var d=this.get_input_value();
		if(d){
			return d;	
		}
		return false;
		
	}
	this.get_input_value_as_group_IfNotEmpty=function(){
		var num=0;
		if(!this.sub_items_list){
			return false;	
		}
		var list=this.sub_items_list.getElemsList();
		if(!list){
			return false;	
		}
		var d=new Object;
		var cod;
		var input;
		for(var i =0; i<list.length;i++){
			cod=list[i].cod;
			input=list[i].elem;
			if(input.parentAllowGetValue()){
				if(input.addInputValueIfNotEmpty(d,cod)){
					num++;	
				}
				//d[cod]=input.get_input_value();
			}
		}
		if(num>0){
			return d;	
		}
		return false;
	}
	
	this.get_input_value_as_group=function(){
		var d=new Object;
		if(!this.sub_items_list){
			return d;	
		}
		var list=this.sub_items_list.getElemsList();
		if(!list){
			return d;	
		}
		var cod;
		var input;
		for(var i =0; i<list.length;i++){
			cod=list[i].cod;
			input=list[i].elem;
			if(input.parentAllowGetValue()){
				d[cod]=input.get_input_value();
			}
		}
		return d;
	}
	
}
function mw_datainput_item_base(options){
	mw_datainput_item_abs.call(this);
	this.init(options);
	
}
function mw_datainput_item_text(options){
	mw_datainput_item_base.call(this,options);
	this.create_input_elem_set_other_params=function(inputElem){
		inputElem.type="text";
	}
	
	
}



function mw_datainput_item_input(options){
	this.init(options);	
}
mw_datainput_item_input.prototype=new mw_datainput_item_abs();
function mw_datainput_item_file(options){
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
		input.className="form-control";
		input.type="file";
		this.set_def_input_atts_by_cfg(input);//new
		this.set_def_input_atts_more(input);//new
		
		this.update_input_atts(input);
	}
	
	this.init(options);
}
mw_datainput_item_file.prototype=new mw_datainput_item_abs();

function mw_datainput_item_checkbox(options){
	this.init(options);
	this.disabledOnReadOnly=function(){
		return true;
	}
	this.create_input_elem=function(){
		var _this=this;
		var c=document.createElement("input");
		c.type="checkbox";
		c.className="form-check-input";
		c.onchange=function(){_this.on_change_chkbox()};
		c.value=1;
		this.update_input_atts(c);
		return c;
	}
	this.on_change_chkbox=function(){
		this.update_real_input_value();
		this.on_change();
	}

	
	this.get_real_input_elem=function(){
		if(this.real_input_elem){
			return 	this.real_input_elem;
		}
		var _this=this;
		var input=document.createElement("input");
		input.type="hidden";
		var p;
		p=this.get_input_name();
		if(p){
			input.name=p;	
		}
		p=this.get_input_id();
		if(p){
			input.id=p;	
		}
		this.real_input_elem=input
		return this.real_input_elem;
	}
	this.update_real_input_value=function(){
		var v=this.get_input_value();
		this.set_real_input_value(v);
	}
	this.set_real_input_value=function(val){
		if(this.real_input_elem){
			if(val){
				this.real_input_elem.value=1;	
			}else{
				this.real_input_elem.value=0;	
			}
		}
			
	}
	
	this.set_input_value=function(val){
		if(this.input_elem){
			if(val){
				this.input_elem.checked=true;	
			}else{
				this.input_elem.checked=false;	
			}
		}
		this.update_real_input_value(val);
	}
	
	
	this.get_input_value=function(){
		if(this.input_elem){
			if(this.input_elem.checked){
				return 1;	
			}
		}
		return 0;
	}
	
	this.create_container=function(){
		var p;
		var c=document.createElement("div");
		c.className="form-check";
		
		this.frm_group_elem=c;
		
		var real_input=this.get_real_input_elem();
		c.appendChild(real_input);
		var subc=document.createElement("div");
		subc.className="checkbox";
		c.appendChild(subc);
		
		
		
		p=this.options.get_param_or_def("lbl",false);
		var lbl=document.createElement("label");
		lbl.className="form-check-label";
		
		var inputelem=this.get_input_elem();
		if(inputelem){
			lbl.appendChild(inputelem);	
		}
		if(p){
			var textnode = document.createTextNode(p);
			lbl.appendChild(textnode);			
		}
		this.tooltip_target=lbl;
		subc.appendChild(lbl);
		this.create_notes_elem_if_req();
		this.update_real_input_value();
		return c;
	}
	this.get_tooltip_target_elem=function(){
		return this.tooltip_target;	
	}
	
	
}
mw_datainput_item_checkbox.prototype=new mw_datainput_item_abs();


function mw_datainput_item_select(options){
	mw_datainput_item_abs.apply( this, arguments );
	
	
	this.afterInit=function(){
		var list=	this.options.get_param_as_list("optionslist");
		var _this=this;
		if(list){
			mw_objcol_array_process(list,function(data,index){_this.add_option_from_data(data)});	
		}
		list=	this.options.get_param_as_list("optionsgroupslist");
		if(list){
			mw_objcol_array_process(list,function(data,index){_this.add_options_gr_from_data(data)});	
		}
		
		
	}
	this.disabledOnReadOnly=function(){
		return true;
	}

	this.options_list=new mw_arraylist();
	this.final_options_list=new mw_arraylist();
	this.clear_options=function(){
		this.options_list=new mw_arraylist();
		this.final_options_list=new mw_arraylist();
		if(this.input_elem){
			mw_select_removeAllOptions(this.input_elem);	
			var p=this.options.get_param_or_def("placeholder",false);
			var dontaddempty=this.options.get_param_or_def("noemtyoption",false);
			if(!dontaddempty){
				
				var option=document.createElement('option');
				option.value="";
				if(p){
					option.innerHTML=p+"";	
				}
				option.style.color="#999";
				this.input_elem.appendChild(option);
				
			}
		}
		
			
	}
	this.add_option_on_fly=function(cod,option){
		var op=this.add_option(cod,option);
		if(!op){
			return false;	
		}
		if(this.input_elem){
			op.append2select(this.input_elem);
			return op;
		}
		
	}
	
	this.get_selected_option_lbl=function(){
		var op=this.get_selected_option();
		if(op){
			return op.get_lbl()+"";	
		}
		return "";
	}
	this.get_selected_option=function(){
		var cod=this.get_input_value();
		if(!cod){
			return false;	
		}
		var op=this.final_options_list.getItem(cod);
		if(!op){
			return false;	
		}
		return op;
	}
	
	this.create_input_elem=function(){
		var _this=this;
		var c=document.createElement("select");
		c.className="form-control form-select";
		c.onchange=function(){_this.on_change()};
		this.set_def_input_atts(c);
		var p=this.options.get_param_or_def("placeholder",false);
		var dontaddempty=this.options.get_param_or_def("noemtyoption",false);
		if(!dontaddempty){
			
			c.className=c.className+" mw_select_with_placeholder";
			
			var option=document.createElement('option');
			option.value="";
			if(p){
				option.innerHTML=p+"";
				
			}
			option.style.color="#999";
			c.appendChild(option);
			
		}
		if(p=this.options.get_param_or_def("inputaditionaclasses",false)){
			c.className=c.className+" "+p;	
		}
		
		
		
		mw_objcol_array_process(this.options_list.getList(),function(data,index){data.append2select(c)});	
		return c;
	}
	this.add_options_gr_from_data=function(data){
		if(!mw_is_object(data)){
			return false;
		}
		if(!data.cod){
			return false;	
		}
		var op=new mw_datainput_item_select_option_gr(data.cod,data);
		this.add_option_item(op);
	}
	
	this.add_option_from_data=function(data){
		if(!mw_is_object(data)){
			return false;
		}
		if(!data.cod){
			if(!mw_isNumber(data.cod)){
				return false;
			}else{
				data.cod=	data.cod+"";
			}
		}
		//console.log("add_option_from_data",data);
		var op=new mw_datainput_item_select_option(data.cod,data);
		this.add_option_item(op);
	}
	
	
	this.add_option=function(cod,option){
		if(typeof(option)!="object"){
			var n=option;
			option={cod:cod,name:n};	
		}
		
		var op=new mw_datainput_item_select_option(cod,option);
		this.add_option_item(op);
		return op;
	}
	this.add_option_item=function(op){
		var cod=op.cod;
		var r=this.options_list.addItem(op,cod);
		op.add2finalOptionsList(this.final_options_list);
		return r;
			
	}
	
	this.init(options);
	
}

//mw_datainput_item_select.prototype=new mw_datainput_item_abs();

function mw_datainput_item_select_option(cod,data){
	this.data=data;
	this.cod=cod;
	this.add2finalOptionsList=function(listman){
		listman.addItem(this,this.cod);
	}
	this.get_lbl=function(){
		if(this.data.name){
			return this.data.name;
		}
		return this.cod;
	}
	this.get_value=function(){
		return this.cod;
	}
	this.append2select=function(sel){
		var e=this.create_dom_elem();
		if(!e){
			return false;	
		}
		sel.appendChild(e);
		return e;
	}
	this.create_dom_elem=function(){
		var option=document.createElement('option');
		option.innerHTML = this.get_lbl()+"";
		option.value = this.cod;
		return option;
	}
	
}
function mw_datainput_item_select_option_gr(cod,data){
	this.data=data;
	this.cod=cod;
	this.create_options_list=function(){
		this.options_list=new mw_arraylist();
		var list=	this.data.options
		
		if(list){
			var _this=this;
			mw_objcol_array_process(list,function(data,index){_this.add_option_from_data(data)});	
			//mw_objcol_array_process(list);	
		}
			
	}
	this.add_option_from_data=function(data){
		if(!mw_is_object(data)){
			return false;
		}
		if(!data.cod){
			return false;	
		}
		var op=new mw_datainput_item_select_option(data.cod,data);
		return this.options_list.addItem(op,data.cod);
	}
	
	this.add2finalOptionsList=function(listman){
		if(!this.options_list){
			this.create_options_list();	
		}
		mw_objcol_array_process(this.options_list.getList(),function(data,index){data.add2finalOptionsList(listman)});	
		//listman.addItem(this,this.cod);
	}
	
	this.create_dom_elem=function(){
		if(!this.options_list){
			this.create_options_list();	
		}
		var gr=document.createElement('optgroup');
		gr.label = this.get_lbl()+"";
		mw_objcol_array_process(this.options_list.getList(),function(data,index){data.append2select(gr)});	
		
		return gr;
	}
	
	
}
mw_datainput_item_select_option_gr.prototype=new mw_datainput_item_select_option();

function mw_datainput_item_group(options){
	this.init(options);
	this.append_to_container=function(container){
		var finalContainer=container;
		if(this.options.get_param_or_def("hasOwnContainer",false)){
			if(container){
				finalContainer=document.createElement("div");
				container.appendChild(finalContainer);
				this.frm_group_elem=finalContainer;
			}
			//
		}
		
		this.beforeAppend();
		if(!this.sub_items_list){
			return false;	
		}
		var list=this.sub_items_list.getList();
		if(!list){
			return false;	
		}
		for(var i =0; i<list.length;i++){
			list[i].append_to_container(finalContainer);
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
				return r;//modificado
				//return true;
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
	this.getInputValueIfNotEmpty=function(){
		return this.get_input_value_as_group_IfNotEmpty();
	}
	
	this.get_input_value=function(){
		return this.get_input_value_as_group();
	}
}
mw_datainput_item_group.prototype=new mw_datainput_item_abs();

function mw_datainput_item_btnsgroup(options){
	this.append_to_container=function(container){
		this.beforeAppend();
		if(!this.sub_items_list){
			return false;	
		}
		var list=this.sub_items_list.getList();
		if(!list){
			return false;	
		}
		if(!container){
			return false;	
		}
		var c=document.createElement("div");
		c.className="mw-subinterface-btns-container";
		for(var i =0; i<list.length;i++){
			list[i].append_to_container(c);
		}
		container.appendChild(c);
		return true;
	}
	this.init(options);
}
mw_datainput_item_btnsgroup.prototype=new mw_datainput_item_group();
function mw_datainput_item_btn(options){
	this.append_to_container=function(container){
		if(!container){
			return false;	
		}
		this.beforeAppend();
		var e=this.get_input_elem();
		if(e){
			container.appendChild(e);
			this.afterAppend();
			return true;	
		}
	}
	this.append2OtherContainer=function(containerItem){
		if(!this.container){
			this.container=document.createElement("div");
			this.container.className="btn-group";
			var e=this.get_input_elem();
			if(e){
				this.container.appendChild(e);	
			}
		}
		return containerItem.doAppendInputItem(this);
	}
	this.setOnClick=function(fnc){
		
		this.options.set_param(fnc,"onclick");
	}
	this._onClick=function(){
		if(this.options.get_param_or_def("state.disabled",false)){
			return false;	
		}
		
		var fnc=this.options.get_param_if_function("onclick");
		if(fnc){
			fnc(this);	
		}
	}
	this.showLoadingIndicator=function(){
		if(this.loadingJQind){
			this.loadingJQind.show();
		}
	}
	this.hideLoadingIndicator=function(){
		if(this.loadingJQind){
			this.loadingJQind.hide();
		}
	}
	this.create_input_elem=function(){
		var _this=this;
		var p;
		var c=document.createElement("button");
		
		
		c.setAttribute("type","button");
		c.className="btn btn-"+this.options.get_param_or_def("display_mode","default");
		c.onclick=function(){_this._onClick()};
		this.loadingJQind=$('<span class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>');
		this.loadingJQind.appendTo(c);
		this.loadingJQind.hide();
		
		this.lblJQ=$("<span role='status'></span>")
		this.lblJQ.appendTo(c);
		var innerHTML="";
		p=this.options.get_param_or_def("iconClass",false);
		if(p){
			innerHTML="<i class='"+p+"'></i> ";
		}
		p=this.options.get_param_or_def("lbl",false);
		
		if(p){
			innerHTML=innerHTML+p;
		}
		this.lblJQ.html(innerHTML);
		this.set_def_input_atts(c);
		return c;
	}
	
	
	this.init(options);	
}
mw_datainput_item_btn.prototype=new mw_datainput_item_abs();

function mw_datainput_item_submit(options){
	this.append_to_container=function(container){
		if(!container){
			return false;	
		}
		this.beforeAppend();
		var e=this.get_input_elem();
		if(e){
			container.appendChild(e);
			this.afterAppend();
			return true;	
		}
	}
	this._onClick=function(){
		var fnc=this.options.get_param_if_function("onclick");
		if(fnc){
			return fnc(this);	
		}
		return true;
	}
	this.create_input_elem=function(){
		var _this=this;
		var p;
		var c=document.createElement("input");
		c.type=this.options.get_param_or_def("btn_type","submit")
		c.className="btn btn-"+this.options.get_param_or_def("display_mode","default");
		c.onclick=function(){return _this._onClick()};
		this.set_def_input_atts(c);
		p=this.options.get_param_or_def("lbl",false);
		if(p){
			c.value=p;
		}
		//this.setTooltipFromParams(c);
		return c;
	}
	this.setLbl=function(txt){
		
		var ie=this.get_input_elem();
		if(ie){
			$(ie).attr("value",txt);
		}
	}
	
	
	this.init(options);	
}
mw_datainput_item_submit.prototype=new mw_datainput_item_abs();

function mw_datainput_item_textarea(options){
	this.create_input_elem=function(){
		var _this=this;
		var p;
		var c=document.createElement("textarea");
		c.className="form-control";
		c.onchange=function(){_this.on_change()};
		if(this.options.get_param_or_def("validateonkeyup",false)){
			c.onkeyup=function(){_this.on_change()};
				
		}
		p=this.options.get_param_or_def("placeholder",false);
		if(p){
			c.placeholder=p;
		}
		p=this.options.get_param_or_def("rows",false);
		if(p){
			c.rows=p;
		}
		p=this.options.get_param_or_def("cols",false);
		if(p){
			c.cols=p;
		}
		p=this.options.get_param_or_def("maxlength",false);
		if(p){
			//c.maxlength=p;
			c.setAttribute("maxlength",p);
		}
		//this.setTooltipFromParams(c);
		this.set_def_input_atts(c);
		return c;
	}
	this.append2hiddenFrm=function(container){
		if(!container){
			return false;	
		}
		if(this.input_elem){
			var c=document.createElement("div");
			var e=document.createElement("textarea");
			e.value=this.get_input_value();
			e.name=this.get_input_name();
			c.appendChild(e);
			container.appendChild(c);
		}
		
	}
	
	this.init(options);	
}
mw_datainput_item_textarea.prototype=new mw_datainput_item_abs();


