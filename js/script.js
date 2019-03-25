$(document).ready(function () {

  $('#slides').superslides({
    pagination: false,
    animation: 'fade',
    play: 5000
  });

  var typed = new Typed(".typed", {
    strings: ["Student.", "Web Developer."],
    typeSpeed: 70,
    loop: true,
    startDelay: 1000,
    showCursor: false
  });

});