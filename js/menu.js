'use strict';
document.addEventListener('DOMContentLoaded', () => {

    let cardsData = [];

    async function getData() {
        try {
            const res = await fetch('./data.json');

            if (!res.ok) {
                throw new Error(`Ошибка: ${res.status}`);
            }
            const data = await res.json();
            return data;
        } catch (e) {
            console.error('Что-то пошло не так', e);
        }
    }

    const spinner = document.querySelector('.spinner');

    async function init() {
        try {
            spinner.classList.add('active');

            cardsData = await getData();

            renderCard('coffee');
        } catch (e) {
            console.error('Что-то пошло не так', e);
        } finally {
            spinner.classList.remove('active');
        }
    }

    const cardsContent = document.querySelector('.cards__content');
    const loadMore = document.querySelector('.load-more');

    let isMobile = window.innerWidth <= 768;
    let cardsToShow = 4;
    let currentCategory = 'coffee';


    loadMore.addEventListener('click', () => {
        cardsToShow += 4;
        renderCard(currentCategory);
    });


    function renderCard(category) {

        cardsContent.innerHTML = '';
        const filterCards = cardsData.filter(card => {
            return card.category === category;
        });
        const limit = isMobile ? cardsToShow : filterCards.length;

        const showCards = filterCards.slice(0, limit);

        if (isMobile && cardsToShow < filterCards.length) {
            loadMore.style.display = 'inline-block';
        } else {
            loadMore.style.display = 'none';
        }

        showCards.forEach(card => {
            cardsContent.innerHTML += `
            <div class="cards__item" data-id="${card.id}">
                <div class="cards__photo-wrapper">
                    <img
                        class="cards__photo"
                        src="${card.image}"
                        alt="${card.alt}"
                    >
                </div>

                <div class="cards__text">
                    <div class="cards__name">${card.name}</div>
                    <div class="cards__descr">${card.description}</div>
                    <div class="cards__price">$${card.price}</div>
                </div>
            </div>
            `
        });

    }

    const tabs = document.querySelectorAll('.cards__tabs-wrapp');

    tabs.forEach(elem => {

        elem.addEventListener('click', (e) => {
            tabs.forEach(elem => {
                elem.classList.remove('active');
            });

            e.currentTarget.classList.add('active');

            const category = e.currentTarget.dataset.category;
            currentCategory = category;
            cardsToShow = 4;
            renderCard(currentCategory);
        });
    });

    window.addEventListener('resize', () => {
        const newIsMobile = window.innerWidth <= 768;
        if (newIsMobile !== isMobile) {
            if (newIsMobile) {
                cardsToShow = 4;
            }
            
            console.log(isMobile);
            isMobile = newIsMobile;
            renderCard(currentCategory);
        }
    });

    init();


    // МОДАЛКА

    const modal = document.querySelector('.modal');
    const cardsParent = document.querySelector('.cards__content');

    cardsParent.addEventListener('click', (e) => {
        const item = e.target.closest('.cards__item');

        if (!item) return;
        console.log(item.dataset.id);
        renderModal(item.dataset.id);
        openModal();
    });


    modal.addEventListener('click', (e) => {
        const closeBtn = e.target.closest('.modal__close');
        const sizeBtn = e.target.closest('.size-btn');
        const additivesBtn = e.target.closest('.additives-btn');


        if (closeBtn) {
            closeModal();
            return;
        }

        if (e.target === modal) {
            closeModal();
        }

        if (sizeBtn) {
            const sizeBtns = modal.querySelectorAll('.size-btn')
            sizeBtns.forEach(item => {
                item.classList.remove('active');
            });

            sizeBtn.classList.add('active');

            updateTotal();
        }

        if (additivesBtn) {
            additivesBtn.classList.toggle('active');
            updateTotal();
        }
    });

    function updateTotal() {
        const priceElem = modal.querySelector('.total-price');
        const basePrice = +priceElem.dataset.price;
        const activeSize = modal.querySelector('.size-btn.active');
        const sizePrice = activeSize ? +activeSize.dataset.price : 0;
        const activeAdditives = modal.querySelectorAll('.additives-btn.active');
        let additivesPrice = 0;
        activeAdditives.forEach(item => {
            additivesPrice += +item.dataset.price;
        });
        priceElem.textContent = `$${(basePrice + sizePrice + additivesPrice).toFixed(2)}`;
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function renderModal(id) {

        const modalContent = cardsData.find(card => {
            return card.id === +id;
        });

        modal.innerHTML = '';

        if (!modalContent) return;
        console.log(modalContent);
        const sizesHTML = Object.entries(modalContent.sizes).map(item => {
            const key = item[0];
            const sizeData = item[1];
            const activeClass = key === 's' ? 'active' : '';

            return `
                <button class="modal__option-btn size-btn ${activeClass}" data-price="${sizeData['add-price']}">
                    <span class="modal__circle">${key.toUpperCase()}</span>
                    <span>${sizeData.size}</span>
                </button>
            `
        }).join('');

        const additivesHTML = modalContent.additives.map((item, i) => {
            return `
                <button class="modal__option-btn additives-btn" data-price="${item['add-price']}">
                    <span class="modal__circle">${i + 1}</span>
                    <span>${item.name}</span>
                </button>
            `
        }).join('');

        modal.innerHTML = `
            <div class="modal__content">
                <img class="modal__image" src="${modalContent.image}" alt="${modalContent.alt}">
                <div class="modal__info">
                    <div class="modal__header">
                        <h2 class="modal__title">${modalContent.name}</h2>
                        <p class="modal__descr">${modalContent.description}</p>
                    </div>
                    <div class="modal__options">
                        <div class="modal__option">
                            <span class="modal__label">Size</span>
                            <div class="modal__buttons">
                                ${sizesHTML}
                            </div>
                        </div>
                        <div class="modal__option">
                            <span class="modal__label">Additives</span>
                            <div class="modal__buttons">
                                ${additivesHTML}
                            </div>
                        </div>
                    </div>
                    <div class="modal__total">
                        <span>Total:</span>
                        <span class="total-price" data-price="${modalContent.price}">$${modalContent.price}</span>
                    </div>
                    <div class="modal__footer">
                        <div class="modal__notice">
                            <span>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_1_16733)">
                                        <path d="M8 7.66675V11.0001" stroke="currentColor" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                        <path d="M8 5.00667L8.00667 4.99926" stroke="currentColor" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                        <path
                                            d="M8.00065 14.6666C11.6825 14.6666 14.6673 11.6818 14.6673 7.99992C14.6673 4.31802 11.6825 1.33325 8.00065 1.33325C4.31875 1.33325 1.33398 4.31802 1.33398 7.99992C1.33398 11.6818 4.31875 14.6666 8.00065 14.6666Z"
                                            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_1_16733">
                                            <rect width="16" height="16" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>

                            </span>
                            <p>The cost is not final. Download our mobile app to see the final price and place your order.
                                Earn loyalty points and enjoy your favorite coffee with up to 20% discount.</p>
                        </div>
                        <button class="modal__close">Close</button>
                    </div>
                </div>
            </div>
        `
    }
});