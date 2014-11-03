define(['jquery', 'exports', 'tweenMax', 'form'], function ($, exports, TweenMax, form) {
	'use strict';
	var Budget = function () {
		this.budgetSection = $('#budget');
		this.height = $(window).height();
		this.form = new form.Form('Orçamento', 'frm-budget');
	};

	Budget.prototype.insert = function () {
		window.location.hash = '!orcamento';
		TweenMax.to(this.budgetSection, 0.2, { css: {height: this.height + 'px'}, ease: Cubic.easeInOut, onCompleteScope: this, onComplete: this.formAnim});
	};

	Budget.prototype.formAnim = function () {
		this.form.init();
		var $form = $('.budget-form');
		TweenMax.to($form, 0.8, {css: {top: 0}, ease: Cubic.easeInOut});
	};

	Budget.prototype.hideAnim = function () {
		var $form = $('.budget-form');
		TweenMax.to($form, 0.6, {css: {top: -450}, ease: Cubic.easeInOut});
	};

	Budget.prototype.remove = function () {
		this.hideAnim();
		this.removeSection();
		this.form.clearForm();
	};
	
	Budget.prototype.removeSection = function () {
		var settings = {css: { height: 0 }, ease: Cubic.easeOut};
		TweenMax.to(this.budgetSection, 0.8, settings);
	};

	exports.Budget = Budget;
});
