Blind.scene_title = (function(){

	var eye, title;
	var script;

	function init() {
		Blind.lid.reset();
		Blind.lid.open();
		eye = Blind.assets.images["eye"];
		title = Blind.assets.images["title"];
		script = new Blind.TimedScript([
			{
				time: 2,
				action: function() {
					Blind.lid.close();
				},
			},
			{
				dt: 1.5,
				action: function() {
					Blind.setScene(Blind.scene_menu);
				},
			},
		]);
	}

	function update(dt) {
		Blind.lid.update();
		script.update(dt);
	}

	function draw(ctx) {
		var w = Blind.canvas.width;
		var h = Blind.canvas.height;
		ctx.fillStyle = "#222";
		ctx.fillRect(0,0,w,h);

		ctx.drawImage(eye,w/2-eye.width/2,h/2-eye.height/2);
		ctx.drawImage(title,w/2-title.width/2,h/2-title.height/2);

		Blind.lid.draw(ctx);
	}

	return {
		init: init,
		update: update,
		draw: draw,
	};
})();
