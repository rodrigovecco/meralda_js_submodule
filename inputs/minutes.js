function mw_datainput_item_minutes_helper(){
	this.format_DHM=function(val){
		var r=this.val2result(val);
		if(!r.valid){
			return "";
		}
		
		var str="";
		if(r.negative){
			str=str+"-";
		}
		if(r.days>0){
			str=str+r.days+" ";
		}
		str=str+this.twoDigits(r.hours)+":"+this.twoDigits(r.minutes);
		return str;
		
	}
	this.format_txt=function(val,sep){
		var r=this.val2result(val);
		if(!r.valid){
			return "";
		}
		if(!r.actualValue){
			return "";
		}
		
		var list=new Array();
		
		if(r.days>0){
			list.push(r.days+" "+this.unitTxt(r.days,"day"));
		}
		if(r.hours>0){
			list.push(r.hours+" "+this.unitTxt(r.hours,"hour"));
		}
		if(r.minutes>0){
			list.push(r.minutes+" "+this.unitTxt(r.minutes,"min"));
		}
		if(!sep){
			sep=" ";	
		}
		var str=list.join(sep);
		if(r.negative){
			return "-"+str;
		}
		return str;
		
	}
	
	this.format_selUnit=function(val){
		var r=this.val2result(val);
		if(!r.valid){
			return "";
		}
		if(!r.actualValue){
			return "";
		}
		return r.actualDisplayValue+" "+this.unitTxt(r.actualDisplayValue,r.unit);
		
	}
	this.unitTxt=function(val,unitcod){
		var p=true;
		if(val===1){p=false};
		if(val===-1){p=false};
		return this.getUnitLbl(unitcod,p); 	
	}
	this.getUnitLbl=function(unitcod,plural){
		var key;
		
		if(unitcod==="day"){
			if(plural){key="%lbl.datetime.days"}else{key="%lbl.datetime.day"};
		}else if(unitcod==="hour"){
			if(plural){key="%lbl.datetime.hours"}else{key="%lbl.datetime.hour"};
		}else{
			if(plural){key="%lbl.datetime.minutes"}else{key="%lbl.datetime.minute"};	
		}
		if(!window.Globalize){
			return key;
		}
		
		return Globalize.localize(key);
	}
	this.twoDigits=function(val){
		val =mw_getInt(val);
		if(val<9){
			return "0"+val;	
		}
		return val+"";
	}
	this.val2result=function(val){
		if(mw_is_object(val)){
			return val;	
		}
		return this.get_result(val);
	}
	this.get_result=function(val){
		var r={
			inputValue:val,
			totalMinutes:false,
			totalHours:false,
			totalDays:false,
			minutes:false,
			hours:false,
			days:false,
			valid:false,
			unit:false,
			negative:false,
			actualValue:"",
			actualDisplayValue:"",
		}
		if(!mw_isNumber(val)){
			return r;	
		}
		var m =mw_getInt(val);
		if(m<0){
			m=m*(-1);
			r.negative=true;	
		}
		r.valid=true;
		r.actualValue=m;
		r.totalMinutes=m;
		r.totalHours=m/60;
		r.totalDays=r.totalHours/24;
		r.days=Math.floor(r.totalDays);
		r.hours=Math.floor(r.totalHours-(r.days*24));
		r.minutes=Math.floor(r.totalMinutes-((r.hours*60)+(r.days*60*24)));
		if(r.minutes<=0){
			if(r.hours<=0){
				r.unit="day";	
				r.actualDisplayValue=r.totalDays;
			}else{
				r.unit="hour";	
				r.actualDisplayValue=r.totalHours;
			}
		}else{
			r.unit="min";	
			r.actualDisplayValue=r.totalMinutes;
		}
		if(r.negative){
			r.actualValue=r.actualValue*(-1);
			r.actualDisplayValue=r.actualDisplayValue*(-1);
		}
		return r;
		
	}

}
function mw_datainput_item_minutes(options){
	this.init(options);
	this.options_list=new mw_arraylist();
	this.selected_items_in_order=new mw_objcol();
	this.afterAppend=function(){
		this.doAfterAppendFncs();
		this.set_unit_from_dd(this.options.get_param_or_def("defunit","day"));
		if(this.orig_value){
			this.set_input_value(this.orig_value);	
		}
	}
	this.get_minutes_helper=function(){
		if(!this.minutes_helper){
			this.minutes_helper=new mw_datainput_item_minutes_helper();
			
		}
		return this.minutes_helper;
	}
	this.set_input_value=function(val){
		
		if(!mw_isNumber(val)){
			if(this.input_elem){
				this.input_elem.value="";	
			}
			if(this.user_input_min_elem){
				this.user_input_min_elem.value="";	
			}
			return;
			
				
		}
		if(!this.user_input_min_elem){
			return;
		}
		
		val =mw_getInt(val);
		if(this.input_elem){
			this.input_elem.value=val;	
		}
		var f;
		var fint;
		f=val/(24*60);
		fint=mw_getInt(f);
		if(fint==f){
			this.user_input_min_elem.value=fint;
			this.set_unit_from_dd("day");
			return;	
		}
		f=val/(60);
		fint=mw_getInt(f);
		if(fint==f){
			this.user_input_min_elem.value=fint;
			this.set_unit_from_dd("hour");
			return;	
		}
		this.user_input_min_elem.value=val;
		this.set_unit_from_dd("min");
		
	}
	
	
	this.update_after_unit_set=function(){
		var cod=this.get_sel_unit_cod();
		if(this.unit_sel_lbl){
			this.unit_sel_lbl.textContent=this.get_unit_lbl(cod)+" ";
		}
		this.onMin_change();
		this.set_validation_status_normal();
	}
	this.onMin_change=function(){
		if(!this.user_input_min_elem){
			return;	
		}
		if(!this.input_elem){
			return;	
		}
		var cod=this.get_sel_unit_cod();
		var v;
		if(this.user_input_min_elem.value){
			v=mw_getInt(this.user_input_min_elem.value);
			this.user_input_min_elem.value=v
			if(cod=="hour"){
				this.input_elem.value=v*60;	
			}else if(cod=="day"){
				this.input_elem.value=v*24*60;	
			}else{
				this.input_elem.value=v;	
			}
		}else{
			this.input_elem.value="";	
		}
		this.on_change();
	}
	
	this.onMinInputKeyUp=function(){
		if(!this.user_input_min_elem){
			return;	
		}
		if(this.user_input_min_elem.value){
			this.user_input_min_elem.value=mw_getInt(this.user_input_min_elem.value);	
		}
	}
	
	this.set_unit_from_dd=function(cod){
		this.sel_unit_cod=cod;
		this.update_after_unit_set();
	}
	this.get_sel_unit_cod=function(){
		if(this.sel_unit_cod=="hour"){
			return 	"hour";
		}
		if(this.sel_unit_cod=="day"){
			return 	"day";
		}
		return "min"
		
	}
	
	this.get_unit_lbl=function(cod){
		if(!cod){
			return "";	
		}
		return this.options.get_param_or_def("msg."+cod,cod);
	}
	this.create_user_input_elems=function(){
		var c=document.createElement("div");
		c.className="input-group";
		this.user_input_group_elem=c;
		var _this=this;
		var p;
		var input=document.createElement("input");
		input.className="form-control";
		
		input.setAttribute("aria-label","...");
		input.type="text";
		input.onkeyup=function(){_this.onMinInputKeyUp()};
		input.onchange=function(){_this.onMin_change()};
		p=this.options.get_param_or_def("placeholder",false);
		if(p){
			input.placeholder=p;
		}
		this.user_input_min_elem=input;
		this.user_input_group_elem.appendChild(this.user_input_min_elem);
		this.unit_sel_container=document.createElement("div");
		this.unit_sel_container.className="input-group-btn";
		var e;
		e=document.createElement("button");
		e.className="btn btn-default dropdown-toggle";
		e.setAttribute("data-toggle","dropdown");
		e.setAttribute("aria-expanded","false");
		this.unit_sel_lbl=document.createTextNode(".... ");
		//this.unit_sel_lbl.innerHTML="acccc ";
		var t=document.createElement("span");
		t.className="caret";
		e.appendChild(this.unit_sel_lbl);
		e.appendChild(t);
		
		this.unit_sel_container.appendChild(e);
		//<ul class="dropdown-menu dropdown-menu-right" role="menu">
		var ul=document.createElement("ul");
		ul.className="dropdown-menu dropdown-menu-right";
		ul.setAttribute("role","menu");
		var li;
		var a;
		li=document.createElement("li");
		a=document.createElement("a");
		a.href="#";
		a.innerHTML=this.get_unit_lbl("min");
		a.onclick=function(){_this.set_unit_from_dd("min"); return false};
		li.appendChild(a);
		ul.appendChild(li);
		
		li=document.createElement("li");
		a=document.createElement("a");
		a.href="#";
		a.innerHTML=this.get_unit_lbl("hour");
		a.onclick=function(){_this.set_unit_from_dd("hour"); return false};
		li.appendChild(a);
		ul.appendChild(li);

		li=document.createElement("li");
		a=document.createElement("a");
		a.href="#";
		a.innerHTML=this.get_unit_lbl("day");
		a.onclick=function(){_this.set_unit_from_dd("day"); return false};
		li.appendChild(a);
		ul.appendChild(li);
		
		
		
		
		this.unit_sel_container.appendChild(ul);
	
		
		
		
		
		
		
		this.user_input_group_elem.appendChild(this.unit_sel_container);
		
		
		return this.user_input_group_elem;
		
			
	}
	this.create_input_elem=function(){
		var _this=this;
		var p;
		var c=document.createElement("input");
		p=this.get_input_name();
		if(p){
			c.name=p;	
		}
		
		//c.className="form-control";
		c.type="hidden";
		return c;
	}
	
	this.create_container=function(){
		var p;
		var c=document.createElement("div");
		c.className="form-group";
		if(this.is_horizontal()){
			c.className="form-group row";
		}
		this.frm_group_elem=c;
		

		p=this.options.get_param_or_def("lbl",false);
		if(p){
			var lbl=document.createElement("label");
			lbl.innerHTML=p;
			p=this.get_input_id();
			if(p){
				lbl.htmlFor =id;	
			}
			if(this.is_horizontal()){
				lbl.className="col-sm-2";	
			}

			c.appendChild(lbl);
		}
		var uielem=this.create_user_input_elems();
		if(uielem){
			c.appendChild(uielem);	
		}
		var inputelem=this.get_input_elem();
		if(inputelem){
			c.appendChild(inputelem);	
		}
		this.create_notes_elem_if_req();
		return c;
	}
	this.update_display_if_created=function(){
	}

	

}
mw_datainput_item_minutes.prototype=new mw_datainput_item_abs();





