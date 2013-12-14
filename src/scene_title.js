Blind.scene_title = (function(){
	
	function init() {
	}

	function update(dt) {
	}

	function draw(ctx) {
		var color = (Math.random() < 0.5) ? "#F00" : "#00F";
		ctx.fillStyle = color;
		ctx.fillRect(0,0,Blind.screenWidth, Blind.screenHeight);
	}

	return {
		init: init,
		update: update,
		draw: draw,
	};
})();
