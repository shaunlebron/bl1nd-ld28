
Blind.InterpDriver = function(interp, dict) {
	this.interp = interp;
	this.startTime = interp.startTime;
	this.totalTime = interp.totalTime;
	this.loop = dict.loop;
	this.freezeAtEnd = dict.freezeAtEnd;
	this.reset();
};

Blind.InterpDriver.prototype = {

	// return a predicted state that is dt seconds in the future
	seek: function seek(dt) {

		var t = this.time + dt;
		if (this.freezeAtEnd) {
			t = Math.min(this.totalTime, t);
		}
		return this.interp(t);
	},
	setTime: function(t) {
		this.time = 0;
		this.step(t);
	},
	stepRandom: function() {
		this.step(Math.random()*this.totalTime);
	},
	step: function step(dt) {
		this.time += dt;
		if (this.loop) {
			this.time %= this.totalTime;
		}
		this.val = this.seek(0);
	},

	reset: function reset() {
		this.time = 0;
		this.step(0);
	},

	skipToEnd: function() {
		this.time = this.totalTime;
		this.step(0);
	},

	isDone: function isDone() {
		return !this.loop && !this.freezeAtEnd && this.time > this.totalTime; 
	},

	isPresent: function() {
		return this.val != null;
	},
};

Blind.Path = function(interp, dict) {
	this.interp = interp;
	this.startTime = interp.startTime;
	this.totalTime = interp.totalTime;
	this.loop = dict.loop;
	this.freezeAtEnd = dict.freezeAtEnd;
	this.reset();
};

Blind.Path.prototype = {

	// return a predicted state that is dt seconds in the future
	seek: function seek(dt) {

		var t = this.time + dt;
		if (this.freezeAtEnd) {
			t = Math.min(this.totalTime, t);
		}

		// Turn the interpolated value into a vector object.
		// Also add the "angle" property to it.
		var i = this.interp(t);
		if (i == null) {
			return null;
		}
		var v = (new Blind.Vector).set(i);
		v.angle = i.angle;

		return v;
	},
	setTime: function(t) {
		this.time = 0;
		this.step(t);
	},

	step: function step(dt) {
		this.time += dt;
		if (this.loop) {
			this.time %= this.totalTime;
		}
		this.pos = this.seek(0);
	},

	reset: function reset() {
		this.time = 0;
		this.step(0);
	},

	isDone: function isDone() {
		return !this.loop && !this.freezeAtEnd && this.time > this.totalTime; 
	},

	isPresent: function() {
		return this.pos != null;
	},
};
