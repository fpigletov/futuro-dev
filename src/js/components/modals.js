'use strict';

//Modals 
export function modal(triggerElement, contentSelector, triggerSelector) {
    const modal = document.querySelector('.modal');
    const header = document.querySelector('.header');
    const modalCloseBtn = modal.querySelector('.modal__close');
    const modalbody = modal.querySelector('.modal__body');
    const modalContent = modalbody.querySelector(contentSelector);    
    const trigger = document.querySelectorAll(triggerSelector);
    const wrapper = document.querySelector('.wrapper');         
    const scrollWidth = window.innerWidth - wrapper.offsetWidth + 'px';   
    const modalImage = modal.querySelector('.modal__image img'); 
    let lastFocusedEl;

    const openModal = () => {
        modal.classList.add('active');
        modalContent.classList.add('active');
        modalContent.scrollTop = 0;            
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = scrollWidth;            
        header.style.paddingRight = scrollWidth;

        lastFocusedEl = document.activeElement;
        
        Array.from(document.body.children).forEach(item => {
            if (item !== modal) {
                item.inert = true;
            }
        });        
    };

    const closeModal = () => {            
        modalbody.style.padding = '';            
        modal.classList.remove('active');
        modalContent.scrollTop = 0;
        modalContent.classList.remove('active');            
        document.body.style.overflow = '';   
        document.body.style.paddingRight = 0;
        header.style.paddingRight = 0;
        
        Array.from(document.body.children).forEach(item => {
            if (item !== modal) {
                item.inert = false;
            }
        });      
    };

    if (triggerElement === 'furniture__item') {

        trigger.forEach(item => {
            item.addEventListener('click', (e) => {                
                if (e.target) {
                    e.preventDefault();                    
                }

                modalbody.style.padding = 0;
                const imagePath = item.querySelector('img').getAttribute('src');
                modalImage.setAttribute('src', imagePath);
                openModal();
            });   
        });

    } else {

        document.addEventListener('click', (e) => {            
            const target = e.target;

            if (target.classList.contains(triggerElement)) {
                e.preventDefault(); 
                openModal();
            }
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal && modal.classList.contains('active') && modalContent.classList.contains('active')) {
            closeModal();
        }

        if (e.target.classList.contains('to-products')) {             
            closeModal();
            document.querySelector('.actions-product__add').focus();
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('active') && modalContent.classList.contains('active')) {
            closeModal();
            lastFocusedEl.focus();
        }
    });
    
    modalCloseBtn.addEventListener('click', () => {
        if (modal.classList.contains('active') && modalContent.classList.contains('active')) {
            closeModal();
            lastFocusedEl.focus();
        }
    });
}

//Open Modal Product
export function openProductModal(id) {
        const modalProduct = document.querySelector('.product-modal__body');
        const productTitle = modalProduct.querySelector('.product-modal__title');
        const productSubtitle = modalProduct.querySelector('.product-modal__subtitle');
        const productSlides = modalProduct.querySelectorAll('[data-slide-zoom]');
        const productSubslides = modalProduct.querySelectorAll('.slider-product__subslide');
        const productPrice = modalProduct.querySelector('.product-modal__prices');
        const productDescr = modalProduct.querySelector('.product-modal__descr');

        modalProduct.setAttribute('data-product-id', '');
        productTitle.textContent = '';
        productSubtitle.textContent = '';
        productSlides.forEach(item => {
            item.innerHTML = '';
        });
        productSubslides.forEach(item => {
            item.innerHTML = '';
        });
        productPrice.innerHTML = '';
        productDescr.innerHTML = '';

        fetch('https://fpigletov-db.herokuapp.com/futuro/')
            .then(response => response.json())                        
            .then(data => {
                const item = data.products[id];

                modalProduct.setAttribute('data-product-id', id);

                productSlides.forEach(el => {
                    const slideId = el.dataset.slideZoom;
                    const slide = document.querySelector(`[data-slide-zoom="${slideId}"]`);
                    
                    slide.innerHTML = `
                        <picture>
                            <source srcset="${item.galleryWebp[slideId]}" type="image/webp">
                            <img loading="lazy" src="${item.galleryJpg[slideId]}" alt="${item.mainImageAlt}">
                        </picture>
                    `;
                });

                    for (let i = 0; i < productSubslides.length; i++) {
                        productSubslides[i].innerHTML = `
                            <picture>
                                <source srcset="${item.galleryWebp[i]}" type="image/webp">
                                <img loading="lazy" src="${item.galleryJpg[i]}" width="280" height="280" alt="${item.mainImageAlt}">
                            </picture>
                        `;
                    }

                    productTitle.textContent = item.title;
                    productSubtitle.textContent = item.subtitle;

                    productPrice.innerHTML = `
                        <div class="product-modal__price product-modal__price_old">${item.oldPrice ? item.oldPrice + '$' : ''}</div>
                        <div class="product-modal__price product-modal__price_current">${item.price}$</div>
                    `;

                    for (let j = 0; j < Object.keys(item.descr).length; j++) {
                        productDescr.innerHTML += `
                            <div class="product-modal__key">${Object.keys(item.descr)[j]}<span>${Object.values(item.descr)[j]}</span></div>
                        `;
                    }
                    
                
                
            })
            .catch(err => alert(err));
}
    
//Open Blog Modal
export function openBlogModal(id) {
        const blogModal = document.querySelector('.modal__blog');
        blogModal.innerHTML = '';

        fetch('https://fpigletov-db.herokuapp.com/futuro/')
            .then(response => response.json())
            .then(data => {
                const item = data.posts[id];

                blogModal.innerHTML = `
                    <div class="blog-modal__body">
                        <div class="blog-modal__image">
                            <picture>
                                <source srcset="${item.mainImageWebp}" type="image/webp">
                                <img loading="lazy" src="${item.mainImageJpg}" alt="${item.mainImageAlt}">
                            </picture>       
                        </div>
                        <div class="blog-modal__content">
                            <h2 class="blog-modal__title title">${item.title}</h2>
                            <div class="blog-modal__date">${item.date}</div>
                            <div class="blog-modal__descr"></div>
                        </div>
                    </div>
                `;

                const blogDescr = document.querySelector('.blog-modal__descr');

                for (let j = 0; j < Object.keys(item.descr).length; j++) {
                    blogDescr.innerHTML += `
                        <span>${Object.values(item.descr)[j]}</span>
                    `;
                }

            })
            .catch(err => alert(err));
    }