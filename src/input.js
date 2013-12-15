
Blind.input = (function(){

	var mouseHandlers = [];
	function addMouseHandler(h) {
		mouseHandlers.push(h);
	};
	function removeMouseHandler(h) {
		var i;
		while ( (i=mouseHandlers.indexOf(h)) != -1) {
			mouseHandlers.splice(i,1);
		}
	};
	function forEachMouseHandler(callback) {
		var len = mouseHandlers.length;
		var i;
		for (i=0; i<len; i++) {
			if (mouseHandlers[i]) {
				callback(mouseHandlers[i]);
			}
		};
	};

	var clicking = false; // is screen currently being clicked.
	var point = {};

	function mouseHelper(func,x,y) {
		forEachMouseHandler(function(handler) {
			if (handler[func]) {
				handler[func](x,y);
			}
		});
	}

	// Main dispatch functions for each mouse event.
	function mouseStart(x,y) {
		clicking = true;
		point.x = x;
		point.y = y;
		mouseHelper('start',x,y);
	};
	function mouseMove(x,y) {
		if (!clicking) {
			return;
		}
		point.x = x;
		point.y = y;
		mouseHelper('move',x,y);
	};
	function mouseEnd(x,y) {
		clicking = false;
		mouseHelper('end',x,y);
	};
	function mouseCancel(x,y) {
		clicking = false;
		mouseHelper('cancel',x,y);
	};

	var borderSize = 0;
	function setBorderSize(s) {
		borderSize = s;
	}

	// initialize 
	function init() {

		// Makes sure the given callback function gets canvas coords, not absolute coords.
        var canvas = Blind.canvas;
		function getCanvasPos() {
			var p = {x:0,y:0};
			var obj = canvas;
			var addOffset = function(obj) {
				p.x += obj.offsetLeft;
				p.y += obj.offsetTop;
			};
			addOffset(obj);
			while (obj = obj.offsetParent) {
				addOffset(obj);
			}
			if (borderSize) {
				p.x += borderSize;
				p.y += borderSize;
			}
			return p;
		}

		var wrapFunc = function(f) {
			return function(evt) {
				var canvasPos = getCanvasPos();
				var x = evt.pageX-canvasPos.x;
				var y = evt.pageY-canvasPos.y;
				f(x, y);
				evt.preventDefault();
			};
		};
		canvas.addEventListener('mousedown',	wrapFunc(mouseStart));
		canvas.addEventListener('mousemove',	wrapFunc(mouseMove));
		canvas.addEventListener('mouseup',		wrapFunc(mouseEnd));
		canvas.addEventListener('mouseout',		wrapFunc(mouseCancel));
	};

	return {
		init: init,
		isClicking: function() { return clicking; },
		getPoint: function() { return point; },
		addMouseHandler: addMouseHandler,
		removeMouseHandler: removeMouseHandler,
		setBorderSize: setBorderSize,
	};
})();
