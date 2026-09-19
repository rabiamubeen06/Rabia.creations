/* =========================================================
   accordion.js
   Runs the FAQ accordion on services.html.
   Only one panel stays open at a time; clicking an open
   trigger closes it again.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {

    var items = document.querySelectorAll('.acc-item');
    if (!items.length) return;

    items.forEach(function(item) {
        var trigger = item.querySelector('.acc-trigger');
        var panel = item.querySelector('.acc-panel');

        trigger.addEventListener('click', function() {
            var wasOpen = item.classList.contains('is-open');

            // Close every panel first.
            items.forEach(function(other) {
                other.classList.remove('is-open');
                other.querySelector('.acc-trigger').setAttribute('aria-expanded', 'false');
                other.querySelector('.acc-panel').style.maxHeight = null;
            });

            // Re-open the clicked one, unless it was already open.
            if (!wasOpen) {
                item.classList.add('is-open');
                trigger.setAttribute('aria-expanded', 'true');
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }
        });
    });

});