define(['jquery', 'exports'], function ($, exports) {
	'use strict';
	var PreloaderThumbs = function (_thumbs, _callback) {
		this.callback = _callback;
		this.currentImage = 0;
		this.currentImagePath = '';
		this.thumbs = _thumbs;
	};

	PreloaderThumbs.prototype.setImage = function (src) {
		var scope = this;
		var image = new Image();
		image.onload = function () {
			scope.onLoadedImage();
		};
		this.currentImagePath = src;
		image.src = window.MEDIA_URL + this.currentImagePath;
	};

	PreloaderThumbs.prototype.getPercent = function () {
		this.currentImage++;
		return  Math.round(100 * (this.currentImage / this.thumbs.length));
	};

	PreloaderThumbs.prototype.onLoadedImage = function () {
		var currentPercent = this.getPercent();
		if (currentPercent === 100) {
			this.callback();
			$('.preloader-align-center').fadeOut();
		} else {
			this.imageLoad();
		}
	};

	PreloaderThumbs.prototype.imageLoad = function () {
		this.setImage(this.thumbs[this.currentImage].thumb);
	};

	PreloaderThumbs.prototype.init = function () {
		this.imageLoad();
	};

	exports.PreloaderThumbs = PreloaderThumbs;
});
