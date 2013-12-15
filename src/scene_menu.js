Blind.scene_menu = (function(){
	
	var script;

	var shiftCaption = (function() {
		var img;
		var enabled;
		var x=245,y=17;

		var keyHandler = {
			'press': {
				'shift': function() {
					disable();
				},
			},
		};

		var alphaDriver = new Blind.InterpDriver(
			Blind.makeInterp('linear', [0, 1, 0], [0, 0.5, 0.5]),
			{
				loop: true,
			});

		function init() {
			img = Blind.assets.images["shift"];
			disable();
		}

		function enable() {
			Blind.input.addKeyHandler(keyHandler);
			enabled = true;
		}
		
		function disable() {
			Blind.input.removeKeyHandler(keyHandler);
			enabled = false;
		}

		function update(dt) {
			if (enabled) {
				alphaDriver.step(dt);
			}
		}

		function draw(ctx) {
			var alpha = alphaDriver.val;
			
			if (enabled && alpha) {
				ctx.globalAlpha = alpha;
				ctx.drawImage(img, x,y);
				ctx.globalAlpha = 1;
			}
		}

		return {
			init: init,
			enable: enable,
			disable: disable,
			update: update,
			draw: draw,
		};
	})();

	var buttons = (function() {
		var imgNewGame, imgContinue;
		var x=12,y0=160,y1=200;
		var enabled;

		var startedInside;
		var mouseHandler = {
			'start': function (mx,my) {
				startedInside = (
					x  <= mx && mx <= x  + imgNewGame.width &&
					y0 <= my && my <= y0 + imgNewGame.height);
			},
			'end': function (mx,my) {
				if (startedInside) {
					Blind.setScene(Blind.scene_game);
				}
			},
		};

		var alphaDriver = new Blind.InterpDriver(
			Blind.makeInterp('linear', [0, 1], [0, 1]),
			{
				loop: false,
				freezeAtEnd: true,
			});

		function enable() {
			Blind.input.addMouseHandler(mouseHandler);
			enabled = true;
		}
		function disable() {
			Blind.input.removeMouseHandler(mouseHandler);
			enabled = false;
		}

		function init() {
			disable();
			alphaDriver.reset();
			imgNewGame = Blind.assets.images["newgame"];
			imgContinue = Blind.assets.images["continue"];
		}
		
		function draw(ctx) {
			var alpha = alphaDriver.val;
			
			if (enabled && alpha) {
				ctx.globalAlpha = alpha;
				ctx.drawImage(imgNewGame, x, y0);
				ctx.globalAlpha = ctx.globalAlpha * 0.2;
				ctx.drawImage(imgContinue, x, y1);
				ctx.globalAlpha = 1;
			}
		}

		function update(dt) {
			if (enabled) {
				alphaDriver.step(dt);
			}
		}

		return {
			enable: enable,
			disable: disable,
			init: init,
			draw: draw,
			update: update,
		};
	})();

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

	function init() {
		lid.reset();
		lid.open();

		map = new Blind.Map(Blind.assets.json["map_title"]);
		Blind.camera.init(map);
		Blind.camera.disableViewKeys();
		Blind.camera.disableMoveKeys();
		Blind.camera.enableProjKeys();

		buttons.init();
		shiftCaption.init();

		script = new Blind.TimedScript([
			{
				time: 2,
				action: function() {
					shiftCaption.enable();
				},
			},
			{
				time: 4,
				action: function() {
					buttons.enable();
				},
			},
		]);
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

		buttons.draw(ctx);
		shiftCaption.draw(ctx);
		lid.draw(ctx);
	}

	function update(dt) {
		Blind.camera.update(dt);
		lid.update(dt);
		script.update(dt);
		buttons.update(dt);
		shiftCaption.update(dt);
	}
	
	return {
		init: init,
		cleanup: cleanup,
		draw: draw,
		update: update,
	};
})();
