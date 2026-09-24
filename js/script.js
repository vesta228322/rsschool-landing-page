'use strict';
document.addEventListener('DOMContentLoaded', () => {
    const btnDark = document.querySelector('#dark');
    const btnLight = document.querySelector('#light');
    const html = document.documentElement;

    const storageTheme = localStorage.getItem('theme');

    if (storageTheme === 'dark') {
        html.dataset.theme = 'dark';
        btnDark.classList.add('active');
        btnLight.classList.remove('active');
    } else {
        html.dataset.theme = 'light';
    }

    btnDark.addEventListener('click', () => {
        html.dataset.theme = 'dark';
        localStorage.setItem('theme', 'dark');
        btnDark.classList.add('active');
        btnLight.classList.remove('active');
    });

    btnLight.addEventListener('click', () => {
        html.dataset.theme = '';
        localStorage.setItem('theme', 'light');
        btnLight.classList.add('active');
        btnDark.classList.remove('active');
    });

    let cardsData = [];

    async function getData() {
        try {
            const res = await fetch('./data.json');

            if (!res.ok) {
                throw new Error(`Ошибка: ${res.status}`);
            }
            const data = await res.json();
            return data
        } catch (e) {
            console.error('Что-то пошло не так', e);
        }
    }

    const spinner = document.querySelector('.spinner');

    async function init() {
        try {
            if (spinner) {
                spinner.classList.add('active');
            }
            cardsData = await getData();
            renderCard('coffee');
        } catch (e) {
            console.error('Что-то пошло не так', e);
        } finally {
            if (spinner) {
                spinner.classList.remove('active');
            }
        }
    }

    const cardsContent = document.querySelector('.cards__content');
    const loadMore = document.querySelector('.load-more');

    let cardsToShow = 4;
    let currentCategory = 'coffee';

    if (loadMore) {
        loadMore.addEventListener('click', () => {
            cardsToShow += 4;
            renderCard(currentCategory);
        });
    }

    function renderCard(category) {

        cardsContent.innerHTML = '';

        const filterCards = cardsData.filter(card => {
            return card.category === category;
        });

        const showCards = filterCards.slice(0, cardsToShow);

        showCards.forEach(card => {
            cardsContent.innerHTML += `
            <div class="cards__item">
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
                    <div class="cards__price">$${card.price.toFixed(2)}</div>
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
            currentCategory = category

            cardsToShow = 4;
            renderCard(currentCategory);
        });

    });

    init();
});