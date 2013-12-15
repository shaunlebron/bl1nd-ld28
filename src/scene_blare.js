Blind.scene_blare = (function(){

	var script;
	var color;
	
	function init() {
		color = "#F00";
		script = new Blind.TimedScript([
			{
				time: 0.25,
				action: function() {
					color = "#0F0";
				},
			},
			{
				dt: 0.25,
				action: function() {
					color = "#00F";
				},
			},
			{
				dt: 0.25,
				action: function() {
					Blind.setScene(Blind.scene_title);
				},
			},
		]);
	}

	function update(dt) {
		script.update(dt);
	}

	function draw(ctx) {
		ctx.fillStyle = color;
		ctx.fillRect(0,0,Blind.canvas.width, Blind.canvas.height);
	}

	return {
		init: init,
		update: update,
		draw: draw,
	};
})();
