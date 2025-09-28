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

// Contact form (demo)
document.querySelectorAll('.contact-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[name="email"]');
        const success = form.querySelector('.form-success');
        if (!email || !email.value.includes('@')) {
            email?.setCustomValidity('Введите корректный e‑mail');
            email?.reportValidity();
            setTimeout(() => email?.setCustomValidity(''), 0);
            return;
        }
        success?.removeAttribute('hidden');
        form.reset();
    });
});
