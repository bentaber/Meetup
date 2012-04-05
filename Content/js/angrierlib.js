(function() {

	"use strict";

	var $angrylib = $('#angrierLibContent');
	var images = [], movin = false;

	function row(el) {
		if (el.hasClass('selected')) return;
		$('li.selected', $angrylib).removeClass('selected');
		el.addClass('selected');
	}

	function big(el, cb) {
		row(el.parent());

		$('h2', el.parent()).animate({
			left: el.css('left'),
			top: '-50px'
		}, 100);

		el.css({ zIndex: 1 })
		el.animate({
			height: '200px',
			width: '200px',
		}, 500, 'swing', cb)
	}

	function little(el, cb) {
		if (cb) cb();

		el.animate({
			height: '48px',
			width: '48px'
		}, 500, 'swing', function() {
			el.css({ zIndex: 0 })
			var parent = el.parent();
			parent.append(el);

		});
	}

	function next() {
		var idx = Math.floor(Math.random() * images.length);

		big(images[idx], function() {
			little(images[idx], next);
		});
	}

	function go() {
		if (movin) return;
		movin = true;

		next();
	}

	var words = [];
	var top = 0;
	var left = 0;
	
	Util.HandleWordPreFill = function (Element, CurrentWord, WordCategory) {
		var context = this;
		if (!CurrentWord) return true;

		this.TwitterSearch(
			Element, 
			CurrentWord, 
			function(el, word, response) {
				var row;

				if (words.indexOf(word) != -1 || words.length == 10 || !response || !response.results) {
					return madLibEngine.fillNextWord(); 	
				}

				words.push(word);
				
				row = $('<li><h2>' + word + '?</h2></li>');
				row.css({
					top: top + 'px'
				})

				top += 50;


				response.results.forEach(function(result) {
	
					var img = $('<img src="' + result.profile_image_url  + '" />')
					row.append(img);
					images.push(img);

					img.css({
						left: left + 'px'
					})
					left += 50;

				});

				left = 0;

				$angrylib.append(row);

				go();

			}, 
			function(){ 
				madLibEngine.fillNextWord(); 
			}
		);
	};


})();