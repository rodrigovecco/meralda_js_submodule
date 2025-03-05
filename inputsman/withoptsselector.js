// JavaScript Document
function mw_input_elem_withoptsselector(frmman,inputname,params){
	this.pre_init(frmman,inputname,params);
	this.options_list=new mw_objcol();
	this.setInitialSelOpt=function(){
		var scod="";
		var src=this.getOptionInputSrc();
		if(src){
			if(scod=src.get_value()){
				if(this.options_list.get_item(scod)){
					this.setSelectedOption(scod,true);
					return;	
				}
			}
		}
		if(!scod){
			scod=this.get_param("optdef")+"";	
		}
		this.setSelectedOption(scod);
			
	}
	this.getSelectedOptionValidationResult=function(){
		var val=this.get_value();
		var opt=this.getSelectedOption();
		var r={};
		r.value=val;
		r.inputMan=this;
		if(val){
			r.isEmpty=false;	
		}else{
			r.isEmpty=true;		
		}
		r.ok=false;
		r.validated=false;
		if(opt){
			r.ok=true;
			r.option=opt;
			if(mw_is_object(opt.params,"validateInput")){
				r.validated=true;
				if(opt.params.validateInput(r)===false){
					r.ok=false;	
				}
			}
		}
		return r;
	}
	this.afterSelectedOptionSetted=function(dontUpdateSrc){
		var lbl="";
		var selops=this.getSelectedOption();
		var scod="";
		if(selops){
			lbl=selops.name;	
			scod=selops.cod;	
		}
		this.getOptionSelectBtn();
		if(this.optionSelectBtn){
			this.optionSelectBtn.find("[name='optsSelectorLbl']")
			.html(lbl+"");
	
		}
		
		if(!dontUpdateSrc){
			var src=this.getOptionInputSrc();
			if(src){
				src.set_value(scod);	
			}
		}
		this.do_after_change_events();
		//this.validation_function_after_change();
		
	}
	this.loadOptionInputSrc=function(){
		var cod=this.get_param("optselsrccod");
		if(!cod){
			return false;	
		}
		return this.get_other_man(cod);
			
	}
	this.getOptionInputSrc=function(){
		if(this.optionInputSrc){
			return this.optionInputSrc;	
		}
		this.optionInputSrc=this.loadOptionInputSrc();
		return this.optionInputSrc;	
	}
	
	this.getOptionSelectBtn=function(){
		if(this.optionSelectBtn){
			return this.optionSelectBtn;
		}
		var input=this.get_input();	
		if(!input){
			return false;	
		}
		this.optionSelectBtn=$(input).parent().find("button");
		return this.optionSelectBtn;
		
			
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
	this.initOptionsList=function(){
		var list=this.get_param("optionslist");
		//console.log("initOptionsList",list);
		var _this=this;
		if(mw_is_array(list)){
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
		return i;	
	}
	this.getOptionSelectorListContainer=function(){
		if(this.optionSelectorListContainer){
			return this.optionSelectorListContainer;
		}
		var input=this.get_input();	
		if(!input){
			return false;	
		}
		this.optionSelectorListContainer=$(input).parent().find("ul");
		return this.optionSelectorListContainer;
		
			
	}
	this.refresh_lists_options=function(){
		if(!this.getOptionSelectorListContainer()){
			return false;
		}
		this.optionSelectorListContainer.empty();
		var _this=this;
		this.options_list.exec_fnc_on_items(function(data,index){_this.appendSelectorOption(data)});		
	
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
	this.init=function(){
		
		var _this=this;
		var input=this.get_input();	
		
		if(input){
			input.onchange=function(){_this.do_after_change_events()}	
			
		}
	}
	

	
}

mw_input_elem_withoptsselector.prototype=new mw_input_elem_abs();
mw_input_elem_withoptsselector.prototype.after_all_init_done=function(){
	var _this=this;

	this.initOptionsList();
	this.refresh_lists_options();
	this.setInitialSelOpt();
	var input=this.get_input();	
	
	if(input){
		//input.onchange=function(){_this.do_after_change_events()}	
		
	}
	
}
