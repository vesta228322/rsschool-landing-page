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
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
        resetAutoplay();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
        resetAutoplay();
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
            resetAutoplay();
        });
    });

    const observer = new ResizeObserver(() => {
       updateSlider(); 
       console.log('ширина изменилась!');
    });

    observer.observe(slideContainer);

    let autoplay;

    function resetAutoplay() {
        clearTimeout(autoplay)
        
        autoplay = setTimeout(nextSlide, 7300);
    }
    resetAutoplay();

    let startX;
    let endX;
    slider.addEventListener('pointerdown', (e) => {
        startX = e.clientX;
    });

    slider.addEventListener('pointerup', (e) => {
        endX = e.clientX;
        const deltaX = endX - startX;
        
        if (deltaX <= -130) {
            nextSlide();
            console.log('swipe left');
        } else if (deltaX >= 130) {
            prevSlide();
            console.log('swipe right');
        } else {
            console.log('do nothing');
        }
    });
});