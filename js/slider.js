'use strict';
document.addEventListener('DOMContentLoaded', () => {
    const slideContainer = document.querySelector('.slider__container'),
          slider = slideContainer.querySelector('.slider__wrapper'),
          slides = slider.querySelectorAll('.slider__content'),
          btnNext = slideContainer.querySelector('.btn-next'),
          btnPrev = slideContainer.querySelector('.btn-prev'),
          dots = slideContainer.querySelectorAll('.dot');
    
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
        resetAutoplay();
    });

    btnPrev.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
        resetAutoplay();
    });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', (e) => {
            currentSlide = i;
            updateSlider();
        });
    });

    const observer = new ResizeObserver(() => {
       updateSlider(); 
       console.log('изменение ширины!')
    });

    observer.observe(slideContainer);

    let autoplay;

    function nextSlide() {
        resetAutoplay();
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    }

    function resetAutoplay() {
        clearTimeout(autoplay)
        
        autoplay = setTimeout(nextSlide, 7300);
    }
    resetAutoplay();
});