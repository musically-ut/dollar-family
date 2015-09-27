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

    $canvas.on('mousedown.pdollar', function (ev) {
	mouseDownEvent(ev.clientX, ev.clientY, ev.button);
    });

    $canvas.on('mousemove.pdollar', function (ev) {
	mouseMoveEvent(ev.clientX, ev.clientY, ev.button);
    });

    $canvas.on('mouseup.pdollar', function (ev) {
	mouseUpEvent(ev.clientX, ev.clientY, ev.button);
    });

    $canvas.on('contextmenu.pdollar', function (ev) {
	return false;
    });

    $('.js-return').on('mousedown.pdollar', hideOverlay);
    $('.js-clear-stroke').on('mousedown.pdollar', onClickClearStrokes);
    $('.js-check').on('mousedown.pdollar', recognizeNow);
    $('.js-choice').on('mousedown.pdollar', addSampleGesture);
    $('.js-intro').on('mousedown.pdollar', function () {
        introJs().start();
    });

    $('.ui.js-confirm').modal({
        closable: false,
        onApprove: function () {
            onClickDelete();
        },
        onDeny: function () {
        }
    });

    $('.js-clear-all-data').on('mousedown.pdollar', function () {
        $('.ui.js-confirm').modal('show');
    });

    $('.js-close-modal').on('click', function () {
        $('.js-alert').modal('hide');
    });

    $('.js-gesture-count').text(_trainingCount);

    // Map touch events to mouse events
    init();
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
function mouseDownEvent(x, y, button)
{
    document.onselectstart = function() { return false; }; // disable drag-select
    document.onmousedown = function() { return false; }; // disable drag-select
    if (button <= 1)
    {
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
    else if (button == 2)
    {
        drawText("Recognizing gesture...");
    }
}
function mouseMoveEvent(x, y, button)
{
    if (_isDown)
    {
        x -= _rc.x;
        y -= _rc.y - getScrollY();
        _points[_points.length] = new PDollar.Point(x, y, _strokeID); // append
        drawConnectedPoint(_points.length - 2, _points.length - 1);
    }
}
function mouseUpEvent(x, y, button)
{
    document.onselectstart = function() { return true; }; // enable drag-select
    document.onmousedown = function() { return true; }; // enable drag-select

    if (button <= 1)
    {
        if (_isDown)
        {
            _isDown = false;
            drawText("Stroke #" + _strokeID + " recorded.");
        }
    }
    else if (button == 2) // segmentation with right-click
    {
	recognizeNow();
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

// From SO:
// http://stackoverflow.com/questions/1517924/javascript-mapping-touch-events-to-mouse-events

function touchHandler(event)
{
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
    switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type = "mousemove"; break;
        case "touchend":   type = "mouseup";   break;
        default:           return;
    }

    // initMouseEvent(type, canBubble, cancelable, view, clickCount,
    //                screenX, screenY, clientX, clientY, ctrlKey,
    //                altKey, shiftKey, metaKey, button, relatedTarget);

    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1,
                                  first.screenX, first.screenY,
                                  first.clientX, first.clientY, false,
                                  false, false, false, 0/*left*/, null);

    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

function init()
{
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);
}

function showModal(msg) {
    $('.js-modal-content').text(msg);
    $('.js-alert').modal('show');
}
