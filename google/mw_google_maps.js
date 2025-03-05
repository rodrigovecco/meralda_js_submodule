function mw_google_maps(){
	this.loaded=false;
	this.onLoadTodo=[];
	this.onLoad=function(fnc){
		if(this.loaded){
			console.log("mw_google_maps","Already loaded");
			fnc();
		}else{
			console.log("mw_google_maps","Adding TODO onload");
			this.onLoadTodo.push(fnc);
		}
	}
	this.afterLoaded=function(){
		this.loaded=true;
		console.log("mw_google_maps","Running TODO onload");
		for(var i=0;i<this.onLoadTodo.length;i++){
			this.onLoadTodo[i]();
		}
	}
}
window.mw_google_maps_man=new mw_google_maps()
function mw_google_maps_loaded(){
	console.log("mw_google_maps_loaded");
	window.mw_google_maps_man.afterLoaded();
	
}