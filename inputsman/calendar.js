// JavaScript Document
function mw_input_elem_calendar(frmman,inputname,params){
	this.pre_init(frmman,inputname,params);
}

mw_input_elem_calendar.prototype=new mw_input_elem_abs();
mw_input_elem_calendar.prototype.onCalendarChange=function(){
	if(this.cal.isEmpty){
		return true;	
	}
	var ref_date
	ref_date=this.sysFormatStr2date(this.get_param("mindate"));
	if(ref_date){
		if(this.cal.date<ref_date){
			this.cal.setValueByDate();
			return false;	
		}
	}
	ref_date=this.sysFormatStr2date(this.get_param("maxdate"));
	if(ref_date){
		if(this.cal.date>ref_date){
			this.cal.setValueByDate();
			return false;	
		}
	}
	
}
mw_input_elem_calendar.prototype.sysFormatStr2date=function(val){
	if(!val){
		return false;	
	}
	if(typeof(val)!="string"){
		return false;		
	}
	var dharray=val.split(" ",2);
	var dval = dharray[0].replace("/", "-");
	var a=dval.split("-");
	d = new Date(a[0],(a[1]-1),a[2]);
	return d;
}

mw_input_elem_calendar.prototype.set_cal=function(cal){
	if(!cal){
		return false;
	}
	
	var input=this.get_input();	
	if(!input){
		return false;	
	}
	var _this=this;
	this.cal=cal;
	
	if(!this.get_param("nohour")){
		this.cal.cfg.addhour=true;
	}
	if(this.get_param("time_mode")){
		this.cal.cfg.time_mode=true;
	}
	this.cal.debugmode=false;
	if(this.is_bt_mode()){
		this.cal.append2input_bt_mode(input);
	}else{
		this.cal.append2input(input);
	}
	this.setTooltipFromParams(this.cal.userInputElem);
	
	this.cal.addOnChangeAction(function(){_this.onCalendarChange()});
	return true;
	
}

mw_input_elem_calendar.prototype.after_all_init_done=function(){
	
	var param=this.get_param("nocalendar");
	if(param){
		return;
	}
	var _this=this;
	var fnc=function(){
		var cal=mw_calendar_manager.createCalendar();
		
		_this.set_cal(cal);
	}
	mw_calendar_manager.addOnInitAccion(fnc);
	mw_calendar_manager.loadScripts();
}
var mw_calendar_manager=function(){};
mw_calendar_manager.disClassesNamesPrefDef="mw_cal_";
mw_calendar_manager.disClassesNames=new Object();
mw_calendar_manager.disParams=new Object();
mw_calendar_manager.plparams=new Object();
mw_calendar_manager.disParamsHTML=new Object();
mw_calendar_manager.lngparams=new Object();
mw_calendar_manager.lngparams.inputSep="-";
mw_calendar_manager.calendars=new Array();
mw_calendar_manager.scriptLoading=0;
mw_calendar_manager.onInitActions=new Array();	
mw_calendar_manager.preloaders=new Array();	
mw_calendar_manager.addOnInitAccion=function(fnc){
	if(this.initDone){
		fnc();	
	}else{
		this.onInitActions.push(fnc);	
	}
}
mw_calendar_manager.afterInit=function(){
	mw_calendar_manager.scriptLoading=3;
	this.initDone=true;	
	for (var x=0 ; x<this.onInitActions.length; x++){
		if(typeof(this.onInitActions[x])=="function"){
			this.onInitActions[x]();
		}
	}
}

mw_calendar_manager.createCalendar=function(plcod){
	if(this.initDone){
		return this.doCcreateCalendar(plcod);	
	}
	
}

mw_calendar_manager.loadScripts=function(){
	if(this.scriptLoading>0){
		return true;	
	}
	this.scriptLoading=1;
	
	mw_load_script("/res/mwcalendar/mw_calendar.js");
	mw_load_css("/res/mwcalendar/mw_calendar.css");
}
mw_calendar_preloader=function(plcod){
	this.plcod=plcod;
	this.man=mw_calendar_manager;
	this.done=false;
	this.onmainready=function(){
		if(this.done){
			return true;	
		}
		this.done=true;
		this.cal=this.man.createCalendar(this.plcod);
		if(this.onready){
			if(typeof(this.onready)=="function"){
				this.onready();	
			}
		}
	}
	this.onready=function(){
		//
	}
	
	this.set_onready=function(fnc){
		this.onready=fnc;	
	}
	this.loadScripts=function(){
		this.man.loadScripts();	
	}
	this.queue=function(){
		var _this=this;
		this.man.addOnInitAccion(function(){_this.onmainready()});
		
	}
	
}

mw_calendar_manager.disParams={
	tbl:{
		htmltag:{
			border:0,
			cellPadding:0,
			cellSpacing:0
		},
		htmltagstyle:{}
	},
	showdropdownarrows:0,
	monthpost:",",
	
	border:{
		top_left:"/res/mwcalendar/mw_calendar_bg_top_left.png",
		top:"/res/mwcalendar/mw_calendar_bg_top.png",
		top_right:"/res/mwcalendar/mw_calendar_bg_top_right.png",
		bot_left:"/res/mwcalendar/mw_calendar_bg_bot_left.png",
		bot:"/res/mwcalendar/mw_calendar_bg_bot.png",
		bot_right:"/res/mwcalendar/mw_calendar_bg_bot_right.png",
		left:"/res/mwcalendar/mw_calendar_bg_left.png",
		right:"/res/mwcalendar/mw_calendar_bg_right.png"
		
	}
}
mw_calendar_manager.disParamsHTML.close={img:"/res/mwcalendar/mw_calendar_close.png"};
mw_calendar_manager.disParamsHTML.down={img:"/res/mwcalendar/mw_calendar_down.png"};
mw_calendar_manager.disParamsHTML.left={img:"/res/mwcalendar/mw_calendar_left.png"};
mw_calendar_manager.disParamsHTML.right={img:"/res/mwcalendar/mw_calendar_right.png"};
mw_calendar_manager.disParamsHTML.ctr={img:"/res/mwcalendar/mw_calendar_ctr.gif"};
mw_calendar_manager.lngparams={longDays : {0 : 'Domingo' , 1 : 'Lunes' , 2 : 'Martes' , 3 : 'Miércoles' , 4 : 'Jueves' , 5 : 'Viernes' , 6 : 'Sábado'} , shortDays : {0 : 'Dom' , 1 : 'Lun' , 2 : 'Mar' , 3 : 'Mie' , 4 : 'Jue' , 5 : 'Vie' , 6 : 'Sáb'} , firstDay : 0 , shortMonths : {0 : 'ene' , 1 : 'feb' , 2 : 'mar' , 3 : 'abr' , 4 : 'may' , 5 : 'jun' , 6 : 'jul' , 7 : 'ago' , 8 : 'sep' , 9 : 'oct' , 10 : 'nov' , 11 : 'dic'} , longMonths : {0 : 'Enero' , 1 : 'Febrero' , 2 : 'Marzo' , 3 : 'Abril' , 4 : 'Mayo' , 5 : 'Junio' , 6 : 'Julio' , 7 : 'Agosto' , 8 : 'Septiembre' , 9 : 'Octubre' , 10 : 'Noviembre' , 11 : 'Diciembre'} , inputMode : 'dmy' , inputSep : '-'};


