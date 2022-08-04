'use strict';

export function searchLogic() {
    const searchForm = document.querySelector('.search-header__form');    
    const searchInput = document.querySelector('.search-form__input');
    const resultsBody = document.querySelector('.search-header__results');
    
    searchInput.addEventListener('input', (e) => {
        searchInput.value = searchInput.value.replace(/[^a-z]/ig, ''); 
    });

    searchForm.addEventListener('submit', (e) => {        
        e.preventDefault();
        resultsBody.style.display = 'block';
        search(searchInput.value);
        searchInput.value = '';
    });

    function falseResult() {
        resultsBody.innerHTML = '<div class="search-results__false">No results</div>';
    }

    function search(text) {         
        if (text === '') {

            falseResult();

        } else {

            resultsBody.innerHTML = '<ul class="search-results__body"></ul>';
            const results = document.querySelector('.search-results__body');

            fetch('https://fpigletov-db.herokuapp.com/futuro/')
                .then(response => response.json())
                .then((data) => {
                    const searchResults = data.products;
                    const filteredResults = searchResults.filter(item => {
                        return item.title.toLowerCase().includes(text.toLowerCase()) || item.subtitle.toLowerCase().includes(text.toLowerCase());
                    });

                    if (filteredResults.length > 0) {

                        filteredResults.forEach(item => {

                            results.innerHTML += `
                                <li class="search-results__item">
                                    <a href="#" data-btn-id="${item.id}" class="search-results__link show-product">${item.title}</a>
                                </li>
                            `;
                        });

                    } else {

                        falseResult();
                        
                    }
                })
                .catch(err => alert(err));
        }        
    }
}