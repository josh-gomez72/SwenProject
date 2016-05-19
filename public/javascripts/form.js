$(document).on("ready", function(){
	$('#search-form').submit(function(event){
		event.preventDefult();
		console.log("searched");
	});
});