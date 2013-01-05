setInterval( function() {
 $('#row').css({
   position:'absolute',
   display: 'block',
	left: ($(window).width() 
     - $('#row').width())/2 ,
   top: ($(window).height() 
     - $('#row').height())/2
  });	
}, 1);