// JavaScript Document
function mw_ajax_create_Request() {
	if(window.XMLHttpRequest){
		return new XMLHttpRequest();
	}else{
		return new ActiveXObject("Microsoft.XMLHTTP");
		
	}
}

function mw_ajax_launcher(url,onload){
	this.url=url;
	this.reqMode=false;//set to use GET or POST By Default;
	this.onloadActionList=new Array;
	if(onload){
		this.onloadActionList.push(onload);
	}
}

mw_ajax_launcher.prototype.getResponseXMLAsMWData=function(allowJsCode,tagname,rootname){
	var data= new mw_obj();
	data.set_params(this.getResponseXMLFirstNodeByTagnameAsData(tagname,rootname,allowJsCode));
	return data;

}

mw_ajax_launcher.prototype.getResponseXMLFirstNodeByTagnameAsData=function(tagname,rootname,allowJsCode){
	var n=this.getResponseXMLFirstNodeByTagname(tagname,rootname);
	if(!n){
		return false;	
	}
	return mw_xml2obj_item(n,allowJsCode);
	

}
mw_ajax_launcher.prototype.getResponseXMLFirstNodeByTagname=function(tagname,rootdatatagname,rootname){
	if(!tagname){
		tagname="data";	
	}
	var data=this.getResponseXMLRootDataNodeByTagname(rootdatatagname,rootname);
	if(!data){
		return false;	
	}
	return mw_xml_get_child_by_tag_name(data,tagname);
	

}
mw_ajax_launcher.prototype.getResponseXMLRootDataNodeByTagname=function(tagname,rootname){
	if(!tagname){
		tagname="data";	
	}
	var root=this.getResponseXMLRootNodeByTagname(rootname);
	if(!root){
		return false;	
	}
	return mw_xml_get_child_by_tag_name(root,tagname);
	

}
mw_ajax_launcher.prototype.getResponseXMLRootNodeByTagname=function(tagname){
	if(!tagname){
		tagname="root";	
	}
	var resp=this.getResponseXML();
	if(!resp){
		return false;
	}
	return mw_xml_get_child_by_tag_name(resp,tagname);
}
mw_ajax_launcher.prototype.getResponseXML=function(){
	if(!this.req){
		return false;	
	}
	if(!this.req.responseXML){
		return false;	
	}
	return this.req.responseXML;
}
mw_ajax_launcher.prototype.getResponseText=function(){
	if(!this.req){
		return "";	
	}
	if(!this.req.responseText){
		return "";	
	}
	return this.req.responseText;
}

mw_ajax_launcher.prototype.getReq=function(){
	if(!this.req){
		this.buildReq();
	}
	return this.req;

}

mw_ajax_launcher.prototype.buildReq=function(){
	this.req=mw_ajax_create_Request();
	var _this=this;
	this.req.onreadystatechange = function(){_this.onAjaxLoad()};

}
mw_ajax_launcher.prototype.abort=function(){
	this.postData=null;
	if(this.req){
		this.req.abort();	
	}
	this.req=false;
	if(this.runTimeout){
		clearTimeout(this.runTimeout);
	}
	this.runTimeout=false;
}
mw_ajax_launcher.prototype.set_url=function(url){
	this.url=url;
}
mw_ajax_launcher.prototype.abort_and_set_url=function(url){
	this.abort();
	this.set_url(url);
}
mw_ajax_launcher.prototype.addOnLoadAcctionUnique=function(fnc){
	this.abort();
	this.onloadActionList=new Array;
	if(fnc){
		this.addOnLoadAcction(fnc);	
	}
}
mw_ajax_launcher.prototype.addOnLoadAcction=function(fnc){
	if(fnc){
		this.onloadActionList.push(fnc);
	}
}
mw_ajax_launcher.prototype.onAjaxLoad=function(){
	if(!this.req){
		return false;	
	}
	if(this.req.readyState == 4){
		if(this.req.status == 200){
			var fnc;
			
			for (var i=0;i<this.onloadActionList.length;i++){
				fnc=this.onloadActionList[i];
				if(fnc){
					if ( fnc != undefined ) {
						if(typeof(fnc)=="string"){
							eval(fnc);
						}else{
							if(mw_is_function(fnc)){
								if(this.onAjaxLoadPassAsArg){
									fnc(this);
								}else{
									fnc();
								}
							}
						}
					}
				}
			}
		}
	}
	
}
mw_ajax_launcher.prototype.setReqModePost=function(){
	this.reqMode="POST";
}
mw_ajax_launcher.prototype.setReqModeGet=function(){
	this.reqMode="GET";
}
mw_ajax_launcher.prototype.setDelayed=function(timeoutms){
	timeoutms=mw_getInt(timeoutms);
	if(!timeoutms){
		timeoutms=1000;
	}
	this.delayTime=timeoutms;

}
mw_ajax_launcher.prototype.runDelayed=function(timeoutms){
	this.abort();
	if(!timeoutms){
		timeoutms=this.delayTime;
	}
	if(!timeoutms){
		this.run();
	}
	var _this=this;
	if(this.debug_mode){
		console.log("Run in ms: "+timeoutms);
	}
	
	this.runTimeout=setTimeout(function(){_this.run()},timeoutms)

}
mw_ajax_launcher.prototype.postDelayed=function(data,timeoutms){
	this.abort();
	
	if(!timeoutms){
		timeoutms=this.delayTime;
	}
	if(!timeoutms){
		this.post(data);
		return;
	}
	var _this=this;
	if(this.debug_mode){
		console.log("Post in ms: "+timeoutms);
		console.log("data",data);
	}

	this.postData=data;
	this.runTimeout=setTimeout(function(){_this.postStoredData()},timeoutms)

}
mw_ajax_launcher.prototype.postStoredData=function(){
	var data=this.postData;
	if(!data){
		data=null;
	}
	if(this.debug_mode){
		console.log("posting",data);
	}
	
	return this.post(data);

}



mw_ajax_launcher.prototype.run=function(){
	if(this.reqMode){
		if(this.reqMode=="POST"){
			return this.run_post();
		}
		if(this.reqMode=="GET"){
			return this.run_get();
		}
	}

	if(this.postModeDisabled){
		return this.run_get();	
	}
	return this.run_post_if_long();	
	
}
mw_ajax_launcher.prototype.run_get=function(){
	this.abort();
	if(!this.url){
		return false;	
	}
	
	this.buildReq();
	this.req.open("GET", this.url, true);
	this.is_submited=true;
	this.req.send(null);
}
mw_ajax_launcher.prototype.url_too_long=function(){
	if(!this.url){
		return false;	
	}
	var m=8000;//8190
	
	if(this.url.length>m){
		return true;
	}
	return false;
}
mw_ajax_launcher.prototype.run_post_if_long=function(){
	if(this.url_too_long()){
		
		return this.run_post();	
	}else{
		return this.run_get();	
	}
}
mw_ajax_launcher.prototype.run_post=function(){
	this.abort();
	if(!this.url){
		return false;	
	}
	
	this.buildReq();
	
	var uman=new mw_url();
	uman.set_url(this.url);
	if(!uman.parse()){
		return false;	
	}

	this.req.open("POST", uman.url_base, true);
	this.is_submited=true;
	this.req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	if(this.debug_mode){
		console.log("posting",uman.query);
	}
	this.req.send(uman.query);
}

mw_ajax_launcher.prototype.postFormData=function(data){
	//data FormData 
	this.abort();
	if(!this.url){
		return false;	
	}
	this.buildReq();
	this.req.open("POST", this.url, true);
	this.is_submited=true;
	this.req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	if(this.debug_mode){
		console.log("posting",data);
	}
	this.req.send(data);
}
mw_ajax_launcher.prototype.postFormDataMultipart=function(data){
	//data FormData 
	this.abort();
	if(!this.url){
		return false;	
	}
	this.buildReq();
	this.req.open("POST", this.url, true);
	this.is_submited=true;
	
	if(this.debug_mode){
		console.log("posting",data);
	}
	this.req.send(data);
}
mw_ajax_launcher.prototype.post=function(data){
	this.abort();
	if(!this.url){
		return false;	
	}
	
	this.buildReq();
	
	var uman=new mw_url();
	uman.set_url(this.url);
	
	if(!uman.parse()){
		return false;	
	}
	uman.add_params(data);
	var q=uman.get_queryStr();
	

	this.req.open("POST", uman.url_base, true);
	this.is_submited=true;
	this.req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	if(this.debug_mode){
		console.log("posting",q);
	}
	this.req.send(q);
	
}

