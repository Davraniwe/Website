// Smooth scroll for internal links
document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').substring(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Mobile navigation toggle
(() => {
    const menu = document.querySelector('.nav-menu');
    const burger = document.querySelector('.hamburger');
    if (!menu || !burger) return;

    burger.addEventListener('click', () => {
        const open = menu.classList.toggle('is-open');
        burger.classList.toggle('is-active', open);
    });

    menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            if (!menu.classList.contains('is-open')) return;
            menu.classList.remove('is-open');
            burger.classList.remove('is-active');
        });
    });
})();

// Google Form configuration
const GOOGLE_FORM_ENDPOINT = 'https://docs.google.com/forms/d/e/1FAIpQLScpWf7-RuYeJ52lHmTdznZF09ri9rOJcHAnuvfY2qSRBu8POg/formResponse';
const GOOGLE_FORM_ENTRIES = {
    name: 'entry.1301184674',
    email: 'entry.1017719845',
    partnership: 'entry.628951633',
    partnershipSentinel: 'entry.628951633_sentinel',
    message: 'entry.1100639162',
    timestamp: ''
};

const GOOGLE_FORM_STATIC_FIELDS = {
    fvv: '1',
    draftResponse: '[]',
    pageHistory: '0',
    submissionTimestamp: '-1',
    submit: 'Submit'
};

// Tabs (market B2B/B2C)
document.querySelectorAll('[data-tabs]').forEach((tabs) => {
    const tabButtons = tabs.querySelectorAll('.tab');
    const panels = tabs.querySelectorAll('.panel');
    tabButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
            panels.forEach(p => p.classList.remove('is-active'));
            btn.classList.add('is-active');
            btn.setAttribute('aria-selected', 'true');
            const panel = tabs.querySelector('#' + btn.getAttribute('aria-controls'));
            if (panel) panel.classList.add('is-active');
        });
    });
});

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('in');
    });
}, { threshold: 0.08 });
document.querySelectorAll('.card, .grid-3 > *, .grid-4 > *, .split > *, .timeline li').forEach(el => {
    el.classList.add('reveal');
    io.observe(el);
});

// Donut chart builder
(function buildDonuts() {
    const palettes = [
        ['#59c4d8', '#66d28c', '#f7c873', '#7aa9f7', '#d98ceb'],
        ['#69d6e8', '#8dd9b3', '#ffd487', '#9ab7ff', '#e3a9f3']
    ];
    document.querySelectorAll('.donut').forEach((wrap, idx) => {
        const svg = wrap.querySelector('svg');
        const group = svg.querySelector('.slices');
        const dataItems = [...wrap.querySelectorAll('.donut-data li')];
        const legend = wrap.querySelector('.legend');
        const radius = 85;
        const circ = 2 * Math.PI * radius;
        const holeText = svg.querySelector('.donut-subtitle');

        const values = dataItems.map(li => Number(li.dataset.value) || 0);
        const labels = dataItems.map(li => li.dataset.label || '');
        const total = values.reduce((a, b) => a + b, 0) || 1;

        // update center subtitle
        if (holeText) holeText.textContent = `${total} ед.`;

        let offset = 0;
        const gap = 2; // px along stroke
        const colors = palettes[idx % palettes.length];

        values.forEach((val, i) => {
            const seg = (val / total) * circ;
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            path.setAttribute('cx', '110'); path.setAttribute('cy', '110'); path.setAttribute('r', String(radius));
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', colors[i % colors.length]);
            path.setAttribute('stroke-width', '30');
            // dasharray + offset
            const visible = Math.max(seg - gap, 0);
            path.setAttribute('stroke-dasharray', `${visible} ${circ - visible}`);
            path.setAttribute('stroke-dashoffset', String(-offset));
            path.setAttribute('stroke-linecap', 'butt');
            group.appendChild(path);
            offset += seg;
        });

        // Legend
        legend.innerHTML = '';
        values.forEach((val, i) => {
            const item = document.createElement('div');
            item.className = 'item';
            const sw = document.createElement('span'); sw.className = 'sw'; sw.style.background = colors[i % colors.length];
            const pct = total ? Math.round((val / total) * 100) : 0;
            item.appendChild(sw);
            const text = document.createElement('span'); text.textContent = `${labels[i]} — ${pct}%`;
            item.appendChild(text);
            legend.appendChild(item);
        });
    });
})();

// Contact form → Google Forms bridge
(() => {
    const setStatus = (el, type, message) => {
        if (!el) return;
        el.textContent = message || '';
        el.hidden = !message;
        el.classList.remove('is-success', 'is-error');
        if (type === 'success') el.classList.add('is-success');
        if (type === 'error') el.classList.add('is-error');
    };

    const assignNames = (form) => {
        form.querySelectorAll('[data-entry]').forEach((field) => {
            const key = field.dataset.entry;
            if (key && GOOGLE_FORM_ENTRIES[key]) {
                field.name = GOOGLE_FORM_ENTRIES[key];
            }
        });
    };

    let tokenPromise = null;
    const fetchTokens = async () => {
        if (!tokenPromise) {
            tokenPromise = fetch('/api/google-form-token', { cache: 'no-store' })
                .then(async (response) => {
                    if (!response.ok) {
                        throw new Error(`Token request failed with status ${response.status}`);
                    }
                    const data = await response.json();
                    if (!data || data.status !== 'ok' || !data.tokens) {
                        throw new Error('Token response malformed');
                    }
                    return data.tokens;
                })
                .catch((error) => {
                    tokenPromise = null;
                    throw error;
                });
        }
        return tokenPromise;
    };

    // Пробуем заранее получить токены, чтобы сократить задержку при первом отправлении
    fetchTokens().catch(() => {
        tokenPromise = null;
    });

    document.querySelectorAll('form[data-google-form]').forEach((form) => {
        const statusEl = form.querySelector('[data-form-status]');
        const submitBtn = form.querySelector('[data-form-submit]');

        assignNames(form);

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const fields = {
                name: form.querySelector('[data-entry="name"]'),
                email: form.querySelector('[data-entry="email"]'),
                partnership: form.querySelector('[data-entry="partnership"]'),
                message: form.querySelector('[data-entry="message"]')
            };

            const values = {
                name: fields.name?.value.trim() || '',
                email: fields.email?.value.trim() || '',
                partnership: fields.partnership?.value || '',
                message: fields.message?.value.trim() || ''
            };

            const validateField = (field, message) => {
                if (!field) return false;
                field.setCustomValidity(message);
                field.reportValidity();
                setTimeout(() => field.setCustomValidity(''), 0);
                return true;
            };

            if (!values.name) {
                if (fields.name) fields.name.focus();
                validateField(fields.name, 'Укажите имя');
                return;
            }

            if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
                if (fields.email) fields.email.focus();
                validateField(fields.email, 'Введите корректный email');
                return;
            }

            if (!values.partnership) {
                if (fields.partnership) fields.partnership.focus();
                validateField(fields.partnership, 'Выберите вариант сотрудничества');
                return;
            }

            let dynamicTokens;
            try {
                submitBtn?.setAttribute('disabled', 'true');
                submitBtn?.classList.add('is-loading');
                setStatus(statusEl, null, 'Отправляем заявку...');
                dynamicTokens = await fetchTokens();
            } catch (error) {
                console.error('Google Form token error:', error);
                setStatus(statusEl, 'error', 'Не удалось подключиться к форме. Попробуйте позже.');
                submitBtn?.removeAttribute('disabled');
                submitBtn?.classList.remove('is-loading');
                return;
            }

            const formData = new FormData();
            const entries = GOOGLE_FORM_ENTRIES;

            if (entries.name) formData.append(entries.name, values.name);
            if (entries.email) formData.append(entries.email, values.email);
            if (entries.partnership) formData.append(entries.partnership, values.partnership);
            if (entries.message) formData.append(entries.message, values.message);
            if (entries.timestamp) formData.append(entries.timestamp, new Date().toISOString());
            if (entries.partnershipSentinel) formData.append(entries.partnershipSentinel, '');

            Object.entries(GOOGLE_FORM_STATIC_FIELDS).forEach(([key, value]) => {
                formData.append(key, value);
            });

            if (dynamicTokens.fbzx) {
                formData.append('fbzx', dynamicTokens.fbzx);
            }
            if (dynamicTokens.partialResponse) {
                formData.append('partialResponse', dynamicTokens.partialResponse);
            }
            if (dynamicTokens.pageHistory) {
                formData.append('pageHistory', dynamicTokens.pageHistory);
            }
            if (dynamicTokens.draftResponse) {
                formData.set('draftResponse', dynamicTokens.draftResponse);
            }
            if (dynamicTokens.submissionTimestamp) {
                formData.append('submissionTimestamp', dynamicTokens.submissionTimestamp);
            }

            try {
                await fetch(GOOGLE_FORM_ENDPOINT, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: formData
                });

                setStatus(statusEl, 'success', 'Заявка отправлена. Мы свяжемся с вами в ближайшее время.');
                form.reset();
                if (fields.partnership) {
                    fields.partnership.selectedIndex = 0;
                }
                tokenPromise = null; // запросим свежие токены для следующего отправления
            } catch (error) {
                console.error('Google Form submit error:', error);
                setStatus(statusEl, 'error', 'Не удалось отправить заявку. Попробуйте снова или свяжитесь по email.');
            } finally {
                submitBtn?.removeAttribute('disabled');
                submitBtn?.classList.remove('is-loading');
            }
        });
    });
})();
