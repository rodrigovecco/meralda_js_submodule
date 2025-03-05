$(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
		var $this   = $(this);
		var dataAutoTargetSelector=$this.attr('data-auto-target');
		if(!dataAutoTargetSelector){
			return;
		}
		var $parent=$this;
		var dataParentAutoTargetSelector=$this.attr('data-auto-target-parent');
		if(dataParentAutoTargetSelector){
			$parent=$this.closest(dataParentAutoTargetSelector);	
		}
		if(!$parent){
			return;	
		}
		var list=$parent.find(dataAutoTargetSelector);
		if(!list){
			return;	
		}
		if(!list.length){
			return;	
		}
    var $target = $(list[0]);
		if(!$target){
			return;	
		}
   	$target.collapse("toggle");
   
})

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
})



  