'use strict';
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider__wrapper'),
          slides = slider.querySelectorAll('.slider__content'),
          btnNext = document.querySelector('.btn-next'),
          btnPrev = document.querySelector('.btn-prev'),
          dots = document.querySelectorAll('.dot');
    
    let currentSlide = 0;
    
    function updateSlider() {
        let slideWidth = slides[0].offsetWidth;
        const translateX = -(currentSlide * slideWidth);
        slider.style.transform = `translateX(${translateX}px)`;

        dots.forEach((dot, i) => {
            if (i === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    btnNext.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    });

    btnPrev.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
    });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', (e) => {
            currentSlide = i;
            updateSlider();
        });
    });

    const observer = new ResizeObserver(() => {
       updateSlider(); 
    });

    observer.observe(slider);

    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    }, 6000);
});