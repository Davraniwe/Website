/**
 * Lisa Biotech — NeuroVasc Gene
 * Интерактивность и анимации
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initHeaderScroll();
    initRevealOnScroll();
    initFAQ();
    initSmoothScroll();
    initCounters();
    initParticles();
});

/**
 * Scroll Progress Bar
 */
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = `${progress}%`;
    }, { passive: true });
}

/**
 * Header Scroll Effect
 */
function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
}

/**
 * Reveal on Scroll Animation
 */
function initRevealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
        reveals.forEach(el => el.classList.add('active'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/**
 * FAQ Accordion
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(i => i.classList.remove('active'));

            // Open clicked if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            if (href === '#' || href === '#top') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const headerHeight = document.querySelector('header')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Animated Counters
 */
function initCounters() {
    const counters = document.querySelectorAll('.metric-value');

    if (!counters.length) return;

    const animateCounter = (counter) => {
        const target = parseFloat(counter.getAttribute('data-count') || counter.textContent);
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 2000;
        const start = performance.now();

        const step = (timestamp) => {
            const progress = Math.min((timestamp - start) / duration, 1);
            const easeProgress = easeOutExpo(progress);
            const current = target * easeProgress;

            counter.textContent = formatNumber(current, target) + suffix;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                counter.textContent = formatNumber(target, target) + suffix;
            }
        };

        requestAnimationFrame(step);
    };

    const formatNumber = (num, target) => {
        if (target >= 1000000) {
            return (num / 1000000).toFixed(1);
        } else if (target >= 1000) {
            return (num / 1000).toFixed(1);
        } else if (target >= 10) {
            return Math.floor(num);
        } else {
            return num.toFixed(1);
        }
    };

    const easeOutExpo = (t) => {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    // Trigger when metrics section is visible
    const metricsSection = document.querySelector('.metrics');
    if (!metricsSection) {
        counters.forEach(counter => animateCounter(counter));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => animateCounter(counter));
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });

    observer.observe(metricsSection);
}

/**
 * Enhanced Particles System
 */
function initParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;

    // Add more dynamic particles
    const particleCount = window.innerWidth > 768 ? 8 : 5;
    const existingParticles = particlesContainer.querySelectorAll('.particle').length;

    for (let i = existingParticles; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particle.style.animationDuration = `${15 + Math.random() * 10}s`;
        particlesContainer.appendChild(particle);
    }
}

/**
 * Form Handling (если будет форма)
 */
function initForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // TODO: Replace with actual endpoint
        console.log('Form submitted:', data);

        // Show success message
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправлено ✓';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            form.reset();
        }, 3000);
    });
}

/**
 * Mobile Menu Toggle (если будет)
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded',
            navLinks.classList.contains('active') ? 'true' : 'false'
        );
    });
}

/**
 * Cursor Trail Effect (optional premium effect)
 */
function initCursorTrail() {
    if (window.innerWidth < 768) return; // Skip on mobile

    const trail = [];
    const trailLength = 8;

    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.style.cssText = `
            position: fixed;
            width: ${8 - i}px;
            height: ${8 - i}px;
            border-radius: 50%;
            background: rgba(0, 180, 216, ${0.6 - i * 0.08});
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(dot);
        trail.push(dot);
    }

    let mouseX = 0, mouseY = 0;
    let positions = Array(trailLength).fill({ x: 0, y: 0 });

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        positions.unshift({ x: mouseX, y: mouseY });
        positions = positions.slice(0, trailLength);

        trail.forEach((dot, i) => {
            const pos = positions[i];
            dot.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/**
 * Initialize All (optional features)
 */
// initCursorTrail(); // Uncomment for cursor trail effect
initForm();
