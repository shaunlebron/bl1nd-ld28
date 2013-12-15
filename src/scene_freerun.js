Blind.scene_freerun = (function(){

	var keyHandler = {
		'press': {
			'esc': function() {
				Blind.setScene(Blind.scene_menu);
			},
		},
	};

	function init() {
		map = new Blind.Map(Blind.assets.json["map_title"]);
		Blind.camera.init(map);
		Blind.camera.enableViewKeys();
		Blind.camera.enableMoveKeys();
		Blind.camera.enableProjKeys();
		Blind.input.addKeyHandler(keyHandler);
	}

	function cleanup() {
		Blind.camera.disableViewKeys();
		Blind.camera.disableMoveKeys();
		Blind.camera.disableProjKeys();
		Blind.input.removeKeyHandler(keyHandler);
	}

	function draw(ctx) {
		ctx.fillStyle = "#222";
		ctx.fillRect(0,0,Blind.canvas.width, Blind.canvas.height);

		Blind.camera.draw(ctx);
	}

	function update(dt) {
		Blind.camera.update(dt);
	}
	
	return {
		init: init,
		cleanup: cleanup,
		draw: draw,
		update: update,
	};
})();
