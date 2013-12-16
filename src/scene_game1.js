
Blind.scene_game1 = (function(){
	var script;
	var map;

	var showCamera;

	function init() {
		showCamera = false;

		Blind.lid.reset();
		Blind.lid.open();

		map = new Blind.Map(Blind.assets.json["map_game1"]);
		Blind.camera.init(map);

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
					showCamera = true;
				},
			},
		]);
	}

	function cleanup() {
		Blind.camera.disableViewKeys();
		Blind.camera.disableMoveKeys();
		Blind.camera.disableProjKeys();
	}

	function draw(ctx) {
		ctx.fillStyle = "#222";
		ctx.fillRect(0,0,Blind.canvas.width, Blind.canvas.height);

		if (showCamera) {
			Blind.camera.draw(ctx);
		}
		Blind.caption.draw(ctx);

		Blind.lid.draw(ctx);
	}

	function update(dt) {
		Blind.camera.update(dt);
		Blind.lid.update(dt);
		Blind.caption.update(dt);
		script.update(dt);
	}

	return {
		init: init,
		draw: draw,
		update: update,
	};
})();
