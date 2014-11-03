define(['jquery', 'exports', 'signals', 'tweenMax'], function ($, exports, signals, TweenMax) {
	'use strict';
	var PortfolioMenu = function () {
		this.categories = [];
		this.categoryClicked = new signals.Signal();
	};

	PortfolioMenu.prototype.addEventListeners = function () {
		$('.category').click($.proxy(this.filterCategory, this));
	};

	PortfolioMenu.prototype.filterCategory = function (e) {
		e.preventDefault();

		var $parentNode = $(e.currentTarget).parent();
		if ($parentNode.hasClass('checked')) {
			$parentNode.removeClass('checked');
		} else {
			$parentNode.addClass('checked');
		}

		var category = $(e.currentTarget).data('category');
		if (category === 'all') {
			this.clearCategories();
		}
		else if (!this.isFiltered(category)) {
			this.categories.push(category);
		} else {
			this.removePosition(category);
		}
		this.filterClick(category);
	};

	PortfolioMenu.prototype.removePosition = function (category) {
		var position = $.inArray(category, this.categories);
		if (position >= 0) {
			this.categories.splice(position, 1);
		}
	};

	PortfolioMenu.prototype.isFiltered = function (category) {
		var total = this.categories.length;
		for (var x = 0; x < total; x++) {
			if (this.categories[x] === category) {
				return true;
			}
		}
		return false;
	};

	PortfolioMenu.prototype.clearCategories = function () {
		this.categories = [];
		$('.portfolio-submenu ul li').removeClass('checked');
	};

	PortfolioMenu.prototype.filterClick = function (category) {
		this.categoryClicked.dispatch(category);
	};

	exports.PortfolioMenu = PortfolioMenu;
});
