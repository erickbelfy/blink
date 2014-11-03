define(['jquery', 'exports', 'tweenMax', 'signals'], function ($, exports, TweenMax, signals) {

	'use strict';

	var ProjectDetails = function () {
		this.projectDetails = $('.project-details');
		this.activeSection = null;
		this.height = $(window).height();
		this.width = $(window).width();
		this.imageWidth = 1640;
		this.imageHeight = 1080;
		this.infoBlockHeight = 520;
		this.item = null;
		this.imageLoaded = new signals.Signal();
		this.closeSection = new signals.Signal();
		this.isTransitioning = false;
		this.boxIsShow = false;
		this.onContactClicked = new signals.Signal();
		this.onBudgetClicked = new signals.Signal();
		this.nextProjectClicked = new signals.Signal();
		this.previousProjectClicked = new signals.Signal();
	};

	ProjectDetails.prototype.addEventListeners = function () {
		$('.image-action').click($.proxy(this.showProjectImage, this));
		$('.making-of-action').click($.proxy(this.toggleProject, this));
		$('.close-case-action').click($.proxy(this.closeProject, this));
		$('.up-button').click($.proxy(this.showDetailsInfo, this));
		$('.close-button').click($.proxy(this.hideDetailsInfo, this));
		$('.budget-link').click($.proxy(this.goToBudget, this));
		$('.contact-link-detail').click($.proxy(this.goToContact, this));
		$('.prev-action').click($.proxy(this.previousItem, this));
		$('.next-action').click($.proxy(this.nextItem, this));
		$(window).resize($.proxy(this.fixBoxPosition, this));
	};

	ProjectDetails.prototype.toggleProject = function (e) {
		e.preventDefault();
		var item = $(e.currentTarget);
		if (item.hasClass('image-action-click')) {
			item.removeClass('image-action-click');
			this.showProjectImage(e);
		} else {
			item.addClass('image-action-click');
			this.showMakingOfImage(e);
		}
	};

	ProjectDetails.prototype.goToContact = function (e) {
		var scope = this;
		e.preventDefault();
		this.hideDetailsInfo();
		this.hideMenuDetails();
		setTimeout(function () {
			scope.onContactClicked.dispatch();
		}, 1000);
	};

	ProjectDetails.prototype.goToBudget = function (e) {
		var scope = this;
		e.preventDefault();
		this.hideDetailsInfo();
		this.hideMenuDetails();
		setTimeout(function () {
			scope.onBudgetClicked.dispatch();
		}, 1000);
	};

	ProjectDetails.prototype.loadData = function (_item) {
		this.item = _item;
		this.loadImage();
		this.setProjectDetailsInfo();
	};

	ProjectDetails.prototype.previousItem = function () {
		this.previousProjectClicked.dispatch();
	};

	ProjectDetails.prototype.nextItem = function () {
		this.nextProjectClicked.dispatch();
	};

	ProjectDetails.prototype.loadImage = function () {
		var scope = this;
		var image = new Image();
		image.onload = function () {
			scope.insertImage();
			scope.loadMakingOfImage();
		};
		image.src = window.MEDIA_URL + this.item.image;
	};

	ProjectDetails.prototype.loadMakingOfImage = function () {
		var scope = this;
		var image = new Image();
		image.onload = function () {
			var  $projectImage = scope.projectDetails.find('.making-of');
			$projectImage.css('background', 'fixed #202020 url("' + window.MEDIA_URL + scope.item.makingOfImage + '") center center no-repeat');
			$projectImage.css('height', scope.height);
			scope.imageWidth = image.width;
			scope.imageHeight = image.height;
			$projectImage.css('background-size', 'auto 100%');
			scope.fixBoxPosition();
			scope.resizeImage($projectImage);
		};
		image.src = window.MEDIA_URL + this.item.makingOfImage;
	};

	ProjectDetails.prototype.fixBoxPosition = function () {
		this.width = $(window).width();
		this.height = $(window).height();
		if (!this.boxIsShow) {
			$('.details').css('top', this.height + 8);
		}
		this.resizeImage('.project-image');
		this.resizeImage('.making-of');
	};

	ProjectDetails.prototype.resizeImage = function (block) {
		var $item = $(block);
		if ($item.height() > 0) {
			$item.width(this.width);
			$item.height(this.height);
			if (this.checkImageSize()) {
				if (this.checkBrowserWidthSize()) {
					if (this.checkBrowserHeightSize()) {
						var resizedHeight = Math.round((this.imageHeight * this.width) / this.imageWidth);
						if (this.height > resizedHeight) {
							$item.css('background-size',  'auto 100%');
						}
					} else {
						$item.css('background-size',  'auto 100%');
					}
				} else {
					$item.css('background-size',  'auto 100%');
				}
			} else {
				$item.css('background-size',  'auto 100%');
			}
			$('.details').show();
		}
	};

	ProjectDetails.prototype.checkBrowserHeightSize = function () {
		if (this.imageHeight < this.height) {
			return true;
		} else {
			return false;
		}
	};

	ProjectDetails.prototype.checkBrowserWidthSize = function () {
		if (this.imageWidth > this.width) {
			return true;
		} else {
			return false;
		}
	};

	ProjectDetails.prototype.checkImageSize = function () {
		if (this.imageWidth > this.imageHeight) {
			return true;
		} else {
			return false;
		}
	};

	ProjectDetails.prototype.setProjectDetailsInfo = function () {
		if (this.item.name !== '') {
			$('.up-button').show();
			$('.client-data .info').text(this.item.name);
			$('.agency-data .info').text(this.item.agency);
			$('.photo-data .info').text(this.item.photo);
			$('.treatment-data .info').text(this.item.treatment);
		} else {
			$('.up-button').hide();
		}
	};

	ProjectDetails.prototype.insertImage = function () {
		var  $projectImage = this.projectDetails.find('.project-image');
		$projectImage.css('background-size', 'auto 100%');
		$projectImage.css('background', 'fixed #202020 url("'+ window.MEDIA_URL + this.item.image + '") center center no-repeat');
		if (this.checkImageSize()) {
			$projectImage.css('background-size', '100% auto');
		}
		$projectImage.css('height', this.height);

		this.insert();
	};

	ProjectDetails.prototype.insert = function () {
		TweenMax.to(this.projectDetails, 0.8, {css: {height: this.height + 'px' }, onCompleteScope: this, onComplete: this.insertedSection, ease: Cubic.easeOut});
	};

	ProjectDetails.prototype.insertedSection = function () {
		this.imageLoaded.dispatch();
		$('.modal').fadeOut();
	};

	ProjectDetails.prototype.remove =  function () {
		var settings = {css: {height: 0}, ease: Cubic.easeOut};
		TweenMax.to(this.projectDetails, 0.8, settings);
		$('.details').hide();
	};

	ProjectDetails.prototype.shouldAnim = function () {
		this.isTransitioning = false;
	};

	ProjectDetails.prototype.showProjectImage = function (e) {
		e.preventDefault();
		if (!this.isTransitioning) {
			this.isTransitioning = true;
			this.addActiveImage();
			var $projectImage = this.projectDetails.find('.project-image');
			TweenMax.to($projectImage, 0.8, {css: {height: this.height }, onCompleteScope: this, onComplete: this.shouldAnim, ease: Cubic.easeOut});
		}
	};

	ProjectDetails.prototype.showMakingOfImage = function (e) {
		e.preventDefault();
		if (!this.isTransitioning) {
			this.isTransitioning = true;
			this.addActiveMakingOf();
			var $projectImage = this.projectDetails.find('.project-image');
			TweenMax.to($projectImage, 0.8, {css: {height: 0 }, onCompleteScope: this, onComplete: this.shouldAnim, ease: Cubic.easeOut});
		}
	};

	ProjectDetails.prototype.closeProject = function (e) {
		e.preventDefault();
		this.hideMenuDetails();
		this.hideDetailsInfo();
		this.closeSection.dispatch();
	};

	ProjectDetails.prototype.showMenuDetails = function () {
		var $menuActions = $('.actions');
		TweenMax.to($menuActions, 0.8, {css: {right: 0}, ease: Cubic.easeOut, onCompleteScope: this, onComplete: this.addActiveImage});
	};


	ProjectDetails.prototype.hideMenuDetails = function () {
		var $menuActions = $('.actions');
		TweenMax.to($menuActions, 0.8, {css: {right: -160}, ease: Cubic.easeOut});
		this.clearMenuActive();
	};

	ProjectDetails.prototype.addActiveImage = function () {
		$('.image-tooltip').addClass('active-image-tooltip');
		$('.image-action').addClass('active-image-icon');

		$('.making-of-tooltip').removeClass('active-making-of-tooltip');
		$('.making-of-action').removeClass('active-making-of-icon');
	};

	ProjectDetails.prototype.addActiveMakingOf = function () {
		$(' .making-of-tooltip').addClass('active-making-of-tooltip');
		$('.making-of-action').addClass('active-making-of-icon');

		$('.image-tooltip').removeClass('active-image-tooltip');
		$('.image-action').removeClass('active-image-icon');
	};

	ProjectDetails.prototype.clearMenuActive = function () {
		$('.image-tooltip').removeClass('active-image-tooltip');
		$('.image-action').removeClass('active-image-icon');

		$('.making-of-tooltip').removeClass('active-making-of-tooltip');
		$('.making-of-action').removeClass('active-making-of-icon');
	};

	ProjectDetails.prototype.showDetailsInfo = function () {
		this.boxIsShow = true;
		var $details = $('.details');
		$('.up-button').fadeOut();
		$('.down-button').fadeIn();
		TweenMax.to($details, 0.5, {css: { top: '50%', marginTop: -250}, ease: Cubic.easeInOut});
	};

	ProjectDetails.prototype.hideDetailsInfo = function () {
		if (this.boxIsShow) {
			this.boxIsShow = false;
			var $details = $('.details');
			$('.up-button').fadeIn();
			$('.down-button').fadeOut();
			TweenMax.to($details, 0.5, {css: { top: this.height + 8, marginTop: 0}, ease: Cubic.easeInOut});
		}
	};

	ProjectDetails.prototype.setActiveSectionInstance = function (_activeSection) {
		this.activeSection = _activeSection;
	};

	exports.ProjectDetails = ProjectDetails;

});
