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
