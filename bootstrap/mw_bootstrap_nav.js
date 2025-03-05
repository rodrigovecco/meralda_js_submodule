function mw_bootstrap_nav(){
	mw_events_enabled_obj.call(this);
	this.onLinkClick=function(elem,evtn){
		//console.log("onLinkClick elem",elem);
		//console.log("onLinkClick evtn",evtn);
		var cod=this.getNavCodFromLinkElem(elem);
		//console.log("onLinkClick cod",cod);
		this.setSelectedItemCod(cod);
		
	}
	this.setSelectedItemCod=function(cod,omitEvent){
		this.selectedItemCod=false;
		if(cod){
			if(typeof(cod)=="string"){
				this.selectedItemCod=cod;	
			}
		}
		this.updateDisplay();
		if(!omitEvent){
			this.dispatchEvent("selChanged",{selected:this.selectedItemCod});
		}
	}
	this.getNavCodFromLinkElem=function(elem){
		var cod=$(elem).parent("li").attr("aria-controls");
		return cod;
	}
	this.updateDisplay=function(){
		var _this=this;
		if(!this.navId){
			return false;	
		}
		var sel='#'+this.navId+' li';
		if(this.selectedItemCod){
			sel="#"+this.navId+" li[aria-controls!='"+this.selectedItemCod+"']";	
		}
		$(sel).removeClass("active");
		if(this.selectedItemCod){
			sel="#"+this.navId+" li[aria-controls='"+this.selectedItemCod+"']";
			$(sel).addClass("active");	
		}
		
	}
	this.getSelectedElemSelector=function(){
		if(!this.navId){
			return false;
		}
		if(this.selectedItemCod){
			return 	"#"+this.navId+" li[aria-controls='"+this.selectedItemCod+"']";
		}
		return false;
	}
	
	this.initOnClickEvents=function(){
		var _this=this;
		if(!this.navId){
			return false;	
		}
		$('#'+this.navId+' a').click(function (e) {
			  e.preventDefault()
			 _this.onLinkClick(this,e);
		})
	}
}
