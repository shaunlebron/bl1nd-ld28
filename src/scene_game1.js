
Blind.scene_game1 = (function(){
	var script;
	var map;

	var cameraAlpha = (function(){
		var alphaDriver;
		var enabled;

		alphaDriver = new Blind.InterpDriver(
			Blind.makeInterp('linear', [0, 1], [0, 1]),
			{
				freezeAtEnd: true,
			});

		function update(dt) {
			if (enabled) {
				alphaDriver.step(dt);
			}
		}

		function draw(ctx) {
			var alpha = alphaDriver.val;
			if (enabled && alpha) {
				ctx.globalAlpha = alpha;
				Blind.camera.draw(ctx);
				ctx.globalAlpha = 1;
			}
		}

		function init() {
			disable();
			alphaDriver.reset();
		}

		var enabled;

		function enable() {
			enabled = true;
		}

		function disable() {
			enabled = false;
		}

		return {
			init: init,
			disable: disable,
			enable: enable,
			update: update,
			draw: draw,
		};
	})();

	var couch;
	function init() {
		cameraAlpha.init();

		Blind.lid.reset();
		Blind.lid.open();


		map = new Blind.Map(Blind.assets.json["map_game1"]);
		var i,len=map.boxes.length;
		for (i=0; i<len; i++) {
			if (map.boxes[i].name == 'couch') {
				couch = map.boxes[i];
				couch.hide = true;
				break;
			}
		}
		Blind.camera.init(map);
		Blind.camera.disableViewKeys();
		Blind.camera.disableMoveKeys();
		Blind.camera.disableProjKeys();

		Blind.camera.setPosition(356, 90);
		Blind.camera.setAngle(-Math.PI/2);
		Blind.camera.updateProjection();

		script = new Blind.TimedScript([
			{
				time: 1,
				action: function() {
					Blind.caption.show('msg1', 2);
				},
			},
			{
				dt: 4,
				action: function() {
					Blind.caption.show('msg2', 2);
				},
			},
			{
				dt: 4,
				action: function() {
					Blind.caption.show('msg3', 2);
				},
			},
			{
				dt: 4,
				action: function() {
					cameraAlpha.enable();
				},
			},
			{
				dt: 3,
				action: function() {
					Blind.caption.show('msg4', 2);
				},
			},
			{
				dt: 4,
				action: function() {
					Blind.caption.show('msg5', 2);
				},
			},
			{
				dt: 4,
				action: function() {
					Blind.caption.show('msg6', 2);
					Blind.camera.enableViewKeys();
				},
			},
			{
				dt: 8,
				action: function() {
					Blind.caption.show('msg7', 4);
				},
			},
			{
				dt: 6,
				action: function() {
					Blind.caption.show('msg8', 4);
					couch.hide = false;
					Blind.camera.updateProjection();
				},
			},
			{
				dt: 6,
				action: function() {
					Blind.caption.show('msg9', 2);
					Blind.camera.enableMoveKeys();
				},
			},
		]);

		Blind.camera.setCollideAction('couch', function() {
			Blind.caption.show('msg10',2);
			script = new Blind.TimedScript([
				{
					time: 4,
					action: function() {
						Blind.setScene(Blind.scene_game2);
					},
				},
			]);
		});
	}

	function cleanup() {
		Blind.camera.disableViewKeys();
		Blind.camera.disableMoveKeys();
		Blind.camera.disableProjKeys();
	}

	function draw(ctx) {
		ctx.fillStyle = "#222";
		ctx.fillRect(0,0,Blind.canvas.width, Blind.canvas.height);

		cameraAlpha.draw(ctx);
		Blind.caption.draw(ctx);

		Blind.lid.draw(ctx);
	}

	function update(dt) {
		Blind.camera.update(dt);
		Blind.lid.update(dt);
		Blind.caption.update(dt);
		script.update(dt);
		cameraAlpha.update(dt);
	}

	return {
		init: init,
		draw: draw,
		update: update,
	};
})();
