Blind.Box = function(dict) {
	this.x = dict.x;
	this.y = dict.y;
	this.color = dict.color;
	this.name = dict.name || "";
	this.w = dict.w;
	this.h = dict.h;
};

Blind.Box.prototype = {
	draw: function(ctx) {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.w, this.h);
	},
};

Blind.Map = function(dict) {
	this.w = (dict.w != null) ? dict.w : Blind.canvas.width;
	this.h = (dict.h != null) ? dict.h : Blind.canvas.height;

	this.boxes = [];
	var boxes = dict.boxes;
	var i,len=boxes.length;
	for (i=0; i<len; i++) {
		this.boxes.push(new Blind.Box(boxes[i]));
	}
};

Blind.Map.prototype = {
	draw: function(ctx) {
		var i,len=this.boxes.length;
		for (i=0; i<len; i++) {
			this.boxes[i].draw(ctx);
		}
	},
};
