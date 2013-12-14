Blind.Mapper.model = (function(){

	var boxes = [];

	// INDEX SELECTION

	var selectedIndex;
	function clearBoxes() {
		boxes.length = 0;
		selectIndex(null);
	}
	function selectIndex(i) {
		selectedIndex = i;
		refreshNameDisplay();
	}

	// DISPLAY BINDING

	function refreshNameDisplay() {
		var name = "";
		var box = boxes[selectedIndex];
		if (box && box.name) {
			name = box.name;
		}
		$('#objectName').html(name);
	}

	// STATE SET & GET

	function setBoxStates(states) {
		clearBoxes();
		var i,len=states.length;
		for (i=0; i<len; i++) {
			boxes.push(new Blind.Box(states[i]));
		}
	}

	function getBoxStates() {
		var states = [];
		var i,len=boxes.length;
		var b;
		for (i=0; i<len; i++) {
			b = boxes[i];
			states.push({
				x: b.x,
				y: b.y,
				w: b.w,
				h: b.h,
				color: b.color,
				name: b.name,
			});
		}
		return states;
	}

	// INTERFACE FUNCTIONS

	function addBox() {
		boxes.push(new Blind.Box({x:0, y:0, w:50, h:50, color:"#00F"}));
		selectIndex(boxes.length-1);
		Blind.Mapper.loader.backup();
	}

	function removeBox() {
		if (selectedIndex != null) {
			boxes.splice(selectedIndex, 1);
			selectIndex(null);
			Blind.Mapper.loader.backup();
		}
	}

	function duplicateBox() {
		if (selectedIndex != null) {
			var b = boxes[selectedIndex];
			var b2 = new Blind.Box(b);
			b2.x = 0;
			b2.y = 0;
			b2.name = "";
			boxes.push(b2);
			selectIndex(boxes.length-1);
			Blind.Mapper.loader.backup();
		}
	}

	function renameBox() {
		if (selectedIndex != null) {
			var box = boxes[selectedIndex];
			bootbox.prompt("Rename box:", "Cancel", "OK", function(result) {
				if (result != null) {
					box.name = result;
					refreshNameDisplay();
					Blind.Mapper.loader.backup();
				}
			}, box.name || "");
		}
	}

	function colorBox() {
		if (selectedIndex != null) {
			var box = boxes[selectedIndex];
			bootbox.prompt("Change box color:", "Cancel", "OK", function(result) {
				if (result != null) {
					box.color = result;
					Blind.Mapper.loader.backup();
				}
			}, box.color || "");
		}
	}

	// MOUSE FUNCTIONS

	var mouseHandler = (function(){

		var moveFunc;

		function getResizeFunc(box,x,y) {
			var dx = x - (box.x + box.w);
			var dy = y - (box.y + box.h);
			var distSq = dx*dx + dy*dy;
			if (distSq < 100) {
				return function(x,y) {
					box.w = Math.max(10, x-dx - box.x);
					box.h = Math.max(10, y-dy - box.y);
				};
			}
		}

		function getMoveFunc(box,x,y) {
			var dx = x - box.x;
			var dy = y - box.y;
			if (0 <= dx && dx <= box.w &&
				0 <= dy && dy <= box.h) {
				return function(x,y) {
					box.x = x - dx;
					box.y = y - dy;
				};
			}
		}

		return {
			start: function(x,y) {

				moveFunc = null;
				var i,len=boxes.length;
				var f,box;

				// if an object is already selected
				if (selectedIndex != null) {
					box = boxes[selectedIndex];
					moveFunc = getResizeFunc(box,x,y) || getMoveFunc(box,x,y);
				}

				// if no move function has been created
				if (!moveFunc) {

					// deselect
					selectIndex(null);

					// find the first object under the cursor
					for (i=0; i<len; i++) {
						box = boxes[i];
						f = getMoveFunc(box,x,y);
						if (f) {
							moveFunc = f;
							selectIndex(i);
							break;
						}
					}
				}
			},
			move: function(x,y) {
				moveFunc && moveFunc(x,y);
			},
			end: function(x,y) {
				moveFunc = null;
				Blind.Mapper.loader.backup();
			},
			cancel: function(x,y) {
				this.end(x,y);
				Blind.Mapper.loader.backup();
			},
		};
	})();

	function enableMouse() {
		Blind.input.addMouseHandler(mouseHandler);
	}

	// MAIN FUNCTIONS

	function init() {
		enableMouse();
	}

	function draw(ctx) {
		var i,len = boxes.length;
		var b;
		for (i=0; i<len; i++) {
			b = boxes[i];
			if (i == selectedIndex) {
				ctx.strokeStyle = "#FFF";
				ctx.lineWidth = 4;
				ctx.strokeRect(b.x, b.y, b.w, b.h);
			}
			b.draw(ctx);
		}
	}

	return {
		init: init,
		draw: draw,
		addBox: addBox,
		removeBox: removeBox,
		duplicateBox: duplicateBox,
		renameBox: renameBox,
		colorBox: colorBox,
		clearBoxes: clearBoxes,
		setBoxStates: setBoxStates,
		getBoxStates: getBoxStates,
	};
})();
