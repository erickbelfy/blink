define(['jquery', 'exports', 'preloaderThumbs', 'signals', 'tweenMax', '../components/mout/src/array/shuffle'], function ($, exports, preloaderThumbs, signals, TweenMax, shuffle) {

	'use strict';

	var BLOCK = '<div data-id="${item.id}" class="portfolio-images portfolio-hover flip-transitions ${item.originFlip} ${item.category}">';
	BLOCK += '<div class="disabled-category"></div>';
	BLOCK += '<div class="project-description">';
	BLOCK += '<span class="zoom-defaults zoom"></span>';
	BLOCK += '<span class="zoom-defaults zoom-plus"></span>';
	BLOCK += '</div>';
	BLOCK += '<img src="' + window.MEDIA_URL + '/${item.thumb}" class="image-transition"  />';
	BLOCK += '</div>';

	var PortfolioGrid = function (_activeSection, imageData) {
		this.imageData = imageData;
		this.preloaderThumbsSection = null;
		this.originFlip = ['origin-top', 'origin-bottom', 'origin-left', 'origin-right'];
		this.categories = ['publicidade', 'moda', 'produto', 'veiculos'];
		this.items = [];
		this.headerAnimated = false;
		this.width = $(window).width();
		this.height = $(window).height();
		this.projectDetails = $('.project-details');
		this.thumbSize = 158;
		this.thumbContainerWidth = 0;
		this.isResizing = false;
		this.isReAnimating = false;
		this.isDetailsPage = false;
		this.activeSection = _activeSection;
		this.itemClicked = new signals.Signal();
		this.isAnimating = false;
		this.isItemClicked = false;
	};

	PortfolioGrid.prototype.addEventListeners = function () {
		$('.portfolio-images').click($.proxy(this.onItemClick, this));
		$(window).resize($.proxy(this.windowResize, this));
	};
	PortfolioGrid.prototype.windowResize = function () {
		this.height = $(window).height();
		this.projectDetails.height(this.height);
	};

	PortfolioGrid.prototype.checkListSize = function () {
		var totalThumb = Math.round(this.width / 160);
		if (totalThumb < 12) {
			totalThumb++;
		}
		this.thumbContainerWidth = totalThumb * 160;
	};

	PortfolioGrid.prototype.fillItems = function () {
		var item = {};
		var replacedBlock = null;
		var index = 0;
		var itemData = shuffle(this.imageData);
		var extraItems = [];
		this.checkListSize();
		if (this.items.length <= 0) {
			for (var x = 0; x < itemData.length; x++) {
				index = x >= itemData.length ? x - itemData.length : x;
				try {
					item = this.createItem(itemData[index]);
					this.items.push(item);
					replacedBlock = this.createReplacedBlock(item, x);
					extraItems.push(replacedBlock);
					$('.list-images').append(replacedBlock);
				} catch (e) {}
			}
			for (var i in extraItems) {
				var $extraItem = $(extraItems[i]);
				$extraItem.addClass('extra-item').css('display','none');
				$('.list-images').append($extraItem);
			}
		}
	};

	PortfolioGrid.prototype.createItem = function (data) {
		return {
			thumb : data.fields.thumbnailImage,
			agency : data.fields.agency,
			name : data.fields.client,
			photo : '',
			treatment : '',
			category: data.fields.category,
			image: data.fields.imageProject,
			makingOfImage : data.fields.makingofImage,
			originFlip: this.originFlip[this.randomValue(0, 3)]
		};
	};

	PortfolioGrid.prototype.createReplacedBlock = function (item, id) {
		return BLOCK.split('${item.id}').join(id)
			.split('${item.category}').join(item.category)
			.split('${item.originFlip}').join(item.originFlip)
			.split('${item.client}').join(item.agency)
			.split('${item.name}').join(item.name)
			.split('${item.thumb}').join(item.thumb);
	};

	PortfolioGrid.prototype.toggleElements = function (category, categories) {
		if (categories.length === 1) {
			this.hideElements(categories[0]);
		} else {
			this.showElements(category, categories);
		}
	};

	PortfolioGrid.prototype.hideElements = function (category) {
		if (!this.isAnimating) {
			this.isAnimating = true;
			var $categories = $(':not(.portfolio-images.' + category + ')');
			$categories.each(function () {
				var randomValue = Math.random() * 0.5;
				if ($(this).hasClass('portfolio-hover')) {
					$(this).removeClass('portfolio-hover');
					var $blockChild = $(this).find('.disabled-category');
					TweenMax.to($blockChild, 0.8, {css: { opacity: 1}, delay: randomValue, ease: Cubic.easeInOut});
					$(this).unbind('click');
				}
			});
			this.isAnimating = false;
		}
	};

	PortfolioGrid.prototype.showElements = function (category, categories) {
		if (!this.isAnimating) {
			this.isAnimating = true;
			var currentElement = (category === 'all' || categories.length === 0) ? '' : '.' + category;
			var $categories = $('.portfolio-images' + currentElement);
			$('.portfolio-images' + currentElement).click($.proxy(this.onItemClick, this));
			$categories.each(function (index) {
				var randomValue = Math.random() * 0.5;
				if (!$(this).hasClass('portfolio-hover')) {
					$(this).addClass('portfolio-hover');
					var $blockChild = $(this).find('.disabled-category');
					TweenMax.to($blockChild, 0.8, {css: {opacity: 0}, delay: randomValue, ease: Cubic.easeInOut});
				}
			});
			this.isAnimating = false;
		}
	};

	PortfolioGrid.prototype.onItemClick = function (e) {
		if (!this.isItemClicked) {
			var scope = this;
			this.isItemClicked = true;
			var $item = $(e.currentTarget);
			var itemId = $item.data('id');
			$('.modal').css('opacity', '0.8');
			$('.modal').fadeIn(500, function () { scope.isItemClicked = false; });
			this.itemClicked.dispatch(itemId);
		}
	};

	PortfolioGrid.prototype.fixHeaderPosition = function () {
		$('.portfolio-header').width(this.width);
		$('.portfolio-box').width(this.width - 160);
	};

	PortfolioGrid.prototype.resizeThumbContainer = function () {
		if (!this.isDetailsPage) {
			this.width = $(window).width();
			this.height = $(window).height();
			if (this.activeSection.currentSection === 'portfolio') {
				this.checkListSize();
				this.setThumbContainerDimensions();
				this.fixHeaderPosition();
			}
		}
	};

	PortfolioGrid.prototype.preloadAnim = function () {
		this.preloaderThumbsSection = new preloaderThumbs.PreloaderThumbs(this.items, $.proxy(this.startAnim, this));
		this.preloaderThumbsSection.init();
	};

	PortfolioGrid.prototype.startAnim = function () {
		var scope = this;
		$('#portfolio').css('display', 'block');
		$('.list-images').css('display', 'block');
		var $imageTransition = $('.image-transition:not(.final-image-transition)');
		var totalItems = $imageTransition.length;
		this.fixHeaderPosition();
		$imageTransition.each(function (index) {
			var $currentItem = $(this);
			var randomValue = Math.random() * 500;
			setTimeout(function () {
				$currentItem.addClass('final-image-transition');
				$currentItem.parent().addClass('show-image');
				scope.headerAnim(index, totalItems);
			}, randomValue);
		});

		$('.init-preloader').hide();
		$('.portfolio').css('overflow-y', 'auto');
	};

	PortfolioGrid.prototype.removeAnim = function () {
		this.isHeaderAnimated = false;
		var totalImages = $('.final-image-transition').length - 1;
		$('.portfolio-box').removeClass('header-transition-out');
		$('.portfolio-submenu').removeClass('header-transition-out');
		$('.final-image-transition').each(function (index) {
			var $currentItem = $(this);
			var randomValue = Math.random() * 500;
			setTimeout(function () {
				$currentItem.removeClass('final-image-transition');
				$currentItem.parent().removeClass('show-image');
			}, randomValue);
			$('.portfolio').css('overflow-y', 'hidden');
		});
	};

	PortfolioGrid.prototype.headerAnim = function (index, total) {
		if (index >= (total - 1) && !this.isHeaderAnimated) {
			$('.portfolio-box').addClass('header-transition-out');
			$('.portfolio-submenu').addClass('header-transition-out');
			this.isHeaderAnimated = true;
		}
	};
	PortfolioGrid.prototype.setThumbContainerDimensions = function () {
		$('.portfolio').css('height', this.height);
		var $listImages = $('.portfolio .list-images');
		$listImages.width(this.thumbContainerWidth);
		$listImages.height(this.height);
		this.fixLastRow($listImages);
	};

	PortfolioGrid.prototype.fixLastRow = function (listImages) {
		var extraItems = listImages.find('.extra-item');
		var elem = extraItems.first().prev();
		$.each(extraItems, function(index, item) {
			$(item).css('display', 'none');
		});
		while (elem) {
			elem.css('display', 'block');
			if (elem.offset().left <= 0) {
				break;
			}
			elem = elem.next();
			console.log(elem);
		}
	};

	PortfolioGrid.prototype.getThumbContainerWidth = function () {
		var totalThumbsY  = this.getTotalColumns();
		return  totalThumbsY  * (this.thumbSize + 2);
	};

	PortfolioGrid.prototype.getTotalThumbs = function () {
		var totalThumbsY = this.getTotalColumns();
		var totalThumbsX = this.getTotalLines();
		return (totalThumbsY * totalThumbsX);
	};

	PortfolioGrid.prototype.randomValue = function (min, max) {
		return min + Math.floor(Math.random() * (max - min + 1));
	};

	PortfolioGrid.prototype.getTotalColumns = function () {
		return Math.ceil(this.width / this.thumbSize) + 1;
	};

	PortfolioGrid.prototype.getTotalLines = function () {
		return Math.ceil(this.height / this.thumbSize) + 1;
	};

	PortfolioGrid.prototype.insert = function () {
		this.isItemClicked = false;
		this.fillItems();
		this.setThumbContainerDimensions();
	};

	exports.PortfolioGrid = PortfolioGrid;
});
