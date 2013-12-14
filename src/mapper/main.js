
Blind.Mapper = Blind.Mapper || {};

window.addEventListener('load', function() {
	Blind.canvas = document.getElementById('c');
	Blind.ctx = Blind.canvas.getContext('2d');

	var w = Blind.canvas.width = 720;
	var h = Blind.canvas.height = w/16*9;

	Blind.assets.load(function(){
		Blind.input.init();
		Blind.setScene(Blind.Mapper.scene);
		Blind.executive.start();
	});
});

