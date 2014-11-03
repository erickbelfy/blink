define(['jquery', 'exports', 'tweenMax', 'portfolioGrid', 'projectDetails', 'portfolioMenu'],
		function ($, exports, TweenMax, portfolioGrid, projectDetails, portfolioMenu) {

	'use strict';

	var Portfolio = function () {
		this.slideshow = null;
		this.portDom = $('#portfolio');
		this.height = $(window).height();
		this.width = $(window).width();
		this.activeSection = null;
		this.portfolioMenu = new portfolioMenu.PortfolioMenu();
		this.projectDetails = new projectDetails.ProjectDetails();
		this.portfolioMenu.addEventListeners();
		this.isProjectDetails = false;
		this.currentItem = null;
		this.isInserted = false;

	};

	Portfolio.prototype.insert = function () {
		var scope = this;
		window.location.hash = '!portfolio';
		this.height = $(window).height();
		this.width = $(window).width();
		this.portfolioMenu.categoryClicked.add($.proxy(this.onHideElements, this));
		$(window).resize($.proxy(scope.portfolioGridSection.resizeThumbContainer, scope.portfolioGridSection, scope.isProjectDetails));
		this.slideshow.remove();

		if (!this.isInserted) {

			this.projectDetails.addEventListeners();
			this.projectDetails.imageLoaded.add($.proxy(this.onDetailImageLoaded, this));
			this.projectDetails.closeSection.add($.proxy(this.onCloseProject, this));
			this.projectDetails.nextProjectClicked.add($.proxy(this.onNextProjectClicked, this));
			this.projectDetails.previousProjectClicked.add($.proxy(this.onPreviousProjectClicked, this));
			this.portfolioGridSection.insert();
			this.portfolioGridSection.addEventListeners();
			this.portfolioGridSection.itemClicked.add($.proxy(this.onGridItemClicked, this));
			TweenMax.to(this.portDom, 5.8, {css: {height: this.height + 'px', zIndex:2}, ease: Cubic.easeOut, onCompleteScope: this, onComplete: this.onInserted});
		} else {
			$('.init-preloader').show();
			TweenMax.to(this.portDom, 5.8, {css: {height: this.height + 'px', zIndex:2}, ease: Cubic.easeOut, onCompleteScope: this.portfolioGridSection, onComplete: this.portfolioGridSection.startAnim});
		}
		this.isInserted = true;
	};

	Portfolio.prototype.onInserted = function () {
		this.portfolioGridSection.preloadAnim();
	};

	Portfolio.prototype.onDetailImageLoaded = function () {
		this.insertDetail();
	};

	Portfolio.prototype.onCloseProject = function () {
		var scope = this;
		this.portfolioGridSection.isProjectDetails = false;
		this.portfolioGridSection.startAnim();
		setTimeout(function () {
			scope.projectDetails.remove();
		}, 1000);
	};

	Portfolio.prototype.onHideElements = function (category) {
		this.portfolioGridSection.toggleElements(category, this.portfolioMenu.categories);
	};

	Portfolio.prototype.onGridItemClicked = function (itemId) {
		this.currentItem = itemId;
		if (this.portfolioGridSection.items[this.currentItem] !== undefined) {
			this.resetCurrentData();
			this.portfolioGridSection.isDetailsPage = true;
			this.projectDetails.loadData(this.portfolioGridSection.items[this.currentItem]);
		} else {
			$('.modal').fadeOut();
		}
	};

	Portfolio.prototype.resetCurrentData = function () {
		if (this.currentItem < 0) {
			this.currentItem = 0;
		}
	};

	Portfolio.prototype.onNextProjectClicked = function () {
		this.currentItem++;
		$('.modal').css('opacity', '1');
		$('.modal').fadeIn(500, $.proxy(this.onGridItemClicked, this, this.currentItem));
	};

	Portfolio.prototype.onPreviousProjectClicked = function () {
		this.currentItem--;
		$('.modal').css('opacity', '1');
		$('.modal').fadeIn(500, $.proxy(this.onGridItemClicked, this, this.currentItem));
	};

	Portfolio.prototype.remove = function () {
		this.removeDetail();
		this.removeGrid();
		console.log('Portfolio.remove');
		this.slideshow.isActive = false;
		this.slideshow.insert(null);
		this.portfolioMenu.clearCategories();
		this.portfolioGridSection.showElements('all', []);
		$('.init-preloader').hide();
	};

	Portfolio.prototype.removeSection = function () {
		var settings = {css: {height: 0}, ease: Cubic.easeOut};
		settings.onComplete = function () {
			$('.init-preloader').hide();
			$('.list-images').css('height', 0);
			$('.list-images').html('');
			$('.preloader-align-center').show();
		};
		TweenMax.to(this.portDom, 0.8, settings);
	};

	Portfolio.prototype.removeGrid = function () {
		this.portfolioGridSection.removeAnim();
	};

	Portfolio.prototype.insertDetail = function () {
		this.removeGrid(null, null, null);
		this.projectDetails.showMenuDetails();
		setTimeout(function () {
				$('.list-images').css('display', 'none');
				$('#portfolio').css('display', 'none');
			}, 800
		);
	};

	Portfolio.prototype.removeDetail = function () {
		this.projectDetails.remove();
	};

	Portfolio.prototype.setSlideShowInstance = function (_slideshow) {
		this.slideshow = _slideshow;
	};

	Portfolio.prototype.setActivSectionInstance = function (_activeSection) {
		this.activeSection = _activeSection;
	};

	Portfolio.prototype.setImageData = function (data) {
		this.imageData = data;
		this.portfolioGridSection = new portfolioGrid.PortfolioGrid(this.activeSection, this.imageData);
	};

	exports.Portfolio = Portfolio;

});
