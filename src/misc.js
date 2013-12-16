Blind.caption = (function(){
	var alphaDriver;
	var x=14,y=160;
	var image;

	function show(imageName, time) {
		image = Blind.assets.images[imageName];
		alphaDriver = new Blind.InterpDriver(
			Blind.makeInterp('linear', [0, 1, 1, 0], [0, 1, time, 1]),
			{
				freezeAtEnd: true,
			});
	}

	function update(dt) {
		if (alphaDriver) {
			alphaDriver.step(dt);
		}
	}

	function draw(ctx) {
		if (alphaDriver) {
			var alpha = alphaDriver.val;
			if (alpha) {
				ctx.globalAlpha = alpha;
				ctx.drawImage(image, x,y);
				ctx.globalAlpha = 1;
			}
		}
	}

	return {
		show: show,
		update: update,
		draw: draw,
	};
})();

Blind.lid = (function() {
	var value, target;
	var factor = 0.05;

	function reset() {
		close();
		value = target;
	}

	function update() {
		value += (target-value)*factor;
	}

	function open() {
		target = -Blind.canvas.height;
	}
	function close() {
		target = 0;
	}

	function draw(ctx) {
		ctx.fillStyle = "#222";
		ctx.fillRect(0,value,Blind.canvas.width, Blind.canvas.height);
	}

	return {
		reset: reset,
		open: open,
		close: close,
		update: update,
		draw: draw,
	};
})();

