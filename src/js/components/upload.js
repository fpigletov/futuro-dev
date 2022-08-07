'use strict';

export function uploadFromDB() {

    const productsBody = document.querySelector('.products__body');
    const showMoreBtn = document.querySelector('.products__btn');
    const blogWrapper = document.querySelector('.slider-tips__wrapper');
    let productQuantity = 0;
    let dataLength = null;
    
    //Products 
    function loadingProducts(list, quantity) {
            
        fetch('https://fpigletov-db.herokuapp.com/futuro/')
            .then(response => response.json())
            .then((data) => {
                dataLength = data.products.length;

                list.innerHTML = '';

                for (let i = 0; i < dataLength; i++) {
                    if (i < quantity) {
                        let item = data.products[i];
                        
                        list.innerHTML += `
                            <li data-id="${item.id}" class="products__item item-products">
                                <div class="item-products__labels">
                                    <div class="item-products__label item-products__label_sale">${item.labelSale ? item.labelSale : ''}</div>
                                    <div class="item-products__label item-products__label_new">${item.labelNew ? item.labelNew : ''}</div>
                                </div>
                                <div class="item-products__image">
                                    <picture>
                                        <source srcset="${item.mainImageWebp}" type="image/webp">
                                        <img loading="lazy" src="${item.mainImageJpg}" alt="${item.mainImageAlt}">
                                    </picture>                   
                                </div>
                                <div class="item-products__body">
                                    <div class="item-products__content">
                                        <h3 class="item-products__title">${item.title}</h3>
                                        <span class="item-products__text">${item.subtitle}</span>
                                    </div>
                                    <div class="item-products__prices">
                                        <div class="item-products__price">${item.price}$</div>
                                        <div class="item-products__price item-products__price_old">${item.oldPrice ? item.oldPrice + '$' : ''}</div>
                                    </div>
                                    <div class="item-products__actions item-products__actions_reg actions-product">
                                        <div class="actions-product__body">
                                            <button type="button" data-btn-id="${item.id}" class="actions-product__add btn btn-orange">Add to cart</button>
                                            <button type="button" data-btn-id="${item.id}" class="actions-product__see icon-eye show-product" aria-label="Show product info"></button>
                                            <button type="button" data-btn-id="${item.id}" class="actions-product__like icon-favorite" aria-label="Add to favorites"></button>
                                        </div>
                                    </div>
                                    <div class="item-products__actions item-products__actions_hover actions-product">
                                        <div class="actions-product__body">
                                            <button data-btn-id="${item.id}" class="actions-product__add btn btn-white">Add to cart</button>
                                            <button data-btn-id="${item.id}" class="actions-product__see icon-eye show-product" aria-label="Show product info"></button>
                                            <button data-btn-id="${item.id}" class="actions-product__like icon-favorite" aria-label="Add to favorites"></button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        `;
                    }
                }

                const productItems = document.querySelectorAll('.item-products');

                productItems.forEach(item => {
                    if (item.querySelector('.item-products__label_sale').textContent === '') {
                        item.querySelector('.item-products__label_sale').remove();
                    }

                    if (item.querySelector('.item-products__label_new').textContent === '') {
                        item.querySelector('.item-products__label_new').remove();
                    }
                });

            })
            .catch(err => alert(err));
    }

    if (productsBody) {
        productQuantity = 6;

        loadingProducts(productsBody, productQuantity);

        showMoreBtn.addEventListener('click', (e) => {
            productQuantity += 3;

            loadingProducts(productsBody, productQuantity);
                
            if (productQuantity >= dataLength) {
                console.log(dataLength);
                showMoreBtn.style.display = 'none';
            } else {
                showMoreBtn.style.display = 'inline-flex';
            }
        });
    }

    //Blog

    function loadingBlog() {
    
        fetch('https://fpigletov-db.herokuapp.com/futuro/')
            .then(response => response.json())
            .then((blogData) => {
                const blogDataLength = blogData.posts.length;
                
                blogWrapper.innerHTML = '';

                for (let i = 0; i < blogDataLength; i++) {
                    
                        let blogItem = blogData.posts[i];
                        
                        blogWrapper.innerHTML += `
                            <li data-tips-id="${blogItem.id}" class="slider-tips__slide swiper-slide">
                                <a href="#" class="slider-tips__image">
                                    <picture>
                                        <source srcset="${blogItem.mainImageWebp}" type="image/webp">
                                        <img loading="lazy" src="${blogItem.mainImageJpg}" class="slider-tips__img" alt="${blogItem.mainImageAlt}">
                                    </picture>
                                </a>
                                <div class="slider-tips__content">
                                    <button type="button" class="slider-tips__title">${blogItem.title}</button>
                                    <span class="slider-tips__date">${blogItem.date}</span>
                                </div>
                            </li>   
                        `;
                }
            })
            .then(() => {
                new Swiper('.slider-tips__body', {
                    grabCursor: true,
                    observer: true,
                    observeParents: true,
                    watchSlidesProgress: true,
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
                        320: {
                            slidesPerView: 1.1,
                            spaceBetween: 15
                        },                        
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 20
                        },                        
                        992: {
                            slidesPerView: 3,
                            spaceBetween: 32
                        }
                    }
                });
            })
            .catch(err => alert(err));
        
    }
    
    if (blogWrapper) {        
        loadingBlog();
    }

}