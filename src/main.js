
window.addEventListener('load', function() {
	Blind.canvas = document.getElementById('c');
	Blind.ctx = Blind.canvas.getContext('2d');

	var w = Blind.canvas.width = 720;
	var h = Blind.canvas.height = w/16*9;

	Blind.assets.load(function(){
		Blind.setScene(Blind.scene_title);
		Blind.executive.start();
	});
});
