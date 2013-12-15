Blind.scene_testmove = (function(){

	function init() {
		map = new Blind.Map(Blind.assets.json["map_title"]);
		Blind.camera.init(map);
		Blind.camera.enableViewKeys();
		Blind.camera.enableMoveKeys();
		Blind.camera.enableProjKeys();
	}

	function cleanup() {
		Blind.camera.disableViewKeys();
		Blind.camera.disableMoveKeys();
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
