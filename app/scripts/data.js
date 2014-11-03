define(['jquery' ,'exports', 'signals'], function($, exports, signals){
	'use strict';
	var ImageData = function () {
		this.imagePath = window.STATIC_URL;
		this.images  = ['bg-photo1.jpg', 'bg-photo2.jpg', 'bg-photo3.jpg', 'bg-photo4.jpg'];
		this.loadedImages = [];
		this.setResolution();
		this.setImageFolder();
		this.initLoadControl();
	};
	ImageData.prototype.initLoadControl = function () {
		for (var i = 0; i < this.images.length; i++) {
			this.loadedImages[i] = false;
		}
	};
	ImageData.prototype.setImageLoaded = function (index) {
		this.loadedImages[index] = true;
	};

	ImageData.prototype.setResolution = function () {
		this.resolution = $(window).width();
	};

	ImageData.prototype.setImageFolder = function () {
		this.size  = this.displaySize();
	};

	ImageData.prototype.displaySize  = function () {
		return 'large';
	};

	exports.slideshowItem = '<div class="slideshow-item"></div>';

	exports.ImageData = ImageData;
	
	var ActiveSection = function (sections) {
		this.sectionClosed = new signals.Signal();
		this.sectionOpened = new signals.Signal();
		this.sections = sections;
		this.currentSection = null;
		this.closingSection = null;
	};
	ActiveSection.prototype.setCurrentSection = function (section) {
		var scope = this;
		this.currentSection = section;
		console.log(this.currentSection);
		if (this.closingSection !== this.currentSection) {
			if (this.closingSection !== null) {
				this.sections[this.closingSection].remove();
				setTimeout(function () {
					scope.sections[scope.currentSection].insert();
				}, 1000);
			} else {
				this.sections[this.currentSection].insert();
			}
		}
		this.closingSection = this.currentSection;
	};

	exports.ActiveSection = ActiveSection;
});
