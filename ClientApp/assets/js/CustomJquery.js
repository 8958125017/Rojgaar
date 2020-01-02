
function checkDec(el) {
  var ex = /^[0-9]+\.?[0-9]*$/;
  if (ex.test(el.value) = false) {
    el.value = el.value.substring(0, el.value.length - 1);
  }
}
$(document).ready(function () {
  $('.arrow').click(function () {
    $('.collapse-tab').toggleClass('show_it');
    $(this).toggleClass('rotated');
  });
});
$(document).ready(function () {
  $('.custom-accordion .panel-title > a').click(function () {
    $(this).toggleClass('active');
    $(this).parent().parent().parent().siblings().children().children('.panel-title').children('a').removeClass('active');
  });
});
$(document).mouseup(function (e) {
  $('.user-sec a').click(function () {
    $('.nav-user-opt').toggleClass('show_it');
  });
  var container = $(".nav-user-opt"); // YOUR CONTAINER SELECTOR

  if (!container.is(e.target) // if the target of the click isn't the container...
    && container.has(e.target).length === 0) // ... nor a descendant of the container
  {
    $('.nav-user-opt').removeClass('show_it');
  }
});
$(document).mouseup(function (e) {
  $('#dropd-btn').click(function () {
    $('#accordion').toggleClass('show_it');
  });
  var container = $("#accordion"); // YOUR CONTAINER SELECTOR

  if (!container.is(e.target) // if the target of the click isn't the container...
    && container.has(e.target).length === 0) // ... nor a descendant of the container
  {
    $('#accordion').removeClass('show_it');
  }
});
$(document).on('click', '.browse', function () {
  var file = $(this).parent().parent().parent().find('.file');
  file.trigger('click');
});
$(document).on('click', '.browsePhotos', function () {
  var file = $(this).parent().parent().parent().find('.file');
  file.trigger('click');
});
$(document).on('change', '.file', function () {
  try {

    var fp = $("#filUploadDocument");
    var name = '';
    for (var i = 0; i < fp[0].files.length; i++) {
      name += fp[0].files[i].name + ","
    }
    $(this).parent().find('.form-control').val(name.replace(/C:\\fakepath\\/i, ''));

  } catch (e) {

  }

});


$(document).on('click', '.Cover', function () {
  var file = $(this).parent().parent().parent().find('.file1');
  file.trigger('click');
});
$(document).on('change', '.file1', function () {
  try {

    var fp = $("#CoverUploadDocument");
    var name = '';
    for (var i = 0; i < fp[0].files.length; i++) {
      name += fp[0].files[i].name + ","
    }
    $(this).parent().find('.form-control').val(name.replace(/C:\\fakepath\\/i, ''));

  } catch (e) {

  }

});

//function myFunction() {
//  var x = document.getElementById("updateHistory");
//  if (x.style.display === "none") {
//    x.style.display = "block";
//  } else {
//    x.style.display = "none";
//  }
//}


//$(document).ready(function () {
//  $('.update-toggle').click(function () {
//    $(this).children('i').toggleClass('fa fa-plus fa fa-minus');
//  });

//});


// To fix left menu

if ($(window).width() > 1200) {
  $(window).scroll(function () {
    var y = $(this).scrollTop();

    if (y >= 550) {
      $('.add-sec').addClass('fixed-aside');
    }
    else {
      $('.add-sec').removeClass('fixed-aside');
    }

  });
}

if ($(window).width() < 1200 && $(window).width() > 768) {
  $(window).scroll(function () {
    var y = $(this).scrollTop();

    if (y >= 120) {
      $('.add-sec').addClass('fixed-aside-tab');
    }
    else {
      $('.add-sec').removeClass('fixed-aside-tab');
    }

  });
}



//more less

$(document).ready(function () {
  var showChar = 100;
  var ellipsestext = "...";
  var moretext = "More";
  var lesstext = "Less";
  $('.more').each(function () {
    var content = $(this).html();

    if (content.length > showChar) {

      var c = content.substr(0, showChar);
      var h = content.substr(showChar - 1, content.length - showChar);

      var html = c + '<span class="moreellipses">' + ellipsestext + ' </span><span class="morecontent"><span>' + h + '</span>  <a href="" class="morelink">' + moretext + '</a></span>';

      $(this).html(html);
    }

  });

  $(".morelink").click(function () {
    if ($(this).hasClass("less")) {
      $(this).removeClass("less");
      $(this).html(moretext);
    } else {
      $(this).addClass("less");
      $(this).html(lesstext);
    }
    $(this).parent().prev().toggle();
    $(this).prev().toggle();
    return false;
  });
});






// Applied globally on all textareas with the "autoExpand" class
$(document)
  .one('focus.autoExpand', 'textarea.autoExpand', function () {
    var savedValue = this.value;
    this.value = '';
    this.baseScrollHeight = this.scrollHeight;
    this.value = savedValue;
  })
  .on('input.autoExpand', 'textarea.autoExpand', function () {
    var minRows = this.getAttribute('data-min-rows') | 0, rows;
    this.rows = minRows;
    rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 16);
    this.rows = minRows + rows;
  });


// Examination full screen view
function errorHandler() {
  alert('mozfullscreenerror');
}
document.documentElement.addEventListener('mozfullscreenerror', errorHandler, false);

// toggle full screen
function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
    !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    // enable();
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
  disable();
}
function removeFullScreen() {
  enable();
  if (document.cancelFullScreen) {
    document.cancelFullScreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  }
}
function disable() {
  disableoncontextmenu();
  disableonkeydown();
  disableondragstart();
}

function disableoncontextmenu() {
  document.oncontextmenu = function (e)        //check for the right click
  {
    return false;
  }
}
function disableonkeydown() {
  document.onkeydown = function (e) {
    return disableCtrlKeyCombination(e);
  }
}
function disableondragstart() {
  document.ondragstart = function (e) {
    return false;
  }
}

function enable() {
  enableoncontextmenu();
  enableonkeydown();
  enableondragstart();
}

function enableoncontextmenu() {
  document.oncontextmenu = function (e)        //check for the right click
  {
    return true;
  }
}
function enableonkeydown() {
  document.onkeydown = function (e) {
    return true;
  }
}
function enableondragstart() {
  document.ondragstart = function (e) {
    return true;
  }
}


function disableCtrlKeyCombination(e) {
  //list all CTRL + key combinations you want to disable
  var forbiddenKeys = new Array('a', 'n', 'c', 'x', 'v', 'j', 'w');
  var key;
  var isCtrl;
  if (window.event) {
    key = window.event.keyCode;     //IE
    if (window.event.ctrlKey)
      isCtrl = true;
    else
      isCtrl = false;
  }
  else {
    key = e.which;     //firefox
    if (e.ctrlKey)
      isCtrl = true;
    else
      isCtrl = false;
  }
  //if ctrl is pressed check if other key is in forbidenKeys array
  if (isCtrl) {
    for (i = 0; i < forbiddenKeys.length; i++) {
      //case-insensitive comparation
      if (forbiddenKeys[i].toLowerCase() == String.fromCharCode(key).toLowerCase()) {
        //alert('Key combination CTRL + ' + String.fromCharCode(key) + ' has been disabled.');
        return false;
      }
    }
  }
  return true;
}

jQuery.each(jQuery('textarea[data-autoresize]'), function () {
  var offset = this.offsetHeight - this.clientHeight;

  var resizeTextarea = function (el) {
    jQuery(el).css('height', 'auto').css('height', el.scrollHeight + offset);
  };
  jQuery(this).on('keyup input', function () { resizeTextarea(this); }).removeAttr('data-autoresize');
});

//my sampark tab

function stripHTML(text) {
  var regex = /(<([^>]+)>)/ig;
  return text.replace(regex, "");
}
