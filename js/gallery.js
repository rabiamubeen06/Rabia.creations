/* =========================================================
   gallery.js
   Runs only on gallery.html. Two independent features:
   1. Category filter buttons that show/hide pieces.
   2. A lightbox modal that opens a larger view of a piece,
      with next/prev navigation, keyboard/overlay closing,
      focus trapping, and basic touch/swipe support.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {

    var grid = document.querySelector('[data-gallery]');
    if (!grid) return;

    var pieces = Array.prototype.slice.call(grid.querySelectorAll('.piece'));
    var filterButtons = document.querySelectorAll('.filter-btn');

    /* ---- 1. Category filtering ---- */
    function applyFilter(category) {
        pieces.forEach(function(piece) {
            var match = category === 'all' || piece.getAttribute('data-category') === category;
            piece.classList.toggle('is-hidden', !match);
        });
        filterButtons.forEach(function(b) {
            b.classList.toggle('is-active', b.getAttribute('data-filter') === category);
        });
    }

    filterButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            applyFilter(btn.getAttribute('data-filter'));
        });
    });

    // Support links like gallery.html?category=islamic (used from the
    // home page category tiles) by pre-selecting that filter on load.
    var requestedCategory = new URLSearchParams(window.location.search).get('category');
    if (requestedCategory && document.querySelector('.filter-btn[data-filter="' + requestedCategory + '"]')) {
        applyFilter(requestedCategory);
    }

    /* ---- 2. Lightbox ---- */
    var lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;

    var lbImage = lightbox.querySelector('.lightbox-img img');
    var lbTitle = lightbox.querySelector('.lightbox-title');
    var lbCategory = lightbox.querySelector('.lightbox-category');
    var lbDesc = lightbox.querySelector('.lightbox-desc');
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var prevBtn = lightbox.querySelector('.lightbox-prev');
    var nextBtn = lightbox.querySelector('.lightbox-next');
    var activeIndex = 0;
    var triggerElement = null; // Element that opened the lightbox.

    // Touch/swipe state.
    var touchStartX = 0;
    var touchEndX = 0;
    var SWIPE_THRESHOLD = 50;

    function visiblePieces() {
        return pieces.filter(function(p) { return !p.classList.contains('is-hidden'); });
    }

    function openLightbox(piece, trigger) {
        var visible = visiblePieces();
        activeIndex = visible.indexOf(piece);
        triggerElement = trigger || null;
        renderSlide(visible[activeIndex]);
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        // Focus the close button for keyboard users.
        closeBtn.focus();
    }

    function renderSlide(piece) {
        var img = piece.querySelector('img');
        lbImage.src = img.src;
        lbImage.alt = img.alt;
        lbTitle.textContent = piece.getAttribute('data-title');
        lbCategory.textContent = piece.getAttribute('data-category-label');
        lbDesc.textContent = piece.getAttribute('data-desc');
    }

    function closeLightbox() {
        lightbox.classList.remove('is-open');
        document.body.style.overflow = '';
        // Restore focus to the element that opened the lightbox.
        if (triggerElement) {
            triggerElement.focus();
            triggerElement = null;
        }
    }

    function step(direction) {
        var visible = visiblePieces();
        if (!visible.length) return;
        activeIndex = (activeIndex + direction + visible.length) % visible.length;
        renderSlide(visible[activeIndex]);
    }

    /* Focus trapping inside the lightbox. */
    function trapFocus(e) {
        if (!lightbox.classList.contains('is-open')) return;
        var focusable = lightbox.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }
    }

    pieces.forEach(function(piece) {
        var img = piece.querySelector('.piece-frame img');
        img.addEventListener('click', function() { openLightbox(piece, img); });
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', function() { step(1); });
    prevBtn.addEventListener('click', function() { step(-1); });

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') step(1);
        if (e.key === 'ArrowLeft') step(-1);
        trapFocus(e);
    });

    /* Touch/swipe support for mobile lightbox navigation. */
    lightbox.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > SWIPE_THRESHOLD) {
            if (diff > 0) step(1); // Swipe left  → next
            else step(-1); // Swipe right → prev
        }
    }, { passive: true });

});