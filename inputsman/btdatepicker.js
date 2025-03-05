// JavaScript Document

function mw_input_elem_btdatepicker(frmman,inputname,params){
	this.pre_init(frmman,inputname,params);
}

mw_input_elem_btdatepicker.prototype=new mw_input_elem_abs();
mw_input_elem_btdatepicker.prototype.get_datetimepicker_params=function(){
	var p=new Object();
	var param;
	var ref;
	param=this.get_param("locale");
	if(param){
		p["locale"]=param;
	}
	p["showClear"]=true;
	if(this.get_param("nohour")){
		p["format"]="L";	
	}
	param=this.get_param("mindate");
	if(param){
		ref= this.moment_from_str(param);
		if(ref){
			if(ref.isValid()){
				p["minDate"]=ref;
			}
		}
	}
	param=this.get_param("maxdate");
	if(param){
		ref= this.moment_from_str(param);
		if(ref){
			if(ref.isValid()){
				p["maxDate"]=ref;
			}
		}
	}
	
	var dd=this.get_defaultDate();
	if(dd){
		p["defaultDate"]=dd;		
	}
	
	
	return p;
		
}
mw_input_elem_btdatepicker.prototype.moment_from_str=function(val){
	var d=this.sysFormatStr2date(val);
	if(!d){
		return false;	
	}
	var m=moment(d);
	return m;
}
mw_input_elem_btdatepicker.prototype.sysFormatStr2date=function(val){
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
	var h=dharray[1];
	if(h){
		if(typeof(h)=="string"){
			a=h.split(":");	
			d.setHours(mw_getInt(a[0]));
			d.setMinutes(mw_getInt(a[1]));
			d.setSeconds(mw_getInt(a[2]));
		}
			
	}
	return d;
}

mw_input_elem_btdatepicker.prototype.get_defaultDate=function(){
	var input=this.get_input();	
	var param;
	var ref;
	var val="";
	if(input){
		val=input.value;	
	}
	if(!val){
		return false;	
	}
	var day;
	if(this.get_param("time_mode")){
		val=mw_getInt(val);
		if(!val){
			return false;	
		}
		day = moment(new Date(val*1000));
	}else{
		day = this.moment_from_str(val);
	}
	if(!day){
		return false;	
	}

	
	if(!day.isValid()){
		return false;	
	}
	param=this.get_param("mindate");
	if(param){
		ref= this.moment_from_str(param);
		if(ref){
			if(ref.isValid()){
				if(day.isBefore(ref)){
					if(!day.isSame(ref)){
						return false;
					}
				}
			}
		}
	}
	param=this.get_param("maxdate");
	if(param){
		ref= this.moment_from_str(param);
		if(ref){
			if(ref.isValid()){
				if(day.isAfter(ref)){
					if(!day.isSame(ref)){
						return false;
					}
				}
			}
		}
	}
	
	return day;
}
mw_input_elem_btdatepicker.prototype.on_dp_change=function(e){
	var v=this.get_val_for_input_from_m_date(e.date);
	var input=this.get_input();	
	if(!input){
		return false;	
	}
	if(v){
		input.value=v;	
	}else{
		input.value="";	
	}
}
mw_input_elem_btdatepicker.prototype.get_val_for_input_from_m_date=function(m){
	if(!m){
		return false;	
	}
	if(!m.isValid()){
		return false;	
	}
	if(this.get_param("time_mode")){
		return m.unix()	
	}
	
	if(this.get_param("nohour")){
		return m.get("year")+"-"+(m.get("month")+1)+"-"+m.get("date");
	}
	return m.get("year")+"-"+(m.get("month")+1)+"-"+m.get("date")+" "+m.get("hour")+":"+m.get("minute")+":"+m.get("second");

}
mw_input_elem_btdatepicker.prototype.after_all_init_done=function(){
	var param;
	param=this.get_param("dpid");
	if(!param){
		return;
	}
	var _this=this;
	var p=this.get_datetimepicker_params();
	this.datepicker=$('#'+param).datetimepicker(p);
	this.datepicker.on("dp.change",function(e){_this.on_dp_change(e)});
	var input=this.get_input();
	mw_hide_obj(input);

}

