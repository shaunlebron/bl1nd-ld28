Blind.camera = (function(){

	// ========================== CAMERA STATE  =============================

	// position
	var x=0,y=0;

	// orientation
	var angle=-Math.PI/2;

	// speed (per second)
	var moveSpeed = 50;
	var angleSpeed = Math.PI;

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

	function getEyeRadius() {
		return 100;
	}

	// ========================== MAP & PROJECTION  =============================

	var map;
	var projection;

	function init(_map) {
		map = _map;
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
			},
			'right': function() {
				controls["turnRight"] = true;
			},
		},
		'release': {
			'left': function() {
				controls["turnLeft"] = false;
			},
			'right': function() {
				controls["turnRight"] = false;
			},
		}
	};
	var moveKeyHandler = {
		'press': {
			'up': function() {
				controls["moveUp"] = true;
			},
			'down': function() {
				controls["moveDown"] = true;
			},
		},
		'release': {
			'up': function() {
				controls["moveUp"] = false;
			},
			'down': function() {
				controls["moveDown"] = false;
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

	// ========================== MAIN FUNCTIONS  =============================

	function update(dt) {
		if (controls["turnLeft"]) {
			angle -= angleSpeed*dt;
		}
		if (controls["turnRight"]) {
			angle += angleSpeed*dt;
		}
		if (controls["moveUp"]) {
			x += Math.cos(angle)*moveSpeed*dt;
			y += Math.sin(angle)*moveSpeed*dt;
		}
		if (controls["moveDown"]) {
			x -= Math.cos(angle)*moveSpeed*dt;
			y -= Math.sin(angle)*moveSpeed*dt;
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
				x: x,
				y: y,
				radius: 100,
				lineWidth: 30,
				projection: projection,
			});
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
