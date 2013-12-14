
Blind.setScene = function(scene) {
	Blind.prevScene = Blind.scene;
	if (Blind.scene && Blind.scene.cleanup) {
		Blind.scene.cleanup();
	}
	Blind.scene = scene;
	scene.init();
};

Blind.executive = (function(){
	var lastTime;
	var minFps = 20;

	function tick(time) {
		try {
			var dt = (lastTime == undefined) ? 0 : Math.min((time-lastTime)/1000, 1/minFps);
			lastTime = time;

			var scene = Blind.scene;
			var ctx = Blind.ctx;

			scene.update(dt);
			scene.draw(ctx);
			requestAnimationFrame(tick);
		}
		catch (e) {
			console.error(e.message + "@" + e.sourceURL);
			console.error(e.stack);
		}
	};

	function start() {
		requestAnimationFrame(tick);
	};

	return {
		start: start,
	};
})();

