import * as THREE from "three";

document.addEventListener("DOMContentLoaded", function() {
    // --- Scroll animation logic ---
    const stage = document.getElementById("canvas-stage");
    const loader = document.getElementById("loader");
    const progressFill = document.getElementById("progress-fill");

    if (stage && loader && progressFill) {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        const TOTAL_FRAMES = isMobile ? 151 : 121;
        const FRAME_PATH = (i) => isMobile 
            ? `./assets/frames-vertical/frame_${String(i + 1).padStart(4, "0")}.jpg`
            : `./assets/frames/frame_${String(i + 1).padStart(4, "0")}.jpg`;
        
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        camera.position.z = 1;

        const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance", alpha: true });
        renderer.setClearColor(0xede9dd, 1);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        function resizeRenderer() {
            const container = stage.parentElement;
            const header = document.querySelector("header");
            if (header) {
                const headerHeight = header.offsetHeight;
                container.style.height = `calc(100vh - ${headerHeight}px)`;
                container.style.top = `${headerHeight}px`;
            }
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
        resizeRenderer();
        stage.appendChild(renderer.domElement);

        const textures = new Array(TOTAL_FRAMES);
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.MeshBasicMaterial({ transparent: true });
        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        let currentFrameIndex = -1;
        let displayFrame = 0;
        let imageAspect = 1;

        function fitPlaneToViewport() {
            const container = stage.parentElement;
            const viewportAspect = container.clientWidth / container.clientHeight;
            camera.left = -viewportAspect;
            camera.right = viewportAspect;
            camera.top = 1;
            camera.bottom = -1;
            camera.updateProjectionMatrix();

            const boxWidth = viewportAspect * 2;
            const boxHeight = 2;
            let targetWidth = boxHeight * imageAspect;
            let targetHeight = boxHeight;
            // Emulate background-size: cover for desktop, contain for mobile
            const isMobileView = window.matchMedia("(max-width: 768px)").matches;
            if (isMobileView) {
                // background-size: contain
                if (targetWidth > boxWidth) {
                    targetWidth = boxWidth;
                    targetHeight = boxWidth / imageAspect;
                }
            } else {
                // background-size: cover
                if (targetWidth < boxWidth) {
                    targetWidth = boxWidth;
                    targetHeight = boxWidth / imageAspect;
                }
            }
            plane.scale.set((targetWidth / 2) * 1.01, (targetHeight / 2) * 1.01, 1);
        }

        function setFrame(index) {
            index = Math.max(0, Math.min(TOTAL_FRAMES - 1, index));
            if (index === currentFrameIndex) return;
            const tex = textures[index];
            if (!tex) return;
            const isFirstFrame = currentFrameIndex === -1;
            currentFrameIndex = index;
            material.map = tex;
            if (isFirstFrame) material.needsUpdate = true;
            renderer.render(scene, camera);
        }

        const loadingManager = new THREE.LoadingManager();
        const texLoader = new THREE.TextureLoader(loadingManager);

        let loadedCount = 0;
        loadingManager.onProgress = (_url, loaded, total) => {
            const pct = Math.round((loaded / total) * 100);
            progressFill.style.width = pct + "%";
        };
        loadingManager.onLoad = () => {
            material.map = textures[0];
            material.needsUpdate = true;
            for (const tex of textures) {
                material.map = tex;
                renderer.render(scene, camera);
            }
            loader.classList.add("hidden");
            stage.style.opacity = "1"; // Fade in canvas smoothly over the background
            fitPlaneToViewport();
            setFrame(0);
            requestAnimationFrame(animate);
        };

        for (let i = 0; i < TOTAL_FRAMES; i++) {
            texLoader.load(FRAME_PATH(i), (tex) => {
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.generateMipmaps = false;
                tex.minFilter = THREE.LinearFilter;
                tex.magFilter = THREE.LinearFilter;
                if (i === 0) {
                    imageAspect = tex.image.width / tex.image.height;
                    fitPlaneToViewport();
                }
                textures[i] = tex;
                loadedCount++;
            });
        }

        function getScrollProgress() {
            const homeSection = document.getElementById("home");
            if (!homeSection) return 0;
            const rect = homeSection.getBoundingClientRect();
            const maxScroll = rect.height - window.innerHeight;
            const scrolled = -rect.top;
            return maxScroll > 0 ? Math.min(1, Math.max(0, scrolled / maxScroll)) : 0;
        }

        const EASE = 0.08;

        function animate() {
            const progress = getScrollProgress();
            const targetFrame = progress * (TOTAL_FRAMES - 1);
            displayFrame += (targetFrame - displayFrame) * EASE;
            if (Math.abs(targetFrame - displayFrame) < 0.01) displayFrame = targetFrame;
            setFrame(Math.round(displayFrame));
            requestAnimationFrame(animate);
        }

        window.addEventListener("resize", () => {
            resizeRenderer();
            fitPlaneToViewport();
            renderer.render(scene, camera);
        });
    }

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