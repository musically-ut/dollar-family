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
