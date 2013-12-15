Blind.scene_testmap = (function(){

	var playerX=0, playerY=0;
	var segs = [];
	var projection;
	var refs = [];
	var visibleSegs = [];

	function updatePlayerPos(x,y) {
		playerX = x;
		playerY = y;
		projection = Blind.getProjection({
			x: playerX,
			y: playerY,
			boxes: map.boxes
		});
		segs = projection.segments;
		refs = projection.refpoints;
		visibleSegs = projection.visibleSegments;
	}

	var mouseHandler = {
		start: function(x,y) {
			updatePlayerPos(x,y);
		},
		move: function(x,y) {
			updatePlayerPos(x,y);
		},
	};

	var map;
	function init() {
		Blind.input.addMouseHandler(mouseHandler);
		map = new Blind.Map(Blind.assets.json["map_title"]);
	}

	function update(dt) {
	}

	function draw(ctx) {
		ctx.fillStyle = "#222";
		ctx.fillRect(0,0,Blind.canvas.width, Blind.canvas.height);

		ctx.globalAlpha = 0.6;
		map.draw(ctx);
		ctx.globalAlpha = 1;

		ctx.fillStyle = "#FFF";
		var w = 4;
		ctx.fillRect(playerX-w/2, playerY-w/2, w,w);

		ctx.save();
		ctx.translate(playerX, playerY);
		var i,len=segs.length,s,mid;
		for (i=0; i<len; i++) {
			s = segs[i];
			ctx.strokeStyle = s.box.color;
			ctx.lineWidth = 4;
			ctx.beginPath();
			ctx.moveTo(s.x0, s.y0);
			ctx.lineTo(s.x1, s.y1);
			ctx.stroke();
		}

		ctx.globalAlpha = 0.4;
		var len=visibleSegs.length;
		var a,d;
		for (i=0; i<len; i++) {
			s = visibleSegs[i];
			var color = s.seg.box.color;
			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.moveTo(0,0);
			a = s.a0;
			d = s.d0;
			ctx.lineTo(Math.cos(a)*d, Math.sin(a)*d);
			a = s.a1;
			d = s.d1;
			ctx.lineTo(Math.cos(a)*d, Math.sin(a)*d);
			ctx.closePath();
			ctx.fill();
		}
		ctx.globalAlpha = 1;

		if (projection) {
			Blind.drawArcs(ctx, {
				x: 0,
				y: 0,
				radius: 100,
				lineWidth: 10,
				projection: projection,
				angle: -Math.PI/2,
			});
		}
		ctx.restore();
	}

	return {
		init: init,
		update: update,
		draw: draw,
	};
})();
