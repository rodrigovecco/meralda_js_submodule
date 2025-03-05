function mw_google_test_ui(info){
	mw_ui.call(this,info);
	this.after_init=function(){
		var _this=this;
		window.onGoogleSignIn=function(googleUser){_this.onSignIn(googleUser)};
		this.testFrm=this.params.get_param_if_object("testfrm");
		var e=this.get_ui_elem("testfrmcontainer");
		if(e){
			if(	this.testFrm){
				this.testFrm.append_to_container(e);	
			}
		}
		//main_ui.doAfterInit(function(){_this.onMainUiInit()});
	}
	this.onSignIn=function(googleUser){
		var profile = googleUser.getBasicProfile();
		var id_token = googleUser.getAuthResponse().id_token;
		console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
		console.log('Name: ' + profile.getName());
		console.log('Image URL: ' + profile.getImageUrl());
		console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
		if(this.testFrm){
			this.testFrm.setChildValueByDotCod("nd.token",id_token);	
		}
	
	}
	/*
	this.onFbLoginCheckResponse=function(){
		var data=this.getAjaxDataResponse(true);
		if(!data){
			return false;	
		}
		var _this=this;
		console.log("onFbLoginCheckResponse",data.params);
	}
	
	
	this.onMainUiInit=function(){
		console.log("onMainUiInit");
		this.fbMan=main_ui.getMan("fb");
		if(!this.fbMan){
			return false;	
		}
		var _this=this;
		this.fbMan.onFBReady(function(){console.log("onFBReady 1");});
		this.fbMan.onFBReady(function(){console.log("onFBReady 2");});
		this.fbMan.createFB(function(){console.log("onFBReady createFB");_this.onfbloaded()});
		this.fbMan.onFBReady(function(){console.log("onFBReady 3");});
		
		
	}
	
	
	this.test=function(){
		console.log("test");
		
		FB.getLoginStatus(function(response) {
			console.log("getLoginStatus",response);
		});
		//FB.login(function(){}, {scope: 'public_profile,email'});	
			
	}
	this.logout=function(){
		console.log("logout");
		FB.logout(function(response) {
			console.log("FB.logout",response);
		});	
			
	}
	this.FBLogin=function(){
		var _this=this;
		FB.login(function(response) {
			_this.onFBLogin(response);
		}, {
			scope: 'public_profile,email', 
			enable_profile_selector: true,
			return_scopes: true
		});			
	}
	this.onFBLogin=function(response){
		console.log("mwfbonlogin",response);
		if(!response){
			return false;	
		}
		if (response.status !== 'connected') {
    		return false;
			
  		}
		
		console.log('Logged in.');
		
		params={};	
		
		params.fba=response.authResponse;
		var url =this.get_xmlcmd_url("fblogin",params);
		var _this=this;
		var a=this.getAjaxLoader();
		a.set_url(url);
		a.addOnLoadAcctionUnique(function(){_this.onFbLoginCheckResponse()});
		a.run_post_if_long();
			
	}
		
	this.onfbloaded=function(){
		console.log("onfbloaded");	
		var _this=this;
		window.mwfbonlogin=function(){
			_this.onFBLogin();	
		}
		
		$('#fbTest').on('click',function(){_this.test()});
		$('#fbLogin').on('click',function(){_this.FBLogin()});
		$('#fbLogout').on('click',function(){_this.logout()});
		$('#fbloginbtn').html('<fb:login-button scope="public_profile,email"></fb:login-button><div class="fb-login-button" data-max-rows="1" data-size="large" data-button-type="continue_with" data-show-faces="false" data-auto-logout-link="false" data-use-continue-as="false" enable_profile_selector="true"><div class="fb-login-button" data-max-rows="1" data-size="large" data-button-type="login_with" data-show-faces="false" data-auto-logout-link="true" data-use-continue-as="false"></div>');
		return;
	}

	this.onFBgetLoginStatus=function(response){
		this.fbStatusResponse=response;
		console.log("onFBgetLoginStatus",response);
		
	}
	this.loadFbStatus=function(){
		this.fbStatusResponse=false;
		var _this=this;
		FB.getLoginStatus(function(response) {
			_this.onFBgetLoginStatus(response);
		});
		
	}
	*/

	
	
}
