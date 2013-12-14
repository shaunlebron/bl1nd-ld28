

Blind.Vector = function(x,y,z) {
	if (z == undefined) z = 0;
	this.x = x;
	this.y = y;
	this.z = z;
};

Blind.Vector.fromXYZ = function(xyz) {
	return (new Blind.Vector).set(xyz);
};

Blind.Vector.prototype = {
	set: function(vector) {
		this.x = vector.x;
		this.y = vector.y;
		this.z = vector.z;
		return this;
	},
	copy: function() {
		return (new Blind.Vector).set(this);
	},
	add: function(vector) {
		this.x += vector.x;
		this.y += vector.y;
		this.z += vector.z;
		return this;
	},
	sub: function(vector) {
		this.x -= vector.x;
		this.y -= vector.y;
		this.z -= vector.z;
		return this;
	},
	mul: function(scalar) {
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
		return this;
	},
	dot: function(vector) {
		return (
			this.x * vector.x +
			this.y * vector.y +
			this.z * vector.z);
	},
	cross: function(vector) {
		return new Blind.Vector(
			this.y*vector.z - this.z*vector.y,
			this.x*vector.z - this.z*vector.x,
			this.x*vector.y - this.y*vector.x
		);
	},
	dist_sq: function(vector) {
		var dx = this.x - vector.x;
		var dy = this.y - vector.y;
		var dz = this.z - vector.z;
		return (dx*dx + dy*dy + dz*dz);
	},
	dist: function(vector) {
		return Math.sqrt(this.dist_sq(vector));
	},
	ease_to: function(vector,ratio) {
		this.x += (vector.x - this.x) * ratio;
		this.y += (vector.y - this.y) * ratio;
		this.z += (vector.z - this.z) * ratio;
	},
	mag: function() {
		return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
	},
	normalize: function() {
		var d = this.mag();
		this.x /= d;
		this.y /= d;
		this.z /= d;
		return this;
	},
	angleTo: function(vector) {
		return Math.abs(Math.acos(this.dot(vector)));
	},
};
