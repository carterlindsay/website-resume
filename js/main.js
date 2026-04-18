document.addEventListener('DOMContentLoaded', function () {

    // ── 1. ACTIVE NAV LINK ────────────────────────────────────────────
    // Highlights the nav link that matches the current page filename.
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('#mainNav .nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('nav-active');
        }
    });

    // ── 2. SCROLL-TO-TOP BUTTON ───────────────────────────────────────
    const scrollBtn = document.createElement('button');
    scrollBtn.id = 'scrollTopBtn';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    scrollBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ── 3. FADE-IN ANIMATIONS FOR RESUME SECTIONS ────────────────────
    // Sections animate in one by one as they enter the viewport.
    const sections = Array.from(document.querySelectorAll('.post-preview'));
    if (sections.length > 0) {
        sections.forEach(section => section.classList.add('fade-section'));

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const idx = sections.indexOf(entry.target);
                    setTimeout(function () {
                        entry.target.classList.add('fade-in');
                    }, idx * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        sections.forEach(section => observer.observe(section));
    }

    // ── 4. CONTACT FORM HANDLER ───────────────────────────────────────
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    // Enable the submit button (SB Forms leaves it disabled without an API token)
    const submitBtn = document.getElementById('submitButton');
    if (submitBtn) submitBtn.classList.remove('disabled');

    // Clear invalid state on input
    contactForm.querySelectorAll('input, textarea').forEach(function (field) {
        field.addEventListener('input', function () {
            if (this.value.trim()) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
    });

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const fields = {
            name:    document.getElementById('name'),
            email:   document.getElementById('email'),
            phone:   document.getElementById('phone'),
            message: document.getElementById('message'),
        };

        let valid = true;

        // Required field check
        Object.values(fields).forEach(function (field) {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                field.classList.remove('is-valid');
                valid = false;
            } else {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
            }
        });

        // Email format check
        if (fields.email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value)) {
            fields.email.classList.add('is-invalid');
            valid = false;
        }

        if (!valid) return;

        // Build mailto link as a working fallback
        const subject = encodeURIComponent('Message from ' + fields.name.value.trim());
        const body = encodeURIComponent(
            fields.message.value.trim() +
            '\n\nFrom: ' + fields.name.value.trim() +
            '\nEmail: ' + fields.email.value.trim() +
            '\nPhone: ' + fields.phone.value.trim()
        );
        window.location.href = 'mailto:?subject=' + subject + '&body=' + body;

        // Show success message
        const successMsg = document.getElementById('submitSuccessMessage');
        if (successMsg) {
            successMsg.classList.remove('d-none');
            successMsg.innerHTML =
                '<div class="text-center mb-3 p-3" style="background:#f0f6fb;border-radius:6px;border-left:4px solid #4d6080">' +
                '<div class="fw-bolder" style="color:#1e3058">Message sent! Thank you, ' +
                fields.name.value.trim() + '.</div>' +
                '<div class="text-muted mt-1" style="font-size:0.9rem">Your default email app should open — just hit Send.</div>' +
                '</div>';
        }

        // Reset form
        contactForm.reset();
        contactForm.querySelectorAll('.is-valid').forEach(f => f.classList.remove('is-valid'));
    });

});
