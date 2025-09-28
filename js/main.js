(() => {
    const body = document.body;
    const header = document.getElementById('header');
    const particlesContainer = document.querySelector('.particles');
    const themeToggle = document.getElementById('theme-toggle');

    const syncToggleState = (isLight) => {
        if (!themeToggle) {
            return;
        }
        const nextTheme = isLight ? 'light' : 'dark';
        themeToggle.setAttribute('data-theme', nextTheme);
        themeToggle.setAttribute('aria-pressed', isLight.toString());
        themeToggle.setAttribute(
            'aria-label',
            isLight ? 'Переключить на тёмную тему' : 'Переключить на светлую тему',
        );
    };

    const applyTheme = (theme, { persist = true } = {}) => {
        const isLight = theme === 'light';
        body.classList.toggle('theme-light', isLight);
        syncToggleState(isLight);
        if (persist) {
            localStorage.setItem('preferred-theme', theme);
        }
    };

    const initTheme = () => {
        const storedTheme = localStorage.getItem('preferred-theme');
        if (storedTheme) {
            applyTheme(storedTheme);
            return;
        }
        const prefersLightQuery = typeof window.matchMedia === 'function'
            ? window.matchMedia('(prefers-color-scheme: light)')
            : null;

        if (prefersLightQuery) {
            applyTheme(prefersLightQuery.matches ? 'light' : 'dark', { persist: false });

            if (typeof prefersLightQuery.addEventListener === 'function') {
                prefersLightQuery.addEventListener('change', (event) => {
                    if (!localStorage.getItem('preferred-theme')) {
                        applyTheme(event.matches ? 'light' : 'dark', { persist: false });
                    }
                });
            }
        } else {
            applyTheme('dark', { persist: false });
        }
    };

    initTheme();

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const nextTheme = body.classList.contains('theme-light') ? 'dark' : 'light';
            applyTheme(nextTheme);
        });
    }

    const onScroll = () => {
        if (!header) {
            return;
        }
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', onScroll);
    onScroll();

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') {
                return;
            }

            const target = document.querySelector(targetId);
            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    document.querySelectorAll('.faq-question').forEach((question) => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            if (item) {
                item.classList.toggle('active');
            }
        });
    });

    const switchTab = (type) => {
        const b2cFields = document.getElementById('b2c-fields');
        const b2bFields = document.getElementById('b2b-fields');
        const tabs = document.querySelectorAll('.tab-btn');

        if (!b2cFields || !b2bFields || tabs.length < 2) {
            return;
        }

        if (type === 'b2c') {
            b2cFields.style.display = 'block';
            b2bFields.style.display = 'none';
            tabs[0].classList.add('active');
            tabs[1].classList.remove('active');
        } else {
            b2cFields.style.display = 'none';
            b2bFields.style.display = 'block';
            tabs[0].classList.remove('active');
            tabs[1].classList.add('active');
        }
    };

    window.switchTab = switchTab;
    switchTab('b2c');

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
            contactForm.reset();
            switchTab('b2c');
        });
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach((section) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease';
        observer.observe(section);
    });

    const createParticle = () => {
        if (!particlesContainer) {
            return;
        }
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particle.style.animationDuration = `${15 + Math.random() * 10}s`;
        particlesContainer.appendChild(particle);

        setTimeout(() => particle.remove(), 25000);
    };

    setInterval(createParticle, 3000);
})();
