$('.nav-btn').click(function () {
  $('.nav-use').fadeToggle();
  $('.navbar').css('z-index', '0');
  $('body').css('overflow', 'hidden');
  // $('.nav-btn').addCss('close');
})

$('.nav-use').click(function () {
  $('.nav-use').fadeToggle();
  $('body').css('overflow', 'auto');
  setTimeout(
    function () {
      $('.navbar').css('z-index', '9');
    }, 400
  );
})

$(window).scroll (function () {
 var ratio = $(document).scrollTop () / (($(document).height () - $(window).height ()) / 100);
 $("#progress").width (ratio + "%");

});

JQuery(function($) {
  $(window).scroll(function(){

    if($(window).scrollTop()>460){
     e.preventDefault();
     $('.home-title__brand').animate({
       font-size: '24px',
     }, 350);
    }

    if($(window).scrollTop()<460){
     $('.home-title__brand').css('font-size', '46px');
    }
  });
});
