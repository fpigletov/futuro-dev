'use strict';

export function productsLogic() {
    //Products
    const cartList = document.querySelector('.cart-content__list');
    const cart = document.querySelector('.actions-header__cart');
    const cartIcon = cart.querySelector('.cart-header__btn');
    const cartQuantity = cartIcon.querySelector('span');
    const favorite = document.querySelector('.favorite-header');
    const favoriteBtn = favorite.querySelector('.favorite-header__btn');    
    const favoriteQuantity = favoriteBtn.querySelector('span');
    const favoriteList = favorite.querySelector('.favorite-header__content');
    const favoriteModal = document.querySelector('.modal__favorite');
    const cartBody = document.querySelector('.actions-header__cart');        
    const cartTotalPrice = document.querySelector('.cart-content__total span');
    const checkout = document.querySelector('.modal__checkout');    
    const checkoutContent = document.querySelector('.order-checkout');
    const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth);
    const burger = document.querySelector('.actions-header__burger');

    // Local Storage
    function updateStorage() {
        let cartListContent = cartList.innerHTML;
        let favoriteListContent = favoriteList.innerHTML;

        localStorage.setItem('futuroCartProducts', cartListContent);          
        localStorage.setItem('futuroFavoriteProducts', favoriteListContent);          
    }

    function currentStorageState() {
        if (localStorage.getItem('futuroCartProducts') !== null) {
            cartList.innerHTML = localStorage.getItem('futuroCartProducts');
        }
        
        if (localStorage.getItem('futuroFavoriteProducts') !== null) {
            favoriteList.innerHTML = localStorage.getItem('futuroFavoriteProducts');
        }         
    }

    currentStorageState();

    //Show Cart
    function showCart() {
        if (cartList.children.length > 0) {
            cartQuantity.classList.add('active');  
            cartBody.classList.add('active');
        } else {
            cartQuantity.classList.remove('active');  
            cartBody.classList.remove('active');
        }
    }

    //ShowCart Quantity
    function showCartQuantity() { 
        const cartProductQuantity = document.querySelectorAll('.cart-content__quantity span');  
        const cartItem = document.querySelector('.cart-content__item');
        let totalQuantity = 0;

        if (cartItem) {
            cartProductQuantity.forEach(item => {
                totalQuantity += +item.textContent;
            });

            cartQuantity.textContent = totalQuantity;

            showCart();
        }
        
    }

    showCartQuantity();

    //Favorite Quantity
    function showFavoriteQuantity() {
        if (favoriteList.children.length > 0) {
            favoriteQuantity.classList.add('active');             
        } else {
            favoriteQuantity.classList.remove('active'); 
            changeFavoriteContent();
        }

        favoriteQuantity.textContent = favoriteList.children.length;
        
    }
    showFavoriteQuantity();

    //Favorite Content
    function changeFavoriteContent() {
        favoriteModal.innerHTML = `
            <div class="favorite-modal__empty empty-favorite">
                <div class="favorite-modal__title title">Your Favorites is empty.</div>
                <div class="favorite-modal__link empty-link">Go to <a href="#" class="to-products product-link">Products</a></div>
            </div>
        `;
    }

    //Count Cart Total
    function countCartTotal() {  
        const cartProductPrice = document.querySelectorAll('.cart-content__price');
        const total = [];  
        
        cartProductPrice.forEach(item => {            
            total.push(parseInt(item.textContent)); 
        });

        if (total.length > 0) {
            cartTotalPrice.textContent = (total.reduce((a, b) => a + b)) + '$';
        }
    }

    countCartTotal();
    
    //Flying Product
    function flyingImage(currentBtn, id, destination) {
        if (!currentBtn.classList.contains('hold')) {
            currentBtn.classList.add('hold');
            currentBtn.classList.add('fly');            
            
            const product = document.querySelector(`[data-id="${id}"]`);
            const productImage = product.querySelector('.item-products__image img');
           
            const productImageFly = productImage.cloneNode(false);
            
            const productImageFlyWidth = productImage.offsetWidth;
            const productImageFlyHeight = productImage.offsetHeight;
            const productImageFlyTop = productImage.getBoundingClientRect().top;
            const productImageFlyLeft = productImage.getBoundingClientRect().left;             

            productImageFly.setAttribute('class', 'flyImage');
            productImageFly.style.cssText =	`
                left: ${productImageFlyLeft}px;
                top: ${productImageFlyTop}px;
                width: ${productImageFlyWidth}px;
                height: ${productImageFlyHeight}px;
            `;

            document.body.append(productImageFly);

            const cartFlyLeft = destination.getBoundingClientRect().left;
            const cartFlyTop = destination.getBoundingClientRect().top;

            productImageFly.style.cssText =	`
                left: ${cartFlyLeft}px;
                top: ${cartFlyTop}px;
                width: 0px;
                height: 0px;
                opacity: 0;
            `;

            productImageFly.addEventListener('transitionend', () => {
                if (currentBtn.classList.contains('fly')) {
                    productImageFly.remove();
                    addToDestination(currentBtn, id, destination);
                    currentBtn.classList.remove('fly');
                }
            });	
        }
    }

    function generateCartItem(imgJpg, imgWebp, alt, title, subtitle, price, id) {
        return `
            <li class="cart-content__item" data-cart-id="${id}">
                <div class="cart-content__image">
                    <picture>
                        <source srcset="${imgWebp}" type="image/webp">
                        <img loading="lazy" src="${imgJpg}" alt="${alt}">
                    </picture>
                </div>
                <div class="cart-content__info">
                    <div class="cart-content__title">
                        <span>${title}</span>
                        <div class="cart-content__subtitle">
                            ${subtitle}
                        </div>                            
                    </div>
                    <div class="cart-content__price">${price}$</div>
                </div>
                <div class="cart-content__quantity"><span>1</span></div>
                <button class="cart-content__remove icon-trash"></button>
            </li>
        `;
    }

    function generateFavoriteItem(id) {
        return `
            <li class="favorite-header__item" data-favorite-id="${id}"></li>
        `;
    }

    // Add Product to Cart 
    function addToDestination(currentBtn, id, destination, productAdd = true) {

        fetch('https://fpigletov-db.herokuapp.com/futuro/')
            .then(response => response.json())
            .then((data) => {
                const item = data.products[id];
        
            if (destination === favorite || destination === burger) {
                const favoriteProduct = document.querySelector(`[data-favorite-id="${id}"]`);

                if (productAdd) {
                    if (!favoriteProduct) {                    
                        favoriteList.insertAdjacentHTML('beforeend', generateFavoriteItem(item.id));
                    }
                } else {
                    const favoriteModalProduct = document.querySelector(`[data-favorite-modal-id="${id}"]`);
                    favoriteProduct.remove();
                    favoriteModalProduct.remove();
                }
                
                currentBtn.classList.remove('hold');
                showFavoriteQuantity();

                
            } else {
                const cartProduct = document.querySelector(`[data-cart-id="${id}"]`);             

                if (productAdd) {
                    if (!cartProduct) {

                        cartList.insertAdjacentHTML('beforeend', generateCartItem(item.mainImageJpg, item.mainImageWebp, item.mainImageAlt, item.title, item.subtitle, item.price, item.id));

                    } else {
                        const cartProductQuantity = cartProduct.querySelector('.cart-content__quantity span');
                        const cartProductPrice = cartProduct.querySelector('.cart-content__price');
                        cartProductQuantity.textContent = ++cartProductQuantity.textContent;
                        cartProductPrice.textContent = (+cartProductQuantity.textContent * item.price) + '$';
                    }

                    //Unhold Button
                    currentBtn.classList.remove('hold');
                } else {    //Remove Product
                    const cartProductQuantity = cartProduct.querySelector('.cart-content__quantity span');
                    const cartProductPrice = cartProduct.querySelector('.cart-content__price');
                    cartProductQuantity.textContent = --cartProductQuantity.textContent;

                    //Total Product Price
                    cartProductPrice.textContent = (+cartProductQuantity.textContent * item.price) + '$';
                    
                    //Remove Cart Product
                    if (!parseInt(cartProductQuantity.textContent)) {
                        cartProduct.remove();
                    }

                    cartQuantity.textContent = --cartQuantity.textContent; 
                }

                countCartTotal();
                showCartQuantity();
                showCart();
            }
        
            updateStorage();  
            })
            .catch(err => alert(err));
    }

    //Triggers
    document.addEventListener('click', (e) => {        
        const target = e.target;
        
        //Flying Product Cart
        if (target.classList.contains('actions-product__add')) {
            e.preventDefault();
            const productId = target.dataset.btnId;
            flyingImage(target, productId, cart);
        }

        //Flying Product
        if (target.classList.contains('actions-product__like')) {
            const productId = target.dataset.btnId;

            if (viewportWidth > 480) {
                flyingImage(target, productId, favorite);
            } else {
                flyingImage(target, productId, burger);
            }
        }

        //Delete Cart Product
        if (target.classList.contains('cart-content__remove')) {           
            const productId = target.closest('.cart-content__item').dataset.cartId;
            addToDestination(target, productId, cart, false);
        }

        //Add Product To Checkout
        if (target.classList.contains('cart-header__btn') || target.classList.contains('cart-content__btn') || target.classList.contains('checkout-link')) {
            addToCheckout();
        }

        //Delete Checkout Product
        if (target.classList.contains('item-checkout__close')) {
            const checkoutProduct = target.closest('.order-checkout__item');  
            const productId = checkoutProduct.dataset.checkoutId;
            const productTotal = checkoutProduct.querySelector('.item-checkout__total span');
            const checkoutTotal = document.querySelector('.order-checkout__total span');
            
            checkoutProduct.remove();
            document.querySelector(`[data-cart-id="${productId}"]`).remove();
            cartQuantity.textContent -= +checkoutProduct.querySelector('.item-checkout__quantity').textContent;

            updateStorage();             
            
            checkoutTotal.textContent = (parseInt(checkoutTotal.textContent) - parseInt(productTotal.textContent)) + '$';
            
            if (cartList.children.length < 1) {
                changeCheckoutContent();
                cartQuantity.classList.remove('active');
                cartBody.classList.remove('active');
            }
        }

        //Add Product To Favorite
        if (target.classList.contains('favorites-link')) {              
            addToFavorite();
        }
        //Remove Item From Favorite
        if (target.classList.contains('actions-product__remove')) {             
            const productId = target.dataset.btnId;
            addToDestination(target, productId, favorite, false);
        } 
    });

    //Genetare Checkout Item
    function generateCheckoutItem(imgJpg, imgWebp, alt, title, subtitle, quantity, price, totalPrice, id) {

        return `<li class="order-checkout__item item-checkout" data-checkout-id="${id}">
                    <div class="item-checkout__top">
                        <button type="button" class="item-checkout__close icon-close"></button>
                    </div>
                    <div class="item-checkout__wrapper">
                        <div class="item-checkout__image">
                            <picture>
                                <source srcset="${imgWebp}" type="image/webp">
                                <img loading="lazy" src="${imgJpg}" alt="${alt}">
                            </picture>
                        </div>
                        <div class="item-checkout__content">
                            <div class="item-checkout__descr">
                                <div class="item-checkout__title">
                                    <span>${title}</span>
                                    <div class="item-checkout__subtitle">${subtitle}</div>
                                </div>
                                <div class="item-checkout__price">
                                    ${price}$
                                </div>
                            </div>
                            <div class="item-checkout__quantity"><span>${quantity}</span></div>
                            <div class="item-checkout__total">Total:<span>${totalPrice}<span></div>
                        </div>                        
                    </div>                    
                </li>`;
    }

    function changeCheckoutContent() {
        checkoutContent.innerHTML = `
            <div class="order-checkout__empty empty-checkout">
                <div class="empty-checkout__text title">Your cart is empty.</div>
                <div class="empty-checkout__link empty-link">Go to <a href="#" class="to-products product-link">Products</a></div>
            </div>
        `;
    }

    function addToCheckout() {
        checkoutContent.innerHTML = `
            <div class="order-checkout__title title">Your order:</div>
            <ul class="order-checkout__items"></ul>
            <div class="order-checkout__footer">
                <div class="order-checkout__total">
                    Total: <span>0</span>                                 
                </div>
                <button type="submit" class="order-checkout__btn btn-orange btn">Confirm order</button>
            </div>
        `;

        if (cartList.children.length > 0) {
            if (checkout) {
                const cartProduct = cartList.querySelectorAll('.cart-content__item');
                const cartTotalPrice = document.querySelector('.cart-content__total span');
                const checkoutTotalPrice = checkout.querySelector('.order-checkout__total span');
                const checkoutProductsBody = checkout.querySelector('.order-checkout__items');
                

                cartProduct.forEach(el => {
                    const cartId = el.dataset.cartId;
                    const cartTotalPrice = el.querySelector('.cart-content__price').textContent;  
                    const cartQuantity = el.querySelector('.cart-content__quantity span').textContent;

                    fetch('https://fpigletov-db.herokuapp.com/futuro/')
                        .then(response => response.json())                        
                        .then(data => {
                            const item = data.products[cartId];

                            checkoutProductsBody.insertAdjacentHTML('beforeend', generateCheckoutItem(item.mainImageJpg, item.mainImageWebp, item.mainImageAlt, item.title, item.subtitle, cartQuantity, item.price, cartTotalPrice, item.id,));
                        })
                        .catch(err => alert(err));
                });
                
                checkoutTotalPrice.textContent = cartTotalPrice.textContent;
            }

        } else {
            if (checkout) {
                changeCheckoutContent();                
            }            
        }
    }

    addToCheckout();
    
    
    //Favorite Modal
    function addToFavorite() {

        favoriteModal.innerHTML = `
            <div class="favorite-modal__title title">Your favorites</div>
            <ul class="favorite-modal__body"></ul>
        `;
        
        if (favoriteList.children.length > 0) {
            const favoriteItems = document.querySelectorAll('.favorite-header__item');
            const favoriteModal = document.querySelector('.favorite-modal__body');
            
            favoriteItems.forEach(el => {                 
                const favoriteId = el.dataset.favoriteId;

                fetch('https://fpigletov-db.herokuapp.com/futuro/')
                        .then(response => response.json())                        
                        .then(data => {
                            const item = data.products[favoriteId];

                            favoriteModal.innerHTML += `
                                <li data-favorite-modal-id ="${item.id}" class="favorite-modal__item item-products">
                                    <div class="item-products__image">
                                        <picture>
                                            <source srcset="${item.mainImageWebp}" type="image/webp">
                                            <img loading="lazy" src="${item.mainImageJpg}" alt="${item.mainImageAlt}">
                                        </picture>                   
                                    </div>
                                    <div class="item-products__body">
                                        <div class="item-products__content">
                                            <h4 class="item-products__title">${item.title}</h4>
                                            <span class="item-products__text">${item.subtitle}</span>
                                        </div>
                                        <div class="item-products__prices">
                                            <div class="item-products__price">${item.price}$</div>
                                            <div class="item-products__price item-products__price_old">${item.oldPrice ? item.oldPrice : ''}</div>
                                        </div>
                                        <div class="item-products__actions item-products__actions_reg actions-product">
                                            <div class="actions-product__body">
                                                <button type="button" data-btn-id="${item.id}" class="actions-product__add btn btn-orange">Add to cart</button>
                                                <button type="button" data-btn-id="${item.id}" class="actions-product__remove icon-trash" aria-label="Remove product"></button>
                                            </div>
                                        </div>
                                        <div class="item-products__actions item-products__actions_hover actions-product">
                                            <div class="actions-product__body">
                                                <button data-btn-id="${item.id}" class="actions-product__add btn btn-white">Add to cart</button>
                                                <button data-btn-id="${item.id}" class="actions-product__remove icon-trash" aria-label="Remove product"></button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            `;
                        })
                        .catch(err => alert(err));
            });

        } else {
            changeFavoriteContent();
        }
    }

    //Form Validation
    const modal = document.querySelector('.modal');
    const modalMessage = modal.querySelector('.modal__message');
    const modalbody = modal.querySelector('.modal__body');
    const wrapper = document.querySelector('.wrapper'); 

    //Inputmask    
    const selector = document.querySelectorAll('input[type="tel"]');
    const inputMask = new Inputmask('+7 (999) 999-99-99');
    inputMask.mask(selector);

    // Close Modal With Delay
    const closeModalWithDelay = (delay) => {
        setTimeout(() => {
            modalbody.style.padding = '';
            modal.classList.remove('active');            
            modalMessage.classList.remove('active');
            wrapper.classList.remove('blur');
            document.body.style.overflow = '';
            modalMessage.textContent = '';

            Array.from(document.body.children).forEach(item => {
                if (item !== modal) {
                    item.inert = false;
                }
            });      

            document.querySelector('.header__logo').focus();
        }, delay);
    };

    //Create Random Number
    const randomNumber = Math.random().toString().slice(2, 10);

    function clearCheckout() {
        const checkoutProducts = document.querySelectorAll('.order-checkout__items');
        const cartProducts = document.querySelectorAll('.cart-content__item');

        checkoutProducts.forEach(item => {
            item.remove(); 
        });

        cartProducts.forEach(item => {
            item.remove();
        });

        updateStorage();           

        changeCheckoutContent();

        cartQuantity.textContent = 0;
        cartQuantity.classList.remove('active');
        cartBody.classList.remove('active');
    }

    //Status Messages
    const statusMessage = {
        checkoutSuccess: `Your order №${randomNumber} has been successfully placed. 
        Thank you.`,        
        callbackSuccess: 'Confirmation has been sent by email.',
        fail: 'Something went wrong... Try again please.',
        loading: 'Loading...'
    };

    //POST
    const postData = async (url, data, contentSelector) => {
        document.querySelector(contentSelector).classList.remove('active');    
        
        if (!modal.classList.contains('active')) {
            modal.classList.add('active');
        }        

        modalMessage.classList.add('active');
        modalMessage.textContent = statusMessage.loading;

        let result = await fetch(url, {
            method: 'POST',
            body: data
        });

        return await result.text();
    };

    //Validate And Post Forms    
    function validateForms(formSelector, rules, messages, url, delay, successMessage) {
        
        new window.JustValidate(formSelector, {
            rules: rules,
            colorWrong: '#ee2c2d',
            messages: messages,
            submitHandler: function (form) {
                let formData = new FormData(form);
                
                if (formSelector === '.modal__checkout') {
                    const payment = document.querySelector('.select__current[name="Payment"]');
                    if (payment) {
                        formData.append('Payment', payment.textContent);
                    }      
                }

                postData(url, formData, formSelector)
                    .then((data) => {
                        modalMessage.textContent = successMessage;                        
                        if (formSelector === '.modal__checkout') {
                            clearCheckout();
                        }
                    }).catch((data) => {
                        modalMessage.textContent = statusMessage.fail;
                        console.log(data);                        
                    }).finally(() => {
                        form.reset();
                        closeModalWithDelay(delay);
                    });
            }
        });
    }

    //Login
    validateForms('.modal__login',
        {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true
            },
        },
        {
            email: {
                required: 'Enter your Email',
                email: 'Wrong format'
            },
            password: {
                required: 'Enter your password'
            }
        },
        'resources/server.php');
    
    //Subscribe
    validateForms('.subscribe-footer__form',
        {
            email: {
                required: true,
                email: true
            }
        },
        {
            email: {
                required: 'Enter your Email',
                email: 'Wrong format'
            }
        },
        'resources/server.php', 5000, statusMessage.callbackSuccess);
    
    //Checkout
    validateForms('.modal__checkout',
        {
            fullname: {
                required: true
            },
            email: {
                required: true,
                email: true
            },
            phone: {
                required: true
            },            
            address: {
                required: true
            },
        },
        {
            fullname: {
                required: 'Enter your fullname',
            },
            email: {
                required: 'Enter your email',
                email: 'Wrong format'
            },
            phone: {
                required: 'Enter your phone number'
            },
            address: {
                required: 'Enter your address'
            }
        },
        'resources/server.php', 5000, statusMessage.checkoutSuccess);
}

