'use strict';
document.addEventListener('DOMContentLoaded', () => {
    const slideContainer = document.querySelector('.slider__container'),
          slider = slideContainer.querySelector('.slider__wrapper'),
          slides = slider.querySelectorAll('.slider__content'),
          btnNext = slideContainer.querySelector('.btn-next'),
          btnPrev = slideContainer.querySelector('.btn-prev'),
          dots = slideContainer.querySelectorAll('.dot');
    
    let currentSlide = 0;
    let slideWidth;
    function updateSlider() {
        slideWidth = slides[0].offsetWidth;
        const translateX = -(currentSlide * slideWidth);
        slider.style.transform = `translateX(${translateX}px)`;

        dots.forEach((dot, i) => {
            if (i === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        resetAutoplay();
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
    }

    btnNext.addEventListener('click', () => {
        nextSlide();
    });

    btnPrev.addEventListener('click', () => {
        prevSlide();
    });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', (e) => {
            currentSlide = i;
            updateSlider();
        });
    });

    const observer = new ResizeObserver(() => {
       updateSlider(); 
       console.log('ширина изменилась!');
    });

    observer.observe(slideContainer);

    let autoplay;

    function resetAutoplay() {
        clearTimeout(autoplay);
        
        autoplay = setTimeout(nextSlide, 7300);
    }
    updateSlider();
    resetAutoplay();

    let startX;
    let endX;
    slider.addEventListener('pointerdown', (e) => {
        if (window.innerWidth > 576) return;
        startX = e.clientX;
        clearTimeout(autoplay);
    });

    slider.addEventListener('pointermove', (e) => {
        if (window.innerWidth > 576) return;
        const deltaX = e.clientX - startX;
        const transformX = -(currentSlide * slideWidth) + deltaX;
        slider.style.transition = 'none';
        slider.style.transform = `translateX(${transformX}px)`;
    });

    slider.addEventListener('pointerup', (e) => {
        if (window.innerWidth > 576) return;
        slider.style.transition = '0.55s ease-out';
        const swipeThreshold = slideWidth * 0.37;
        endX = e.clientX;
        const deltaX = endX - startX;
        
        if (deltaX <= -swipeThreshold) {
            nextSlide();
            console.log('swipe left');
        } else if (deltaX >= swipeThreshold) {
            prevSlide();
            console.log('swipe right');
        } else {
            updateSlider();
            console.log('do nothing');
        }
    });
});