//2015-03-04 RVH
function mw_validator(){
	this.valid_file=function(filename,validexts,allowempty){
		if(!filename){
			if(allowempty){
				return true;	
			}
			return false;	
		}
		var ext=this.fileExt(filename);
		if(!ext){
			return false;	
		}
		ext=ext.toLowerCase();
		if(!validexts){
			return false;	
		}
		if(!mw_is_array(validexts)){
			validexts=validexts+"";
			validexts=validexts.split(",");
		}
		for(var i=0;i<validexts.length;i++){
			if(ext==validexts[i]){
				return true;	
			}
		}
		return false;	
	}
	this.fileExt=function baseName(str){
		var base=this.baseName(str);
		if(!base){
			return false;	
		}
		if(base.lastIndexOf(".") != -1){
			return base.substring((base.lastIndexOf("."))+1);
		}
		
	}

	this.baseName=function baseName(str){
		if(!str){
			return false;	
		}
		str=str+"";
		var sep="/";
		if(str.lastIndexOf('\\')){
			sep="\\";
		}
		var base = new String(str).substring(str.lastIndexOf(sep) + 1); 
		/*
		if(base.lastIndexOf(".") != -1){
			base = base.substring(0, base.lastIndexOf("."));
		}
		*/
   		return base;
	}

	
	this.check_email=function(str,allowempty){
		if(!str){
			if(allowempty){
				return true;	
			}
			return false;	
		}
		var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    	if (filter.test(str)) {
			return true;
		}
		return false;	
	}
	this.check_alphanumeric_and_underline=function(str,allowempty){
		
		if(!str){
			if(allowempty){
				return true;	
			}
			return false;	
		}
		var filter = /[^a-zA-Z0-9_]/;
    	if (filter.test(str)) {
			return false;
		}
		return true;	
	}
	
	this.has_lowers=function(str){
		if(!str){
			return false;	
		}
		for(var i=0;i<str.length;i++){
			if(this.check_case(str[i],false)){
				return true;
			}
		}
		return false;
	}
	
	this.has_uppers=function(str){
		if(!str){
			return false;	
		}
		for(var i=0;i<str.length;i++){
			if(this.check_case(str[i],true)){
				return true;
			}
		}
		return false;
	}
	this.has_numbers=function(str){
		if(!str){
			if(mw_isNumber(str)){
				return true;
			}
			
			return false;	
		}
		for(var i=0;i<str.length;i++){
			if(mw_isNumber(str[i])){
				return true;
			}
		}
		return false;
	}
	
	
	this.check_min_length=function(str,num){
		if(!str){
			return false;	
		}
		str=str+"";
		if(str.length>=num){
			return true;	
		}
		return false;
	}
	this.check_max_length=function(str,num){
		if(!str){
			return true;	
		}
		str=str+"";
		if(str.length<=num){
			return true;	
		}
		return false;
	}
	
	this.check_case=function(str,upper){
		if(!str){
			return false;	
		}
		if(mw_isNumber(str)){
			return false;
		}
		str=str+"";
		var s_u=str.toUpperCase();
		var s_l=str.toLowerCase();
		if(s_u===s_l){
			return false;
		}
		if(upper){
			if(str===s_u){
				return true;	
			}else{
				return false;	
			}
		}else{
			if(str===s_l){
				return true;	
			}else{
				return false;	
			}
		}
		
		
		
		
	}
}