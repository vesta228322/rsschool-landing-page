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
});