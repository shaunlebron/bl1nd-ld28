Blind.caption = (function(){
	function init() {
	}

	function show(image, time) {
	}

	function update(dt) {
	}

	function draw(ctx) {
	}

	return {
		init: init,
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

