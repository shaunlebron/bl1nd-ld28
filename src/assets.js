
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
		"msg1": "img/msg1.png",
		"msg2": "img/msg2.png",
		"msg3": "img/msg3.png",
		"msg4": "img/msg4.png",
		"msg5": "img/msg5.png",
		"msg6": "img/msg6.png",
		"msg7": "img/msg7.png",
		"msg8": "img/msg8.png",
		"msg9": "img/msg9.png",
		"msg10": "img/msg10.png",
		"msg11": "img/msg11.png",
		"msg12": "img/msg12.png",
		"msg13": "img/msg13.png",
		"msg14": "img/msg14.png",
		"msg15": "img/msg15.png",
		"msg16": "img/msg16.png",
		"msg17": "img/msg17.png",
		"msg18": "img/msg18.png",
		"msg19": "img/msg19.png",
		"msg20": "img/msg20.png",
		"msg21": "img/msg21.png",
		"msg22": "img/msg22.png",
		"msg23": "img/msg23.png",
		"msg24": "img/msg24.png",
		"msg25": "img/msg25.png",
		"msg26": "img/msg26.png",
		"msg27": "img/msg27.png",
		"msg28": "img/msg28.png",
		"msg29": "img/msg29.png",
	};

	var jsonSources = {
		"map_title": "maps/title.json",
		"map_game1": "maps/game1.json",
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
