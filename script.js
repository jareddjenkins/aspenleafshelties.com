$(document).ready(function() {
						   
	var hash = window.location.hash.substr(1);
	var href = $('#list-nav li a').each(function(){
		var href = $(this).attr('href');
		if(hash==href.substr(0,href.length-5)){
			var toLoad = hash+'.html #content';
			$('#content').load(toLoad)
		}											
	});

	$('#list-nav li a').click(function(){
		jQuery.fx.off = true;							  
		var toLoad = $(this).attr('href')+' #content';
		$('#content').fadeOut('fast',loadContent);
		window.location.hash = $(this).attr('href');
		function loadContent() {
			$('#content').load(toLoad,'',showNewContent())
		}
		function showNewContent() {
			$('#content').fadeIn('fast',hideLoader());
		}
		function hideLoader() {
			$('#load').fadeOut('normal');
		}
		return false;
		
	});

});