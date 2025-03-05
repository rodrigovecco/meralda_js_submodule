// JavaScript Document
function mwDeepMerge(target, ...sources) {
  for (const source of sources) {
    for (const key in source) {
      if (source[key] instanceof Object && key in target) {
        mwDeepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
}

function nl2br(str){
	var s=""+str;
	return s.replace(/\n/g, "<br>");
}
function mw_format_number(num,precision,thousendsep,decsep,negParenthesis){
	num=mw_getNumber(num);
	precision=Math.abs(mw_getInt(precision));
	
	if(!thousendsep){
		thousendsep="";	
	}
	if(!decsep){
		decsep=".";	
	}
	var sign = (num < 0) ? '-' : '';
	var neg = (num < 0) ? true : false;
	
	num=Math.abs(num);
	//var int=Math.round(num);
	var fixedN=num.toFixed(precision);
	var nList=fixedN.toString().split(".");
	var intS=nList[0].toString();
	var intList=[];
	var dNum=3;
	while(intS.length>0){
		if(intS.length<dNum){
			dNum=intS.length;	
		}
		intList.push(intS.slice(dNum*-1));
		intS=intS.substr(0,intS.length-dNum);
	}
	intList.reverse();
	intS=intList.join(thousendsep);
	var numS=intS;
	if(precision){
		numS=numS+decsep+nList[1].toString();
	}
	if(neg){
		if(negParenthesis){
			numS="("+numS+")";	
		}else{
			numS="-"+numS;		
		}
	}
	return numS;
}

function mw_createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function mw_readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function mw_eraseCookie(name) {
	mw_createCookie(name,"",-1);
}

function mw_is_object(data,checkfnc){
	if(!data){
		return false;	
	}
	if (typeof(data)=="object" ) {
		if(!checkfnc){
			return true;
		}
		return mw_is_function(data[checkfnc]);
	}
	return false;
}
function mw_is_function(data){
	if(!data){
		return false;	
	}
	if (typeof(data)=="function" ) {
		return true;
	}
	return false;
}

function mw_is_array(data){
	if(!mw_is_object(data)){
		return false;	
	}
	if(Object.prototype.toString.apply(data)=="[object Array]"){
		return true;	
	}
	return false;
}


function mw_hide_show_objs(list,hide) {
	if(!list){
		return false;	
	}
	if (typeof(list)!="object"){
		return false;	
	}
	if(!list.hasOwnProperty("length")){
		return 	false;
	}
	for(var i=0;i<list.length;i++){
		if(hide){
			mw_hide_obj(list[i]);	
		}else{
			mw_show_obj(list[i]);	
				
		}
	}
		
}

function mw_hide_obj(obj) {
	if (typeof(obj)=="string"){
		obj=mw_get_element_by_id(obj);
	}
	
	if(!obj){
		return false;	
	}
	if (typeof(obj)!="object"){
		return false;	
	}
	if(!obj["tagName"]){
		return 	mw_hide_show_objs(obj,true);
	}
	var displayonshow=obj.getAttribute('displayonshow');
	if (typeof(displayonshow)!="string"){
		obj.setAttribute('displayonshow',obj.style["display"]);
	}
	obj.style["display"]="none";
}
function mw_show_obj(obj) {
	if (typeof(obj)=="string"){
		obj=mw_get_element_by_id(obj);
	}
	
	if(!obj){
		return false;	
	}
	
	if (typeof(obj)!="object"){
		return false;	
	}
	if(!obj["tagName"]){
		return 	mw_hide_show_objs(obj,false);
	}
	
	if(!obj.style["display"]){
		return;	
	}
	if(obj.style["display"]!="none"){
		return;	
	}
	
	
	var displayonshow=obj.getAttribute('displayonshow');
	var displayonshowdo="";
	if (typeof(displayonshow)=="string"){
		if (displayonshow!="none"){
			displayonshowdo=displayonshow;
		}
	}
	obj.style["display"]=displayonshowdo;
}

function mw_get_element_by_id(id) {
	if(!id){
		return false;	
	}
	if (typeof(id)=="object" ) {
		return id;
	}
	
	var obj=document.getElementById(id);
	if(!obj){
		return false;	
	}
	if (typeof(obj)!="object" ) {
		return false;
	}
	if(!obj.tagName){
		return false;	
	}
	return obj;
}

function mw_isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function mw_getNumber(n) {
	if(!n){
		return 0;	
	}
	if(typeof(n)=="number"){
		if(isNaN(n)){
			return 0;	
		}
		if(!isFinite(n)){
			return 0;	
		}
		
		return n;	
	}
	if(mw_isNumber(n)){
		return 	parseFloat(n);
	}
	return 0;
}
function mw_getInt(n) {
	if(mw_isNumber(n)){
		return 	parseInt(n);
	}
	return 0;
}
function mw_dom_remove_children(e) {
    if(!e) {
        return false;
    }
    while (e.hasChildNodes()) {
        e.removeChild(e.firstChild);
    }
	if(e.getAttribute('innerHTML')){
		e.innerHTML="";	
	}
    return true;
}
function mw_dom_set_cont(e,cont) {
	if(!mw_dom_remove_children(e)){
		return false;   
	}
	return mw_dom_append_cont(e,cont);
}
function mw_dom_append_cont(e,cont) {
	if(!e){
		return true;	
	}
	if(!cont){
		return true;	
	}
	var i;
	if(mw_is_array(cont)){
		for (i = 0; i < cont.length; i++) {	
			mw_dom_append_cont(e,cont[i]);
		}
		return true;
	}
	if(mw_is_object(cont)){
		e.appendChild(cont);		
	}else{
		var cc=document.createElement("div");
		cc.innerHTML=cont+"";
		if(cc.hasChildNodes()){
			var list=cc.childNodes;
			var newlist=new Array();
			
			for (i = 0; i < list.length; i++) {
				newlist.push(list[i]);
			}
			for (i = 0; i < newlist.length; i++) {
				e.appendChild(newlist[i]);	
			}
		}
	}
	return true;
}


function mw_get_debug_data(obj,fnc,deep){
	var p=new mw_get_debug_data_processor();
	if(fnc){
		p.fnc=fnc;	
	}
	if(deep){
		p.deep=deep;	
	}
	return p.getData(obj);
}
function mw_get_debug_data_processor(){
	this.fnc="getDebugDataForLog";
	this.deep=5;
	this.omitFunctions=true;
	this.returnObjOnDeepLimit=false;
	this.returnFncOnDeepLimit=false;
	this.currentDeep=0;
	this.deepLimit=function(){
		if(this.deep<=0){
			return false;
		}
		if(this.currentDeep>=this.deep){
			return true;
		}
		return false;	
		
	}
	this.getData=function(obj){
		if(mw_is_function(obj)){
			if(this.returnFncOnDeepLimit){
				return obj;	
			}
			return "[Function]";
		}
		
		if(mw_is_array(obj)){
			return this.getDataArray(obj);
		}
		if(mw_is_object(obj)){
			return this.getDataObj(obj);
		}
		
		return obj;
		
	}
	this.omitValue=function(val){
		if(this.omitFunctions){
			if(mw_is_function(val)){
				return true;	
			}
		}
		return false;
	}
	this.getDataObj=function(obj){
		if(this.deepLimit()){
			if(this.returnObjOnDeepLimit){
				return obj;	
			}else{
				return "Object: "+obj;	
			}
		}
		var r;
		this.currentDeep=this.currentDeep+1;

		if(mw_is_function(obj[this.fnc])){
			r=this.getData(obj[this.fnc]());	
		}else{
			r={};
			for (var prop in obj) {
				if(!this.omitValue(obj[prop])){
					r[prop]=this.getData(obj[prop]);
						
				}
				
				//r[prop]=obj[prop];
			}
		}
		this.currentDeep=this.currentDeep-1;
		return r;
			
	}
	
	
	this.getDataArray=function(obj){
		if(this.deepLimit()){
			if(this.returnObjOnDeepLimit){
				return obj;	
			}else{
				return "Array: "+obj;	
			}
		}
		this.currentDeep=this.currentDeep+1;
		var l=new Array();
		for(var i=0;i<obj.length;i++){
			if(!this.omitValue(obj[i])){
				l.push(this.getData(obj[i]));	
			}
		}
		this.currentDeep=this.currentDeep-1;
		return l;
			
	}
	
}

function mw_obj(){
	this.params=new Object;	
	this.getDebugDataForLog=function(){
		return this.params;	
	}
	this.set_params=function(data){
		if(!data){
			return false;	
		}
		if(typeof(data)!="object"){
			return false;	
		}
		this.params=data;
		return true;
	}
	this.getParamAsData=function(cod,checkObj,deleteOrig){
		var d=this.get_param_if_object(cod);
		var r= new mw_obj();
		if(d){
			r.set_params(d);
		}else{
			if(checkObj){
				return false;	
			}
		}
		if(deleteOrig){
			this.deleteParam(cod);	
		}
		return r;
	}
	this.deleteParam=function(cod){
		var o=this.getParamParentCodPair(cod);
		if(!o){
			return false;	
		}
		var p=o.parent;
		var c=o.cod;
		delete p[c];
		return true;
	}
	this.getParamParentCodPair=function(cod){
		if(typeof(this.params)!="object"){
			return false;
		}
		if(!cod){
			return false;	
		}
		cod=cod+"";
		if(typeof(cod)!="string"){
			return false;
		}
		var list=cod.split(".");
		if(list.length<=0){
			return false;	
		}
		
		if(list.length==1){
			if(this.params[cod]===undefined){
				return false;	
			}
			var r={parent:this.params,cod:cod,value:this.params[cod]};
			return r;
		}
		var last_cod=list.pop();
		var ncod=list.join(".");
		var parent=this.get_param_if_object(ncod);
		if(!parent){
			return false;	
		}
		if(parent[last_cod]===undefined){
			return false;	
		}
		var r={parent:parent,cod:last_cod,value:parent[last_cod]};
		return r;
		
	}
	
	this.param_exists=function(cod){
		if(typeof(this.params)!="object"){
			return false;
		}
		if(!cod){
			return true;	
		}
		cod=cod+"";
		if(typeof(cod)!="string"){
			return true;
		}
		var list=cod.split(".");
		if(list.length<=0){
			return true;	
		}
		
		if(list.length==1){
			if(this.params[cod]===undefined){
				return false;	
			}
			return true;	
		}
		var last_cod=list.pop();
		var ncod=list.join(".");
		var parent=this.get_param_if_object(ncod);
		if(!parent){
			return false;	
		}
		if(parent[last_cod]===undefined){
			return false;	
		}
		return true;	
		
		
		
	}
	this.get_param_if_function=function(cod){
		var p=this.get_param(cod);
		if(!p){
			return false;	
		}
		if(typeof(p)=="function"){
			return p;	
		}
		return false;
		
	}
	this.get_DOptim_param=function(cod){
		var o=this.get_param(cod);
		return mw_js_optim_create(o);

	}
	
	this.get_param_if_object=function(cod,createifnone){
		var r=this.get_param(cod);
		if(mw_is_object(r)){
			return r;
		}
		if(createifnone){
			return {};	
		}
		return false;

	}
	this.get_param_if_string=function(cod,def){
		return this.get_param_if_type(cod,"string",def);	
	}
	
	this.get_param_if_type=function(cod,type,def){
		
		var r=this.get_param(cod);
		if(!r){
			if(def){
				return def;	
			}
		}
		
		if(typeof(r)===type){
			return r;	
		}
		return def;

	}
	this.get_param_as_boolean=function(cod){
		if(this.get_param(cod)){
			return true;	
		}
		return false;
		
	}
	
	this.get_param_as_list=function(cod,allowDoptiom){
		var list=this.get_param(cod);
		if(!mw_is_array(list)){
			if(allowDoptiom){
				if(mw_is_object(list)){
					var doptiom=mw_js_optim_create(list);
					if(doptiom){
						return 	doptiom.get_all_data();
					}
					
				}
			}
			return false;
		}
		if(list.length){
			return list;
		}
		return false;
		
	}
	this.get_param_or_def=function(cod,def,checkexists){
		var p=this.get_param(cod);
		if(p){
			return p;	
		}
		if(checkexists){
			if(this.param_exists(cod)){
				return p;
			}
		}
		return def;
	}

	this.get_param=function(cod){
		if(typeof(this.params)!="object"){
			this.params=new Object;	
		}
		if(!cod){
			return this.params;
		}
		return this.get_obj_prop_by_dot_cod(this.params,cod);
	}
	
	this.extend_params=function(data,cod){
		if(!mw_is_object(data)){
			return false;	
		}
		if(!mw_is_object(this.params)){
			this.params=new Object;
		}
		if(!cod){
			$.extend( true, this.params, data );
			return true;	
		}
		var orig=this.get_param(cod);
		if(!mw_is_object(orig)){
			orig=new Object;
		}
		$.extend( true, orig, data );
		return this.set_obj_prop_by_dot_cod(this.params,cod,orig);
		
		
	}
	
	this.set_param_default=function(data,cod){
		if(!cod){
			return false;	
		}
		if(this.param_exists(cod)){
			return false;	
		}
		this.set_param(data,cod);
		return true;
		
	}
	
	this.set_param=function(data,cod){
		if(!cod){
			return this.set_params(data);	
		}
		if(typeof(this.params)!="object"){
			this.params=new Object;	
		}
		return this.set_obj_prop_by_dot_cod(this.params,cod,data);
		
	}
	this.set_obj_prop_by_dot_cod=function(data,cod,val){
		if(!cod){
			return false;	
		}
		cod=cod+"";
		if(typeof(cod)!="string"){
			return false;
		}
		var list=cod.split(".");
		if(list.length<=0){
			return false;	
		}
		if(typeof(data)!="object"){
			return false;
		}
		if(list.length==1){
			data[cod]=val;
			return true;	
		}
		var fcod=list.shift();
		if(!fcod){
			return false;	
		}
		var ncod=list.join(".");
		if((typeof(data[fcod])!="object")||(!data[fcod])){
			data[fcod]=new Object;	
		}
		return this.set_obj_prop_by_dot_cod(data[fcod],ncod,val);
		
		
		//return this.get_obj_prop_by_dot_cod(data[fcod],ncod);
			
	}
	
	this.get_obj_prop_by_dot_cod=function(data,cod){
		if(!cod){
			return data;	
		}
		cod=cod+"";
		if(typeof(cod)!="string"){
			return false;
		}
		var list=cod.split(".");
		if(list.length<=0){
			return data;	
		}
		if(!data){
			return false;	
		}
		
		if(typeof(data)!="object"){
			return false;
		}
		if(list.length==1){
			return data[cod];	
		}
		var fcod=list.shift();
		if(!fcod){
			return false;	
		}
		var ncod=list.join(".");
		return this.get_obj_prop_by_dot_cod(data[fcod],ncod);
			
	}

	this.append2frm=function(frm,pref,addLbl){
		if(!frm){
			return false;	
		}
		if(typeof(this.params)=="object"){
			for(var cod in this.params){
				if(pref){
					this.append2frm_elem(pref+"["+cod+"]",this.params[cod],frm,addLbl);	
				}else{
					this.append2frm_elem(cod,this.params[cod],frm,addLbl);	
				}
			}
		}
	}
	this.append2frm_elem=function(cod,data,frm,addLbl){
		var prot;
		if(typeof(data)=="object"){
			prot=Object.prototype.toString.apply(data);
			if(prot=="[object Object]"){
				for(var subcod in data){
					this.append2frm_elem(cod+"["+subcod+"]",data[subcod],frm,addLbl);	
				}
					
			}
		}else if(typeof(data)=="function"){
			return false;
		}else{
			if(typeof(data)=="boolean"){
				if(data){
					data=1;	
				}else{
					data=0;	
				}
			}
			//var input=document.createElement("input");
			
			var input=document.createElement("textarea");
			input.name=cod;
			input.value=data+"";
			if(addLbl){
				var c=document.createElement("div");
				var l=	document.createElement("label");
				l.innerHTML=cod;
				c.appendChild(l);
				c.appendChild(input);
				frm.appendChild(c);
			}else{
				frm.appendChild(input);
			}
		}
	}
	
	
	this.get_list_debug_elem=function(deep,cod){
		this.list_debug_elem_deep_max=5;	
		if(deep){
			this.list_debug_elem_deep_max=deep;	
		}
		this.list_debug_elem_deep=0;
		
		var elem=document.createElement("ul");
		var data=this.params;
		if(cod){
			data=this.get_param(cod);	
		}
		
		if(typeof(data)=="object"){
			for(var dcod in data){
				this.append2list_debug_elem(elem,dcod,data[dcod]);	
			}
		}
		
		return elem;
	}
	this.append2list_debug_elem=function(list,cod,data){
		this.list_debug_elem_deep++;
		var li=document.createElement("li");
		var lbl=document.createElement("strong");
		if(this.omit_type_on_debug_list){
			lbl.innerHTML=cod+" ";
		}else{
			lbl.innerHTML=cod+" ("+typeof(data)+"): ";
		}
		var elemcontainer=document.createElement("span");
		var valcontainer=document.createElement("span");
		var sublist;
		elemcontainer.appendChild(lbl);
		elemcontainer.appendChild(valcontainer);
		li.appendChild(elemcontainer);
		var prot;
		var i;
		if(typeof(data)=="object"){
			prot=Object.prototype.toString.apply(data);
			if(this.list_debug_elem_deep<this.list_debug_elem_deep_max){

				if(prot=="[object Array]"){
					if(!this.omit_type_on_debug_list){
						valcontainer.innerHTML="Array";
					}
					
					sublist=document.createElement("ul");
					li.appendChild(sublist);
					for(i=0; i<data.length;i++){
						this.append2list_debug_elem(sublist,(i+1),data[i]);	
					}
					
				}else if(prot=="[object Object]"){
					sublist=document.createElement("ul");
					li.appendChild(sublist);
					for(var subcod in data){
						this.append2list_debug_elem(sublist,subcod,data[subcod]);		
					}
				}else{
					valcontainer.innerHTML=prot+"";	
				}
			}else{
				valcontainer.innerHTML=prot+"";		
			}
			//
		}else{
			valcontainer.innerHTML=data+"";
		}
		if(sublist){
			elemcontainer.style.cursor="pointer";
			elemcontainer.onclick=function(){mw_html_set_display_visible(sublist,"alternate")};	
		}
		
		
		list.appendChild(li);
		this.list_debug_elem_deep--;
		
	}
}
function mw_obj_get_prop_by_dot_cod(data,cod){
	if(!cod){
		return data;	
	}
	var o=new mw_obj();
	return o.get_obj_prop_by_dot_cod(data,cod);
	
	
	
}


function mw_load_script(src){
	var node=document.createElement("SCRIPT");
	node.src=src;
	node.language="javascript";
	node.type="text/javascript";
	document.body.appendChild(node);
	
}
function mw_load_css(src){
	var node=document.createElement("link");
	node.href=src;
	node.rel="stylesheet";
	node.type="text/css";
	document.body.appendChild(node);
	
}
function mw_html_table(){
	this.appendCell=function(cell){
		var r=this.getActualRow();
		r.appendChild(cell);
		return cell;
	}

	this.addCell=function(innerHTML){
		var cell=document.createElement("TD");
		if(innerHTML){
			cell.innerHTML=innerHTML;
		}
		return this.appendCell(cell);
	}
	this.closeRow=function(){
		this.actualRow=false;	
	}
	this.getActualRow=function(){
		if(this.actualRow){
			return 	this.actualRow;
		}
		var row=document.createElement("TR");
		this.getTBody();
		this.tbody.appendChild(row);
		this.actualRow=row;
		return row;
	}
	this.getTBody=function(){
		if(!this.tbody){
			this.tbody=document.createElement("TBODY");
			this.getTable();
			this.table.appendChild(this.tbody);
		}
		return this.tbody;
	}
	this.getTable=function(){
		if(!this.table){
			this.table=document.createElement("TABLE");
			this.table.border=0;
			this.table.cellPadding=0;
			this.table.cellSpacing=0;
		}
		return this.table;
	}
}
function mw_html_apply_atts(elem,params){
	if(!params){
		return false;	
	}
	if(typeof(params)!="object"){
		return false;
	}
	mw_html_apply_atts_tag(elem,params["htmltag"]);
	mw_html_apply_atts_style(elem,params["htmltagstyle"]);
	
}
function mw_html_apply_atts_style(elem,params){
	if(!params){
		return false;	
	}
	if(typeof(params)!="object"){
		return false;
	}
	for (var p in params){
		$(elem).css(p,params[p]+"");
		//elem[p]=params[p];	
	}
	//return 	mw_html_apply_atts_tag(elem.style,params);
}


function mw_html_apply_atts_tag(elem,params){
	if(!params){
		return false;	
	}
	if(typeof(params)!="object"){
		return false;
	}
	for (var p in params){
		$(elem).attr(p,params[p]+"");
		//elem[p]=params[p];	
	}
	return true;
}

function mw_html_set_display_visible(elem,visible){
	if(!elem){
		return false;
	}
	if(visible){
		if(visible==="alternate"){
			if(elem.style.display!="none"){
				visible=false;	
			}
		}
	}
	var displayonshow=elem.getAttribute('displayonshow');
	if((typeof(displayonshow)!="string")||(displayonshow=="none")){
		displayonshow="";
		if(elem.style.display!="none"){
			displayonshow=elem.style.display;
		}
		elem.setAttribute('displayonshow',displayonshow);
	}
	if(visible){
		if(visible==="alternate"){
		}
		elem.style.display=	displayonshow;
	}else{
		elem.style.display=	"none";	
	}
	
}


function mw_do_fnc(fnc){
	fnc();
	
}
function mw_xml_get_child_by_tag_name(node,tagname) {
	if(!node){
		return false;
	}
	if (typeof(node)!="object" ) {
		return false;
	}
	
	if(!node["childNodes"]){
		return false;	
	}
	if(node.childNodes.length>0){
 		for(var i=0;i<node.childNodes.length;i++){
			if (node.childNodes[i]['nodeName']){
				
				if (node.childNodes[i]['nodeName']==tagname){
					return node.childNodes[i];	
				}
			}
		}
    }

}

function mw_xml2obj_item(xmlNode,allowJsCode){
	if(!xmlNode){
		return false;	
	}
	
	var dtype=xmlNode.getAttribute('dataType');
	if (dtype==("Object")){
		var r=new Object;
		var itemkey="";
		if(xmlNode.childNodes.length>0){
 			for(var i=0;i<xmlNode.childNodes.length;i++){
				if (xmlNode.childNodes[i].nodeType == 1){
					itemkey=xmlNode.childNodes[i].getAttribute('id');
					r[itemkey]=mw_xml2obj_item(xmlNode.childNodes[i],allowJsCode);
				}
			}
    	}
		return r;
		
	}else if (dtype==("Array")){
		var r=new Array;
		var itemkey="";
		if(xmlNode.childNodes.length>0){
 			for(var i=0;i<xmlNode.childNodes.length;i++){
				if (xmlNode.childNodes[i].nodeType == 1){
					itemkey=xmlNode.childNodes[i].getAttribute('id');
					r.push(mw_xml2obj_item(xmlNode.childNodes[i],allowJsCode));
				}
			}
    	}
		return r;
		
		
	}else{
		if(xmlNode.firstChild){
			var r;
			if (dtype==("Bool")){
				if(xmlNode.firstChild.data){
					r=parseInt(xmlNode.firstChild.data);
					if(r){
						return true;	
					}
					return false;	
				}else{
					return false;		
				}
			}
			if (dtype==("Int")){
				r=parseInt(xmlNode.firstChild.data);
				if(isNaN(r)){
					return 0;	
				}
				return r;
			}
			if (dtype==("Numeric")){
				r=parseFloat(xmlNode.firstChild.data);
				if(isNaN(r)){
					return 0;	
				}
				return r;
			}
			if (dtype==("String")){
				if(typeof(xmlNode.firstChild.data=="string")){
					return xmlNode.firstChild.data;
				}
				return "";
			}
			if (dtype==("JSObject")&&(allowJsCode)){
				if(typeof(xmlNode.firstChild.data=="string")){
					
					eval('var obj='+xmlNode.firstChild.data);
					if(typeof(obj=="object")){
						return obj;	
					}
				}
				return {};
			}
			return 	xmlNode.firstChild.data;
		}else{
			if (dtype==("Bool")){
				return false;	
			}
			if (dtype==("Int")){
				return 0;	
			}
			if (dtype==("Numeric")){
				return 0;	
			}
			if (dtype==("JSObject")&&(allowJsCode)){
				return {};	
			}
			if (dtype==("String")){
				return "";	
			}
			if (dtype==("Array")){
				return [];	
			}
		}
	}
	return false;
}
