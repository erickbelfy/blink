define(['jquery', 'scrollbar', 'exports', 'tweenMax', 'signals'], function ($, scrollbar, exports, TweenMax, signals) {

	'use strict';

	var About = function () {
		this.height = $(window).height();
		this.about = $('#about');
		this.onPortfolioCliked = new signals.Signal();
		this.onContactClicked = new signals.Signal();
		this.isActive = false;
	};

	About.prototype.addEventListeners = function () {
		$('.portfolio-link').click($.proxy(this.goToPortfolio, this));
		$('.contact-link').click($.proxy(this.goToContact, this));
		$(window).resize($.proxy(this.resizeBlock, this));
	};

	About.prototype.goToPortfolio = function (e) {
		e.preventDefault();
		this.onPortfolioCliked.dispatch();
	};

	About.prototype.goToContact = function (e) {
		e.preventDefault();
		this.onContactClicked.dispatch();
	};

	About.prototype.insert = function () {
		window.location.hash = '!sobre';
		this.height = $(window).height();
		this.isActive = true;
		TweenMax.to(this.about, 0.8, {css: {height: this.height + 'px'}, ease: Cubic.easeOut});
		this.about.perfectScrollbar();
		this.addEventListeners();
		$(window).resize($.proxy(this.resize, this));
	};
	About.prototype.resize = function () {
		this.height = $(window).height();
		$('#about').perfectScrollbar('update');
	};
	About.prototype.remove = function () {
		this.isActive = false;
		var settings = {css: {height: 0}, ease: Cubic.easeOut};
		TweenMax.to(this.about, 0.8, settings);
	};

	About.prototype.resizeBlock = function () {
		if (this.isActive) {
			this.height = $(window).height();
			this.about.height(this.height);
		}
	};

	exports.About = About;

});

