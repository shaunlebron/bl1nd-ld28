Blind.Segment = function(dict) {
	this.box = dict.box;
	this.type = dict.type;
	this.x0 = dict.x0;
	this.y0 = dict.y0;
	this.x1 = dict.x1;
	this.y1 = dict.y1;
	this.distSq0 = this.x0*this.x0 + this.y0*this.y0;
	this.distSq1 = this.x1*this.x1 + this.y1*this.y1;
	this.angle0 = Math.atan2(this.y0, this.x0);
	this.angle1 = Math.atan2(this.y1, this.x1);

	// Tricky corner case:
	// Force angles of vertical segment endpoints from traveling over the atan2
	// portal at PI.
	if (this.type == 'v' && this.y1 == 0 && this.x0 < 0) {
		this.angle1 = -this.angle1;
	}
};

Blind.Segment.prototype = {
	getDistAtAngle: function(angle) {
		if (this.type == 'v') {
			return this.x0 / Math.cos(angle);
		}
		else {
			return this.y0 / Math.sin(angle);
		}
	},
};

Blind.projector = function(cx,cy, boxes) {

	function getSegments() {
		var segments = [];
		function processVSeg(box,x,y0,y1) {
			if (y1 <= 0 || y0 >= 0) {
				segments.push(new Blind.Segment({
					box: box,
					x0: x, y0: y0,
					x1: x, y1: y1,
					type: 'v',
				}));
			}
			else {
				processVSeg(box, x,y0,0);
				processVSeg(box, x,0,y1);
			}
		}
		function processHSeg(box,y,x0,x1) {
			if (x1 <= 0 || x0 >= 0) {
				segments.push(new Blind.Segment({
					box: box,
					x0: x0, y0: y,
					x1: x1, y1: y,
					type: 'h',
				}));
			}
			else {
				processHSeg(box, y,x0,0);
				processHSeg(box, y,0,x1);
			}
		}
		function processBox(box) {
			var x = box.x-cx;
			var y = box.y-cy;
			var w = box.w;
			var h = box.h;

			// left
			if (x > 0) {
				processVSeg(box, x, y, y+h);
			}

			// right
			if (x+w < 0) {
				processVSeg(box, x+w, y, y+h);
			}

			// top
			if (y > 0) {
				processHSeg(box, y, x, x+w);
			}

			// bottom
			if (y+h < 0) {
				processHSeg(box, y+h, x, x+w);
			}
		}

		var i,len=boxes.length;
		for (i=0; i<len; i++) {
			processBox(boxes[i]);
		}
		return segments;
	}
	var segments = getSegments();
	
	return {
		segments: segments,
	};
};
