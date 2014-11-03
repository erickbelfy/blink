define(['jquery', 'exports', 'tweenMax', 'data'], function ($, exports, TweenMax, data) {

	'use strict';

	var Home = function () {

		this.home = $('#home');
		this.height = $(window).height();
		this.slideshow = null;
	};

	Home.prototype.insert = function () {
		window.location.hash = '';
		TweenMax.to(this.home, 0.8, {css: {height: this.height + 'px' }, ease: Cubic.easeOut});
	};

	Home.prototype.remove =  function () {
		var settings = {css: {height: 0}, ease: Cubic.easeOut};
		TweenMax.to(this.home, 0.8, settings);
	};

	Home.prototype.setSlideShowInstance = function (_slideshow) {
		this.slideshow = _slideshow;
	};

	exports.Home = Home;
});
