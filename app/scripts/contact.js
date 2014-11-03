define(['jquery', 'exports', 'tweenMax', 'form','async!http://maps.google.com/maps/api/js?v=3&sensor=false'], function ($, exports, TweenMax, form) {
	'use strict';
	var Contact = function () {
		this.blinkMap = null;
		this.blinkLatLng = null;
		this.contact = $('#contact');
		this.contactForm = $('.contact-form');
		this.contactFooter = $('.blink-address');
		this.height = $(window).height();
		this.width = $(window).width();
		this.form = new form.Form('Contato', 'frm-contact');
	};
	Contact.prototype.insert = function () {
		window.location.hash = '!contato';
		this.renderMap();
	};

	Contact.prototype.animSection = function () {
		this.contact.css('z-index', 52);
		TweenMax.to(this.contact, 0.8, {css: {height: this.height + 'px'}, ease: Cubic.easeOut, onCompleteScope: this, onComplete: this.animContactForm});
	};

	Contact.prototype.animContactForm = function () {
		TweenMax.to(this.contactForm, 0.8, {css: { top: 0}, ease: Cubic.easeOut});
		TweenMax.to(this.contactFooter, 0.8, {css: {bottom: 0}, ease: Cubic.easeOut});
		this.form.init();
	};

	Contact.prototype.hideContactForm = function () {
		if ($('.form-feedback').is(':visible')) {
			$('.form-feedback').fadeOut(200, function () {
				$(this).removeClass('fail').removeClass('success');
			});
		}
		TweenMax.to(this.contactForm, 0.8, {css: {top: -400}, ease: Cubic.easeOut });
		TweenMax.to(this.contactFooter, 0.8, {css: {bottom: -150}, ease: Cubic.easeOut, onComplete: this.removeSection, onCompleteScope: this });
	};

	Contact.prototype.remove = function () {
		this.hideContactForm();
		this.form.clearForm();
	};

	Contact.prototype.removeSection = function () {
		var settings = {css: { height: 0 }, ease: Cubic.easeOut};
		TweenMax.to(this.contact, 0.8, settings);
	};

	Contact.prototype.renderMap = function () {
		var image = 'http://d1572339f4f2159d8873-cfdb84911e3caeb584974bffb19d7a4d.r9.cf1.rackcdn.com/pin.png';

		$('#blink-map').width(this.width);
		$('#blink-map').height(this.height);

		var styles = [ {
				stylers: [
					{ saturation: -100 },
					{ lightness: -10 }
				]
			}];
		this.blinkLatLng = new google.maps.LatLng(-19.923805, -43.963731);

		this.blinkMap = new google.maps.Map($('#blink-map')[0], {
			zoom: 17,
			center: this.blinkLatLng,
			disableDefaultUI: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});

		this.blinkMap.setOptions({ styles: styles});

		var blinkMarker = new google.maps.Marker({
			position: this.blinkLatLng,
			map: this.blinkMap,
			icon: image
		});

		google.maps.event.addListener(this.blinkMap, 'idle', $.proxy(this.animSection, this));
	};

	exports.Contact = Contact;
});
