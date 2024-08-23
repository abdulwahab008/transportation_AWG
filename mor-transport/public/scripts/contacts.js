document.addEventListener('DOMContentLoaded', function() {
    // Smooth Scrolling for internal links
    const links = document.querySelectorAll('a[href^="#"]');
    for (const link of links) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // Highlight active navigation link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Contact Form Validation
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            const name = document.querySelector('#name').value.trim();
            const email = document.querySelector('#email').value.trim();
            const message = document.querySelector('#message').value.trim();

            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                event.preventDefault(); // Prevent form submission
                return;
            }

            // Simple email validation (basic)
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert('Please enter a valid email address.');
                event.preventDefault(); // Prevent form submission
                return;
            }

            // Optionally, you can also add AJAX form submission here
        });
    }
});
