//under construction
function mw_datainput_item_imagefile(options){
	this.getFile=function(){
		if(this.input_elem){
			if(this.input_elem.files){
				return this.input_elem.files[0];
			}
		}
	}
	this._upload=function(){
		if(this.disabled){
			return;
		}
		this.upload();
	}
	this.upload=function(){
		console.log("upload","Extend this method to execute");
	}
	this.setImgUrl=function(url){
		this.imageURL=url;
		this.updateDisplayImg();
	}
	this.updateDisplayImg=function(){
		var html="";
		if(this.imageURL){
			html="<img src='"+this.imageURL+"'>";
		}
		if(this.imageContainer){
			this.imageContainer.html(html);
		}
	}
	this.openFileDialog=function(){
		if(this.disabled){
			return;
		}
		if(this.input_elem){
			this.input_elem.click();
		}
	}
	this.onDrop=function(e){
		console.log("onDrop",e);
		var finalFiles=[];
		if(e){
			e.preventDefault();
			if(e.originalEvent){
				if(e.originalEvent.dataTransfer){
					if(e.originalEvent.dataTransfer.files){
						if(e.originalEvent.dataTransfer.files.length==1){
							if (e.originalEvent.dataTransfer.files[0].type.startsWith('image/')) {
								finalFiles=e.originalEvent.dataTransfer.files;
							}
						}

					}
				}
			}
		}
		if(this.input_elem){
			this.input_elem.files = finalFiles;

			this.on_change();
		}
	}
	this.on_change=function(){
		this.show_hide_validations_msgs_on_change();
		this.run_on_change_events();
		if(this.options.get_param("autoSubmit")){
			this._upload();
		}
	}
	this.create_container=function(){

		this.imageURL=this.options.get_param_or_def("imageURL",false);
		var p;
		var _this=this;
		var c=document.createElement("div");
		c.className="form-group";
		if(this.is_horizontal()){
			c.className="form-group mw-form-group-horizontal";
		}
		
		this.frm_group_elem=c;

		$(this.frm_group_elem).addClass("mw_input_file_drop_container_full");
		
		var lbnt=this.create_left_btn();
		var rbtn=this.create_right_btn();
		var inputelem=this.get_input_elem();
		var cc;
		var ccc;
		this.dropContainer=$("<div class='mw_input_file_drop_container'></div>");
		this.dropContainer.click(function(){_this.openFileDialog()});
		this.dropContainer.on('drop', function (e) {
			e.preventDefault();
			_this.onDrop(e)}
		);
		this.dropContainer.on('dragover', function (e) {
 			e.preventDefault();
		});
		this.dropContainer.appendTo(this.frm_group_elem);
		this.dropIndicator=$("<div class='mw_input_file_drop_indicator_text'></div>");
		this.dropIndicator.html(this.options.get_param_or_def("dropIndicatorText","<i class='glyphicon glyphicon-inbox'></i>"));
			
		this.dropIndicator.appendTo(this.dropContainer);



		this.imageContainer=$("<div class='mw_input_file_image_container'></div>");
		this.imageContainer.appendTo(this.dropContainer);
		var lbl=this.create_lbl();
		if(lbl){
			c.appendChild(lbl);	
		}

		var inputHiddenMode=this.options.get_param("fileInputHiddenMode");
		this.addBtnsContainer=$("<div class='mw_input_file_addBtns'></div>");
		this.editBtn=$("<button class='btn btn-outline-secondary' type='button'><i class='glyphicon glyphicon-pencil'></i></button>");
		this.editBtn.click(function(){_this.openFileDialog()});
		this.editBtn.appendTo(this.addBtnsContainer);
		if(this.options.get_param("deleteBtnEnabled")){
			this.deleteAddBtn=$("<button class='btn btn-outline-danger' type='button'><i class='fa fa-trash'></i></button>");
			this.deleteAddBtn.click(function(){_this.onDeleteClick()});
			this.deleteAddBtn.appendTo(this.addBtnsContainer);
		}
		

		this.addBtnsContainer.appendTo(this.frm_group_elem);

		if(!this.options.get_param("addBtnsVisible")){
			this.addBtnsContainer.hide();
		}

		if(this.options.get_param("deleteBtnEnabled")){
			this.deleteBtn=$("<button class='btn btn-outline-secondary' type='button'><i class='fa fa-trash'></i></button>");
			this.deleteBtn.click(function(){_this.onDeleteClick()});
		}
		if(this.options.get_param("uploadBtnEnabled")){
			this.uploadBtn=$("<button class='btn btn-outline-secondary' type='button'><i class='fa fa-upload'></i></button>");
			this.uploadBtn.click(function(){_this._upload()});
		}
		
		if(lbnt||rbtn||this.is_horizontal()||this.deleteBtn||this.uploadBtn){
			cc=document.createElement("div");
			cc.className="input-group";
			if(this.is_horizontal()){
				if(lbnt||rbtn){
					ccc=document.createElement("div");
					ccc.className="mw_input_group_horizontal_container";
					cc.appendChild(ccc);
					cc=ccc;	
					
					
				}
			}
			if(lbnt){
				cc.appendChild(lbnt);	
			}
			if(inputelem){
				cc.appendChild(inputelem);	
			}
			if(rbtn){
				cc.appendChild(rbtn);	
			}
			if(this.deleteBtn){
				this.deleteBtn.appendTo(cc);	
			}
			if(this.uploadBtn){
				this.uploadBtn.appendTo(cc);	
			}
			if(inputHiddenMode){
				$(cc).hide();
			}
			c.appendChild(cc);	
		}else{
			if(inputelem){
				c.appendChild(inputelem);
				if(inputHiddenMode){
					$(inputelem).hide();
				}
			}
				
		}
		p=this.options.get_param_or_def("input_name",false);
		if(p){
			this.fileNameInput=$("<input type=\"hidden\">");
			this.fileNameInput.attr("name",this.get_input_name_for_child("fileinputname"));
			this.fileNameInput.val(p);
			this.fileNameInput.appendTo(this.frm_group_elem);

			
		}
		this.deleteInput=$("<input  type=\"hidden\">");
		this.deleteInput.attr("name",this.get_input_name_for_child("delete"));

		this.deleteInput.appendTo(this.frm_group_elem);
		
		this.create_notes_elem_if_req();
		this.updateDisplayImg();
		return c;
	}
	this.onDeleteClick=function(){
		if(this.disabled){
			return;
		}
		if(this.toggleDelete()){
			this.doDelete();
		}
	}
	this.doDelete=function(){
		console.log("Delete","Extend this method to execute");
		//extend
	}
	this.setDelete=function(value){
		if(value){
			value="1";
		}else{
			value="";
		}
		if(this.deleteInput){
			this.deleteInput.val(value);
		}
		if(this.deleteBtn){
			if(value){
				this.deleteBtn.addClass("active");
			}else{
				this.deleteBtn.removeClass("active");
			}
		}
		if(this.deleteAddBtn){
			if(value){
				this.deleteAddBtn.addClass("active");
			}else{
				this.deleteAddBtn.removeClass("active");
			}
		}
		return value;

	}
	this.toggleDelete=function(){
		if(!this.deleteInput){
			return;
		}
		var val=this.deleteInput.val();
		if(val){
			return this.setDelete(false);
		}else{
			return this.setDelete(true);
		}
		
	}

	this.set_def_input_atts=function(input){
		var p;
		p=this.get_input_name();
		if(p){
			input.name=p;	
		}
		p=this.get_input_id();
		if(p){
			input.id=p;	
		}
		input.className="form-control";
		input.type="file";
		this.set_def_input_atts_more(input);//new
		this.set_def_input_atts_by_cfg(input);//new
		
		
		this.update_input_atts(input);
	}
	this.set_def_input_atts_more=function(input){
		$(input).attr("accept",".jpg,.png");
	}
	this.init(options);
}
mw_datainput_item_imagefile.prototype=new mw_datainput_item_abs();