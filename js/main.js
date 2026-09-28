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

    // БУРГЕР МЕНЮ

    const menu = document.querySelector('.header__nav');
    const burgerBtn = document.querySelector('.header__burger');
    const navLinks = document.querySelectorAll('.header__nav-list a');

    function closeMenu() {
        menu.classList.remove('open');
        burgerBtn.classList.remove('open');
        document.body.style.overflow = '';
    }

    burgerBtn.addEventListener('click', () => {
        if (burgerBtn.classList.contains('open')) {
            closeMenu();
        } else {
            menu.classList.add('open');
            burgerBtn.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });
});