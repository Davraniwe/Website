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

    const b2cFields = document.getElementById('b2c-fields');
    const b2bFields = document.getElementById('b2b-fields');
    const tabs = document.querySelectorAll('.tab-btn');
    const contactForm = document.getElementById('contact-form');
    const statusElement = document.getElementById('form-status');
    const submitButton = contactForm ? contactForm.querySelector('.form-submit') : null;
    const privacyCheckbox = contactForm ? contactForm.querySelector('#privacy') : null;
    let activeTab = 'b2c';

    const setStatus = (message, state) => {
        if (!statusElement) {
            return;
        }

        statusElement.textContent = message || '';
        statusElement.classList.remove('form-status--success', 'form-status--error', 'form-status--pending');

        if (state) {
            statusElement.classList.add(`form-status--${state}`);
        }
    };

    const toggleFieldset = (container, disabled) => {
        if (!container) {
            return;
        }

        container.querySelectorAll('input, textarea, select').forEach((field) => {
            field.disabled = disabled;
        });
    };

    const switchTab = (type) => {
        if (!b2cFields || !b2bFields || tabs.length < 2) {
            return;
        }

        activeTab = type === 'b2b' ? 'b2b' : 'b2c';

        if (activeTab === 'b2c') {
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

        if (contactForm) {
            contactForm.dataset.activeTab = activeTab;
        }

        toggleFieldset(b2cFields, activeTab !== 'b2c');
        toggleFieldset(b2bFields, activeTab !== 'b2b');

        setStatus('', null);
    };

    window.switchTab = switchTab;
    switchTab('b2c');

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            if (typeof contactForm.reportValidity === 'function' && !contactForm.reportValidity()) {
                return;
            }

            if (privacyCheckbox && !privacyCheckbox.checked) {
                setStatus('Подтвердите согласие на обработку данных.', 'error');
                return;
            }

            const container = activeTab === 'b2c' ? b2cFields : b2bFields;
            const fields = container ? container.querySelectorAll('input, textarea, select') : [];
            const payload = {
                type: activeTab,
                privacyAccepted: true,
                page: window.location.href,
            };

            fields.forEach((field) => {
                if (field.name) {
                    payload[field.name] = field.value.trim();
                }
            });

            try {
                setStatus('Отправляем заявку…', 'pending');
                if (submitButton) {
                    submitButton.disabled = true;
                }

                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                const result = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(result.error || 'Не удалось отправить заявку. Попробуйте позже.');
                }

                setStatus(result.message || 'Заявка отправлена. Мы свяжемся с вами в ближайшее время.', 'success');
                contactForm.reset();

                if (privacyCheckbox) {
                    privacyCheckbox.checked = false;
                }
            } catch (error) {
                setStatus(error.message || 'Не удалось отправить заявку. Попробуйте позже.', 'error');
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                }
            }
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
