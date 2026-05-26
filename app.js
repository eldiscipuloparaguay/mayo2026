/**
 * Revista Digital "El Discípulo" - Mayo 2026
 * Interactividad y SPA Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CONFIGURACIÓN DEL SPA (ENRUTAMIENTO) ---
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-content a');
    const cards = document.querySelectorAll('.article-card');
    const backButtons = document.querySelectorAll('.btn-back');

    function navigateToPage(targetId) {
        if (!targetId) return;

        // Limpiar hashes o prefijos en el ID
        const cleanId = targetId.replace('#', '');
        const targetPage = document.getElementById(cleanId);

        if (!targetPage) return;

        // Desactivar todas las páginas y activar la destino
        pages.forEach(page => {
            page.classList.remove('active');
        });
        targetPage.classList.add('active');

        // Actualizar estados activos en la navegación
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-target') === cleanId || link.getAttribute('href') === `#${cleanId}`) {
                link.classList.add('active');
                // Si está dentro del dropdown, opcionalmente activar el padre
                const dropdown = link.closest('.dropdown');
                if (dropdown) {
                    dropdown.querySelector('.dropdown-toggle').classList.add('active');
                }
            }
        });

        // Desactivar active de dropdown toggles si el link actual no es dropdown o si no tiene hijos activos
        navLinks.forEach(link => {
            if (!link.closest('.dropdown')) {
                const activeToggles = document.querySelectorAll('.dropdown-toggle.active');
                activeToggles.forEach(toggle => {
                    const dropdownLinks = toggle.nextElementSibling.querySelectorAll('a');
                    let hasActiveChild = false;
                    dropdownLinks.forEach(dl => {
                        if (dl.classList.contains('active')) hasActiveChild = true;
                    });
                    if (!hasActiveChild) {
                        toggle.classList.remove('active');
                    }
                });
            }
        });

        // Scroll suave hacia arriba
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Cerrar menú móvil si está abierto
        const hamburger = document.getElementById('hamburger-btn');
        const navMenu = document.getElementById('nav-links');
        if (hamburger && hamburger.classList.contains('open')) {
            hamburger.classList.remove('open');
            navMenu.classList.remove('open');
        }
    }

    // Interceptar clicks de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const target = link.getAttribute('data-target') || (href && href.startsWith('#') ? href.substring(1) : null);
            if (target) {
                e.preventDefault();
                window.location.hash = target;
            }
        });
    });

    // Interceptar clicks en las tarjetas del índice
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const target = card.getAttribute('data-target');
            if (target) {
                window.location.hash = target;
            }
        });
    });

    // Interceptar clicks en botones de volver
    backButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target') || 'home';
            window.location.hash = target;
        });
    });

    // Escuchar cambios de Hash en la URL para soporte nativo de navegación e historial
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash || '#home';
        navigateToPage(hash);
    });

    // Cargar página inicial al abrir
    const initialHash = window.location.hash || '#home';
    navigateToPage(initialHash);


    // --- 2. SELECTOR DE TEMA (CLARO / OSCURO) ---
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeToggleText = document.getElementById('theme-toggle-text');
    
    function updateThemeText() {
        if (themeToggleText) {
            if (document.body.classList.contains('dark-theme')) {
                themeToggleText.textContent = 'Modo Oscuro';
            } else {
                themeToggleText.textContent = 'Modo Claro';
            }
        }
    }

    // Cargar tema guardado o por defecto
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
    }
    updateThemeText();

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            if (document.body.classList.contains('dark-theme')) {
                document.body.classList.remove('dark-theme');
                document.body.classList.add('light-theme');
                localStorage.setItem('theme', 'light');
            } else {
                document.body.classList.remove('light-theme');
                document.body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            }
            updateThemeText();
        });
    }


    // --- 3. MENÚ HAMBURGUESA (MÓVIL) ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinksMenu = document.getElementById('nav-links');

    if (hamburgerBtn && navLinksMenu) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('open');
            navLinksMenu.classList.toggle('open');
        });
    }


    // --- 4. SISTEMA DE PESTAÑAS (CAACUPÉ, ARROYOS Y ESTEROS, ETC.) ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            const container = btn.closest('.tabs-container');

            if (container) {
                // Quitar active solo de los botones y contenidos de este contenedor
                container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            } else {
                // Comportamiento alternativo si no están dentro de un .tabs-container
                tabButtons.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
            }

            // Activar botón actual y panel correspondiente
            btn.classList.add('active');
            const contentPanel = document.getElementById(targetTab);
            if (contentPanel) {
                contentPanel.classList.add('active');
            }
        });
    });


    // --- 5. DESLIZADOR DE IMÁGENES (SLIDER DE CAACUPÉ - MADRES) ---
    const sliderContainer = document.getElementById('slider-caacupe-madres');
    if (sliderContainer) {
        const slides = sliderContainer.querySelectorAll('.slide');
        const prevBtn = sliderContainer.querySelector('.slider-btn.prev');
        const nextBtn = sliderContainer.querySelector('.slider-btn.next');
        let currentSlide = 0;
        let slideInterval;

        function showSlide(index) {
            slides.forEach(s => s.classList.remove('active'));
            
            // Ajustar el índice si se sale del rango
            if (index >= slides.length) {
                currentSlide = 0;
            } else if (index < 0) {
                currentSlide = slides.length - 1;
            } else {
                currentSlide = index;
            }

            slides[currentSlide].classList.add('active');
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        function prevSlide() {
            showSlide(currentSlide - 1);
        }

        // Event listeners para botones manuales
        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            resetTimer();
        });
        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            resetTimer();
        });

        // Temporizador de auto-reproducción
        function startTimer() {
            slideInterval = setInterval(nextSlide, 4000);
        }

        function resetTimer() {
            clearInterval(slideInterval);
            startTimer();
        }

        // Iniciar auto-slider
        startTimer();

        // Pausar al pasar el cursor
        sliderContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
        sliderContainer.addEventListener('mouseleave', startTimer);
    }


    // --- 6. VISOR DE IMÁGENES MODAL (LIGHTBOX) ---
    // Crear la estructura del modal dinámicamente si no existe en HTML
    let modal = document.querySelector('.image-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <button class="modal-close" aria-label="Cerrar ventana">&times;</button>
            <div class="modal-img-container">
                <img class="modal-img" src="" alt="Ampliada">
                <div class="modal-caption"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const modalImg = modal.querySelector('.modal-img');
    const modalCaption = modal.querySelector('.modal-caption');
    const modalClose = modal.querySelector('.modal-close');

    // Registrar click en todos los elementos de galería
    const galleryItems = document.querySelectorAll('.gallery-item, .camp-worker-card img, .slide img, .mar-photos-row img, .roa-photos-grid img, .mini-gallery img');
    galleryItems.forEach(item => {
        // Asegurarse de que el elemento o su ancestro tenga comportamiento interactivo
        item.style.cursor = 'pointer';
        
        item.addEventListener('click', (e) => {
            let imgSrc = '';
            let captionText = '';

            if (item.tagName.toLowerCase() === 'img') {
                imgSrc = item.getAttribute('src');
                const parentGalleryItem = item.closest('.gallery-item');
                captionText = parentGalleryItem ? parentGalleryItem.getAttribute('data-caption') : (item.getAttribute('data-caption') || item.getAttribute('alt') || '');
            } else {
                const img = item.querySelector('img');
                imgSrc = img ? img.getAttribute('src') : '';
                captionText = item.getAttribute('data-caption') || (img ? img.getAttribute('alt') : '');
            }

            if (imgSrc) {
                modalImg.setAttribute('src', imgSrc);
                modalCaption.textContent = captionText;
                modal.classList.add('active');
            }
        });
    });

    // Cerrar modal
    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            modalImg.setAttribute('src', '');
            modalCaption.textContent = '';
        }, 300);
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-img-container')) {
            closeModal();
        }
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });


    // --- 7. REPRODUCTOR DE AUDIO (INTERACCIÓN VINILO) ---
    const vinylDisc = document.getElementById('vinyl-disc');
    if (vinylDisc) {
        vinylDisc.style.cursor = 'pointer';
        
        // Simular reproducción al hacer click en el vinilo
        vinylDisc.addEventListener('click', () => {
            vinylDisc.classList.toggle('vinyl-play');
            
            // Crear o mostrar una pequeña notificación
            const isPlaying = vinylDisc.classList.contains('vinyl-play');
            showNotification(isPlaying ? 'Reproduciendo audio...' : 'Audio pausado.');
        });
    }

    function showNotification(message) {
        let toast = document.getElementById('audio-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'audio-toast';
            toast.style.position = 'fixed';
            toast.style.bottom = '2rem';
            toast.style.right = '2rem';
            toast.style.backgroundColor = 'var(--primary)';
            toast.style.color = '#fff';
            toast.style.padding = '0.75rem 1.5rem';
            toast.style.borderRadius = 'var(--border-radius-sm)';
            toast.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
            toast.style.zIndex = '3000';
            toast.style.fontWeight = '600';
            toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
        }, 2500);
    }


    // --- 8. GENERADOR DE PARTÍCULAS DE FUEGO ---
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            createParticle(particlesContainer);
        }
    }

    function createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Valores aleatorios para la simulación
        const size = Math.random() * 8 + 3; // de 3px a 11px
        const leftPos = Math.random() * 100; // de 0% a 100% de la pantalla
        const delay = Math.random() * 10; // retardo de 0s a 10s
        const duration = Math.random() * 8 + 6; // duración de 6s a 14s

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${leftPos}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;

        // Colores aleatorios entre amarillo, naranja y rojo
        const hue = Math.floor(Math.random() * 30); // 0 a 30 (naranja/rojo)
        particle.style.background = `radial-gradient(circle, hsl(${hue}, 100%, 60%) 0%, transparent 70%)`;

        container.appendChild(particle);
    }
});
