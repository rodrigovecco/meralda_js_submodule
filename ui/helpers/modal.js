function mwuihelper_modal_populator(params){
	this.params=new mw_obj();
	this.body_input_data=new mw_obj();
	this.actions=new mw_objcol();
	this.create_actions_by_list=function(){
		var list=this.params.get_param_as_list("actions");
		if(!list){
			return false;	
		}
		var _this=this;
		mw_objcol_array_process(list,function(elem){_this.add_action_obj(elem)});
	}
	this.add_footer_btn_by_action_cod=function(cod){
		if(!cod){
			return false;	
		}
		var action=this.actions.get_item(cod);
		if(!mw_is_object(action)){
			return false;
		}
		if(!mw_is_object(action.btn)){
			return false;
		}
		if(!mw_is_object(action.btn.options)){
			return false;
		}
		var _this=this;
		var btn=action.btn;
		if(!btn.options.get_param_if_function("onclick")){
			btn.options.set_param(function(){_this.do_action(cod)},"onclick");
		}
		if(this.footer_input){
			this.footer_input.addItem(btn,cod);	
		}
	}
	this.add_action_obj=function(action){
		if(!mw_is_object(action)){
			return false;
		}
		var cod=action.cod;
		if(!cod){
			return false;	
		}
		return this.actions.add_item(cod,action);	
	}
	
	this.add_action=function(cod,action){
		return this.actions.add_item(cod,action);	
	}
	this.do_action=function(cod){
		var action=this.actions.get_item(cod);
		if(!action){
			return false;	
		}
		if(mw_is_function(action)){
			return 	action(this);
		}
		if(mw_is_object(action)){
			if(mw_is_function(action["exec"])){
				return 	action.exec(this);
			}
		}
	}
	
	this.params.set_params(params);
	this.get_title=function(){
		return 	this.params.get_param_or_def("title","");
	}
	this.set_body_input_data=function(data,cod){
		this.body_input_data.set_param(data,cod);
	}
	
	this.validate_and_submit_body_frm=function(){
		if(!this.validate_body_frm()){
			return false;	
		}
		if(!this.body_frm){
			return false;	
		}
		var fnc=this.params.get_param_if_function("onSubmitFrm");
		if(fnc){
			if(fnc(this)===false){
				return false;	
			}
		}
		this.body_frm.submit();
		this.hide();
		
	}
	this.validate_body_frm=function(){
		if(!this.body_input){
			return false;	
		}
		return this.body_input.validate();
	}
	
	this.set_body_input=function(input){
		this.body_input=input;	
	}
	this.set_footer_input=function(input){
		
		this.footer_input=input;	
	}
	this.init_inputs=function(){
		if(this.init_inputs_done){
			return;	
		}
		this.init_inputs_done=true;
		var fnc;
		this.create_actions_by_list();
		fnc=this.params.get_param_if_function("create_actions");
		if(fnc){
			fnc(this);	
		}
		fnc=this.params.get_param_if_function("create_body_input");
		if(fnc){
			fnc(this);	
		}
		fnc=this.params.get_param_if_function("create_footer_input");
		if(fnc){
			fnc(this);	
		}
		this.auto_create_footer_input();
		
	}
	this.auto_create_footer_input=function(){
		if(!this.params.get_param_or_def("autocreate_footer_input",false)){
			return false;
		}
		var _this=this;
		
		var gr=this.footer_input;
		if(!this.footer_input){
			gr = new mw_datainput_item_btnsgroup();
			this.set_footer_input(gr);	
		}
		var list=this.params.get_param_as_list("footer_btns_actions_cods");
		if(list){
			
			mw_objcol_array_process(list,function(elem){_this.add_footer_btn_by_action_cod(elem)});
		}
		
		
	}
	this.populate_footer=function(container){
		this.init_inputs();
		var footer_cont=this.params.get_param_or_def("footer_cont",false);
		if(footer_cont){
			mw_dom_append_cont(container,footer_cont);	
		}
		
		if(this.footer_input){
			this.footer_input.append_to_container(container);
		}
		footer_cont=this.params.get_param_or_def("footer_final_cont",false);
		if(footer_cont){
			mw_dom_append_cont(container,footer_cont);	
		}
		
	}
	this.get_footer=function(){
		if(this.params.get_param_or_def("nofooter",false)){
			return false;	
		}
		var elem=document.createElement("div");
		this.populate_footer(elem);
		return elem;
	}
	this.create_body_frm=function(){
		this.body_frm=document.createElement("form");
		this.body_frm.action=this.params.get_param_or_def("frm.action","");
		this.body_frm.id=this.params.get_param_or_def("frm.id","");
		this.body_frm.name=this.params.get_param_or_def("frm.name","");
		this.body_frm.method=this.params.get_param_or_def("frm.method","post");
		this.body_frm.enctype=this.params.get_param_or_def("frm.enctype","multipart/form-data");
		this.body_frm.target=this.params.get_param_or_def("frm.target","");
		/*
		if(this.params.get_param_or_def("frm.inline",false)){
			this.body_frm.className="";	
		}
		*/
		return this.body_frm;
	}
	this.populate_body=function(container){
		this.init_inputs();
		if(!container){
			return false;	
		}
		var body_cont=this.params.get_param_or_def("body_cont",false);
		if(body_cont){
			mw_dom_append_cont(container,body_cont);	
		}
		var bincontainer=container;
		if(this.params.get_param_or_def("frm.enabled",false)){
			var frm=this.create_body_frm();
			container.appendChild(frm);	
			bincontainer=	frm;
		}
		if(this.body_input){
			
			this.body_input.append_to_container(bincontainer);
			this.body_input.set_input_value(this.body_input_data.get_param());
		}
		body_cont=this.params.get_param_or_def("body_final_cont",false);
		if(body_cont){
			mw_dom_append_cont(container,body_cont);	
		}
		
		
		return true;
		
		//elem.innerHTML="xxx";
		//container.appendChild(elem);	
	}
	
	this.get_body=function(){
		var elem=document.createElement("div");
		this.populate_body(elem);
		return elem;
	}
	this.get_title=function(){
		return 	this.params.get_param_or_def("title","");
	}
	
	this.populate=function(modal){
		if(modal){
			this.set_modal(modal);	
		}
		if(!this.modal){
			return false;	
		}
		this.modal.set_title(this.get_title());
		this.modal.set_footer(this.get_footer());
		this.modal.set_body(this.get_body());
		
	}
	this.show=function(modal){
		if(modal){
			this.populate(modal);	
		}
		
		if(this.modal){
			return this.modal.show();	
		}
	}
	this.hide=function(modal){
		if(this.modal){
			return this.modal.hide();	
		}
	}
	this.set_modal=function(modal){
		this.modal=modal;
		if(this.modal){
			this.modal.set_size(this.params.get_param_or_def("size",false));	
		}
	}
	this.set_title=function(title){
		this.params.set_param(title,"title");
	}
	this.set_body_cont=function(cont){
		this.params.set_param(cont,"body_cont");
	}
}
function mwuihelper_modal_populator_yes_no(params){
	this.params=new mw_obj();
	this.body_input_data=new mw_obj();
	this.actions=new mw_objcol();
	this.noClick=function(){
		this.hide();
		this.afterNoClick();
	}
	this.afterNoClick=function(){
			
	}
	this.afterYesClick=function(){
			
	}
	this.yesClick=function(){
		this.hide();
		this.afterYesClick();
	}
	this.init_dafault=function(yesdanger){
		this.set_def_params();
		if(yesdanger){
			this.set_as_danger_on_yes();	
		}
		this.create_def_footer_input();
	}
	this.set_def_params=function(){
		this.params.set_param("small","size");
	}
	this.set_as_danger_on_yes=function(){
		this.params.set_param("success","btns.no.display_mode");
		this.params.set_param("danger","btns.yes.display_mode");
		
	}
	this.create_def_footer_input=function(){
		var gr = new mw_datainput_item_btnsgroup();
		var btn;
		var _this=this;
		btn=new mw_datainput_item_btn({
			lbl:this.params.get_param_or_def("btns.no.lbl",Globalize.localize("No")),
			display_mode:this.params.get_param_or_def("btns.no.display_mode","danger"),
			onclick:function(){_this.noClick()},
		});
		gr.addItem(btn,"no");
		btn=new mw_datainput_item_btn({
			lbl:this.params.get_param_or_def("btns.yes.lbl",Globalize.localize("Yes")),
			display_mode:this.params.get_param_or_def("btns.yes.display_mode","success"),
			onclick:function(){_this.yesClick()},
		});
		gr.addItem(btn,"yes");
		
		this.set_footer_input(gr);
		return gr;
	}
	
}
mwuihelper_modal_populator_yes_no.prototype=new mwuihelper_modal_populator();

function mwuihelper_modal(ui){
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
		return this.get_elem_by_class("modal-footer");	
	}
	this.get_title=function(){
		return this.get_elem_by_class("modal-title");	
	}
	this.get_body=function(){
		return this.get_elem_by_class("modal-body");	
	}
	
	this.show=function(){
		var id=this.get_id();
		if(!id){
			return false;	
		}
		$('#'+id).modal("show");
			
	}
	this.hide=function(){
		var id=this.get_id();
		if(!id){
			return false;	
		}
		$('#'+id).modal("hide");
	}
	this.get_id=function(){
		if(this.id_elem){
			return this.id_elem;	
		}
		return this.ui.params.get_param_or_def("uielemsids.modal",false);
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

