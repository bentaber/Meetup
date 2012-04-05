(function() {

	"use strict";

	var $angrylib = $('#angrierLibContent');
	var images = [], movin = false, idx = -1;

	function row(el) {
		if (el.hasClass('selected')) return;

		// $('li.selected', $angrylib).animate({
		// 	height: '48px'
		// }, 250, function($) {
		// 	el.removeClass('selected');

		$('li.selected', $angrylib).removeClass('selected');
		el.addClass('selected');
	}

	function big(el, cb) {
		row(el.parent());
		el.animate({
			height: '200px',
			width: '200px',
			top: '20px'
		}, 250, 'swing', cb)
	}

	function little(el, cb) {
		el.animate({
			height: '48px',
			width: '48px',
			top: '80px'
		}, 250, function() {

			var parent = el.parent();
			// parent.remove(el);
			parent.append(el);

			if (cb) cb();
		});
	}

	function next() {
		if (idx >= images.length) {
			idx = -1;
		}

		idx ++;

		big(images[idx], function() {
			little(images[idx], next);
		});
	}

	function go() {
		if (movin) return;
		movin = true;

		next();
	}

	
	Util.HandleWordPreFill = function (Element, CurrentWord, WordCategory) {
		var context = this;
		if (!CurrentWord) return true;
	
		this.TwitterSearch(
			Element, 
			CurrentWord, 
			function(el, word, response) {
				var row;

				if (!response || !response.results) {
					return madLibEngine.fillNextWord(); 	
				}

				row = $('<li><h2>' + word + '?</h2></li>');

				response.results.forEach(function(result) {
	
					var img = $('<img src="' + result.profile_image_url  + '" />')
					row.append(img);
					images.push(img);

				});

				$angrylib.append(row);

				go();

			}, 
			function(){ 
				madLibEngine.fillNextWord(); 
			}
		);
	};


})();