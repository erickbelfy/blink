define(['jquery', 'exports', 'tweenMax', 'data'],
		function ($, exports, TweenMax, data) {

	'use strict';

	var Slideshow = function (_data, _menu, _activeSection) {
		this.slideshow = $('.slideshow');
		this.preloader = null;
		this.menu = _menu;
		this.actualSlideIndex = 0;
		this.transitionTimeout = 8000;
		this.left = $(window).width();
		this.height = $(window).height();
		this.imageHeight = 1080;
		this.imageWidth = 1920;
		this.imageData = _data;
		this.isActive = false;
		this.isResizing = false;
		this.slideInterval = false;
		this.showMenu = false;
		this.activeSection = _activeSection;
	};

	Slideshow.prototype.setPreloaderInstance = function (_preloader) {
		this.preloader = _preloader;
	};

	Slideshow.prototype.insert = function (imagePath, startMenu) {
		var scope = this;

		if (imagePath !== null) {
			this.insertItem(imagePath);
		}
		if (this.activeSection.currentSection !== 'portfolio') {
			if (!this.isActive) {
				this.isActive = true;
				this.resizeSlideshow();
				TweenMax.to(this.slideshow, 0.8, {css: {height: this.height + 'px'}, ease: Cubic.easeOut, onCompleteScope: this, onComplete: function () {
					this.isResizing = true;
					if (imagePath !== null) {
						if (startMenu) {
							if (this.showMenu) {
								scope.menu.init();
							}
						}
					}
					$('.preloader').hide();
				}});
			}
		}
	};
	Slideshow.prototype.remove = function () {
		var settings = {css: { height: 0}, ease: Cubic.easeOut};
		if (this.isActive) {
			TweenMax.to(this.slideshow, 0.8, settings);
			this.isActive = false;
		}
	};

	Slideshow.prototype.insertItem = function (imagePath) {
		var $item = $(data.slideshowItem);
		$item.css({
				background : "url('"+imagePath+"') center center no-repeat",
				backgroundAttachment: 'fixed'
			});
		this.slideshow.append($item);
		this.resizeSlideshow();
	};

	Slideshow.prototype.append = function (imagePath) {
		var $slideshow = $('.slideshow');
		var $item = $(data.slideshowItem);
		$item.css({
			width: '0px',
			left: this.left + 'px',
			background : "url('" + imagePath + "') center center no-repeat",
			backgroundAttachment : 'fixed'
		});
		$slideshow.append($item);
		this.resizeSlideshow();
		if (this.hasToChange) {
			this.hasToChange = false;
			this.changeSlide();
		}

		$(window).resize($.proxy(this.resizeSlideshow, this));
	};

	Slideshow.prototype.nextSlide = function () {
		var scope = this;

		if (this.slideInterval) {
			clearInterval(this.slideInterval);
		}
		this.slideInterval =  setTimeout(function () {
			scope.updateActualSlide();
			if (scope.imageData.loadedImages[scope.actualSlideIndex]) {
				scope.changeSlide();
			} else {
				scope.hasToChange = true;
			}
		}, this.transitionTimeout);
	};

	Slideshow.prototype.updateActualSlide = function () {
		this.actualSlideIndex++;
		if (this.actualSlideIndex >= this.imageData.images.length) {
			this.actualSlideIndex = 0;
		}
	};

	Slideshow.prototype.changeSlide = function () {
		var $item = $($('.slideshow-item')[this.actualSlideIndex]);
		this.fixZIndexOrder();
		$item.css('left', this.left);
		$item.css('width', 0);
		$item.css('z-index', 50);
		TweenMax.to($item, 0.8, {css: {width: this.left + 'px', left: 0}, ease: Cubic.easeOut, onComplete: $.proxy(this.nextSlide, this)});
	};

	Slideshow.prototype.fixZIndexOrder = function () {
		var zIndex = 0;
		var zIndexCount = this.actualSlideIndex + 1;
		while (zIndexCount !== this.actualSlideIndex) {
			zIndex++;
			zIndexCount++;
			if (zIndexCount >= this.imageData.images.length) {
				zIndexCount = 0;
			}
			$($('.slideshow-item')[zIndexCount]).css('z-index', zIndex);
		}
	};

	Slideshow.prototype.resizeSlideshow = function () {
		console.log('Slideshow.resizeSlideshow');
		if (this.isActive) {
			this.width = $(window).width();
			this.height = $(window).height();
			this.left = this.width;
			var $items = $('.slideshow-item');
			if (this.isResizing) {
				var $slideshow = $('.slideshow');
				$slideshow.height(this.height);
			}
			$($items).width(this.width);
			$($items).height(this.height);
			$($items).css('background-size',  '100% auto');
			var resizedHeight = Math.round((this.imageHeight * this.width) / this.imageWidth);
			if (this.height > resizedHeight) {
				$($items).css('background-size',  'auto 100%');
			}
		}
	};

	exports.Slideshow = Slideshow;
});
