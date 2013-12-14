

Blind.StopWatch = function() {
	this.reset();
};

Blind.StopWatch.prototype = {
	reset: function() {
		this.t = 0;
	},
	update: function(dt) {
		this.t += dt;
	},
};

Blind.Timer = function(d) {
	this.limit = d.limit;
	this.onFinish = d.onFinish;
	this.onUpdate = d.onUpdate;
	this.stopWatch = new Blind.StopWatch;
};

Blind.Timer.prototype = {
	isDone: function() {
		return this.stopWatch.t > this.limit;
	},
	getTimeElapsed: function() {
		return Math.min(this.limit,this.stopWatch.t);
	},
	getTimeLeft: function() {
		return this.limit - this.getTimeElapsed();
	},
	reset: function reset() {
		this.stopWatch.reset();
	},
	update: function(dt) {
		if (this.isDone()) {
			this.onFinish && this.onFinish();
		}
		else {
			this.stopWatch.update(dt);
			this.onUpdate && this.onUpdate(dt, this.getTimeElapsed(), this.limit);
		}
	},
};
