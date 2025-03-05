function mw_date(){
	this.empty=true;
	this.sys_value="";
	this.date=new Date();
	this.omit_date=false;
	this.omit_hour=false;
	this.omit_secs=false;
	this.set_date=function(date){
		this.set_empty();
		if(!date){
			return false;	
		}
		this.date=date;
		this.empty=false;
		this.sys_value=this.format_date_as_sys_value(date,false,false);
		//console.log(this.sys_value);
		return this.date;
		
	}
	this.strIsTimeOnly=function(val){
		if(!val){
			return false;	
		}
		if(typeof(val)!="string"){
			return false;		
		}
		if(val.match(" ")){
			return false;	
		}
		if(val.match(":")){
			return true;	
		}
		return false;	
		
	}
	this.set_from_sys_value_flexibleMode=function(val){
		if(this.strIsTimeOnly(val)){
			return this.set_from_sys_value_timeonlyMode(val);
		}
		return this.set_from_sys_value(val);
		

	}
	this.set_from_sys_value_timeonlyMode=function(val){
		this.set_empty();
		var date = new Date();
		var ok=this.set_date_time_from_str(date,val);
		if(!ok){
			return false;	
		}
		this.date=date;
		this.empty=false;
		this.sys_value=this.format_date_as_sys_value(date,false,false);
		//console.log("set_from_sys_value_timeonlyMode",this.sys_value);
		return this.date;
		

	}
	
	this.set_from_sys_value=function(val){
		this.set_empty();
		var date = this.get_date_from_sys_formated_str(val);
		if(!date){
			return false;	
		}
		this.date=date;
		this.empty=false;
		this.sys_value=this.format_date_as_sys_value(date,false,false);
		//console.log(this.sys_value);
		return this.date;
		

	}
	this.set_empty=function(){
		this.empty=true;
		this.sys_value="";
		this.date=new Date();
	}
	this.get_sys_value=function(){
		return this.sys_value;	
	}
	this.get_formated_sys_value=function(){
		var date=this.get_date();
		if(!date){
			return "";	
		}
		return this.format_date_as_sys_value(date,this.omit_hour,this.omit_secs,this.omit_date);
	}
	this.is_empty=function(){
		return this.empty;	
	}
	this.get_date_or_null=function(){
		var d=this.get_date();
		if(d){
			return d;	
		}
		return null;
	}
	
	this.get_date=function(){
		if(this.is_empty()){
			return false;	
		}
		return this.date;
	}
	this.format_date_as_sys_value_defMode=function(date){
		return this.format_date_as_sys_value(date,this.omit_hour,this.omit_secs,this.omit_date);
	}
	
	this.format_date_as_sys_value=function(date,no_hour,no_secs,no_date){
		if(!date){
			return "";	
		}
		var date_part=date.getFullYear()+"-"+(this.get_2_digits(date.getMonth()+1))+"-"+(this.get_2_digits(date.getDate()));
		var time_part=this.get_2_digits(date.getHours())+":"+this.get_2_digits(date.getMinutes());
		if(!no_secs){
			time_part=time_part+":"+this.get_2_digits(date.getSeconds());
		}
		
		if(no_date){
			return time_part;
		}
		if(no_hour){
			return date_part;
		}
		return date_part+" "+time_part;
		
	}
	this.get_2_digits=function(num){
		num=mw_getInt(num);
		if(num<10){
			return "0"+num;	
		}
		return ""+num;
	}
	this.replaceAll=function(str, searchtxt, replacement){
		var re=new RegExp(searchtxt, 'g');
		var s=""+str;
		return s.replace(re, replacement);
	}
	this.getTimeZoneOffsetFromPart=function(tz){
		if(!tz){
			return false;
		}
		tz = tz.trim();
		var tzOffset = false;
		if (tz === "Z") {
	        tzOffset = 0;
	    } else if (/^[+-]\d{2}:?\d{2}$/.test(tz)) {
	        var sign = tz[0] === '+' ? 1 : -1;
	        var tzParts = tz.substring(1).split(/:|(?=\d{2}$)/); // Support both hh:mm and hhmm formats
	        var tzHours = mw_getInt(tzParts[0]);
	        var tzMinutes = mw_getInt(tzParts[1] || 0);
	        tzOffset = sign * (tzHours * 60 + tzMinutes) * 60000; // Convert to milliseconds
	    }
	    return tzOffset;
	}
	this.get_date_from_sys_formated_str=function(val,no_hour_to_max){
		//console.log("get_date_from_sys_formated_str",val);
		if(!val){
			return false;	
		}
		if(this.isDate(val)){
			return val;	
		}
		
		if(typeof(val)!="string"){
			return false;		
		}
		var dharray=val.split(" ",3);
		//console.log("get_date_from_sys_formated_str",dharray);
		var tzOffset=false;
		if (dharray.length > 2) {
			tzOffset = this.getTimeZoneOffsetFromPart(dharray[2]);
		}
		var dval = this.replaceAll(dharray[0],"/", "-");
		var a=dval.split("-");
		var year=mw_getInt(a[0]);
		var month=mw_getInt(a[1]);
		
		var day=mw_getInt(a[2]);
		var hour=0;
		var minute=0;
		var sec=0;
		var h=dharray[1];
		if(h){
			if(typeof(h)=="string"){
				a=h.split(":");
				hour=mw_getInt(a[0]);
				minute=mw_getInt(a[1]);
				sec=mw_getInt(a[2]);
			}
		}else if(no_hour_to_max){
			hour=23;
			minute=59;
			sec=59;
				
		}
		if(!mw_isNumber(year)){
			return false;	
		}
		if(!mw_isNumber(month)){
			return false;	
		}
		if(!mw_isNumber(day)){
			return false;	
		}


		var date = new Date(year,( month-1), day,hour,minute,sec);
		//var date = new Date(year, month, day,hour,minute,sec);
		var ok=false;
		if(date.getFullYear() === year){
			if(date.getMonth() === (month-1)){
				if(date.getDate() === day){
					ok=true;	
				}
			}
				
		}
		if(!ok){
			return false;	
		}
		if (tzOffset !== false) {
			let dateutc=new Date(Date.UTC(year, month - 1, day, hour, minute, sec) - tzOffset);
			//console.log("dateconv",{"orig":val,"final":dateutc,"notz":date});
    		return dateutc;
		}


		return date;
		

	}
	this.set_date_time_from_str=function(date,val){
		if(!val){
			return false;	
		}
		if(typeof(val)!="string"){
			return false;		
		}
		var a=val.split(":");
		var v;
		v=a[0];
		if(!mw_isNumber(v)){
			return false;	
		}
		v=mw_getInt(v);
		if(v<0){
			return false;	
		}
		if(v>23){
			return false;	
		}
		date.setHours(v);
		v=a[1];
		if(!mw_isNumber(v)){
			return false;	
		}
		v=mw_getInt(v);
		if(v<0){
			return false;	
		}
		if(v>59){
			return false;	
		}
		date.setMinutes(v);
		v=a[2];
		if(!mw_isNumber(v)){
			return true;	
		}
		v=mw_getInt(v);
		if(v<0){
			return true;	
		}
		if(v>59){
			return true;	
		}
		date.setSeconds(v);
		return true;
		
		
	}
	this.get_fixed_date_from_str=function(val){
		//console.log("get_fixed_date_from_str: "+val);	
		if(!val){
			return false;	
		}
		if(this.isDate(val)){
			return val;	
		}
		if(typeof(val)!="string"){
			return false;		
		}
		var date=new Date();
		if(this.omit_date){
			if(!this.set_date_time_from_str(date,val)){
				return false;	
			}
			return date;
		}
		var dharray=val.split(" ");
		var date_part=dharray[0]+"";
		
		date_part = this.replaceAll(date_part,"/", "-");
		var a=date_part.split("-");
		if(!mw_isNumber(a[0])){
			return false;	
		}
		if(!mw_isNumber(a[1])){
			return false;	
		}
		date.setDate(1);
		date.setMonth(mw_getInt(a[1])-1);
		date.setDate(mw_getInt(a[0]));
		if(mw_isNumber(a[2])){
			date.setFullYear(mw_getInt(a[2]));
		}
		if(dharray[1]){
			this.set_date_time_from_str(date,dharray[1]);
		}
		return date;
		
		
		
	}
	this.isDate=function(date){
		if(mw_is_object(date)){
			if ( date instanceof Date ) {
				return true;
			}
		}
		return false;
		
	}
	this.formatDateGlobalize=function(date,dateformat,timeformat){
		var ok=false;
		if(mw_is_object(date)){
			if ( date instanceof Date ) {
				if(date.getFullYear()){
					ok=true;
				}
			}
		}
		if(!ok){
			return "";	
		}
		
		if(dateformat === null){
			dateformat="d";	
		}
		if(timeformat === null){
			timeformat="t";	
		}
		if(dateformat === undefined){
			dateformat="d";	
		}
		if(timeformat === undefined){
			timeformat="t";	
		}
		if(dateformat === true){
			dateformat="d";	
		}
		if(timeformat === true){
			timeformat="t";	
		}
		
		var list=[];
		var s;
		if(dateformat){
			if(s=Globalize.format(date,dateformat)){
				list.push(s);	
			}
		}
		if(timeformat){
			if(s=Globalize.format(date,timeformat)){
				list.push(s);	
			}
		}
		
		return list.join(" ");
		
	}
	
	
}




