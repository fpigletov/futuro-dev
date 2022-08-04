'use strict';

export function homeSlider() {
    const swiper = new Swiper('.home-slider__body', {
		loop: true,
		watchSlidesProgress: true,		
        pagination: {
            el: '.home-slider__dotts',
            type: 'bullets',
            clickable: true
		},
		keyboard: {
            enabled: true,
            onlyInViewport: true
        },
        navigation: {
            nextEl: '.home-slider__arrow_next',
            prevEl: '.home-slider__arrow_prev',
        },
        grabCursor: true,
        spaceBetween: 32,
        parallax: true,
        speed: 800,        
    });
}

export function roomSlider() {
    new Swiper('.slider-rooms__body', {
		observer: true,
		observeParents: true,
		slidesPerView: 'auto',
		spaceBetween: 24,
		speed: 800,
		loop: true,
		watchOverflow: true,
		loopAdditionalSlides: 5,
		preloadImages: false,
        parallax: true,		
        grabCursor: true,
		pagination: {
			el: '.slider-rooms__dotts',
			clickable: true,
		},		
		navigation: {
			nextEl: '.slider-rooms__arrow_next',
			prevEl: '.slider-rooms__arrow_prev',
		}
    });
}

export function tipsSlider() {
    new Swiper('.slider-tips__body', {
        grabCursor: true,
		observer: true,
		observeParents: true,
		slidesPerView: 3,
		spaceBetween: 32,
		speed: 800,
		loop: true,
		watchOverflow: true,		
		navigation: {
			nextEl: '.slider-tips__arrow_next',
			prevEl: '.slider-tips__arrow_prev',
		},
		breakpoints: {
			// when window width is >= 320px
			320: {
				slidesPerView: 1.1,
				spaceBetween: 15
			},
			// when window width is >= 768px
			768: {
				slidesPerView: 2,
				spaceBetween: 20
			},
			// when window width is >= 992px
			992: {
				slidesPerView: 3,
				spaceBetween: 32
			}
		}
	});
}

export function productSlider() {
	

	let sliderProductSlides = new Swiper(".slider-product__subslider", {
		loop: false,
		spaceBetween: 10,
		slidesPerView: 4,
		freeMode: true,
		
		watchSlidesProgress: true,
	});
	
	let sliderProduct = new Swiper(".slider-product__mainslider", {
		loop: true,
		spaceBetween: 10,
		effect: 'fade',
		zoom: {
			maxRatio: 3,
		},
		thumbs: {
			swiper: sliderProductSlides,
		},
	});        
    
}