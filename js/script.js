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
            const res = await fetch('../data.json');

            if (!res.ok) {
                throw new Error(`Ошибка: ${res.status}`);
            }
            const data = await res.json();
            return data
        } catch (e) {
            console.error('Что-то пошло не так', e);
        }
    }

    async function init() {
        cardsData = await getData();
        renderCard('coffee');
    }

    function renderCard(category) {
        const cardsContent = document.querySelector('.cards__content');

        cardsContent.innerHTML = '';

        const filterCards = cardsData.filter(card => {
            return card.category === category;
        });

        filterCards.forEach(card => {
            console.log(card);
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

    init();


});