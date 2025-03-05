function mw_url(){
	this.params=new Array();
	this.get_url_from_path_as_obj=function(baseurl,pathasobj,rest){
		var url=baseurl;
		if(pathasobj){
			if(typeof(pathasobj)=="object"){
				for(var c in pathasobj){
					url=url+"/"+c+"/"+pathasobj[c];	
				}
			}
		}
		if(rest){
			url=url+"/"+rest;		
		}
		return url;

	}
	this.get_url_from_data_varargs=function(url,var_args_keys,data,args){
		if(!mw_is_object(args)){
			args={};	
		}
		if(mw_is_object(var_args_keys)){
			if(mw_is_object(data)){
				var codondata;
				for(var arg in var_args_keys){
					codondata=var_args_keys[arg];
					args[arg]=data[codondata];
				}		
			}
		}
		return this.get_url(url,args);

			
	}
	
	this.get_url=function(url,params){
		this.set_url(url);
		this.parse();
		this.add_params(params);
		if(this.url_base){
			return this.url_base+this.get_query();
		}
		return false;
		
	}
	this.get_parsed_params=function(){
		var list= new Array();
		if(this.params){
			for(var i =0;i<this.params.length;i++){
				list.push(this.params[i].get_query_txt());	
			}
		}
		return list;
	}
	
	this.get_query=function(){
		var s=this.get_queryStr();
		if(s.length<1){
			return "";	
		}
		var r="?"+s;
		return r;
	}
	this.get_queryStr=function(){
		var list=this.get_parsed_params();
		if(list.length<1){
			return "";	
		}
		var r=list.join("&");
		return r;
	}
	this.reset=function(){
		this.url=false;
		this.reset_parsed();
	}
	this.reset_parsed=function(){
		this.url_base=false;
		this.params=new Array();	
	}
	this.set_url=function(url){
		this.reset();
		this.url=url;
	}
	this.add_params=function(params,pref){
		if(!params){
			return false;
		}
		
		if(typeof(params)=="object"){
			for(var p in params){
				this.add_param(p,params[p],pref);
			}
		}
			
	}
	
	this.parse=function(){
		this.reset_parsed();
		if(!this.url){
			return false;
		}
		
		var partes=this.url.split ("?");
		this.url_base=partes[0];
		var query=partes[1];
		if (query == undefined){
			query="";
		}
		this.query=query;
		var args=query.split ("&");
		var Separ;
		var p;
		for (i = 0; i < args.length; i++) { 
			Separ = args[i].split("=");
			if(Separ[0]){
				p=new mw_url_param(Separ[0],Separ[1]);
				this.params.push(p);
			}
		}
		return true;
		
	}
	this.getDateStr=function(date){
		if(!mw_is_object(date,"getFullYear")){
			return date+"";	
		}
		if ( date instanceof Date ) {
			var str=date.getFullYear()+'-'+(date.getMonth() + 1)+'-'+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
			//console.log("date: "+str,date);
			return str;
				
		}
		return date+"";	
	}
	this.add_param=function(cod,val,pref){
		if(typeof(val)=="boolean"){
			if(val){
				val=1;	
			}else{
				val=0;	
			}
		}
		if(!val){
			if(mw_isNumber(val)){
				val=val+"";	
			}else{
				val="";
				//return false;
			}
		}
		var ncod=cod;
		if(pref){
			ncod=pref+"["+cod+"]";	
		}
		
		if(mw_is_object(val,"getFullYear")){
			if ( val instanceof Date ) {
				val=this.getDateStr(val);
			}
		}
		
		if(mw_is_object(val)){
			for(var p in val){
				this.add_param(p,val[p],ncod);
			}
			
		}else{
			p=new mw_url_param(ncod,val);
			this.params.push(p);
		}
		
		
	}

}
function mw_url_param(name,val){
	this.name=name;
	this.val=val;
	this.get_val=function(){
		var val=this.val;
		if(typeof(val)=="boolean"){
			if(val){
				val=1;	
			}else{
				val=0;	
			}
		}
		return val+"";
	}
	
	this.get_query_txt=function(){
		return this.name+"="+encodeURIComponent(this.get_val());	
	}
}
function mw_url_build(baseurl,params){
	var u =new mw_url();
	return u.get_url(baseurl,params);
	
}

