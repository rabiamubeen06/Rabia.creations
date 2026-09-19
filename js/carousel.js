/* =========================================================
   carousel.js
   A small, dependency-free testimonial carousel.
   Works on any element with [data-carousel]; builds its own
   dot indicators, supports prev/next buttons, keyboard arrows,
   and autoplay that pauses on hover/focus.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {

    var root = document.querySelector('[data-carousel]');
    if (!root) return;

    var track = root.querySelector('.carousel-slides');
    var slides = Array.prototype.slice.call(root.querySelectorAll('.slide'));
    var prevBtn = root.querySelector('.carousel-prev');
    var nextBtn = root.querySelector('.carousel-next');
    var dotsWrap = root.querySelector('.carousel-dots');
    var current = 0;
    var autoplayId = null;

    if (!slides.length) return;

    // ARIA: label the carousel region.
    root.setAttribute('aria-roledescription', 'carousel');
    root.setAttribute('aria-label', 'Customer testimonials');
    track.setAttribute('aria-live', 'off');

    // Build one dot per slide.
    slides.forEach(function(slide, i) {
        slide.setAttribute('role', 'group');
        slide.setAttribute('aria-roledescription', 'slide');
        slide.setAttribute('aria-label', 'Testimonial ' + (i + 1) + ' of ' + slides.length);

        var dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
        if (i === 0) dot.classList.add('is-active');
        dot.addEventListener('click', function() { goTo(i); });
        dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function goTo(index) {
        current = (index + slides.length) % slides.length;
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        dots.forEach(function(d, i) { d.classList.toggle('is-active', i === current); });
    }

    function next() { goTo(current + 1); }

    function prev() { goTo(current - 1); }

    if (nextBtn) nextBtn.addEventListener('click', function() { next();
        resetAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', function() { prev();
        resetAutoplay(); });

    root.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') { next();
            resetAutoplay(); }
        if (e.key === 'ArrowLeft') { prev();
            resetAutoplay(); }
    });

    function startAutoplay() {
        track.setAttribute('aria-live', 'off');
        autoplayId = setInterval(next, 5500);
    }

    function stopAutoplay() {
        clearInterval(autoplayId);
        track.setAttribute('aria-live', 'polite');
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    // Pause on hover AND focus (a11y: keyboard users need this too).
    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', startAutoplay);
    root.addEventListener('focusin', stopAutoplay);
    root.addEventListener('focusout', function(e) {
        if (!root.contains(e.relatedTarget)) startAutoplay();
    });

    startAutoplay();
});