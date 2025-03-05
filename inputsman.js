//2012-10-01 RVH
mw_frm_input_class_manager=function(classname,src,mainfrmman){
	this.classname=classname;	
	this.mainfrmman=mainfrmman;
	this.src=src;
	this.status=0;
	this.params=new mw_obj();
	this.on_load_fncs=new Array();
	this.add_on_load_fnc=function(fnc){
		if(!fnc){
			return false;	
		}
		if(typeof(fnc)!="function"){
			return false;	
		}
		this.on_load_fncs.push(fnc);
		return true;
	}
	this.get_status=function(){
		if(this.status){
			return 	this.status;
		}
		
		if(this.check_loaded()){
			
			return 	this.status;	
		}
		return 	this.status;
		
	}
	this.check_loaded=function(){
		if(this.status==3){
			return 	true;
		}
		var cls = window[this.classname];
		if(cls){
			this.status=3;
			return 	true;
		}


		
	}
	this.is_loaded_and_load=function(){
		
		if(this.check_loaded()){
			return true;	
		}
		this.do_load();
	}
	//c.params
	this.add_css=function(){
		var list=this.params.get_param_as_list("css");
		if(!list){
			return false;	
		}
		for(var i=0;i<list.length;i++){
			mw_load_css(list[i]);	
		}
	}
	this.jsonload=function(){
		if(!this.jselem){
			return false;	
		}
		
		this.jselem.onreadystatechange=null;
		this.on_loaded();
	}
	
	this.onreadystatechange=function(){
		if(!this.jselem){
			return false;	
		}
		this.jselem.onload=null;
		if (this.jselem.readyState in {complete: 1, loaded: 1}) {
			this.on_loaded();	
		}
	}
	
	this.on_loaded=function(){
		this.status=3;
		this.add_css();
		for(var i=0;i<this.on_load_fncs.length;i++){
			this.on_load_fncs[i]();	
		}
	}
	this.do_load=function(){
		var s=this.get_status();
		
		if(s){
			return;	
		}
		var _this=this;
		var jsdodivelement=document.createElement("SCRIPT");
		jsdodivelement.language="javascript";
		jsdodivelement.type="text/javascript";
		jsdodivelement.src=this.src;
		this.status=1;
		this.jselem=jsdodivelement;
		this.jselem.onload = function() {
			_this.jsonload();	
		}
		this.jselem.onreadystatechange = function() {
			_this.onreadystatechange();	
		}
		
		document.body.appendChild(jsdodivelement);
		
	}
	
}
mw_main_frm_manager_classes_loader=function(frm,mainman){
	this.frm=frm;
	this.mainman=mainman;
	this.inputclasses_managers_list=new Array();
	this.inputclasses_managers_waiting=new Object();
	this.inputclasses_manager_index=0;
	this.on_all_loaded=function(){
		this.frm.on_all_req_loaded();	
	}
	this.load_current=function(){
		var man=this.get_current_man();
		if(!man){
			return this.on_all_loaded();
		}
		if(man.check_loaded()){
			this.inputclasses_manager_index++;
			return this.load_current();
		}
		var cod=man.classname;
		var _this=this;
		if(!this.inputclasses_managers_waiting[cod]){
			man.add_on_load_fnc(function(){_this.load_current()});
			this.inputclasses_managers_waiting[cod]=true;
		}
		man.do_load();
	}
	this.get_current_man=function(){
		if(this.inputclasses_managers_list.length<=this.inputclasses_manager_index){
			return false;	
		}
		return this.inputclasses_managers_list[this.inputclasses_manager_index];
	}
	this.load_all=function(){
		var list=this.inputclasses_managers_list;
		var _this=this;
		for(var i=0;i<list.length;i++){
			var man=list[i];
			if(!man.check_loaded()){
				man.add_on_load_fnc(function(){_this.check_all_loaded_and_do()});
				man.do_load();
			}
		}

	}
	this.all_loaded=function(){
		var list=this.inputclasses_managers_list;
		for(var i=0;i<list.length;i++){
			var man=list[i];
			if(!man.check_loaded()){
				return false;
			}
		}
		return true;
			
	}
	this.check_all_loaded_and_do=function(){
		if(this.all_loaded_and_do_done){
			return;	
		}
		
		if(this.all_loaded()){
			this.all_loaded_and_do_done=true;
			return this.on_all_loaded();
		}
	}
	this.load_and_init=function(){
		this.load_all();
		this.check_all_loaded_and_do();
	}
	this.add_req_mans=function(){
		this.inputclasses_managers_list=new Array();
		this.inputclasses_manager_index=0;
		var list=this.mainman.get_inputclasses_managers_list();
		if(list){
			for(var i=0;i<list.length;i++){
				this.inputclasses_managers_list.push(list[i]);	
			}
		}
		
	}
}
mw_main_frm_manager=function(){
	this.frm_managers=new Object();
	this.inputclasses_managers=new Object();
	this.inputclasses_managers_list=new Array();
	this.req_input_classes_loaders=new Array();
	this.get_inputclasses_managers_list=function(){
		return this.inputclasses_managers_list;	
	}
	
	this.add_req_input_class_man=function(icm){
		var cod=icm.classname;
		if(!cod){
			return false;	
		}
		if(this.inputclasses_managers[cod]){
			return false;
		}
		this.inputclasses_managers[cod]=icm;
		this.inputclasses_managers_list.push(icm);
		return icm;
	}
	this.new_req_input_classes_loader=function(frm){
		var l=new mw_main_frm_manager_classes_loader(frm,this);
		l.add_req_mans();
		this.req_input_classes_loaders.push(l);
		return l;
	}
	
	
	this.all_req_input_classes_loaded=function(){
		alert("all_req_input_classes_loaded old mode");
		return false;
		var r=true;
		for(var cod in 	this.inputclasses_managers){
			if(!this.inputclasses_managers[cod].is_loaded_and_load()){
				
				r=false;
			}
		}
		return r;
	}
	this.get_current_time_cod=function(){
		if(this.current_time_cod){
			return this.current_time_cod;	
		}
		var d=new Date();
		this.current_time_cod=d.getFullYear()+""+d.getMonth()+""+d.getDay()+""+d.getHours()+""+d.getMinutes();
		return this.current_time_cod;	
	}
	this.get_input_class_man=function(classname){
		if(!classname){
			return false;	
		}
		if(typeof(classname)!="string"){
			return false;	
		}
		if(this.inputclasses_managers[classname]){
			return 	this.inputclasses_managers[classname];
		}
		
		var prefok="mw_input_elem_";
		var len=prefok.length;
		var pref=classname.substring(0,len);
		if(pref!=prefok){
			return false;	
		}
		var post=classname.substring(len);
		var src="/res/js/inputsman/"+post+".js?_t="+this.get_current_time_cod();
		var icm=new mw_frm_input_class_manager(classname,src,this);
		return this.add_req_input_class_man(icm);
		
	}
	this.get_existing_input_class_man=function(classname){
		if(!classname){
			return false;	
		}
		if(typeof(classname)!="string"){
			return false;	
		}
		if(this.inputclasses_managers[classname]){
			return 	this.inputclasses_managers[classname];
		}
		
	}

	this.load_input_class=function(classname){
		if(!classname){
			return false;	
		}
		if(typeof(classname)!="string"){
			return false;	
		}
		var m=this.get_input_class_man(classname);
		if(m){
			return m.do_load();	
		}
		
		
		
	}
	this.load_input_classes=function(classes){
		if(!classes){
			return false;	
		}
		if(typeof(classes)!="string"){
			return false;	
		}
		var l=classes.split(",");
		for(var x=0; x<l.length;x++){
			this.load_input_class(l[x]);	
		}
	}
	this.get_input_classes=function(classes){
		if(!classes){
			return false;	
		}
		if(typeof(classes)!="string"){
			return false;	
		}
		var l=classes.split(",");
		var r=new Array();
		var o;
		for(var x=0; x<l.length;x++){
			o=this.get_input_class_man(l[x]);
			if(o){
				r.push(o);	
			}
		}
	}
	this.add_input_class_man_by_cod_or_obj=function(c){
		if(!c){
			return false;
		}
		if(typeof(c)=="object"){
			var n=c.name;
			var src=c.src;
			if(n){
				var man=this.get_existing_input_class_man(n);
				if(!man){
					if(src){
						var icm=new mw_frm_input_class_manager(n,src,this);
						if(c.params){
							icm.params.set_params(c.params);	
						}
						return this.add_req_input_class_man(icm);
					}
				}
			}
		}else{
			if(c){
				return 	this.get_input_class_man(c);
			}
		}
	}
	this.create_frm_manager_bt_mode=function(frmname,classes,after_create){
		
		var frmman=this.do_create_frm_manager(frmname);
		if(!frmman){
			return false;
		}
		
		frmman.bt_mode=true;
		
		if(classes){
			if(typeof(classes)=="object"){
				for(var i=0;i<classes.length;i++){
					
					this.add_input_class_man_by_cod_or_obj(classes[i]);	
				}
			}
		}
		
		if(after_create){
			if(typeof(after_create)=="object"){
				for(var i=0;i<after_create.length;i++){
					//alert(after_create[i]);
					frmman.add_after_create_fnc(after_create[i]);	
				}
				
			}
		}
		return frmman.load_classes_and_init();
		
		
		
	}
	
	this.create_frm_manager_load_scripts=function(frmname,classes){
		
		var frmman=this.do_create_frm_manager(frmname);
		if(!frmman){
			return false;
		}
		this.get_input_classes(classes);
		var fnc;
		
		for(var i=2; i<arguments.length; i++) {
			fnc=arguments[i];
			if(typeof(fnc)=="function"){
				
				frmman.add_after_create_fnc(fnc);
			}
		}
		
		return frmman.load_classes_and_init();
		
		
	}
	this.do_create_frm_manager=function(frmname){
		var frm=document.forms[frmname];
		if(!frm){
			return false;	
		}
		
		var frmman=new mw_frm_man();
		frmman.set_frm(frm);
		
		frmman.set_main_man(this);
		if(!this.frm_managers[frmname]){
			this.frm_managers[frmname]=frmman;
			
		}
		
		return frmman;
		
	}

	this.create_frm_manager=function(frmname){
		
		var frmman=this.do_create_frm_manager(frmname);
		if(!frmman){
			return false;
		}
		
		var fnc;
		
		for(var i=1; i<arguments.length; i++) {
			fnc=arguments[i];
			if(typeof(fnc)=="function"){
				frmman.add_after_create_fnc(fnc);
			}
		}
		
		return frmman.do_after_create();
		
	}
	
};

var ___mw_main_frm_manager=new mw_main_frm_manager();

mw_frm_man=function(){
	this.input_managers=new Object();
	this.after_create_fncs=new Array();
	this.load_classes_trys=0;
	this.lng_msg=new mw_obj();

	
};
mw_frm_man.prototype.is_bt_mode=function(){
	return this.bt_mode;	
}
//
mw_frm_man.prototype.on_all_req_loaded=function(){
	return this.do_after_create();	
}
mw_frm_man.prototype.load_classes_and_init=function(){
	if(!this.main_man){
		return false;	
	}
	this.req_loader=this.main_man.new_req_input_classes_loader(this);
	this.req_loader.load_and_init();
}

mw_frm_man.prototype.set_main_man=function(man){
	this.main_man=man;
}
mw_frm_man.prototype.add_after_create_fnc=function(fnc){
	if(typeof(fnc)=="function"){
		this.after_create_fncs.push(fnc);		
	}
}
mw_frm_man.prototype.do_after_create=function(){
	var fnc;
	var _this=this;
	
	for(var i=0; i<this.after_create_fncs.length; i++) {
		fnc=this.after_create_fncs[i];
		if(typeof(fnc)=="function"){
			fnc(this);	
		}
	}
	
	return this.init();

}
mw_frm_man.prototype.set_confirm_on_submit=function(msg){
	if(!msg){
		this.confirm_on_submit=false;
		return false;	
	}
	this.confirm_on_submit=msg;
	return true;

}

mw_frm_man.prototype.init=function(){
	
	this.init_inputs();
	this.after_all_inputs_init_done();
	this.after_preparation();
	return true;
}
mw_frm_man.prototype.after_all_inputs_init_done=function(){
	for (var c in this.input_managers){
		this.input_managers[c].do_after_all_init_done();	
	}
}
mw_frm_man.prototype.onFrmSubmit=function(){
	
	this.onFrmSubmitBeforeCheckCus();
	if(this.cant_submit){
		return false;	
	}
	
	if(this.confirm_on_submit){
		if(!confirm(this.confirm_on_submit)){
			return false;	
		}
	}
	if(!this.check_before_submit()){
		if(this.ask_before_submit_debug){
			alert("Submit check fail");	
		}
		
		return false;
	}
	if(this.ask_before_submit_debug){
		if(!confirm("Submit check ok. Continue?")){
			return false;	
		}
			
	}
	if(!this.allowresubmit){
		this.cant_submit=true;
	}

	if(this.disable_on_submit){
		this.cant_submit=true;
		this.disable_all_submit_btns();
	}
	return this.onFrmSubmitAfterCheckCus();
	return true;	
}
mw_frm_man.prototype.onFrmSubmitBeforeCheckCus=function(){
	
}
mw_frm_man.prototype.onFrmSubmitAfterCheckCus=function(){
	return true;	
}

mw_frm_man.prototype.disable_all_submit_btns=function(enable){
	var dis=true;
	if(enable){
		dis=false;	
	}
	
	if(!this.frm){
		return false;	
	}
	var e;
	for ( var i = 0; i < this.frm.elements.length; i++ ) {
		e= this.frm.elements[i];
		if(e){
			if(e.tagName=="INPUT"){
				if(e.type=="submit"){
					e.disabled=dis;
				}
			}
		}
	}
	
}

mw_frm_man.prototype.check_before_submit_fail=function(){
	this.check_before_submit_ok=false;	
}
mw_frm_man.prototype.check_before_submit=function(){
	this.check_before_submit_ok=true;
	var i;
	var fnc;
	if(this.check_before_submit_events){
		for(i=0;i<this.check_before_submit_events.length;i++){
			fnc=this.check_before_submit_events[i];
			if(typeof(fnc)=="function"){
				fnc(this);
			}
		}
	}
	if(this.input_managers){
		for (var c in this.input_managers){
			this.input_managers[c].check_before_submit();	
		}
	}
	return this.check_before_submit_ok;
	
}
mw_frm_man.prototype.add_check_before_submit=function(fnc){
	if(typeof(fnc)!="function"){
		return false;
	}
	if(!this.check_before_submit_events){
		this.check_before_submit_events=new Array();
	}
	this.check_before_submit_events.push(fnc);
}


mw_frm_man.prototype.set_frm=function(frm){
	if(!frm){
		return false;	
	}
	this.frm=frm;
	this.before_preparation();

	var _this=this;
	this.frm.onsubmit=function(){return _this.onFrmSubmit()};
}
mw_frm_man.prototype.before_preparation=function(){
	
	if(!this.frm){
		return false;
	}
	mw_hide_obj(this.frm);
	
	return true;
}
mw_frm_man.prototype.after_preparation=function(){
	if(!this.frm){
		return false;
	}
	
	mw_show_obj(this.frm);
	return true;
}

mw_frm_man.prototype.init_inputs=function(){
	for (var c in this.input_managers){
		this.input_managers[c].do_init();	
	}
}
mw_frm_man.prototype.add_input_manager_bt_mode=function(man){
	if(!man){
		return false;	
	}
	if(typeof(man)!="object"){
		return false;
	}
	var c=man.get_str_cod();
	
	if(c){
		
		if(this.add_input_manager(c,man)){
			man.bt_mode=true;
			man.set_frm_man(this);
			man.check_preinit();	
		}
	}
	
	
}
mw_frm_man.prototype.add_input_managers_bt_mode=function(list){
	
	if(!list){
		return false;	
	}
	
	if(typeof(list)!="object"){
		return false;
	}
	for(var i=0;i<list.length;i++){
		this.add_input_manager_bt_mode(list[i]);	
	}
}
mw_frm_man.prototype.get_input_manager=function(code){
	if(!code){
		return false;	
	}
	if(!this.input_managers){
		return false;	
	}
	if(this.input_managers[code]){
		return this.input_managers[code];	
	}
	return false;
}

mw_frm_man.prototype.add_input_manager=function(code,man){
	if(this.input_managers[code]){
		return false;	
	}
	this.input_managers[code]=man;
	
	return true;
}


mw_frm_man.prototype.get_input=function(inputname){
	if(!this.frm){
		return false;	
	}
	if(this.frm[inputname]){
		return this.frm[inputname];	
	}
}
mw_frm_man.prototype.init_labels_for=function(){
	if(this.labels_for){
		return true;	
	}
	if(!this.frm){
		return false;	
	}
	this.labels_for=new Object();
	var labels=this.frm.getElementsByTagName("LABEL");
	if(!labels){
		return true;	
	}
	var forid;
	for (var z=0;z<labels.length;z++){
		forid=labels[z].htmlFor;
		if(forid){
			this.labels_for[forid]=	labels[z];
		}
	}
	return true;	

}
mw_frm_man.prototype.get_label_for=function(id){
	if(!id){
		return false;	
	}
	if(!this.init_labels_for()){
		return false;
	}
	return this.labels_for[id];
}

mw_input_elem_abs=function(){};
mw_input_elem_abs.prototype.is_bt_mode=function(){
	return this.bt_mode;	
}
mw_input_elem_abs.prototype.setTooltipFromParams=function(elem){
	if(!elem){
		return false;	
	}
	var p=this.get_param("tooltip");
	if(!mw_is_object(p)){
		return false;		
	}
	if(!p["placement"]){
		p["placement"]="auto bottom";
	}
	$($(elem)).tooltip(p);
}

mw_input_elem_abs.prototype.is_empty=function(){
	var v=this.get_value();
	if(v){
		return false;	
	}
	if(mw_isNumber(v)){
		return false;	
	}
	return true;
}

mw_input_elem_abs.prototype.get_value=function(){
	var input=this.get_input();	
	if(!input){
		return false;	
	}
	return input.value;
	
}

mw_input_elem_abs.prototype.set_value=function(val){
	var input=this.get_input();	
	if(!input){
		return false;	
	}
	input.value=val;
	return true;
	
}

mw_input_elem_abs.prototype.get_other_man_value=function(code){
	var m=this.get_other_man(code);
	if(m){
		return m.get_value();	
	}
	return false;
}

mw_input_elem_abs.prototype.get_other_man=function(code){
	if(!this.frm_man){
		return false;	
	}
	return this.frm_man.get_input_manager(code);
}


mw_input_elem_abs.prototype.set_params=function(params){
	if(!params){
		params=new Object;	
	}
	if(typeof(params)!="object"){
		return false;	
	}
	this.params=params;
}
mw_input_elem_abs.prototype.create_help_elem=function(){
	this.help_elem=document.createElement("p");
	this.help_elem.className="help-block";
	return this.help_elem;
}
mw_input_elem_abs.prototype.clear_error_msg=function(){
	this.set_help_elem_cont(false);
	var elemgr=this.get_form_group_elem();	
	if(elemgr){
		elemgr.className="form-group";
	}
	
}
mw_input_elem_abs.prototype.on_set_validation_function=function(){
}
mw_input_elem_abs.prototype.set_validation_function=function(fnc){
	if(typeof(fnc)=="function"){
		this.validation_function=fnc;
		this.on_set_validation_function();
		return true;
	}
	return false;
}
mw_input_elem_abs.prototype.validation_function_after_change=function(){
	if(!this.validation_function){
		return true;
	}
	if(this.validation_function(this)){
		return true;
	}else{
		return false;	
	}
		
}
mw_input_elem_abs.prototype.setDisabled=function(val){
	if(val){
		val=true;	
	}else{
		val=false;	
	}
	var i=this.get_input();
	if(i){
		i.disabled=val;	
	}
	
	
}

mw_input_elem_abs.prototype.validation_function_before_submit_fail=function(){
	if(!this.validation_function){
		return false;
	}
	if(this.validation_function(this)){
		return false;
	}
	this.check_before_submit_fail();
	return true;
}



mw_input_elem_abs.prototype.set_validation_status=function(msg,status){
	//status=0 normal, 1 success, 2 warning 3 erro
	this.set_help_elem_cont(msg);
	var elemgr=this.get_form_group_elem();	
	if(elemgr){
		if(status==1){
			elemgr.className="form-group has-success";
		}else if(status==2){
			elemgr.className="form-group has-warning";
		}else if(status==3){
			elemgr.className="form-group has-error";
		}else{
			elemgr.className="form-group";	
		}
	}
	
}
mw_input_elem_abs.prototype.set_validation_status_normal=function(msg){
	return this.set_validation_status(msg,0);	
}
mw_input_elem_abs.prototype.set_validation_status_success=function(msg){
	return this.set_validation_status(msg,1);	
}
mw_input_elem_abs.prototype.set_validation_status_warning=function(msg){
	return this.set_validation_status(msg,2);	
}
mw_input_elem_abs.prototype.set_validation_status_error=function(msg){
	return this.set_validation_status(msg,3);	
}

mw_input_elem_abs.prototype.set_error_msg=function(msg){
	
	this.set_help_elem_cont(msg);
	this.check_before_submit_fail();
	var elemgr=this.get_form_group_elem();	
	if(elemgr){
		
		elemgr.className="form-group has-error";
	}
	
		
}

mw_input_elem_abs.prototype.set_help_elem_cont=function(cont){
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
mw_input_elem_abs.prototype.get_form_group_elem_for_elem=function(elem){
	if(!elem){
		return false;	
	}
	if(elem.nodeName=="DIV"){
		var cn=elem.className+"";
		if(cn.indexOf("form-group") > -1){
			return elem;	
		}
	}
	return this.get_form_group_elem_for_elem(elem.parentNode);

}
mw_input_elem_abs.prototype.get_form_group_elem=function(){
	if(this.form_group_elem){
		return this.form_group_elem;	
	}
	if(!this.is_bt_mode()){
		return false;
	}
	var input=this.get_input();	
	if(!input){
		return false;	
	}
	var e=this.get_form_group_elem_for_elem(input);
	if(e){
		this.form_group_elem=e;
		return e;	
	}
	return false;
		
}

mw_input_elem_abs.prototype.get_help_elem=function(){
	if(this.help_elem){
		return this.help_elem;	
	}
	this.create_help_elem();
	if(!this.help_elem){
		return false;
	}
	var elemgr=this.get_form_group_elem();	
	if(!elemgr){
		return false;	
	}
	elemgr.appendChild(this.help_elem);
	return this.help_elem;

	//this.help_elem=
}

mw_input_elem_abs.prototype.check_before_submit_fail=function(){
	this.check_before_submit_ok=false;
	if(this.frm_man){
		this.frm_man.check_before_submit_fail();	
	}
	
}
mw_input_elem_abs.prototype.check_before_submit=function(){
	this.check_before_submit_ok=true;
	var i;
	var fnc;
	if(this.check_before_submit_events){
		for(i=0;i<this.check_before_submit_events.length;i++){
			fnc=this.check_before_submit_events[i];
			if(typeof(fnc)=="function"){
				fnc(this);
			}
		}
	}
	if(this.validation_function_before_submit_fail()){
		return false;	
	}
	return this.check_before_submit_ok;
	
}
mw_input_elem_abs.prototype.add_check_before_submit=function(fnc,clear_error_msg_afterchange){
	if(typeof(fnc)!="function"){
		return false;
	}
	if(!this.check_before_submit_events){
		this.check_before_submit_events=new Array();
	}
	this.check_before_submit_events.push(fnc);
	if(clear_error_msg_afterchange){
		this.clear_error_msg_afterchange=true;	
	}
}
mw_input_elem_abs.prototype.get_str_cod=function(){
	return this.inputname;

}
mw_input_elem_abs.prototype.add_after_change_event=function(fnc){
	if(typeof(fnc)!="function"){
		return false;
	}
	if(!this.after_change_events){
		this.after_change_events=new Array();
	}
	this.after_change_events.push(fnc);
}
mw_input_elem_abs.prototype.do_after_change_events=function(){
	if(this.clear_error_msg_afterchange){

		this.clear_error_msg();	
	}
	this.continue_do_after_change_events=true;//to be changed in validation funtion or in afterchange events
	this.validation_function_after_change();
	var i;
	var fnc;
	if(this.after_change_events){
		for(i=0;i<this.after_change_events.length;i++){
			fnc=this.after_change_events[i];
			if(typeof(fnc)=="function"){
				if(this.continue_do_after_change_events){
					
					fnc(this);
				}
			}
		}
	}
	
}

mw_input_elem_abs.prototype.get_param=function(cod){
	if(!cod){
		return false;
	}
	if(!this.params){
		return false;
	}
	return this.params[cod];
}
mw_input_elem_abs.prototype.pre_init=function(frmman,inputname,params){
	if(typeof(frmman)=="string"){
		//this.set_frm_on_add=true;
		//this.set_frm_man(frmman);
		this.set_inputname(frmman);
		this.set_params(inputname);
		return;
		
	}
	this.set_frm_man(frmman);
	this.set_inputname(inputname);
	this.set_params(params);

}
mw_input_elem_abs.prototype.check_preinit=function(){
	
	if(!this.get_input()){
		return false;	
	}
	return true;
}
mw_input_elem_abs.prototype.do_init=function(){
	if(!this.check_preinit()){
		return false;	
	}
	return this.init();
}
mw_input_elem_abs.prototype.get_label=function(){
	if(this.label){
		return this.label;	
	}
	if(!this.get_input()){
		return false;
	}
	var id=this.input.getAttribute("id");
	if(!id){
		return false;	
	}
	if(!this.frm_man){
		return false;	
	}
	var l=this.frm_man.get_label_for(id);
	if(l){
		this.label=l;
		return this.label;	
	}
	
}
mw_input_elem_abs.prototype.is_required=function(){
	if(this.required){
		return true;	
	}
	var i=this.get_input();	
	if(!i){
		return false;	
	}
	if(i.required){
		return true;	
	}
	return false;
}

mw_input_elem_abs.prototype.get_input=function(){
	if(this.input){
		return this.input;	
	}
	if(!this.frm_man){
		return false;	
	}
	if(!this.inputname){
		return false;	
	}
	var i=this.frm_man.get_input(this.inputname);
	if(!i){
		return false;
	}
	this.input=i;
	if(i.required){
		this.required=true;	
	}
	
	return this.input;	
}
mw_input_elem_abs.prototype.set_inputname=function(inputname){
	this.inputname=inputname;
}
mw_input_elem_abs.prototype.set_frm_man=function(man){
	this.frm_man=man;
}
mw_input_elem_abs.prototype.init=function(){
	//
}
mw_input_elem_abs.prototype.after_all_init_done=function(){
	//
}
mw_input_elem_abs.prototype.after_all_init_done_events_bt_mode_special=function(){
	this.after_all_init_done_events_bt_mode_special_required();
	
}
mw_input_elem_abs.prototype.get_frm_man_lng_msg=function(cod,def){
	if(!this.frm_man){
		return def;	
	}
	return this.frm_man.lng_msg.get_param_or_def(cod,def);

		
}

mw_input_elem_abs.prototype.check_before_submit_required=function(){
	if(!this.is_required()){
		return true;
	}
	if(!this.is_empty()){
		return true;
	}
	var msg=this.get_frm_man_lng_msg("field_required","Field required");
	this.set_error_msg(msg);
	
	
	
}
mw_input_elem_abs.prototype.after_all_init_done_events_bt_mode_special_required=function(){
	if(!this.is_required()){
		return false;	
	}
	var _this=this;
	this.add_check_before_submit(function(){_this.check_before_submit_required()});
	this.add_after_change_event(function(){_this.clear_error_msg()});
}

mw_input_elem_abs.prototype.after_all_init_done_bt_mode=function(){
	this.after_all_init_done_events_bt_mode();
	this.after_all_init_done_events_bt_mode_special();
}
mw_input_elem_abs.prototype.after_all_init_done_events_bt_mode=function(){
	var events=this.get_param("afteriniteventsbtmode");
	if(!events){
		return false;
	}
	if(typeof(events)!=="object"){
		return false;	
	}
	for(var i=0;i<events.length;i++){
		if(typeof(events[i])=="function"){
			events[i](this);
		}
	}
	
}

mw_input_elem_abs.prototype.after_all_init_done_events=function(){
	var events=this.get_param("afterinitevents");
	if(!events){
		return false;
	}
	if(typeof(events)!=="object"){
		return false;	
	}
	for(var c in events){
		if(typeof(events[c])=="function"){
			events[c](this);	
		}
	}
	
}

mw_input_elem_abs.prototype.do_after_all_init_done=function(){
	if(!this.check_preinit()){
		return false;	
	}
	this.after_all_init_done();
	this.after_all_init_done_events();
	if(this.is_bt_mode()){
		this.after_all_init_done_bt_mode();
		
	}

}
function mw_input_elem_def(frmman,inputname,params){
	this.pre_init(frmman,inputname,params);
}
mw_input_elem_def.prototype=new mw_input_elem_abs();

mw_input_elem_def.prototype.on_set_validation_function=function(){
	var i=this.get_input();
	if(i){
		var _this=this;
		if(!this.get_param("omitValidationOnKeyUp")){
			i.onkeyup=function(){_this.validation_function_after_change()};	
		}
	}
}

mw_input_elem_def.prototype.init=function(){
	var _this=this;
	var _input=this.get_input();
	var _param;
	if(!_input){
		return false;	
	}
	this.setTooltipFromParams(_input);
	
	
	if(this.get_param("int")){
		this.add_after_change_event(function(){
			if(!mw_isNumber(_input.value)){
				_input.value="";
				return;	
			}
			_input.value=mw_getInt(_input.value);	
			
		});	
	}
	if(this.get_param("decimal")){
		this.add_after_change_event(function(){
			if(!mw_isNumber(_input.value)){
				_input.value="";
				return;	
			}
			_input.value=mw_getNumber(_input.value);	
			
		});	
	}
	_param=this.get_param("num_min");
	if(mw_isNumber(_param)){
		
		this.add_after_change_event(function(){
			if(!mw_isNumber(_input.value)){
				_input.value="";
				return;	
			}
			var _ref=mw_getNumber(_this.get_param("num_min"));
			var _v=mw_getNumber(_input.value);
			if(_v<_ref){
				_input.value="";	
			}else{
				_input.value=_v;		
			}
			
		});	
		
	}
	_param=this.get_param("num_max");
	if(mw_isNumber(_param)){
		
		this.add_after_change_event(function(){
			
			if(!mw_isNumber(_input.value)){
				_input.value="";
				return;	
			}
			
			var _ref=mw_getNumber(_this.get_param("num_max"));
			var _v=mw_getNumber(_input.value);
			
			if(_v>_ref){
				_input.value="";	
			}else{
				_input.value=_v;		
			}
			
		});	
		
	}

	
	_input.onchange=function(){_this.do_after_change_events()}	
	
}


function mw_input_elem_chkbox(frmman,inputname,params){
	this.pre_init(frmman,inputname,params);
}
mw_input_elem_chkbox.prototype=new mw_input_elem_abs();
mw_input_elem_chkbox.prototype.isChecked=function(){
	if(!this.chkbox){
		return false;	
	}
	if(this.chkbox.checked){
		return true;		
	}
	return false;	
	
}
mw_input_elem_chkbox.prototype.onLabelClick=function(){
	var val=true;
	if(!this.input){
		return false;	
	}
	if(!this.chkbox){
		return false;	
	}
	if(this.input.disabled){
		return false;	
	}
	if(this.chkbox.checked){
		val=false;	
	}
	this.chkbox.checked=val;
	if(val){
		this.input.value=1;	
	}else{
		this.input.value=0;	
	}
	this.do_after_change_events();
	
}
mw_input_elem_chkbox.prototype.get_value=function(){
	return this.isChecked();
}
mw_input_elem_chkbox.prototype.set_value=function(val){
	if(!this.input){
		return false;	
	}
	if(!this.chkbox){
		return false;	
	}
	if(val){
		this.input.value=1;	
		this.chkbox.checked=true;
	}else{
		this.input.value=0;	
		this.chkbox.checked=false;
	}
	
	
	
}


mw_input_elem_chkbox.prototype.init=function(){
	var np=this.input.parentNode;
	if(!np){
		return false;	
	}
	this.chkbox=document.createElement("input");
	this.chkbox.type="checkbox";
	this.chkbox.className="form-check-input";
	if(mw_getNumber(this.input.value)){
		this.chkbox.checked=true;
	}else{
		this.chkbox.checked=false;
		this.input.value=0;
	}
	var _this=this;
	this.chkbox.onchange=function(){
		if(this.checked){
			_this.input.value=1;
			_this.do_after_change_events();
			
		}else{
			_this.input.value=0;
			_this.do_after_change_events();		
		}
	}
	if(this.input.disabled){
		this.chkbox.disabled=true;
	}
	if(this.input.required){
		this.chkbox.required=this.input.required;
		
	}
	np.insertBefore(this.chkbox,this.input);
	this.setTooltipFromParams(np);
	//this.setTooltipFromParams(this.chkbox);
	var lbl=this.get_label();
	if(lbl){
		lbl.onclick=function(){_this.onLabelClick()}
		//this.setTooltipFromParams(lbl);
	}
	
	mw_hide_obj(this.input);
	
}