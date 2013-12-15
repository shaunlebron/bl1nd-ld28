Blind.camera = (function(){

	// ========================== CAMERA STATE  =============================

	// position
	var x=0,y=0;

	// orientation
	var angle=-Math.PI/2;

	// speed (per second)
	var moveSpeed = 50;
	var angleSpeed = Math.PI;

	var collide = (function(){

		var alphaDriver = new Blind.InterpDriver(
			Blind.makeInterp('linear', [1,0], [0,0.25]),
			{
				freezeAtEnd: true,
			});

		function init() {
			alphaDriver.skipToEnd();
		}

		function trigger() {
			alphaDriver.reset();
		}

		function update(dt) {
			alphaDriver.step(dt);
		}

		function getValue() {
			return alphaDriver.val;
		}

		return {
			init: init,
			trigger: trigger,
			update: update,
			getValue: getValue,
		};
	})();

	var push = (function(){
		var value=0, target=0;
		var offset = 10;
		var factor = 0.2;

		function pushUp() {
			target = -offset;
		}
		function pushDown() {
			target = offset;
		}
		function reset() {
			target = 0;
		}

		function update(dt) {
			value += (target-value)*factor;
		}

		function getValue() {
			return value;
		}

		return {
			pushUp: pushUp,
			reset: reset,
			pushDown: pushDown,
			update: update,
			getValue: getValue,
		};
	})();

	var tilt = (function(){
		var value=0, target=0;
		var offset = Math.PI/16;
		var factor = 0.2;

		function tiltLeft() {
			target = -offset;
		}
		function tiltRight() {
			target = offset;
		}
		function reset() {
			target = 0;
		}

		function update(dt) {
			value += (target-value)*factor;
		}

		function getValue() {
			return value;
		}

		return {
			tiltLeft: tiltLeft,
			reset: reset,
			tiltRight: tiltRight,
			update: update,
			getValue: getValue,
		};
	})();

	function setPosition(_x,_y) {
		x = _x;
		y = _y;
	}

	function setAngle(_angle) {
		angle = _angle;
	}

	var projFade=0;
	var projFadeTarget=0;
	var projFadeSpeed = 4;
	function fadeTo1D() {
		projFadeTarget = 0;
	}
	function fadeTo2D() {
		projFadeTarget = 1;
	}

	// ========================== MAP & PROJECTION  =============================

	var map;
	var projection;

	function init(_map) {
		map = _map;
		collide.init();
		updateProjection();
	}

	function updateProjection() {
		projection = Blind.getProjection({
			x: x,
			y: y,
			boxes: map.boxes,
		});
	}

	// ========================== CONTROLLER FUNCTIONS =============================
	
	var controls = {
		"turnLeft": false,
		"turnRight": false,
		"moveUp": false,
		"moveDown": false,
	};
	function clearControls() {
		var name;
		for (name in controls) {
			controls[name] = false;
		}
	};
	var viewKeyHandler = {
		'press': {
			'left': function() {
				controls["turnLeft"] = true;
				tilt.tiltLeft();
			},
			'right': function() {
				controls["turnRight"] = true;
				tilt.tiltRight();
			},
		},
		'release': {
			'left': function() {
				controls["turnLeft"] = false;
				tilt.reset();
			},
			'right': function() {
				controls["turnRight"] = false;
				tilt.reset();
			},
		}
	};
	var moveKeyHandler = {
		'press': {
			'up': function() {
				controls["moveUp"] = true;
				push.pushUp();
			},
			'down': function() {
				controls["moveDown"] = true;
				push.pushDown();
			},
		},
		'release': {
			'up': function() {
				controls["moveUp"] = false;
				push.reset();
			},
			'down': function() {
				controls["moveDown"] = false;
				push.reset();
			},
		}
	};
	var projKeyHandler = {
		'press': {
			'shift': function() {
				fadeTo2D();
			},
		},
		'release': {
			'shift': function() {
				fadeTo1D();
			},
		},
	};
	function enableViewKeys()  { Blind.input.addKeyHandler(    viewKeyHandler); }
	function disableViewKeys() { Blind.input.removeKeyHandler( viewKeyHandler); }
	function enableMoveKeys()  { Blind.input.addKeyHandler(    moveKeyHandler); }
	function disableMoveKeys() { Blind.input.removeKeyHandler( moveKeyHandler); }
	function enableProjKeys()  { Blind.input.addKeyHandler(    projKeyHandler); }
	function disableProjKeys() { Blind.input.removeKeyHandler( projKeyHandler); }

	// ========================== COLLISION FUNCTIONS  =============================

	function collideX(dx) {
		if (dx == 0) {
			return x;
		}
		var boxes = map.boxes;
		var i,len = boxes.length;
		var b;
		var boundX;
		if (dx < 0) {
			for (i=0; i<len; i++) {
				b = boxes[i];
				boundX = b.x+b.w;
				if (b.y <= y && y <= b.y+b.h &&
					boundX <= x && x+dx <= boundX) {
					collide.trigger();
					return boundX;
				}
			}
		}
		else {
			for (i=0; i<len; i++) {
				b = boxes[i];
				boundX = b.x;
				if (b.y <= y && y <= b.y+b.h &&
					x <= boundX && boundX <= x+dx) {
					collide.trigger();
					return boundX;
				}
			}
		}
		return x+dx;
	}

	function collideY(dy) {
		if (dy == 0) {
			return y;
		}
		var boxes = map.boxes;
		var i,len = boxes.length;
		var b;
		var boundY;
		if (dy < 0) {
			for (i=0; i<len; i++) {
				b = boxes[i];
				boundY = b.y+b.h;
				if (b.x <= x && x <= b.x+b.w &&
					boundY <= y && y+dy <= boundY) {
					collide.trigger();
					return boundY;
				}
			}
		}
		else {
			for (i=0; i<len; i++) {
				b = boxes[i];
				boundY = b.y;
				if (b.x <= x && x <= b.x+b.w &&
					y <= boundY && boundY <= y+dy) {
					collide.trigger();
					return boundY;
				}
			}
		}
		return y+dy;
	}

	// ========================== MAIN FUNCTIONS  =============================

	function update(dt) {
		if (controls["turnLeft"]) {
			angle -= angleSpeed*dt;
		}
		if (controls["turnRight"]) {
			angle += angleSpeed*dt;
		}
		if (controls["moveUp"]) {
			x = collideX(Math.cos(angle)*moveSpeed*dt);
			y = collideY(Math.sin(angle)*moveSpeed*dt);
		}
		if (controls["moveDown"]) {
			x = collideX(-Math.cos(angle)*moveSpeed*dt);
			y = collideY(-Math.sin(angle)*moveSpeed*dt);
		}
		if (controls["moveUp"] || controls["moveDown"]) {
			updateProjection();
		}

		if (projFade < projFadeTarget) {
			projFade = Math.min(projFadeTarget, projFade + projFadeSpeed*dt);
		}
		else if (projFade > projFadeTarget) {
			projFade = Math.max(projFadeTarget, projFade - projFadeSpeed*dt);
		}

		push.update(dt);
		tilt.update(dt);
		collide.update(dt);
	}

	function draw(ctx) {
		ctx.save();
		ctx.translate(Blind.canvas.width/2, Blind.canvas.height/2);
		ctx.rotate(-Math.PI/2-angle);
		ctx.translate(-x, -y);

		function draw1D() {
			ctx.save();
			ctx.setTransform(1,0,0,1,0,0);
			var img = Blind.assets.images["eye"];
			ctx.drawImage(img,Blind.canvas.width/2 - img.width/2, Blind.canvas.height/2 - img.height/2);
			ctx.restore();

			Blind.drawArcs(ctx, {
				x: x-push.getValue()*Math.cos(angle),
				y: y-push.getValue()*Math.sin(angle),
				radius: 100,
				lineWidth: 30,
				projection: projection,
			});

			ctx.save();
			ctx.setTransform(1,0,0,1,0,0);
			ctx.translate(Blind.canvas.width/2, Blind.canvas.height/2 + push.getValue());

			var collideAlpha = collide.getValue();
			if (collideAlpha) {
				ctx.fillStyle = "rgba(200,200,200," + collideAlpha +")";
				ctx.beginPath();
				ctx.arc(0,0,85,0,Math.PI*2);
				ctx.fill();
			}

			ctx.rotate(tilt.getValue());
			ctx.strokeStyle = "rgba(0,0,0,0.5)";
			ctx.beginPath();
			var a=Math.PI/2;
			ctx.lineWidth = 31;
			ctx.arc(0,0, 100, -Math.PI/2+a/2, Math.PI/2*3 - a/2);
			ctx.stroke();
			ctx.restore();
		}

		function draw2D() {
			map.draw(ctx);

			var alpha = ctx.globalAlpha;

			ctx.globalAlpha = ctx.globalAlpha * 0.3;
			Blind.drawCones(ctx, {
				x: x,
				y: y,
				projection: projection,
			});
			ctx.globalAlpha = alpha;

			ctx.beginPath();
			ctx.arc(x,y,3,0,Math.PI*2);
			ctx.fillStyle = "#FFF";
			ctx.fill();
		}

		if (projFade == 0) {
			draw1D();
		}
		else if (projFade == 1) {
			draw2D();
		}
		else {
			ctx.globalAlpha = 1-projFade;
			draw1D();
			ctx.globalAlpha = projFade;
			draw2D();
			ctx.globalAlpha = 1;
		}

		ctx.restore();
	}

	return {
		init: init,
		updateProjection: updateProjection,
		enableViewKeys: enableViewKeys,
		disableViewKeys: disableViewKeys,
		enableMoveKeys: enableMoveKeys,
		disableMoveKeys: disableMoveKeys,
		enableProjKeys: enableProjKeys,
		disableProjKeys: disableProjKeys,
		setPosition: setPosition,
		setAngle: setAngle,
		update: update,
		draw: draw,
	};
})();
