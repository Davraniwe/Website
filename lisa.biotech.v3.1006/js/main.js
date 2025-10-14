const NeuroVitalApp = (() => {
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const formatNumber = (value) => {
        if (value >= 1_000_000) {
            return (value / 1_000_000).toFixed(1);
        }
        if (value >= 1_000) {
            return (value / 1_000).toFixed(1);
        }
        if (value >= 10) {
            return Math.round(value).toString();
        }
        return value.toFixed(1);
    };

    const createParticle = () => {
        const particle = document.createElement('span');
        particle.className = 'particle';

        const size = Math.random() * 12 + 6;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 18}s`;
        particle.style.animationDuration = `${18 + Math.random() * 14}s`;
        particle.style.opacity = (0.25 + Math.random() * 0.45).toFixed(2);

        return particle;
    };

    const throttle = (fn, delay = 200) => {
        let last = 0;
        let timer;

        return (...args) => {
            const now = Date.now();
            if (now - last < delay) {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    last = now;
                    fn(...args);
                }, delay - (now - last));
            } else {
                last = now;
                fn(...args);
            }
        };
    };

    class App {
        constructor() {
            this.header = null;
            this.progressBar = null;
            this.metricsSection = null;
            this.counters = [];
            this.revealElements = [];
            this.revealObserver = null;
            this.counterObserver = null;
            this.countersAnimated = false;
        }

        init() {
            this.cacheDom();
            this.injectScrollProgress();
            this.bindScrollEffects();
            this.setupReveal();
            this.setupCounters();
            this.setupSmoothScroll();
            this.setupFaq();
            this.setupParticles();
            this.setupForm();
        }

        cacheDom() {
            this.header = document.querySelector('header');
            this.metricsSection = document.querySelector('.metrics');
            this.counters = Array.from(document.querySelectorAll('.metric-value'));
            this.revealElements = Array.from(document.querySelectorAll('.reveal'));
        }

        injectScrollProgress() {
            this.progressBar = document.querySelector('.scroll-progress');
            if (!this.progressBar) {
                this.progressBar = document.createElement('div');
                this.progressBar.className = 'scroll-progress';
                document.body.appendChild(this.progressBar);
            }
            this.updateScrollEffects();
        }

        bindScrollEffects() {
            window.addEventListener('scroll', () => this.updateScrollEffects(), { passive: true });
        }

        updateScrollEffects() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

            if (this.progressBar) {
                this.progressBar.style.width = `${progress}%`;
            }

            if (this.header) {
                this.header.classList.toggle('scrolled', scrollTop > 24);
            }
        }

        setupReveal() {
            if (!this.revealElements?.length) {
                return;
            }

            if (!('IntersectionObserver' in window) || prefersReducedMotion) {
                this.revealElements.forEach((el) => el.classList.add('is-visible'));
                return;
            }

            this.revealObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        this.revealObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.18,
                rootMargin: '0px 0px -10%'
            });

            this.revealElements.forEach((el) => this.revealObserver.observe(el));
        }

        setupCounters() {
            if (!this.counters.length) {
                return;
            }

            const runCounters = () => {
                if (this.countersAnimated) {
                    return;
                }
                this.countersAnimated = true;
                this.counters.forEach((counter) => this.animateCounter(counter));
            };

            if (!('IntersectionObserver' in window) || prefersReducedMotion) {
                runCounters();
                return;
            }

            this.counterObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        runCounters();
                        this.counterObserver.disconnect();
                    }
                });
            }, { threshold: 0.35 });

            if (this.metricsSection) {
                this.counterObserver.observe(this.metricsSection);
            } else {
                runCounters();
            }
        }

        animateCounter(counter) {
            const targetValue = parseFloat(counter.dataset.count ?? counter.textContent);
            const suffix = counter.dataset.suffix ?? '';
            const start = performance.now();
            const duration = 2200;

            const step = (timestamp) => {
                const elapsed = timestamp - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = easeOutCubic(progress);
                const currentValue = targetValue * eased;

                counter.textContent = `${formatNumber(currentValue)}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    counter.textContent = `${formatNumber(targetValue)}${suffix}`;
                }
            };

            requestAnimationFrame(step);
        }

        setupSmoothScroll() {
            const links = Array.from(document.querySelectorAll('a[href^="#"]'));
            if (!links.length) {
                return;
            }

            links.forEach((link) => {
                link.addEventListener('click', (event) => {
                    const targetId = link.getAttribute('href');
                    if (!targetId || targetId === '#') {
                        return;
                    }

                    if (targetId === '#top') {
                        event.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        return;
                    }

                    const target = document.querySelector(targetId);
                    if (!target) {
                        return;
                    }

                    event.preventDefault();

                    const headerOffset = this.header?.offsetHeight ?? 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset - 12;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                });
            });
        }

        setupFaq() {
            const items = Array.from(document.querySelectorAll('.faq-item'));
            if (!items.length) {
                return;
            }

            items.forEach((item) => {
                const question = item.querySelector('.faq-question');
                if (!question) {
                    return;
                }

                question.setAttribute('role', 'button');
                question.setAttribute('tabindex', '0');
                question.setAttribute('aria-expanded', 'false');

                const toggle = () => {
                    const isActive = item.classList.contains('active');
                    items.forEach((faq) => {
                        faq.classList.remove('active');
                        const faqQuestion = faq.querySelector('.faq-question');
                        faqQuestion?.setAttribute('aria-expanded', 'false');
                    });
                    if (!isActive) {
                        item.classList.add('active');
                        question.setAttribute('aria-expanded', 'true');
                    }
                };

                question.addEventListener('click', toggle);
                question.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        toggle();
                    }
                });
            });
        }

        setupParticles() {
            const container = document.querySelector('.particles');
            if (!container || prefersReducedMotion) {
                return;
            }

            const populate = () => {
                const desired = window.innerWidth > 1200 ? 16 : window.innerWidth > 768 ? 11 : 7;

                container.innerHTML = '';

                for (let i = 0; i < desired; i += 1) {
                    container.appendChild(createParticle());
                }
            };

            populate();
            window.addEventListener('resize', throttle(populate, 300));
        }

        setupForm() {
            const form = document.querySelector('.contact-form');
            if (!form) {
                return;
            }

            const status = document.createElement('p');
            status.className = 'form-status';
            status.hidden = true;
            status.setAttribute('role', 'status');
            status.setAttribute('aria-live', 'polite');
            form.appendChild(status);

            form.addEventListener('submit', (event) => {
                event.preventDefault();

                const submitButton = form.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.textContent = 'Отправляем…';
                }

                setTimeout(() => {
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = 'Отправить';
                    }

                    status.textContent = 'Спасибо! Мы свяжемся с вами в ближайшее время.';
                    status.hidden = false;

                    form.reset();

                    setTimeout(() => {
                        status.hidden = true;
                    }, 4000);
                }, 1200);
            });
        }
    }

    return new App();
})();

document.addEventListener('DOMContentLoaded', () => {
    NeuroVitalApp.init();
});
