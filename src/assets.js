
Blind.assets = (function(){

	var sfxSources = {
	};

	var songSources = {
	};

	var imageSources = {
		"eye": "img/eye.png",
		"title": "img/title.png",
		"newgame": "img/newgame.png",
		"continue": "img/continue.png",
		"shift": "img/shift.png",
		"freerun": "img/freerun.png",
	};

	var jsonSources = {
		"map_title": "maps/title.json",
	};

	// Add secondary sources dependent on the primary sources listed above.
	(function(){
		var name;

		// add metadata json sources to loading list
		for (name in imageSources) {
			jsonSources[name] = imageSources[name]+".json";
		}

	})();

	var json = {};

	// "Audio" objects for sfx
	var sfx = {};
	
	// post-processed song structures
	var songs = {};

	// "Image" objects, actual image file data
	var images = {};

	// post-processed image structures
	var fonts = {};

	function postProcessImage(name) {

		var meta = json[name];
		console.log(name);

		if (meta.font != undefined) {
			if (!fonts[name]) {
				console.log("creating font",name);
				fonts[name] = new Blind.Font(images[name], meta);
			}
		}
	};

	function postProcess() {

		var name;

		// post-process images
		for (name in imageSources) {
			postProcessImage(name);
		}
	}

	function load(onLoad) {

		// Determine the number of files we are loading.
		var totalCount = 0;
		for (name in imageSources) { totalCount++; }
		for (name in jsonSources) { totalCount++; }
		for (name in sfxSources) { totalCount++; }
		for (name in songSources) { totalCount++; }

		// Running count of how many files have been loaded.
		var count = 0;


		// Called when all files are loaded.
		function handleAllDone() {
			postProcess();
			onLoad && onLoad();
		}

		if (count == totalCount) {
			handleAllDone();
		}

		// Called after a file is loaded.
		function handleLoad() {
			count++;
			//console.log(count, totalCount);
			if (count == totalCount) {
				handleAllDone();
			}
		}

		// Load images
		var img,name,src,req;
		for (name in imageSources) {
			if (images[name]) {
				handleLoad();
				continue;
			}
			src = imageSources[name];
			console.log('image',name, src);
			img = new Image();
			img.src = src;
			img.onerror = (function(name){
				return function() {
					console.error("couldn't load image: "+ name);
				};
			})(name);
			img.onload = (function(name){
				return function() {
					console.log("loaded image: "+ name);
					handleLoad();
				};
			})(name);
			images[name] = img;
		}

		// Load json data.
		for (name in jsonSources) {
			if (json[name]) {
				handleLoad();
				continue;
			}
			src = jsonSources[name];
			req = new XMLHttpRequest();
			req.onload = (function(name){
				return function() {
					try {
						json[name] = JSON.parse(this.responseText);
						console.log("loaded json: "+ name);
						handleLoad();
					}
					catch (e) {
						console.log("ERROR: could not load json file",name);
						console.error("could not load json file",name);
					}
				};
			})(name);
			req.open('GET', src, true);
			req.send();
		}

		// load sound effects
		var audio;
		for (name in sfxSources) {
			audio = new Audio();
			audio.src = sfxSources[name];
			sfx[name] = audio;
			console.log("loaded sfx: ", name);
			handleLoad();
		}

		// load songs and create song objects
		for (name in songSources) {
			audio = new Audio();
			src = songSources[name];
			if (audio.canPlayType('audio/ogg')) {
				audio.src = src+".ogg";
			}
			else if (audio.canPlayType('audio/mp3')) {
				audio.src = src+".mp3";
			}
			else {
				audio = null;
				console.error("no song found for: ", name);
				continue;
			}
			console.log("loaded song: ", name);
			songs[name] = new Blind.Song(audio);
			handleLoad();
		}
	}

	return {
		json: json,
		load: load,
		sfx: sfx,
		songs: songs,
		images: images,
		fonts: fonts,
	};
})();
