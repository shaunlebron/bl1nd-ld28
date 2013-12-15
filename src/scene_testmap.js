Blind.scene_testmap = (function(){

	var playerX=0, playerY=0;
	var segs = [];
	var projection;

	function updatePlayerPos(x,y) {
		playerX = x;
		playerY = y;
		projection = Blind.projector(playerX, playerY, map.boxes);

		segs.length = 0;
		var i,j,q,len;
		for (i=0; i<4; i++) {
			q = projection.quadrants[i];
			len = q.length;
			for (j=0; j<len; j++) {
				segs.push(q[j]);
			}
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
		var i,len=segs.length,s;
		for (i=0; i<len; i++) {
			s = segs[i];
			ctx.strokeStyle = s.box.color;
			ctx.lineWidth = 4;
			ctx.beginPath();
			ctx.moveTo(s.x0, s.y0);
			ctx.lineTo(s.x1, s.y1);
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
