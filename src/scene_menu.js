Blind.scene_menu = (function(){

	var lid = (function() {
		var value, target;
		var factor = 0.05;

		function reset() {
			close();
			value = target;
		}

		function update() {
			value += (target-value)*factor;
		}

		function open() {
			target = -Blind.canvas.height;
		}
		function close() {
			target = 0;
		}

		function draw(ctx) {
			ctx.fillStyle = "#222";
			ctx.fillRect(0,value,Blind.canvas.width, Blind.canvas.height);
		}

		return {
			reset: reset,
			open: open,
			close: close,
			update: update,
			draw: draw,
		};
	})();

	function init() {
		lid.reset();
		lid.open();

		map = new Blind.Map(Blind.assets.json["map_title"]);
		Blind.camera.init(map);
		Blind.camera.disableViewKeys();
		Blind.camera.disableMoveKeys();
		Blind.camera.enableProjKeys();
	}

	function cleanup() {
		Blind.camera.disableViewKeys();
		Blind.camera.disableMoveKeys();
		Blind.camera.disableProjKeys();
	}

	function draw(ctx) {
		ctx.fillStyle = "#222";
		ctx.fillRect(0,0,Blind.canvas.width, Blind.canvas.height);

		Blind.camera.draw(ctx);

		lid.draw(ctx);
	}

	function update(dt) {
		Blind.camera.update(dt);
		lid.update(dt);
	}
	
	return {
		init: init,
		cleanup: cleanup,
		draw: draw,
		update: update,
	};
})();
