var Blind = Blind || {};

window.addEventListener('load', function() {
	var canvas = document.getElementById('c');
	Blind.ctx = canvas.getContext('2d');

	var w = Blind.screenWidth = canvas.width = 720;
	var h = Blind.screenHeight = canvas.height = w/16*9;
	console.log('about to load assets');

	Blind.assets.load(function(){
		console.log('loaded assets!');
		Blind.setScene(Blind.scene_title);
		Blind.executive.start();
	});
});

