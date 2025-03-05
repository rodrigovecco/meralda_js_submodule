function mw_ui_users_groups_admin(info){
	this.info=new mw_obj();
	this.info.set_params(info);
	//this.debug_mode=true;
	
	this.set_datagrid_man=function(man){
		this.datagrid_man=man;
		this.datagrid_man.ui=this;
			
	}
	
	this.create_data_grid=function(){
		return this.datagrid_man.create_data_grid();	
	}
	
	this.add_data_grid_colum=function(col){
		return this.datagrid_man.add_colum(col);	
	}

	
	
}

mw_ui_users_groups_admin.prototype=new mw_ui_grid();
