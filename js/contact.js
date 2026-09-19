/* =========================================================
   contact.js
   Client-side validation for the commission enquiry form on
   contact.html. This site has no backend/server, so instead
   of "submitting" the form we validate it, then hand the
   message off to WhatsApp with the details pre-filled -
   that's how the studio actually wants to receive enquiries.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {

    var form = document.querySelector('#enquiry-form');
    if (!form) return;

    var status = document.querySelector('.form-status');
    var studioWhatsApp = '923455787990'; // country code + number, digits only

    var fields = {
        name: {
            el: form.querySelector('#name'),
            validate: function(v) { return v.trim().length >= 2; },
            message: 'Please tell us your name (at least 2 characters).'
        },
        email: {
            el: form.querySelector('#email'),
            validate: function(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
            message: 'Enter a valid email address, e.g. name@example.com.'
        },
        piece: {
            el: form.querySelector('#piece'),
            validate: function(v) { return v.trim().length > 0; },
            message: 'Let us know what kind of piece you would like.'
        },
        message: {
            el: form.querySelector('#message'),
            validate: function(v) { return v.trim().length >= 15; },
            message: 'Add a little more detail (at least 15 characters) so we can quote accurately.'
        }
    };

    function setFieldState(key, isValid) {
        var wrapper = fields[key].el.closest('.form-field');
        wrapper.classList.toggle('has-error', !isValid);
    }

    function validateField(key) {
        var field = fields[key];
        var isValid = field.validate(field.el.value);
        setFieldState(key, isValid);
        return isValid;
    }

    // Live validation: check a field again once the user leaves it.
    Object.keys(fields).forEach(function(key) {
        fields[key].el.addEventListener('blur', function() { validateField(key); });
        fields[key].el.addEventListener('input', function() {
            var wrapper = fields[key].el.closest('.form-field');
            if (wrapper.classList.contains('has-error')) validateField(key);
        });
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        var allValid = Object.keys(fields).every(function(key) {
            return validateField(key);
        });

        if (!allValid) {
            status.textContent = 'Please fix the highlighted fields before sending.';
            status.style.background = '#F5E7E1';
            status.style.borderColor = 'var(--terracotta)';
            status.style.color = 'var(--terracotta-dark)';
            status.classList.add('is-visible');

            // Focus the first field with an error so the user knows where to look.
            var firstErrorKey = Object.keys(fields).find(function(key) {
                return !fields[key].validate(fields[key].el.value);
            });
            if (firstErrorKey) fields[firstErrorKey].el.focus();
            return;
        }

        var name = fields.name.el.value.trim();
        var email = fields.email.el.value.trim();
        var piece = fields.piece.el.value;
        var message = fields.message.el.value.trim();

        var text = 'New commission enquiry from Rabia\'s Creations site\n' +
            'Name: ' + name + '\n' +
            'Email: ' + email + '\n' +
            'Piece type: ' + piece + '\n' +
            'Details: ' + message;

        status.style.background = '';
        status.style.borderColor = '';
        status.style.color = '';
        status.textContent = 'Thanks, ' + name.split(' ')[0] + ' \u2014 opening WhatsApp with your message ready to send.';
        status.classList.add('is-visible');

        window.open('https://wa.me/' + studioWhatsApp + '?text=' + encodeURIComponent(text), '_blank');
        form.reset();
    });

});