
Blind.input = (function(){
	

	// ====================== KEYS ==========================


	var keyHandlers = [];
	function addKeyHandler(h) {
		keyHandlers.push(h);
	};
	function removeKeyHandler(h) {
		var i;
		while ( (i=keyHandlers.indexOf(h)) != -1) {
			keyHandlers.splice(i,1);
		}
	};
	function forEachKeyHandler(callback) {
		var len = keyHandlers.length;
		var i;
		for (i=0; i<len; i++) {
			if (keyHandlers[i]) {
				callback(keyHandlers[i]);
			}
		};
	};

	function keyHelper(keyDir,keyName) {
		forEachKeyHandler(function(handler) {
			if (handler[keyDir] && handler[keyDir][keyName]) {
				handler[keyDir][keyName]();
			}
		});
	}

	function keyDown(keyName) {
		keyHelper('press',keyName);
	}

	function keyUp(keyName) {
		keyHelper('release',keyName);
	}

	// ====================== MOUSE ==========================

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

		function wrapMouseFunc(f) {
			return function(evt) {
				var canvasPos = getCanvasPos();
				var x = evt.pageX-canvasPos.x;
				var y = evt.pageY-canvasPos.y;
				f(x, y);
				evt.preventDefault();
			};
		}
		canvas.addEventListener('mousedown',	wrapMouseFunc(mouseStart));
		canvas.addEventListener('mousemove',	wrapMouseFunc(mouseMove));
		canvas.addEventListener('mouseup',		wrapMouseFunc(mouseEnd));
		canvas.addEventListener('mouseout',		wrapMouseFunc(mouseCancel));

		
		function wrapKeyFunc(f) {
			var names = {
				8: 'backspace',
				9: 'tab',
				13: 'enter',
				16: 'shift',
				17: 'ctrl',
				18: 'alt',
				27: 'esc',
				32: 'space',
				37: 'left',
				38: 'up',
				39: 'right',
				40: 'down',
				46: 'delete',
			};
			function getKeyNameFromCode(code) {
				// return key name from table
				var name = names[code];
				if (name) {
					return name;
				}

				// return digit
				if (48 <= code && code <= 57) {
					return (code-48)+'';
				}

				// return letter
				if (65 <= code && code <= 90) {
					return String.fromCharCode(code).toLowerCase();
				}
			}
			return function(evt) {
				var name = getKeyNameFromCode(evt.keyCode);
				if (name) {
					f(name);
				}
			};
		}
		window.addEventListener('keydown', wrapKeyFunc(keyDown));
		window.addEventListener('keyup',   wrapKeyFunc(keyUp));
	};

	return {
		init: init,
		isClicking: function() { return clicking; },
		getPoint: function() { return point; },
		addMouseHandler: addMouseHandler,
		removeMouseHandler: removeMouseHandler,
		addKeyHandler: addKeyHandler,
		removeKeyHandler: removeKeyHandler,
		setBorderSize: setBorderSize,
	};
})();
