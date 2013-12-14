
Blind.TimedScript = function(events) {
	this.normalizeEvents(events);
	this.events = events;
	this.init();
}

Blind.TimedScript.prototype = {
	init: function() {
		this.currentEvent = 0;
		this.time = 0;
	},
	normalizeEvents: function(events) {
		var i,len=events.length;
		var t=events[0].time;
		var e;
		for (i=1; i<len; i++) {
			e = events[i];
			if (e.time == undefined) {
				t += e.dt;
				e.time = t;
			}
		}
	},
	addEventsAfterNow: function(events) {
		this.normalizeEvents(events);
		var i,len=events.length;
		for (i=0; i<len; i++) {
			this.addEventAfterNow(events[i]);
		}
	},
	addEventAfterNow: function(e) {
		e.time += this.time;
		var i,len=this.events.length;
		for (i=this.currentEvent; i<len; i++) {
			var e2 = this.events[i];
			if (e.time < e2.time) {
				break;
			}
		}
		this.events.splice(i,0,e);
	},
	update: function(dt) {
		this.time += dt;
		var e = this.events[this.currentEvent];
		while (e && this.time >= e.time) {
			e.action();
			e = this.events[++this.currentEvent];
		}
	},
};
