define([
		'exports'
], function(exports){
	var Preloader = function(_slideshow, _data, _activeSection){
		this.callback = null;
		this.callbackScope = null;
		this.currentImage = 0;
		this.currentImagePath = '';
		this.imageData = _data;
		this.slideshow = _slideshow;
		this.initMenu = null;
		this.activeSection = _activeSection;
	};
	
	Preloader.prototype.setImage = function(src){
		var scope = this;
		var image = new Image();
		image.onload = function(){
			scope.onLoadedImage();
		};
		this.currentImagePath = this.formatSrc(src);
		image.src = this.currentImagePath; 
	};

	Preloader.prototype.formatSrc = function(src){
		return this.imageData.imagePath+'/'+this.imageData.size+'-'+src;
	};

	Preloader.prototype.getPercent = function(){
		this.currentImage++;
		return  Math.round(100 *(this.currentImage/this.imageData.images.length));
	};

	Preloader.prototype.onLoadedImage = function(){
		this.imageData.setImageLoaded(this.currentImage);
		if(this.currentImage === 0){
			if (this.callback !== null) {
				this.callback.apply(this.callbackScope,[this.currentImagePath,this.initMenu]);
				this.slideshow.nextSlide();
			}
		}else{
			this.slideshow.append(this.currentImagePath);
		}
		var currentPercent = this.getPercent();
		if(this.currentImage < this.imageData.images.length){
			this.imageLoad();
		}
	};

	Preloader.prototype.imageLoad = function(){
		this.setImage(this.imageData.images[this.currentImage]);
	};

	Preloader.prototype.init = function(callback,scope,_initMenu){
		this.currentImage = 0;
		this.initMenu = _initMenu;
		this.callback = callback;
		this.callbackScope = scope;
		this.imageLoad();
	};

	exports.Preloader = Preloader; 
});
