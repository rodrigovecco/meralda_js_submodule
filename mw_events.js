
function mw_events_handler(params){
	
	this.params=new mw_obj();
	this.params.set_params(params);
	this.cod=this.params.get_param_or_def("cod",cod);
	
	this.setCurrentData=function(data,extraData){
		this.currentData=data;	
		this.currentExtraData=extraData;	
	}
	this.setCurrentDataAndDispatch=function(data,extraData){
		this.setCurrentData(data,extraData);	
		this.dispatch(data);	
	}
	
	this.dispatch=function(data){
		return this._dispatch(data);	
	}
	this._dispatch=function(data){
		var fnc=this.get_param_if_function("onDispatch");
		if(fnc){
			fnc(data,this);	
		}
	}
	this.set_listener=function(listener){
		this.listener=listener;	
	}
	
}
function mw_events_listener(cod){
	this.cod=cod;
	this.eventsCount=0;
	
	
	
	this.handlers=new mw_objcol();
	this.handlers.enable_autocod("listener_");
	
	this.dispatch=function(data,extraData){
		this.eventsCount++;
		this.currentData=data;
		this.stop_dispatch=false;
		this.currentExtraData=extraData;
		var list=this.handlers.get_items_by_index();
		
		if(!list){
			return;	
		}
		var handler;
		for(var i=0;i<list.length;i++){
			handler=list[i];
			if(mw_is_function(handler)){
				handler(data);	
			}else if(mw_is_object(handler)){
				handler.setCurrentDataAndDispatch(data,extraData);	
			}
			if(this.stop_dispatch){
				return;	
			}
		}
			
	}
	
	this.addHandlers=function(list){
		if(!mw_is_array(list)){
			return;
		}
		var handler;
		for(var i=0;i<list.length;i++){
			handler=list[i];
			this.addHandler(handler);	
		}
		
	}
	this.removeHandler=function(handler){
		var cod;
		if(!handler){
			return false;	
		}
		if(mw_is_object(handler)){
			cod=handler.cod;	
		}else{
			cod=handler;	
		}
		//console.log("removing Handler",cod);
		if(!cod){
			return false;	
		}
		this.handlers.removeItem(cod);
		return true;
			
	}
	this.addHandler=function(handler,cod){
		
		var e;
		
		if(mw_is_object(handler)){
			if(!mw_is_function(handler["_dispatch"])){
				var p=handler;
				handler=new mw_events_handler(p);
			}
			if(!cod){
				cod=handler.cod;	
			}else{
				handler.cod=cod;	
			}
			if(mw_is_function(handler["set_listener"])){
				handler.set_listener(this);	
			}
			e=this.handlers.add_item(cod,handler);
			if(!e){
				return false;	
			}
			if(!handler.cod){
				handler.cod=e.cod;	
			}
			
			
			return handler;
			
		}
		if(mw_is_function(handler)){
			
			e=this.handlers.add_item(cod,handler);
			if(!e){
				return false;	
			}
			
			return e.cod;
			
		}
		return false;	
	}
	
	this.set_man=function(man){
		this.man=man;	
	}
	
}
function mw_events_man(){
	this.listeners=new mw_objcol();
	this.dispatch=function(listenerCod,data,extraData){
		
		var l=this.get_listener_if_exists(listenerCod);
		
		if(!l){
			return false;
			
		}
		
		return l.dispatch(data,extraData);
		
	}
	this.addHandlers=function(listenerCod,list){
		var l=this.get_listener(listenerCod);
		
		if(l){
			return l.addHandlers(list);	
		}
		return false;
	}
	this.removeHandler=function(listenerCod,handler){
		var l=this.get_listener(listenerCod);
		
		if(l){
			return l.removeHandler(handler);	
		}
		return false;
			
	}
	
	this.onEventReady=function(listenerCod,handler,cod){
		//listener must be created
		var num=this.getListenerEventsCount(listenerCod);
		//console.log("onEventReady "+listenerCod," count: "+num);
		if(num){
			if(mw_is_function(handler)){
				handler();
				return true;
			}
			return;
		}
		return this.on(listenerCod,handler,cod);
	}
	this.on=function(listenerCod,handler,cod){
		var l=this.get_listener(listenerCod);
		
		if(l){
			return l.addHandler(handler,cod);	
		}
		return false;
	}
	this.add_listener=function(cod,evnt){
		if(cod){
			if(mw_is_object(cod)){
				var c=cod.cod;
				evnt=cod;
				cod=c;	
			}
		}
		if(mw_is_object(evnt)){
			if(!cod){
				cod=evnt.cod;	
			}
		}
		if(!cod){
			return false;	
		}
		if(typeof(cod)!="string"){
			return false;	
		}
		if(!mw_is_object(evnt)){
			evnt=this.create_listener(cod);	
		}
		if(!evnt){
			return false;
		}
		evnt.cod=cod;
		return this.do_add_listener(evnt);
		
	}
	this.do_add_listener=function(evnt){
		var cod=evnt.cod;
		this.listeners.add_item(cod,evnt);
		evnt.set_man(this);
		return evnt;
		
	}

	this.create_listener=function(cod){
		if(!cod){
			return false;	
		}
		if(typeof(cod)!="string"){
			return false;	
		}
		var e=new mw_events_listener(cod);
		return e;
		
	}
	this.get_listener=function(cod){
		if(!cod){
			return false;	
		}
		var e=this.get_listener_if_exists(cod);
		if(e){
			return e;	
		}
		return this.add_listener(cod);
	}
	this.get_listener_if_exists=function(cod){
		if(!cod){
			return false;	
		}
		return this.listeners.get_item(cod);
	}
	this.getListenerEventsCount=function(cod){
		var l=this.get_listener_if_exists(cod);
		if(l){
			return l.eventsCount;
		}
		return 0;
	}
}
function mw_events_enabled_obj(){
	this.eventsMan=new mw_events_man();
	this.do_initEvents=function(){
			
	}
	this.initEvents=function(){
		if(this.initEventsDone){
			return;	
		}
		this.initEventsDone=true;
		this.do_initEvents();
	}
	this.on=function(listenerCod,handler,cod){
		this.initEvents();
		if(mw_is_array(handler)){
			return this.eventsMan.addHandlers(listenerCod,handler);
		}

		return 	this.eventsMan.on(listenerCod,handler,cod);
	}
	this.dispatchEvent=function(listenerCod,data,extraData){
		if(!mw_is_object(data)){
			data={};
		}
		if(!data.dispatcher){
			data.dispatcher=this;	
		}
		this.initEvents();
		return 	this.eventsMan.dispatch(listenerCod,data,extraData);
	}
}
