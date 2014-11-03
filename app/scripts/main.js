require.config({

	shim: {
		tweenMax: {
			exports: 'TweenMax'
		},
		scrollbar: ['jquery'],
		inputmask: ['jquery']
	},

	paths: {
		signals : '../components/js-signals/dist/signals',
		async: '../components/requirejs-plugins/src/async',
		jquery: '../components/jquery/jquery',
		scrollbar: '../components/perfect-scrollbar/min/perfect-scrollbar.with-mousewheel.min',
		inputmask: '../components/jquery.inputmask/dist/min/jquery.inputmask',
		tweenMax: '../components/tweenMax/src/uncompressed/TweenMax'
	},
	waitSeconds: 5000
});

require([ 'jquery', 'preloader', 'home', 'menu', 'portfolio', 'portfolioMenu', 'contact', 'slideshow', 'about', 'budget', 'projectDetails', 'data', 'signals' ],
	function ($, preloader, home, menu, portfolio, portfolioMenu, contact, slideshow, about, budget, projectDetails, data, signals) {

	'use strict';


	var imageData = null;
	var preloaderSection = null;
	var slideshowSection = null;
	var homeSection = null;
	var portfolioSection = null;
	var projectDetailsSection = null;
	var portfolioSectionMenu = null;
	var interativeMenu = null;
	var contactSection = null;
	var aboutSection = null;
	var budgetSection = null;
	var activeSection = null;
	
	function getCurrentPage() {
		var currentHash = window.location.hash;
		if (currentHash === '#') {
			return 'home';
		} else {
			if (currentHash.indexOf('#') >= 0) {
				return currentHash.substring(2, currentHash.length);
			} else {
				if (currentHash !== '') {
					return currentHash.substring(1, currentHash.length);
				} else {
					return 'home';
				}
			}
		}
	}

	function init() {
		initCSRFToken();
		var currentPage = getCurrentPage();

		imageData = new data.ImageData();
		homeSection = new home.Home();
		portfolioSection = new portfolio.Portfolio();
		projectDetailsSection = new projectDetails.ProjectDetails();
		portfolioSectionMenu = new portfolioMenu.PortfolioMenu();
		aboutSection = new about.About();
		budgetSection = new budget.Budget();
		contactSection = new contact.Contact();

		var hash = {
			'home' : 'home',
			'portfolio' : 'portfolio',
			'sobre' : 'about',
			'orcamento' : 'budget',
			'contato' : 'contact'
		};

		var sections = {
			home: homeSection,
			portfolio: portfolioSection,
			details : projectDetailsSection,
			about: aboutSection,
			budget: budgetSection,
			contact: contactSection
		};

		$.getJSON('json_images', function (data) {
			portfolioSection.setImageData(data);
			finishInit(sections, currentPage, hash);
		});
	}

	function finishInit(sections, currentPage, hash) {

		activeSection = new data.ActiveSection(sections);
		interativeMenu = new menu.Menu(activeSection);
		slideshowSection = new slideshow.Slideshow(imageData, interativeMenu, activeSection);
		preloaderSection = new preloader.Preloader(slideshowSection, imageData, activeSection);
		portfolioSection.setSlideShowInstance(slideshowSection);
		portfolioSection.setActivSectionInstance(activeSection);
		slideshowSection.setPreloaderInstance(preloaderSection);
		projectDetailsSection.setActiveSectionInstance(projectDetailsSection);
		var menuSection = null;
		if (currentPage !== 'home') {
			if (currentPage === 'portfolio') {
				$('.init-preloader').hide();
			}
			preloaderSection.init(slideshowSection.insert, slideshowSection, true, false, false);
			activeSection.setCurrentSection(hash[currentPage], null);
			menuSection = new menu.Menu(activeSection, true);
			menuSection.init();
		} else {

			menuSection = new menu.Menu(activeSection, true);
			menuSection.init();
			preloaderSection.init(slideshowSection.insert, slideshowSection, true, true);
		}

		aboutSection.onPortfolioCliked.add($.proxy(activeSection.setCurrentSection, activeSection, 'portfolio', null));
		aboutSection.onContactClicked.add($.proxy(activeSection.setCurrentSection, activeSection, 'contact', null));
		portfolioSection.projectDetails.onContactClicked.add($.proxy(activeSection.setCurrentSection, activeSection, 'contact', null));
		portfolioSection.projectDetails.onBudgetClicked.add($.proxy(activeSection.setCurrentSection, activeSection, 'budget', null));
	}


	function csrfSafeMethod(method) {
		return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
	}

	function initCSRFToken() {
		$.ajaxSetup({
			crossDomain: false,
			beforeSend: function (xhr, settings) {
				if (!csrfSafeMethod(settings.type)) {
					xhr.setRequestHeader('X-CSRFToken', $('#frm-contact>input[name=csrfmiddlewaretoken]').val());
				}
			}
		});
	}

	$(init);

});
