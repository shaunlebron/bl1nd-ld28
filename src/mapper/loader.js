
Blind.Mapperc.loader = (function(){

	function promptReset() {
		bootbox.confirm('Are you sure you want to discard this wave and start a new one?',
			function(result) {
				if (result) {
					reset();
				}
			}
		);
	}

	function reset() {
	}

	function getState() {
		var models = Ptero.Ptalaga.enemy_model_list.models;
		var i,len = models.length;
		var state = {
			version: 1,
			models: [],
		};
		for (i=0; i<len; i++) {
			state.models.push(models[i].getState());
		}
		return state;
	}

	function setState(state) {
		var models = [];
		var i,len = state.models.length;
		for (i=0; i<len; i++) {
			models.push(Ptero.Ptalaga.EnemyModel.fromState(state.models[i]));
		}
		Ptero.Ptalaga.enemy_model_list.setModels(models);
		backup();
	}

	function backup() {
		var state = getState();
		var stateStr = JSON.stringify(state,null,'\t');
		if (window.localStorage != undefined) {
			window.localStorage.ptalagaState = stateStr;
		}
		var btn = document.getElementById("save-button");
		btn.href = "data:application/json;base64," + btoa(stateStr);
		btn.download = "wave.json";
	}

	function restore() {
		try {
			if (window.localStorage) {
				var state = JSON.parse(window.localStorage.ptalagaState);
				if (state) {
					setState(state);
					return true;
				}
			}
		}
		catch (e) {
		}
		return false;
	}

	function openFile(f) {
		var reader = new FileReader();
		reader.onload = function(e) {
			try {
				var state = JSON.parse(e.target.result);
				setState(state);
			}
			catch (e) {
				bootbox.alert("Could not load file '"+f.name+"'");
			}
		};
		reader.readAsText(f);
	}

	// open file dialog
	function handleOpenFile(evt) {
		evt.stopPropagation();
		evt.preventDefault();

		var files = evt.target.files;
		if (files) {
			openFile(files[0]);
		}
		else {
			files = evt.dataTransfer.files;
			if (files) {
				openFile(files[0]);
			}
		}
	}

	return {
		backup: backup,
		restore: restore,
		handleOpenFile: handleOpenFile,
		reset: reset,
		promptReset: promptReset,
	};
})();
