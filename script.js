var options = {
  perspective: true,
  position: [50, 50]
}
if (localStorage.getItem('RLSBOptions')) {
  options = JSON.parse(localStorage.getItem('RLSBOptions'));
}

if (options.perspective === true) {
  $('body').addClass('hasPerspective');
  $('#perspective').prop('checked', true);
}
$('.hasPerspective #scoreboard').css({
  top: options.position[0],
  left: options.position[1]
})


// default colours
var defaultColours = [1, 6];
// Colour palette hue values
var h = [0, 15, 38, 68, 152, 190, 216, 236, 265, 322],
  s = 100,
  l = [50, 40, 30, 25],
  a = .8,
  hsla = function (h, s, l, a) {
    return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
  }

// build colour pallete html
var lc = 0,
  defaultSquare;
for (var i = 0; i < (h.length * l.length); i++) {
  // create each colour square
  var background = 'background:' + hsla(h[i % h.length], s, l[lc], 1);
  if (i === defaultColours[0] || i === defaultColours[1]) {
    defaultSquare = 'square default';
  } else {
    defaultSquare = 'square';
  }
  $('.colour-palette')[0].innerHTML += '<div class="' + defaultSquare + '" style="' + background + '"></div>';
  if (i % h.length === 9) {
    $('.colour-palette')[0].innerHTML += '<br>';
    lc++;
  }
}
// give each "team" (line) a palette
$('.team').each(function () {
  $('.colour-palette:last').clone().appendTo(this);
})

// CSS for adding to score
var changeColour = function (hsla) {
  return {
    'background': hsla,
    'box-shadow': '0 0 30px ' + hsla
  };
}

$(document).on('focus', 'input', function () {
  $('tr.active').removeClass('active');
  $(this).parents('tr').addClass('active');
}).on('blur', 'input', function () {
  if (!$('.active').find('.colour-palette:hover').length) {
    $('tr.active').removeClass('active');
  }
  $('#scoreboard .team input').each(function () {
    if (this.value === '' && $('#scoreboard .team').length > 2) {
      $(this).parents('.team').remove();
    }
  })
});
$(document).on('keydown keyup change', 'input', function (e) {
  $(this).next('span').text(this.value);
  var maxWidth = Math.max.apply(null, $('.name span').map(function () {
    return $(this).outerWidth(true);
  }).get());
  $('.name input').width(maxWidth);

  if (e.keyCode === 13 && e.type === 'keyup') {
    newTeam($(this).parents('.team'));
  }

});

/// apply colour change to first 2 teams
$('.team:eq(0) .score').css(changeColour(hsla(h[defaultColours[1]], s, l[0] + 10, a)));
$('.team:eq(1) .score').css(changeColour(hsla(h[defaultColours[0]], s, l[0] + 10, a)));

$(document).on('click', '.square', function () {
  var tHsla = this.outerHTML.split('background:hsla(')[1].split(')')[0].split(',');
  var tHsla = hsla(tHsla[0], tHsla[1].split('%')[0], Number(tHsla[2].split('%')[0]) + 10, a);
  $(this).parents('.team').find('.score').css(changeColour(tHsla));
  $(this).parents('.team').removeClass('active');
}).on('click', '.button.up', function () {
  $(this).parents('.score').find('span').text(Number($(this).parents('.score').find('span:first').text()) + 1);
  $(this).parents('.score').find('.boom').stop(true, true).hide().show().fadeOut(1500);
}).on('click', '.button.down', function () {
  $(this).parents('.score').find('span').text(Number($(this).parents('.score').find('span:first').text()) - 1);
}).on('mousemove', function (e) {
  if ($('#reposition:checked').length == 1 && mouseDown) {
    // add screen limits
    $('#scoreboard').css({
      top: e.pageY + pos.top,
      left: e.pageX + pos.left
    });
  }
}).on('change', 'input', function () {
  setRLSBOptions();
}).on('click', '.repositioning', function (e) {
  if (e.target != $('#scoreboard')[0]) {
    $('#reposition').prop('checked', false).trigger('change');
  }
})

var mouseDown = false;
$('#scoreboard').mousedown(function (e) {
  pos = $('#scoreboard').offset();
  pos.top = pos.top - e.pageY;
  pos.left = pos.left - e.pageX;
  mouseDown = true;
});
$(document).mouseup(function () {
  mouseDown = false;
  setRLSBOptions();
})

function setRLSBOptions() {
  options.perspective = $('#perspective:checked').length == 1;
  options.position = [$('#scoreboard').css('top'), $('#scoreboard').css('left')];
  localStorage.setItem('RLSBOptions', JSON.stringify(options));
}

// OMG what a mess... :S

$('.newTeam').on('click', function () {
  newTeam();
});

function newTeam(where) {
  if (!where) {
    where = '#scoreboard tbody tr:last'
  }
  $('.team-template tr').clone().insertAfter(where).find('input').focus().val('').parents('.team').find('.score').css(changeColour(hsla(h[Math.floor(Math.random() * h.length)], s, l[0] + 10, a)));
}


$('#perspective').change(function () {
  if ($('#perspective:checked').length == 1) {
    $('body').addClass('hasPerspective');
  } else {
    $('.hasPerspective').removeClass('hasPerspective');
    $('#scoreboard').attr('style', '');
  }
});

$('#reposition').change(function () {
  $('#reposition:checked').length == 1 ? $('body').addClass('repositioning') : $('.repositioning').removeClass('repositioning');
});
