'use strict';

import { productsLogic } from './components/products'; 
import { slideUp } from './components/modules'; 
import { modal } from './components/modals'; 
import { openProductModal } from './components/modals'; 
import { openBlogModal } from './components/modals'; 
import { slideToggle } from './components/modules';
import { homeSlider } from './components/sliders'; 
import { roomSlider } from './components/sliders'; 
import { uploadFromDB } from './components/upload'; 
import { searchLogic } from './components/search'; 

window.addEventListener('DOMContentLoaded', () => {
    
    //Header
    const headerMenu = document.querySelector('.menu-header__body');
    const header = document.querySelector('.header');
    const burgerBtn = document.querySelector('.actions-header__burger');
    const searchBtn = document.querySelector('.actions-header__search');
    const headerSearch = document.querySelector('.header__search');
    const headerMenuItems = document.querySelectorAll('[data-header-item]');
    const headerBtns = document.querySelectorAll('.menu-header__btn');
    const favoriteBtn = document.querySelector('.favorite-header__btn');
    const headerCart = document.querySelector('.actions-header__cart');
    const userBtn = document.querySelector('.actions-header__user');
    const headerIcons = document.querySelector('.menu-header__icons');
    const resultsBody = document.querySelector('.search-header__results');

    burgerBtn.addEventListener('click', () => {
        headerMenu.classList.toggle('active');
        burgerBtn.classList.toggle('active');
        headerBtns.forEach(item => {
            if (item.classList.contains('active')) {
                item.classList.remove('active');
                slideUp(item.nextSibling);
            }
        });

        let ariaLabel = burgerBtn.getAttribute('aria-label');
        if (ariaLabel === 'Open menu') {
            burgerBtn.setAttribute('aria-label', 'Close menu');
        } else {
            burgerBtn.setAttribute('aria-label', 'Open menu');
        }
    });

    //Search
    searchBtn.addEventListener('click', () => {
        headerSearch.classList.toggle('active');
        searchBtn.classList.toggle('active');

        let ariaLabel = searchBtn.getAttribute('aria-label');
        if (ariaLabel === 'Open search block') {
            searchBtn.setAttribute('aria-label', 'Close search block');            
        } else {
            searchBtn.setAttribute('aria-label', 'Open search block');            
        }
    });

    searchLogic();

    window.addEventListener('keydown', (e) => {
        if (e.code === 'Escape') {
            if (headerSearch.classList.contains('active')) {
                headerSearch.classList.remove('active');
                searchBtn.classList.remove('active');
            }

            headerBtns.forEach(item => {
                if (item.classList.contains('active')) {
                    item.classList.remove('active');
                }
            });

            if (resultsBody.style.display === 'block') {
                resultsBody.innerHTML = '';
                resultsBody.style.display = '';
            }
            
        }
    });

    //Header 
    function activeHeader() {
        if (window.scrollY > 0) {
			header.classList.add('active');
		} else {
			header.classList.remove('active');
		}		
    }

    window.addEventListener('scroll', () => {
        activeHeader();

        if (headerSearch.classList.contains('active')) {
            headerSearch.classList.remove('active');
        }
    });

    function dinamicAdaptiv() {
        const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth);
        if (viewportWidth <= 480) {            
            headerIcons.append(favoriteBtn, userBtn);
        } else {
            searchBtn.after(favoriteBtn);
            headerCart.after(userBtn);
        }
    }

    window.addEventListener('resize', dinamicAdaptiv);
    

    //Preloader
    window.addEventListener('load', () => {
        setTimeout(() => {
            const preloader = document.querySelector('.preloader');
            if (!preloader.classList.contains('done')) {
                preloader.classList.add('done');
            }
        }, 2000);

        activeHeader();

        dinamicAdaptiv();
    });

    //Subitems
    const headerLinksActions = () => {
        headerBtns.forEach(item => {        
            item.addEventListener('click', (e) => {
                e.preventDefault();
                headerBtns.forEach(el => { 
                    if (el !== e.currentTarget) {
                        el.classList.remove('active');
                    }                        
                });
                
                item.classList.toggle('active');  
            });
        });

        document.addEventListener('click', (e) => {
            const target = e.target;
            if (!target.closest('.menu-header__item')) {
                headerBtns.forEach(item => {
                    item.classList.remove('active');
                });
            }                
        });
    };

    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth);

        if (viewportWidth <= 768) {
            headerBtns.forEach(item => { 
                item.addEventListener('click', (e) => {
                    e.preventDefault();  
                    const target = e.currentTarget;
                    headerBtns.forEach(el => {
                        if (el !== target) {
                            slideUp(el.nextElementSibling); 
                            el.classList.remove('active');
                        }
                        slideToggle(target.nextElementSibling);
                    });

                    item.classList.toggle('active');  
                });
            });
        } else {           
            headerLinksActions();
        }
        
    } else {
        headerMenuItems.forEach(item => {        
            item.addEventListener('mouseover', (e) => {
                e.preventDefault();
                item.classList.add('active');
            });

            item.addEventListener('mouseout', (e) => {
                e.preventDefault();
                item.classList.remove('active');
            });
        });

        headerLinksActions();
    }

    //Home Slider
    homeSlider();

    //Rooms Slider
    roomSlider();

    //Product Modal
    modal('show-product', '.modal__product');

    //Blog Modal
    modal('open-blog', '.modal__blog');
    
    // Login Modal    
    modal('account-link', '.modal__login');

    //Furniture Modal
    modal('furniture__item', '.modal__image', '.furniture__item');

    //Checkout Modal 
    modal('checkout-link', '.modal__checkout');

    //Favorite Modal   
    modal('favorites-link', '.modal__favorite');
    
    

    //Smooth Scroll     
    const products = document.querySelector('.products');
    const rooms = document.querySelector('.rooms');
    const furniture = document.querySelector('.furniture');
    

    function scrollTo(element) {
        const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth);
        let elementTopOffset = 0;

        if (viewportWidth > 480) {
            elementTopOffset = element.offsetTop - 120;
        } else {
            elementTopOffset = element.offsetTop - 65;
        }

        window.scroll({
            left: 0,
            top: elementTopOffset,
            behavior: 'smooth'
        });
    }

    function removeClasses() {
        if (headerMenu.classList.contains('active')) {
            headerMenu.classList.remove('active');        
        }

        if (burgerBtn.classList.contains('active')) {
            burgerBtn.classList.remove('active');       
        }
    }

    function linksLogic() {

        removeClasses();

        headerBtns.forEach(item => {
            if (item.classList.contains('active')) {
                item.classList.remove('active');
                slideUp(item.nextSibling);
            }
        });

        headerBtns.forEach(item => {
            if (item.classList.contains('active')) {
                item.classList.remove('active');
            }
        });
    }

    document.addEventListener('click', (e) => {
        const target = e.target;   
        
        if (target.classList.contains('product-link')) {            
            e.preventDefault();
            linksLogic();
            scrollTo(products);
            document.querySelector('.actions-product__add').focus();
        }

        if (target.classList.contains('rooms-link')) {
            e.preventDefault();
            linksLogic();
            scrollTo(rooms);
            document.querySelector('.slide-rooms__content').focus();
        }

        if (target.classList.contains('furniture-link')) {
            e.preventDefault();
            linksLogic();
            scrollTo(furniture);
            document.querySelector('.furniture__item').focus();
        }

        if (target.classList.contains('favorite-header__btn') || target.classList.contains('actions-header__user') ) {
            e.preventDefault();
            removeClasses();
        }

        //Open Modal Product
        if (target.classList.contains('show-product')) {             
            const productId = target.dataset.btnId;
            openProductModal(productId);
        }

        //Open Modal Blog
        if (target.classList.contains('slider-tips__img') || target.classList.contains('slider-tips__title') || target.classList.contains('slider-tips__image')) { 
            const productId = target.closest('.slider-tips__slide').dataset.tipsId;
            openBlogModal(productId);
        }

        //Search Results
        if (target.classList.contains('search-results__link')) { 
            resultsBody.innerHTML = '';
            resultsBody.style.display = '';
        }


    });

    //Add To Cart
    productsLogic();

    //Upload from DB
    uploadFromDB();

    // Checkout Select
    const select = document.querySelector('.form-modal__select');
    const choices = new Choices(select, {
        shouldSort: false,
        position: 'bottom',
        searchEnabled: false,
    });
});


