document.addEventListener("DOMContentLoaded", function() {
            const cards = document.querySelectorAll('.ts-card');
            const btnPrev = document.querySelector('.ts-nav-prev');
            const btnNext = document.querySelector('.ts-nav-next');
            let currentIdx = 1; // La tarjeta del medio (índice 1) es la inicial activa

            function updateSlider() {
                cards.forEach((card, index) => {
                    // Limpiamos las clases de estado
                    card.classList.remove('active', 'prev', 'next');
                    card.style.opacity = ''; // Reset opacity

                    
                    if (index === currentIdx) {
                        card.classList.add('active');
                    } else if (index === currentIdx - 1 || (currentIdx === 0 && index === cards.length - 1)) {
                        card.classList.add('prev');
                    } else if (index === currentIdx + 1 || (currentIdx === cards.length - 1 && index === 0)) {
                        card.classList.add('next');
                    } else {
                        // Si hubiera más de 3 tarjetas, las demás se ocultarían
                        card.style.opacity = '0'; 
                    }
                });
            }

            btnPrev.addEventListener('click', () => {
                currentIdx = (currentIdx === 0) ? cards.length - 1 : currentIdx - 1;
                updateSlider();
            });

            btnNext.addEventListener('click', () => {
                currentIdx = (currentIdx === cards.length - 1) ? 0 : currentIdx + 1;
                updateSlider();
            });
        });