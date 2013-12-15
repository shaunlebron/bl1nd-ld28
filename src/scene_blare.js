Blind.scene_blare = (function(){
	
	var time;
	function init() {
		time = 0;
	}

	function update(dt) {
		time += dt;
		if (time > 0.25) {
			Blind.setScene(Blind.scene_title);
		}
	}

	function draw(ctx) {
		var color = ["#F00", "#0F0", "#00F"][Math.floor(Math.random()*3)];
		ctx.fillStyle = color;
		ctx.fillRect(0,0,Blind.canvas.width, Blind.canvas.height);
	}

	return {
		init: init,
		update: update,
		draw: draw,
	};
})();
