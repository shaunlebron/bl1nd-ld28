
Blind.scene_game2 = (function(){
	var script;
	var map;

	function init() {
		Blind.lid.reset();
		Blind.lid.open();


		map = new Blind.Map(Blind.assets.json["map_game2"]);
		var i,len=map.boxes.length;
		for (i=0; i<len; i++) {
			if (map.boxes[i].name == 'couch') {
				couch = map.boxes[i];
				couch.hide = true;
				break;
			}
		}
		Blind.camera.init(map);
		Blind.camera.enableViewKeys();
		Blind.camera.enableMoveKeys();
		Blind.camera.disableProjKeys();

		Blind.camera.setPosition(0, 0);
		Blind.camera.setAngle(-Math.PI/2);
		Blind.camera.updateProjection();

		script = new Blind.TimedScript([
			{
				time: 1,
				action: function() {
					Blind.caption.show('msg11', 2);
				},
			},
		]);

		Blind.camera.setCollideAction('me', function() {
			console.log('hi me');
			Blind.caption.show('msg12',2);
			script = new Blind.TimedScript([
				{
					time: 4,
					action: function() {
						Blind.caption.show('msg13', 2);
					},
				},
				{
					dt: 4,
					action: function() {
						Blind.caption.show('msg14', 2);
					},
				},
				{
					dt: 4,
					action: function() {
						Blind.setScene(Blind.scene_title);
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

		Blind.camera.draw(ctx);
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
