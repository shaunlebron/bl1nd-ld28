Blind.scene_testmap = (function(){

	var playerX=0, playerY=0;
	var segs = [];
	var projection;
	var refs = [];

	function updatePlayerPos(x,y) {
		playerX = x;
		playerY = y;
		projection = Blind.projector(playerX, playerY, map.boxes);
		segs = projection.segments;
		refs = projection.refpoints;
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
		var len=refs.length,ref;
		for (i=0; i<len; i++) {
			ref = refs[i];
			var val = Math.floor(i/len*255);
			var color = "rgb("+val+","+val+","+val+")";
			ctx.strokeStyle = color;
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(0,0);
			var a = ref.angle;
			var d = ref.seg.getDistAtAngle(a);
			ctx.lineTo(Math.cos(a)*d, Math.sin(a)*d);
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
