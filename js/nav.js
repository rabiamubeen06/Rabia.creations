/* =========================================================
   nav.js
   Shared on every page. Handles:
   - responsive hamburger navigation menu
   - sticky header shadow on scroll
   - highlighting the current page's nav link
   - scroll-reveal animation for elements with class "reveal"
   - the "back to top" button
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {

    /* ---- 1. Hamburger menu ---- */
    var toggle = document.querySelector('.hamburger');
    var nav = document.querySelector('.main-nav');
    var mainContent = document.querySelector('main');

    function closeMenu() {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        if (mainContent) mainContent.removeAttribute('inert');
    }

    if (toggle && nav) {
        toggle.addEventListener('click', function() {
            var isOpen = nav.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            if (mainContent) {
                if (isOpen) mainContent.setAttribute('inert', '');
                else mainContent.removeAttribute('inert');
            }
        });

        // Close the menu automatically once a link is tapped (mobile).
        nav.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', closeMenu);
        });

        // Close on Escape key.
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && nav.classList.contains('is-open')) {
                closeMenu();
                toggle.focus();
            }
        });
    }

    /* ---- 2. Sticky header shadow (throttled) ---- */
    var header = document.querySelector('.site-header');
    if (header) {
        var scrollTicking = false;
        var onScroll = function() {
            if (!scrollTicking) {
                requestAnimationFrame(function() {
                    header.classList.toggle('is-scrolled', window.scrollY > 8);
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ---- 3. Mark the current page's nav link ---- */
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-nav a').forEach(function(link) {
        var href = link.getAttribute('href');
        if (href === currentPage) {
            link.setAttribute('aria-current', 'page');
        }
    });

    /* ---- 4. Scroll reveal ---- */
    var revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealEls.length) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealEls.forEach(function(el) { observer.observe(el); });
    } else {
        revealEls.forEach(function(el) { el.classList.add('is-visible'); });
    }

    /* ---- 5. Back to top button (throttled) ---- */
    var backBtn = document.querySelector('.back-to-top');
    if (backBtn) {
        var backTicking = false;
        window.addEventListener('scroll', function() {
            if (!backTicking) {
                requestAnimationFrame(function() {
                    backBtn.classList.toggle('is-visible', window.scrollY > 480);
                    backTicking = false;
                });
                backTicking = true;
            }
        }, { passive: true });
        backBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});