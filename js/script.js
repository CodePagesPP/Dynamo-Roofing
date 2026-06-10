document.addEventListener("DOMContentLoaded", function() {
            const cards = document.querySelectorAll('.ts-card');
            const btnPrev = document.querySelector('.ts-nav-prev');
            const btnNext = document.querySelector('.ts-nav-next');
            let currentIdx = 1; // La tarjeta del medio (índice 1) es la inicial activa

            function updateSlider() {
                cards.forEach((card, index) => {
                    card.classList.remove('active', 'prev', 'next');
                    card.style.opacity = ''; 

                    
                    if (index === currentIdx) {
                        card.classList.add('active');
                    } else if (index === currentIdx - 1 || (currentIdx === 0 && index === cards.length - 1)) {
                        card.classList.add('prev');
                    } else if (index === currentIdx + 1 || (currentIdx === cards.length - 1 && index === 0)) {
                        card.classList.add('next');
                    } else {
                        card.style.opacity = '0'; 
                    }
                });
            }

                    // Seleccionamos todos los items de las FAQs
            const faqItems = document.querySelectorAll('.faq-item');

            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question');
                const answer = item.querySelector('.faq-answer');

                question.addEventListener('click', () => {
                    // Comprobamos si el item actual ya está activo
                    const isActive = item.classList.contains('active');

                    // Opcional: Cerramos todos los demás items primero (efecto acordeón único)
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-answer').style.maxHeight = null;
                    });

                    // Si no estaba activo, lo abrimos
                    if (!isActive) {
                        item.classList.add('active');
                        // Asignamos el max-height dinámicamente según el contenido
                        answer.style.maxHeight = answer.scrollHeight + "px";
                    }
                });
            });

            btnPrev.addEventListener('click', () => {
                currentIdx = (currentIdx === 0) ? cards.length - 1 : currentIdx - 1;
                updateSlider();
            });

            btnNext.addEventListener('click', () => {
                currentIdx = (currentIdx === cards.length - 1) ? 0 : currentIdx + 1;
                updateSlider();
            });

            const sections = document.querySelectorAll('main, section, footer');
            const navLinks = document.querySelectorAll('nav ul li a[href^="#"]:not([href="#"])');

            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });

            window.addEventListener('scroll', () => {
                let current = '';

                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    if (pageYOffset >= (sectionTop - 120)) {
                        if (section.getAttribute('id')) {
                            current = section.getAttribute('id');
                        }
                    }
                });

                if ((window.innerHeight + Math.ceil(window.pageYOffset)) >= document.body.offsetHeight - 20) {
                    current = 'contact';
                }

                if (current) {
                    navLinks.forEach(a => {
                        a.classList.remove('active');
                        if (a.getAttribute('href') === `#${current}`) {
                            a.classList.add('active');
                        }
                    });
                }

                if (pageYOffset < 100) {
                    navLinks.forEach(a => a.classList.remove('active'));
                    const homeLink = document.querySelector('nav ul li a[href="#home"]');
                    if (homeLink) homeLink.classList.add('active');
                }
            });
        });