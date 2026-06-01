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
		var targetEl = list[0];
		// Bootstrap 5: use native Collapse API (jQuery plugin removed in BS5)
		if(typeof bootstrap !== 'undefined' && bootstrap.Collapse){
			var bsCollapse = bootstrap.Collapse.getOrCreateInstance(targetEl);
			bsCollapse.toggle();
		}else{
			// Bootstrap 3/4 fallback via jQuery plugin
			$(targetEl).collapse("toggle");
		}
})

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
})



  