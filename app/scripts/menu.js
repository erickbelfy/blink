define(['jquery','exports', 'tweenMax'], function ($, exports, TweenMax) {

	'use strict';

	var Menu = function (_data, _isPage) {
		this.left = $(window).width();
		this.activeSection = _data;
		this.isCollapsed = false;
		this.isPage = _isPage;
		this.transitioning = false;
	};

	Menu.prototype.init = function () {
		var scope = this;
		var $logo = $('#logo');
		$logo.click($.proxy(this.onClick, this));
		$('.menu-active').mouseenter($.proxy(this.show, this)).mouseleave($.proxy(this.hide, this));
		$('.menu-active')[0].addEventListener('touchend', $.proxy(this.show, this));
		var $menu = $('.menu-active');
		$('.menu-body a').click($.proxy(this.onClick, this));
		$menu.css('left', this.left);
		$menu.css('width', this.left);
		var headMenuPosition = this.left - 160;
		this.left = this.left - 160;
		TweenMax.to($logo, 0.8, {css: {left: 0}, ease: Cubic.easeOut});
		TweenMax.to($menu, 0.8, {css: {left: headMenuPosition}, ease: Cubic.easeOut});
		$(window).resize($.proxy(scope.resizeMenu, scope));
	};

	Menu.prototype.show = function () {
		var $menu = $('#menu');
		TweenMax.to($menu, 1.25, {css: {left: 0}, ease: Power4.easeInOut});
		$('.menu-body').css('display', 'block');
	};

	Menu.prototype.hide = function () {
		var $menu = $('#menu');
		TweenMax.to($menu, 1, {css: {left: this.left}, ease: Power4.easeInOut});
	};

	Menu.prototype.toggleMenu = function (section) {
		this.hide();
		this.activeSection.setCurrentSection(section);
	};

	Menu.prototype.onClick = function (e) {
		e.preventDefault();
		var section = $(e.currentTarget).data('section');
		this.toggleMenu(section);
	};

	Menu.prototype.resizeMenu = function () {
		this.left = $(window).width() - 160;
		var property = (this.isActive) ? {left: 0} : {left: this.left + 'px'};
		var $menu = $('#menu');
		$menu.css(property);
		$menu.css('width', $(window).width() + 'px');
	};

	exports.Menu = Menu;
});
