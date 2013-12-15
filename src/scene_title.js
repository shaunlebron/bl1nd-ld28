Blind.scene_title = (function(){

	var eye, title;
	var script;

	var lid = (function() {
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

		function getValue() {
			return value;
		}

		return {
			reset: reset,
			open: open,
			close: close,
			update: update,
			getValue: getValue,
		};
	})();
	
	function init() {
		lid.reset();
		lid.open();
		eye = Blind.assets.images["eye"];
		title = Blind.assets.images["title"];
		script = new Blind.TimedScript([
			{
				time: 2,
				action: function() {
					lid.close();
				},
			},
			{
				dt: 1,
				action: function() {
					Blind.setScene(Blind.scene_blare);
				},
			},
		]);
	}

	function update(dt) {
		lid.update();
		script.update(dt);
	}

	function draw(ctx) {
		var w = Blind.canvas.width;
		var h = Blind.canvas.height;
		ctx.fillStyle = "#222";
		ctx.fillRect(0,0,w,h);

		ctx.drawImage(eye,w/2-eye.width/2,h/2-eye.height/2);
		ctx.drawImage(title,w/2-title.width/2,h/2-title.height/2);

		// eyelid
		ctx.fillRect(0,lid.getValue(),w,h);
	}

	return {
		init: init,
		update: update,
		draw: draw,
	};
})();
