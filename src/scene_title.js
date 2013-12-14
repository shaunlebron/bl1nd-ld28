Blind.scene_title = (function(){
	
	function init() {
	}

	function update(dt) {
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
