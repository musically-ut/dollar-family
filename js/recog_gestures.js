//
// Startup
//
var _isDown, _points, _strokeID, _r, _g, _rc; // global variables
var _trainingCount = 0;

$(function ()
{
    _points = []; // point array for current stroke
    _strokeID = 0;
    _isDown = false;
    _r = new PDollar.PDollarRecognizer();

    var canvas = document.getElementById('myCanvas'),
	$canvas = $(canvas);

    var $window = $(window);

    canvas.width = $window.width() - 20;
    canvas.height = $window.height() - 20;
    _rc = getCanvasRect(canvas); // canvas rect on page

    $window.resize(function () {
	canvas.width = $window.width() - 20;
	canvas.height = $window.height() - 20;
	_rc = getCanvasRect(canvas); // canvas rect on page
    });

    _g = canvas.getContext('2d');
    _g.lineWidth = 3;
    _g.font = "16px Gentilis";
    _g.fillStyle = "rgb(255,255,136)";
    // _g.fillRect(0, 0, _rc.width, 20);

    $canvas.on('mousedown.pdollar touchstart.pdollar', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        if (ev.originalEvent.changedTouches) {
            ev = ev.originalEvent.changedTouches[0];
        }
        // console.log('starting', 'clientX = ', ev.clientX, 'clientY = ', ev.clientY);
	mouseDownEvent(ev.clientX, ev.clientY);
    });

    $canvas.on('mousemove.pdollar touchmove.pdollar', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        if (ev.originalEvent.changedTouches) {
            ev = ev.originalEvent.changedTouches[0];
        }
        // console.log('moving', 'clientX = ', ev.clientX, 'clientY = ', ev.clientY);
	mouseMoveEvent(ev.clientX, ev.clientY);
    });

    $canvas.on('mouseup.pdollar touchend.pdollar', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        if (ev.originalEvent.changedTouches) {
            ev = ev.originalEvent.changedTouches[0];
        }
        // console.log('ending', 'clientX = ', ev.clientX, 'clientY = ', ev.clientY);
	mouseUpEvent(ev.clientX, ev.clientY);
    });

    $('.js-return').on('click.pdollar', hideOverlay);
    $('.js-clear-stroke').on('click.pdollar', onClickClearStrokes);
    $('.js-init').on('click.pdollar', onClickInit);
    $('.js-check').on('click.pdollar', recognizeNow);
    $('.js-choice').on('click.pdollar', addSampleGesture);
    $('.js-intro').on('click.pdollar', function () {
        introJs().setOption('showStepNumbers', false)
                 .start()
                 .onexit(function () { window.scrollTo(0, 0); });
    });

    $('.ui.js-confirm').modal({
        closable: false,
        onApprove: function () {
            onClickDelete();
            _trainingCount = 0;
            $('.js-gesture-count').text(_trainingCount);
        },
        onDeny: function () {
        }
    });

    $('.js-clear-all-data').on('click.pdollar', function () {
        $('.ui.js-confirm').modal('show');
    });

    $('.js-close-modal').on('click.pdollar', function () {
        $('.js-alert').modal('hide');
    });

    $('.js-gesture-count').text(_trainingCount);

    // Make sure that the page is not accidentally scrolled.
    window.scrollTo(0, 0);

    // Map touch events to mouse events
    // init();
    // $('.ui.accordion').accordion();
});

function initAlphabet() {
    var Point = PDollar.Point;
    var recognizer = _r;
    recognizer.AddGesture('A', new Array(new Point(-0.45,0.54,1), new Point(-0.45,0.43,1), new Point(-0.45,0.31,1), new Point(-0.44,0.20,1), new Point(-0.43,0.09,1), new Point(-0.42,-0.02,1), new Point(-0.40,-0.13,1), new Point(-0.37,-0.24,1), new Point(-0.34,-0.34,1), new Point(-0.24,-0.41,1), new Point(-0.14,-0.44,1), new Point(-0.03,-0.46,1), new Point(0.08,-0.46,1), new Point(0.19,-0.44,1), new Point(0.29,-0.38,1), new Point(0.33,-0.28,1), new Point(0.37,-0.17,1), new Point(0.39,-0.06,1), new Point(0.41,0.05,1), new Point(0.43,0.16,1), new Point(0.44,0.27,1), new Point(0.46,0.38,1), new Point(0.47,0.49,1), new Point(-0.42,0.11,2), new Point(-0.30,0.11,2), new Point(-0.19,0.10,2), new Point(-0.08,0.10,2), new Point(0.03,0.10,2), new Point(0.14,0.10,2), new Point(0.26,0.10,2), new Point(0.37,0.10,2), new Point(0.48,0.10,2)));
    recognizer.AddGesture('B', new Array(new Point(-0.18,-0.49,1), new Point(-0.16,-0.39,1), new Point(-0.16,-0.28,1), new Point(-0.16,-0.17,1), new Point(-0.16,-0.07,1), new Point(-0.16,0.04,1), new Point(-0.16,0.14,1), new Point(-0.17,0.25,1), new Point(-0.17,0.35,1), new Point(-0.17,0.46,1), new Point(-0.10,-0.49,2), new Point(0.01,-0.49,2), new Point(0.11,-0.48,2), new Point(0.20,-0.44,2), new Point(0.26,-0.36,2), new Point(0.26,-0.25,2), new Point(0.22,-0.16,2), new Point(0.16,-0.08,2), new Point(0.06,-0.04,2), new Point(-0.05,-0.03,2), new Point(-0.15,-0.01,2), new Point(-0.10,-0.01,2), new Point(0.00,-0.01,2), new Point(0.09,0.05,2), new Point(0.18,0.11,2), new Point(0.23,0.20,2), new Point(0.23,0.30,2), new Point(0.18,0.39,2), new Point(0.12,0.47,2), new Point(0.02,0.50,2), new Point(-0.09,0.51,2), new Point(-0.18,0.48,2)));
    recognizer.AddGesture('C', new Array(new Point(0.41,-0.49,1), new Point(0.35,-0.51,1), new Point(0.28,-0.51,1), new Point(0.21,-0.52,1), new Point(0.14,-0.52,1), new Point(0.07,-0.51,1), new Point(0.01,-0.49,1), new Point(-0.06,-0.47,1), new Point(-0.11,-0.42,1), new Point(-0.16,-0.38,1), new Point(-0.21,-0.33,1), new Point(-0.24,-0.27,1), new Point(-0.26,-0.21,1), new Point(-0.28,-0.14,1), new Point(-0.30,-0.08,1), new Point(-0.31,-0.01,1), new Point(-0.31,0.06,1), new Point(-0.29,0.13,1), new Point(-0.27,0.19,1), new Point(-0.24,0.25,1), new Point(-0.21,0.31,1), new Point(-0.16,0.36,1), new Point(-0.11,0.40,1), new Point(-0.04,0.42,1), new Point(0.02,0.44,1), new Point(0.09,0.45,1), new Point(0.16,0.46,1), new Point(0.23,0.47,1), new Point(0.29,0.48,1), new Point(0.36,0.48,1), new Point(0.43,0.48,1), new Point(0.50,0.48,1)));
    recognizer.AddGesture('D', new Array(new Point(-0.29,-0.49,1), new Point(-0.28,-0.39,1), new Point(-0.28,-0.30,1), new Point(-0.28,-0.20,1), new Point(-0.28,-0.10,1), new Point(-0.28,-0.00,1), new Point(-0.28,0.09,1), new Point(-0.28,0.19,1), new Point(-0.28,0.29,1), new Point(-0.28,0.39,1), new Point(-0.28,0.48,1), new Point(-0.23,-0.49,2), new Point(-0.13,-0.49,2), new Point(-0.03,-0.49,2), new Point(0.06,-0.48,2), new Point(0.15,-0.44,2), new Point(0.23,-0.39,2), new Point(0.31,-0.33,2), new Point(0.38,-0.26,2), new Point(0.43,-0.19,2), new Point(0.45,-0.09,2), new Point(0.45,0.01,2), new Point(0.42,0.10,2), new Point(0.37,0.18,2), new Point(0.31,0.26,2), new Point(0.25,0.33,2), new Point(0.17,0.38,2), new Point(0.09,0.44,2), new Point(-0.00,0.48,2), new Point(-0.09,0.51,2), new Point(-0.19,0.50,2), new Point(-0.29,0.50,2)));
    recognizer.AddGesture('E', new Array(new Point(-0.33,-0.34,1), new Point(-0.31,-0.26,1), new Point(-0.30,-0.17,1), new Point(-0.29,-0.08,1), new Point(-0.29,0.01,1), new Point(-0.29,0.10,1), new Point(-0.29,0.18,1), new Point(-0.29,0.27,1), new Point(-0.27,-0.34,2), new Point(-0.18,-0.34,2), new Point(-0.09,-0.34,2), new Point(-0.00,-0.34,2), new Point(0.09,-0.34,2), new Point(0.18,-0.34,2), new Point(0.26,-0.34,2), new Point(0.35,-0.34,2), new Point(-0.27,-0.07,3), new Point(-0.18,-0.07,3), new Point(-0.10,-0.07,3), new Point(-0.01,-0.07,3), new Point(0.08,-0.07,3), new Point(-0.21,0.31,4), new Point(-0.12,0.31,4), new Point(-0.04,0.31,4), new Point(0.05,0.31,4), new Point(0.14,0.31,4), new Point(0.23,0.31,4), new Point(0.32,0.31,4), new Point(0.41,0.31,4), new Point(0.50,0.31,4), new Point(0.58,0.31,4), new Point(0.67,0.31,4)));
    recognizer.AddGesture('F', new Array(new Point(-0.14,-0.33,1), new Point(-0.12,-0.29,1), new Point(-0.12,-0.22,1), new Point(-0.12,-0.16,1), new Point(-0.12,-0.10,1), new Point(-0.12,-0.03,1), new Point(-0.12,0.03,1), new Point(-0.12,0.09,1), new Point(-0.12,0.16,1), new Point(-0.12,0.22,1), new Point(-0.12,0.29,1), new Point(-0.12,0.35,1), new Point(-0.12,0.41,1), new Point(-0.12,0.48,1), new Point(-0.12,0.54,1), new Point(-0.11,0.60,1), new Point(-0.11,0.67,1), new Point(-0.08,-0.32,2), new Point(-0.01,-0.32,2), new Point(0.05,-0.32,2), new Point(0.12,-0.32,2), new Point(0.18,-0.32,2), new Point(0.24,-0.32,2), new Point(0.31,-0.32,2), new Point(0.37,-0.32,2), new Point(0.43,-0.32,2), new Point(-0.10,0.04,3), new Point(-0.03,0.04,3), new Point(0.03,0.04,3), new Point(0.09,0.04,3), new Point(0.16,0.04,3), new Point(0.22,0.04,3)));
    recognizer.AddGesture('G', new Array(new Point(0.30,-0.53,1), new Point(0.21,-0.55,1), new Point(0.12,-0.55,1), new Point(0.03,-0.55,1), new Point(-0.06,-0.53,1), new Point(-0.15,-0.49,1), new Point(-0.22,-0.44,1), new Point(-0.29,-0.39,1), new Point(-0.33,-0.31,1), new Point(-0.36,-0.22,1), new Point(-0.37,-0.13,1), new Point(-0.38,-0.04,1), new Point(-0.38,0.06,1), new Point(-0.36,0.15,1), new Point(-0.33,0.23,1), new Point(-0.28,0.31,1), new Point(-0.21,0.37,1), new Point(-0.13,0.40,1), new Point(-0.04,0.43,1), new Point(0.05,0.44,1), new Point(0.15,0.45,1), new Point(0.23,0.44,1), new Point(0.31,0.38,1), new Point(0.13,0.00,2), new Point(0.22,0.00,2), new Point(0.31,0.00,2), new Point(0.40,-0.00,2), new Point(0.29,0.03,3), new Point(0.29,0.12,3), new Point(0.28,0.22,3), new Point(0.28,0.31,3), new Point(0.27,0.40,3)));
    recognizer.AddGesture('H', new Array(new Point(-0.35,-0.48,1), new Point(-0.35,-0.39,1), new Point(-0.35,-0.30,1), new Point(-0.35,-0.21,1), new Point(-0.35,-0.12,1), new Point(-0.35,-0.03,1), new Point(-0.35,0.06,1), new Point(-0.35,0.15,1), new Point(-0.35,0.24,1), new Point(-0.35,0.33,1), new Point(-0.35,0.42,1), new Point(-0.35,0.51,1), new Point(-0.31,-0.02,2), new Point(-0.22,-0.02,2), new Point(-0.13,-0.02,2), new Point(-0.04,-0.02,2), new Point(0.05,-0.02,2), new Point(0.14,-0.02,2), new Point(0.23,-0.02,2), new Point(0.32,-0.02,2), new Point(0.35,-0.49,3), new Point(0.36,-0.40,3), new Point(0.36,-0.31,3), new Point(0.36,-0.23,3), new Point(0.36,-0.14,3), new Point(0.35,-0.05,3), new Point(0.35,0.04,3), new Point(0.35,0.13,3), new Point(0.35,0.22,3), new Point(0.35,0.31,3), new Point(0.35,0.40,3), new Point(0.35,0.49,3)));
    recognizer.AddGesture('I', new Array(new Point(-0.22,-0.46,1), new Point(-0.17,-0.47,1), new Point(-0.11,-0.46,1), new Point(-0.05,-0.46,1), new Point(0.01,-0.46,1), new Point(0.07,-0.46,1), new Point(0.13,-0.46,1), new Point(0.18,-0.46,1), new Point(0.24,-0.46,1), new Point(0.01,-0.41,2), new Point(0.01,-0.35,2), new Point(0.01,-0.29,2), new Point(0.01,-0.23,2), new Point(0.01,-0.17,2), new Point(0.01,-0.12,2), new Point(0.00,-0.06,2), new Point(-0.00,0.00,2), new Point(-0.01,0.06,2), new Point(-0.01,0.12,2), new Point(-0.01,0.17,2), new Point(-0.02,0.23,2), new Point(-0.02,0.29,2), new Point(-0.02,0.35,2), new Point(-0.02,0.41,2), new Point(-0.02,0.47,2), new Point(-0.02,0.52,2), new Point(-0.14,0.53,3), new Point(-0.08,0.53,3), new Point(-0.03,0.53,3), new Point(0.03,0.53,3), new Point(0.09,0.53,3), new Point(0.15,0.53,3)));
    recognizer.AddGesture('J', new Array(new Point(-0.36,-0.42,1), new Point(-0.29,-0.42,1), new Point(-0.21,-0.42,1), new Point(-0.14,-0.42,1), new Point(-0.07,-0.42,1), new Point(0.01,-0.42,1), new Point(0.08,-0.42,1), new Point(0.16,-0.42,1), new Point(0.23,-0.42,1), new Point(0.31,-0.42,1), new Point(0.38,-0.43,1), new Point(0.10,-0.36,2), new Point(0.10,-0.29,2), new Point(0.10,-0.22,2), new Point(0.11,-0.14,2), new Point(0.12,-0.07,2), new Point(0.12,0.00,2), new Point(0.12,0.08,2), new Point(0.12,0.15,2), new Point(0.12,0.23,2), new Point(0.12,0.30,2), new Point(0.11,0.37,2), new Point(0.09,0.45,2), new Point(0.06,0.51,2), new Point(0.02,0.57,2), new Point(-0.06,0.57,2), new Point(-0.13,0.55,2), new Point(-0.19,0.51,2), new Point(-0.25,0.46,2), new Point(-0.28,0.40,2), new Point(-0.30,0.33,2), new Point(-0.32,0.26,2)));
    recognizer.AddGesture('K', new Array(new Point(-0.17,-0.51,1), new Point(-0.18,-0.43,1), new Point(-0.19,-0.34,1), new Point(-0.19,-0.26,1), new Point(-0.20,-0.18,1), new Point(-0.20,-0.09,1), new Point(-0.20,-0.01,1), new Point(-0.20,0.07,1), new Point(-0.20,0.16,1), new Point(-0.20,0.24,1), new Point(-0.20,0.32,1), new Point(-0.20,0.41,1), new Point(-0.20,0.49,1), new Point(0.34,-0.41,2), new Point(0.27,-0.36,2), new Point(0.20,-0.31,2), new Point(0.13,-0.26,2), new Point(0.06,-0.22,2), new Point(-0.01,-0.17,2), new Point(-0.08,-0.13,2), new Point(-0.13,-0.07,2), new Point(-0.17,-0.00,2), new Point(-0.12,0.00,3), new Point(-0.05,0.04,3), new Point(0.02,0.09,3), new Point(0.09,0.13,3), new Point(0.16,0.18,3), new Point(0.23,0.22,3), new Point(0.30,0.27,3), new Point(0.37,0.32,3), new Point(0.42,0.38,3), new Point(0.48,0.44,3)));
    recognizer.AddGesture('L', new Array(new Point(-0.12,-0.70,1), new Point(-0.13,-0.65,1), new Point(-0.14,-0.59,1), new Point(-0.15,-0.54,1), new Point(-0.15,-0.48,1), new Point(-0.15,-0.42,1), new Point(-0.15,-0.37,1), new Point(-0.15,-0.31,1), new Point(-0.16,-0.25,1), new Point(-0.16,-0.20,1), new Point(-0.17,-0.14,1), new Point(-0.17,-0.08,1), new Point(-0.18,-0.03,1), new Point(-0.18,0.03,1), new Point(-0.18,0.09,1), new Point(-0.18,0.14,1), new Point(-0.18,0.20,1), new Point(-0.18,0.26,1), new Point(-0.16,0.30,1), new Point(-0.11,0.30,1), new Point(-0.05,0.30,1), new Point(0.01,0.29,1), new Point(0.06,0.29,1), new Point(0.12,0.29,1), new Point(0.18,0.29,1), new Point(0.23,0.29,1), new Point(0.29,0.29,1), new Point(0.35,0.29,1), new Point(0.40,0.29,1), new Point(0.46,0.29,1), new Point(0.52,0.28,1), new Point(0.57,0.28,1)));
    recognizer.AddGesture('M', new Array(new Point(-0.38,-0.37,1), new Point(-0.38,-0.27,1), new Point(-0.38,-0.17,1), new Point(-0.38,-0.07,1), new Point(-0.38,0.03,1), new Point(-0.38,0.13,1), new Point(-0.38,0.23,1), new Point(-0.38,0.33,1), new Point(-0.38,0.43,1), new Point(-0.38,0.53,1), new Point(-0.35,-0.34,2), new Point(-0.28,-0.26,2), new Point(-0.22,-0.19,2), new Point(-0.16,-0.11,2), new Point(-0.09,-0.03,2), new Point(-0.03,-0.03,2), new Point(0.03,-0.10,2), new Point(0.11,-0.17,2), new Point(0.18,-0.24,2), new Point(0.25,-0.31,2), new Point(0.32,-0.38,2), new Point(0.37,-0.37,2), new Point(0.38,-0.28,2), new Point(0.39,-0.18,2), new Point(0.39,-0.08,2), new Point(0.39,0.02,2), new Point(0.37,0.12,2), new Point(0.36,0.22,2), new Point(0.35,0.32,2), new Point(0.34,0.42,2), new Point(0.34,0.52,2), new Point(0.34,0.62,2)));
    recognizer.AddGesture('N', new Array(new Point(-0.35,-0.43,1), new Point(-0.34,-0.33,1), new Point(-0.33,-0.23,1), new Point(-0.32,-0.13,1), new Point(-0.31,-0.03,1), new Point(-0.29,0.07,1), new Point(-0.29,0.17,1), new Point(-0.29,0.27,1), new Point(-0.29,0.37,1), new Point(-0.29,0.47,1), new Point(-0.33,-0.41,2), new Point(-0.27,-0.33,2), new Point(-0.21,-0.25,2), new Point(-0.15,-0.17,2), new Point(-0.09,-0.09,2), new Point(-0.03,-0.01,2), new Point(0.02,0.08,2), new Point(0.07,0.17,2), new Point(0.13,0.25,2), new Point(0.19,0.33,2), new Point(0.25,0.41,2), new Point(0.31,0.49,2), new Point(0.31,0.39,2), new Point(0.31,0.29,2), new Point(0.31,0.19,2), new Point(0.31,0.09,2), new Point(0.31,-0.01,2), new Point(0.31,-0.12,2), new Point(0.33,-0.21,2), new Point(0.34,-0.31,2), new Point(0.34,-0.41,2), new Point(0.34,-0.51,2)));
    recognizer.AddGesture('O', new Array(new Point(0.11,-0.48,1), new Point(0.01,-0.48,1), new Point(-0.09,-0.47,1), new Point(-0.19,-0.45,1), new Point(-0.28,-0.42,1), new Point(-0.36,-0.36,1), new Point(-0.41,-0.27,1), new Point(-0.44,-0.17,1), new Point(-0.45,-0.07,1), new Point(-0.46,0.03,1), new Point(-0.46,0.13,1), new Point(-0.44,0.23,1), new Point(-0.40,0.33,1), new Point(-0.33,0.40,1), new Point(-0.25,0.47,1), new Point(-0.16,0.50,1), new Point(-0.06,0.52,1), new Point(0.04,0.52,1), new Point(0.14,0.51,1), new Point(0.24,0.47,1), new Point(0.32,0.42,1), new Point(0.39,0.34,1), new Point(0.43,0.25,1), new Point(0.45,0.15,1), new Point(0.45,0.04,1), new Point(0.45,-0.06,1), new Point(0.43,-0.16,1), new Point(0.40,-0.25,1), new Point(0.35,-0.34,1), new Point(0.27,-0.41,1), new Point(0.19,-0.45,1), new Point(0.10,-0.47,1)));
    recognizer.AddGesture('P', new Array(new Point(-0.14,-0.36,1), new Point(-0.14,-0.29,1), new Point(-0.14,-0.22,1), new Point(-0.14,-0.15,1), new Point(-0.14,-0.08,1), new Point(-0.14,-0.01,1), new Point(-0.14,0.07,1), new Point(-0.14,0.14,1), new Point(-0.14,0.21,1), new Point(-0.14,0.28,1), new Point(-0.14,0.35,1), new Point(-0.14,0.42,1), new Point(-0.14,0.49,1), new Point(-0.14,0.56,1), new Point(-0.14,0.63,1), new Point(-0.08,-0.37,2), new Point(-0.00,-0.37,2), new Point(0.07,-0.37,2), new Point(0.14,-0.36,2), new Point(0.20,-0.33,2), new Point(0.25,-0.28,2), new Point(0.28,-0.22,2), new Point(0.30,-0.15,2), new Point(0.32,-0.08,2), new Point(0.31,-0.01,2), new Point(0.26,0.03,2), new Point(0.19,0.06,2), new Point(0.12,0.07,2), new Point(0.05,0.08,2), new Point(-0.02,0.08,2), new Point(-0.09,0.08,2), new Point(-0.15,0.07,2)));
    recognizer.AddGesture('Q', new Array(new Point(-0.03,-0.48,1), new Point(-0.14,-0.48,1), new Point(-0.25,-0.47,1), new Point(-0.35,-0.43,1), new Point(-0.43,-0.35,1), new Point(-0.47,-0.25,1), new Point(-0.50,-0.14,1), new Point(-0.50,-0.02,1), new Point(-0.50,0.09,1), new Point(-0.47,0.20,1), new Point(-0.40,0.28,1), new Point(-0.31,0.34,1), new Point(-0.20,0.39,1), new Point(-0.09,0.41,1), new Point(0.02,0.43,1), new Point(0.13,0.42,1), new Point(0.24,0.38,1), new Point(0.33,0.31,1), new Point(0.39,0.22,1), new Point(0.41,0.11,1), new Point(0.41,-0.00,1), new Point(0.41,-0.12,1), new Point(0.41,-0.23,1), new Point(0.36,-0.33,1), new Point(0.29,-0.41,1), new Point(0.19,-0.47,1), new Point(0.09,-0.51,1), new Point(-0.02,-0.51,1), new Point(0.10,0.32,2), new Point(0.20,0.37,2), new Point(0.29,0.43,2), new Point(0.39,0.49,2)));
    recognizer.AddGesture('R', new Array(new Point(-0.25,-0.42,1), new Point(-0.25,-0.31,1), new Point(-0.25,-0.20,1), new Point(-0.25,-0.09,1), new Point(-0.25,0.02,1), new Point(-0.25,0.13,1), new Point(-0.25,0.24,1), new Point(-0.25,0.35,1), new Point(-0.24,0.46,1), new Point(-0.24,0.56,1), new Point(-0.21,-0.42,2), new Point(-0.10,-0.44,2), new Point(0.01,-0.44,2), new Point(0.12,-0.43,2), new Point(0.22,-0.41,2), new Point(0.32,-0.35,2), new Point(0.36,-0.26,2), new Point(0.37,-0.15,2), new Point(0.32,-0.05,2), new Point(0.22,-0.03,2), new Point(0.11,-0.01,2), new Point(0.00,0.02,2), new Point(-0.11,0.02,2), new Point(-0.21,0.02,2), new Point(-0.18,0.07,2), new Point(-0.09,0.12,2), new Point(0.01,0.17,2), new Point(0.10,0.23,2), new Point(0.18,0.29,2), new Point(0.26,0.36,2), new Point(0.35,0.43,2), new Point(0.42,0.51,2)));
    recognizer.AddGesture('S', new Array(new Point(0.26,-0.40,1), new Point(0.21,-0.47,1), new Point(0.14,-0.49,1), new Point(0.05,-0.50,1), new Point(-0.03,-0.50,1), new Point(-0.11,-0.49,1), new Point(-0.19,-0.47,1), new Point(-0.26,-0.43,1), new Point(-0.29,-0.35,1), new Point(-0.30,-0.27,1), new Point(-0.30,-0.19,1), new Point(-0.28,-0.10,1), new Point(-0.23,-0.04,1), new Point(-0.15,-0.03,1), new Point(-0.07,-0.03,1), new Point(0.02,-0.03,1), new Point(0.10,-0.03,1), new Point(0.18,-0.03,1), new Point(0.25,0.02,1), new Point(0.29,0.09,1), new Point(0.32,0.17,1), new Point(0.34,0.25,1), new Point(0.32,0.33,1), new Point(0.27,0.40,1), new Point(0.20,0.44,1), new Point(0.13,0.49,1), new Point(0.05,0.50,1), new Point(-0.03,0.49,1), new Point(-0.12,0.47,1), new Point(-0.19,0.45,1), new Point(-0.27,0.41,1), new Point(-0.32,0.35,1)));
    recognizer.AddGesture('T', new Array(new Point(-0.52,-0.19,1), new Point(-0.46,-0.20,1), new Point(-0.39,-0.20,1), new Point(-0.33,-0.21,1), new Point(-0.27,-0.22,1), new Point(-0.21,-0.22,1), new Point(-0.14,-0.22,1), new Point(-0.08,-0.22,1), new Point(-0.02,-0.22,1), new Point(0.04,-0.22,1), new Point(0.11,-0.22,1), new Point(0.17,-0.22,1), new Point(0.23,-0.22,1), new Point(0.29,-0.22,1), new Point(0.36,-0.22,1), new Point(0.42,-0.22,1), new Point(0.48,-0.22,1), new Point(0.03,-0.20,2), new Point(0.03,-0.13,2), new Point(0.03,-0.07,2), new Point(0.02,-0.01,2), new Point(0.02,0.05,2), new Point(0.02,0.11,2), new Point(0.02,0.18,2), new Point(0.02,0.24,2), new Point(0.02,0.30,2), new Point(0.02,0.37,2), new Point(0.02,0.43,2), new Point(0.02,0.49,2), new Point(0.02,0.55,2), new Point(0.02,0.62,2), new Point(0.02,0.68,2)));
    recognizer.AddGesture('U', new Array(new Point(-0.37,-0.54,1), new Point(-0.40,-0.48,1), new Point(-0.41,-0.40,1), new Point(-0.42,-0.32,1), new Point(-0.44,-0.24,1), new Point(-0.44,-0.16,1), new Point(-0.44,-0.08,1), new Point(-0.44,-0.00,1), new Point(-0.43,0.07,1), new Point(-0.40,0.15,1), new Point(-0.37,0.23,1), new Point(-0.33,0.29,1), new Point(-0.27,0.34,1), new Point(-0.19,0.37,1), new Point(-0.12,0.40,1), new Point(-0.04,0.41,1), new Point(0.04,0.43,1), new Point(0.12,0.43,1), new Point(0.20,0.41,1), new Point(0.25,0.35,1), new Point(0.30,0.28,1), new Point(0.33,0.21,1), new Point(0.36,0.14,1), new Point(0.39,0.06,1), new Point(0.41,-0.01,1), new Point(0.43,-0.09,1), new Point(0.44,-0.17,1), new Point(0.45,-0.25,1), new Point(0.45,-0.33,1), new Point(0.45,-0.41,1), new Point(0.45,-0.49,1), new Point(0.43,-0.57,1)));
    recognizer.AddGesture('V', new Array(new Point(-0.33,-0.48,1), new Point(-0.32,-0.42,1), new Point(-0.30,-0.35,1), new Point(-0.28,-0.28,1), new Point(-0.26,-0.22,1), new Point(-0.24,-0.15,1), new Point(-0.21,-0.08,1), new Point(-0.19,-0.02,1), new Point(-0.17,0.04,1), new Point(-0.15,0.11,1), new Point(-0.12,0.17,1), new Point(-0.09,0.24,1), new Point(-0.07,0.30,1), new Point(-0.06,0.37,1), new Point(-0.03,0.43,1), new Point(-0.01,0.50,1), new Point(0.01,0.48,1), new Point(0.03,0.41,1), new Point(0.05,0.35,1), new Point(0.07,0.28,1), new Point(0.10,0.22,1), new Point(0.12,0.15,1), new Point(0.15,0.09,1), new Point(0.17,0.02,1), new Point(0.20,-0.04,1), new Point(0.22,-0.11,1), new Point(0.24,-0.17,1), new Point(0.26,-0.24,1), new Point(0.27,-0.31,1), new Point(0.29,-0.37,1), new Point(0.31,-0.44,1), new Point(0.32,-0.50,1)));
    recognizer.AddGesture('W', new Array(new Point(-0.51,-0.45,1), new Point(-0.47,-0.37,1), new Point(-0.44,-0.29,1), new Point(-0.41,-0.22,1), new Point(-0.38,-0.14,1), new Point(-0.35,-0.06,1), new Point(-0.32,0.02,1), new Point(-0.29,0.10,1), new Point(-0.25,0.18,1), new Point(-0.22,0.26,1), new Point(-0.20,0.34,1), new Point(-0.16,0.34,1), new Point(-0.13,0.27,1), new Point(-0.09,0.19,1), new Point(-0.05,0.12,1), new Point(-0.01,0.04,1), new Point(0.03,0.10,1), new Point(0.07,0.17,1), new Point(0.11,0.25,1), new Point(0.16,0.32,1), new Point(0.20,0.35,1), new Point(0.22,0.27,1), new Point(0.23,0.19,1), new Point(0.25,0.10,1), new Point(0.27,0.02,1), new Point(0.30,-0.06,1), new Point(0.32,-0.14,1), new Point(0.35,-0.22,1), new Point(0.38,-0.30,1), new Point(0.42,-0.38,1), new Point(0.45,-0.46,1), new Point(0.49,-0.53,1)));
    recognizer.AddGesture('X', new Array(new Point(-0.32,-0.46,1), new Point(-0.27,-0.40,1), new Point(-0.22,-0.32,1), new Point(-0.17,-0.26,1), new Point(-0.12,-0.19,1), new Point(-0.08,-0.12,1), new Point(-0.02,-0.05,1), new Point(0.03,0.02,1), new Point(0.07,0.09,1), new Point(0.12,0.16,1), new Point(0.17,0.23,1), new Point(0.22,0.29,1), new Point(0.27,0.36,1), new Point(0.32,0.43,1), new Point(0.38,0.50,1), new Point(0.44,-0.50,2), new Point(0.39,-0.44,2), new Point(0.34,-0.37,2), new Point(0.28,-0.31,2), new Point(0.22,-0.25,2), new Point(0.16,-0.19,2), new Point(0.10,-0.13,2), new Point(0.04,-0.07,2), new Point(-0.03,-0.02,2), new Point(-0.09,0.03,2), new Point(-0.15,0.09,2), new Point(-0.20,0.16,2), new Point(-0.26,0.22,2), new Point(-0.32,0.28,2), new Point(-0.38,0.34,2), new Point(-0.43,0.41,2), new Point(-0.48,0.47,2)));
    recognizer.AddGesture('Y', new Array(new Point(-0.32,-0.34,1), new Point(-0.28,-0.30,1), new Point(-0.25,-0.26,1), new Point(-0.21,-0.22,1), new Point(-0.18,-0.17,1), new Point(-0.15,-0.13,1), new Point(-0.12,-0.08,1), new Point(-0.08,-0.04,1), new Point(-0.05,0.00,1), new Point(0.37,-0.39,2), new Point(0.34,-0.35,2), new Point(0.30,-0.31,2), new Point(0.26,-0.27,2), new Point(0.22,-0.24,2), new Point(0.17,-0.20,2), new Point(0.13,-0.17,2), new Point(0.09,-0.13,2), new Point(0.05,-0.10,2), new Point(0.00,-0.07,2), new Point(-0.04,-0.03,2), new Point(-0.05,0.02,2), new Point(-0.04,0.07,2), new Point(-0.04,0.12,2), new Point(-0.03,0.18,2), new Point(-0.02,0.23,2), new Point(-0.02,0.29,2), new Point(-0.02,0.34,2), new Point(-0.02,0.40,2), new Point(-0.02,0.45,2), new Point(-0.01,0.51,2), new Point(-0.00,0.56,2), new Point(0.00,0.61,2)));
    recognizer.AddGesture('Z', new Array(new Point(-0.45,-0.53,1), new Point(-0.35,-0.51,1), new Point(-0.25,-0.50,1), new Point(-0.15,-0.49,1), new Point(-0.05,-0.48,1), new Point(0.05,-0.46,1), new Point(0.15,-0.45,1), new Point(0.25,-0.44,1), new Point(0.35,-0.43,1), new Point(0.43,-0.41,1), new Point(0.36,-0.34,1), new Point(0.28,-0.28,1), new Point(0.20,-0.22,1), new Point(0.12,-0.16,1), new Point(0.05,-0.09,1), new Point(-0.03,-0.02,1), new Point(-0.09,0.05,1), new Point(-0.15,0.13,1), new Point(-0.22,0.20,1), new Point(-0.29,0.28,1), new Point(-0.36,0.35,1), new Point(-0.41,0.43,1), new Point(-0.39,0.47,1), new Point(-0.29,0.46,1), new Point(-0.19,0.45,1), new Point(-0.10,0.43,1), new Point(0.01,0.43,1), new Point(0.11,0.43,1), new Point(0.21,0.42,1), new Point(0.31,0.42,1), new Point(0.40,0.42,1), new Point(0.50,0.42,1)));

    _trainingCount += 26;
}

function getCanvasRect(canvas)
{
    var w = canvas.width;
    var h = canvas.height;

    var cx = canvas.offsetLeft;
    var cy = canvas.offsetTop;
    while (canvas.offsetParent !== null)
    {
        canvas = canvas.offsetParent;
        cx += canvas.offsetLeft;
        cy += canvas.offsetTop;
    }
    return {x: cx, y: cy, width: w, height: h};
}

function getScrollY()
{
    var scrollY = 0;
    if (typeof(document.body.parentElement) != 'undefined')
    {
        scrollY = document.body.parentElement.scrollTop; // IE
    }
    else if (typeof(window.pageYOffset) != 'undefined')
    {
        scrollY = window.pageYOffset; // FF
    }
    return scrollY;
}
//
// Mouse Events
//
function mouseDownEvent(x, y)
{
    document.onselectstart = function() { return false; }; // disable drag-select
    document.onmousedown = function() { return false; }; // disable drag-select

    _isDown = true;
    x -= _rc.x;
    y -= _rc.y - getScrollY();
    if (_strokeID === 0) // starting a new gesture
    {
        _points.length = 0;
        _g.clearRect(0, 0, _rc.width, _rc.height);
    }
    _points[_points.length] = new PDollar.Point(x, y, ++_strokeID);
    drawText("Recording stroke #" + _strokeID + "...");
    var clr = "rgb(" + rand(0,200) + "," + rand(0,200) + "," + rand(0,200) + ")";
    _g.strokeStyle = clr;
    _g.fillStyle = clr;
    _g.fillRect(x - 4, y - 3, 9, 9);
}
function mouseMoveEvent(x, y)
{
    if (_isDown)
    {
        x -= _rc.x;
        y -= _rc.y - getScrollY();
        _points[_points.length] = new PDollar.Point(x, y, _strokeID); // append
        drawConnectedPoint(_points.length - 2, _points.length - 1);
    }
}
function mouseUpEvent(x, y)
{
    document.onselectstart = function() { return true; }; // enable drag-select
    document.onmousedown = function() { return true; }; // enable drag-select

    if (_isDown)
    {
        _isDown = false;
        drawText("Stroke #" + _strokeID + " recorded.");
    }
}
function drawConnectedPoint(from, to)
{
    _g.beginPath();
    _g.moveTo(_points[from].X, _points[from].Y);
    _g.lineTo(_points[to].X, _points[to].Y);
    _g.closePath();
    _g.stroke();
}
function drawText(str)
{
    if (false) {
	_g.fillStyle = "rgb(255,255,136)";
	_g.fillRect(0, 0, _rc.width, 20);
	_g.fillStyle = "rgb(0,0,255)";
	_g.fillText(str, 1, 14);
    }
}
function rand(low, high)
{
    return Math.floor((high - low + 1) * Math.random()) + low;
}
function round(n, d) // round 'n' to 'd' decimals
{
    d = Math.pow(10, d);
    return Math.round(n * d) / d;
}
//
// Multistroke Adding and Clearing
//
function onClickAddExisting()
{
    if (_points.length >= 10)
    {
        var pointclouds = document.getElementById('pointclouds');
        var name = pointclouds[pointclouds.selectedIndex].value;
        var num = _r.AddGesture(name, _points);
        drawText("\"" + name + "\" added. Number of \"" + name + "\"s defined: " + num + ".");
        _strokeID = 0; // signal to begin new gesture on next mouse-down
    }
}
function addCustom(name)
{
    if (_points.length >= 10 && name.length > 0)
    {
        var num = _r.AddGesture(name, _points);
        _trainingCount += 1;
        drawText("\"" + name + "\" added. Number of \"" + name + "\"s defined: " + num + ".");
        _strokeID = 0; // signal to begin new gesture on next mouse-down
    }
}

function onClickDelete()
{
    var num = _r.DeleteUserGestures(); // deletes any user-defined templates
    showModal("All user-defined gestures have been deleted.");
    _strokeID = 0; // signal to begin new gesture on next mouse-down
}

function onClickInit()
{
    showModal("Initialized with the alphabet.");
    initAlphabet();
}

function onClickClearStrokes()
{
    _points.length = 0;
    _strokeID = 0;
    _g.clearRect(0, 0, _rc.width, _rc.height);
    drawText("Canvas cleared.");
}

function showOverlay(result) {
    $('.overlay').removeClass('hidden');
    $('.js-guess').text(result.Name);

    var $confidence = $('.js-confidence');
    $confidence.text(round(result.Score, 2));

    $confidence.removeClass('high');
    $confidence.removeClass('low');
    $confidence.removeClass('medium');

    if (result.Score > 0.8) {
        $confidence.addClass('high');
    } else if (result.Score < 0.2) {
        $confidence.addClass('low');
    } else {
        $confidence.addClass('medium');
    }
}

function recognizeNow() {
    if (_points.length >= 10) {
	var result = _r.Recognize(_points);
	showOverlay(result);
	drawText("Result: " + result.Name + " (" + round(result.Score,2) + ").");
    } else {
	drawText("Too few strokes.");
    }
    _strokeID = 0; // signal to begin new gesture on next mouse-down
}

function hideOverlay() {
    onClickClearStrokes();
    $('.overlay').addClass('hidden');
    $('.js-gesture-count').text(_trainingCount);
}

function addSampleGesture(ev) {
    var target = ev.target;
    var name = target.dataset.name;

    while(typeof name === 'undefined' && target.parentNode !== null) {
        target = target.parentNode;
        name = target.dataset.name;
    }

    if (typeof name !== 'undefined') {
        addCustom(name);
        hideOverlay();
    } else {
        showModal('Unknown gesture chosen.');
    }
}

function showModal(msg) {
    $('.js-modal-content').text(msg);
    $('.js-alert').modal('show');
}
