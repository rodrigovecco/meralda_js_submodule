
function mw_select_removeAllOptions(selectobj){
	if(!selectobj){
		return false;
	}
	
	if(selectobj.nodeName!="SELECT"){
		return false;
	}
	var i;
	selectobj.selectIndex=0;
	for(i=selectobj.options.length-1;i>=0;i--){
		selectobj.remove(i);
	}
}
function mw_select_addOption(selectobj,val,txt,maxlen){
	if(!selectobj){
		return false;
	}
	
	if(selectobj.nodeName!="SELECT"){
		return false;
	}
	var option=document.createElement('option');
	if(txt){
		txt=txt+"";	
	}
	
	if(typeof(txt)!="string"){
		txt="";	
	}
	if(maxlen){
		if(txt.length>maxlen){
			txt=txt.substr(0,maxlen)+"...";	
		}
	}
	option.innerHTML = txt;
	option.value = val;
	selectobj.appendChild(option);
	return option;
}
