
Blind.Font = function(img,dict) {
	this.chars = dict.chars;
	this.scale = dict.scale || 1;
	this.lineHeight = dict.lineHeight;
	this.img = img;
};

Blind.Font.prototype = {
	getTextWidth: function(text) {
		var w = 0;
		var i,len=text.length;
		var c;
		for (i=0; i<len; i++) {
			c = this.chars[text[i]];
			if (c) {
				w += (i == len-1) ? Math.max(c.width, c.xadvance) : c.xadvance;
			}
		}
		return w;
	},
	draw: function(ctx, text, x, y, align) {

		if (typeof text != "string") {
			text = text.toString();
		}

		var textWidth = this.getTextWidth(text);
		var textHeight = this.lineHeight*1.5;

		ctx.save();
		billboard.transform(ctx, pos);
		if (align == "left") {
		}
		else if (align == "right") {
			x -= textWidth;
		}
		else if (align == "center") {
			x -= textWidth/2;
		}
		var c;
		var sx,sy,sw,sh;
		var dx,dy,dw,dh;
		var i,len=text.length;
		for (i=0; i<len; i++) {
			c = this.chars[text[i]];
			if (!c) {
				continue;
			}
			sx = c.x;
			sy = c.y;
			sw = dw = c.width;
			sh = dh = c.height;
			dx = x + c.xoffset;
			dy = y + c.yoffset;
			if (sw > 0 && sh > 0) { // needs a nonzero size
				ctx.drawImage(this.img, sx,sy,sw,sh, dx,dy,dw,dh);
			}
			x += c.xadvance; // should we add xoffset to this?
		}
		ctx.restore();
	},
};

