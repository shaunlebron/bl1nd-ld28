Blind.scene_testmap = (function(){

	var playerX=0, playerY=0;
	var segs = [];
	var projection;
	var mids = [];

	function updatePlayerPos(x,y) {
		playerX = x;
		playerY = y;
		projection = Blind.projector(playerX, playerY, map.boxes);
		segs = projection.segments;

		mids.length = 0;
		var i,q,seg,len=segs.length;
		for (i=0; i<len; i++) {
			seg = segs[i];

			var a = seg.angle0 + (seg.angle1-seg.angle0) / 2;
			var dist = seg.getDistAtAngle(a);
			mids.push({
				x: Math.cos(a) * dist,
				y: Math.sin(a) * dist,
			});
		}
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

			mid = mids[i];
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(0,0);
			ctx.lineTo(mid.x, mid.y);
			ctx.stroke();
		}
		ctx.restore();
	}

	return {
		init: init,
		update: update,
		draw: draw,
	};
})();
