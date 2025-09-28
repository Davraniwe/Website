const http = require('http');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const PORT = Number(process.env.PORT) || 1000;
const SITES_ROOT = __dirname;
const DEFAULT_SITE = 'cancero.tech';
const EMAIL_RECIPIENTS = process.env.CONTACT_RECIPIENT || 'topoj@bk.ru';
const EMAIL_FROM = process.env.CONTACT_FROM || process.env.CONTACT_SMTP_USER || 'no-reply@cancero.tech';
const CONTACT_TIMEZONE = process.env.CONTACT_TIMEZONE || 'Europe/Moscow';
const MAX_JSON_SIZE = 1024 * 1024;
const SMTP_CONNECTION_TIMEOUT = Number(process.env.CONTACT_SMTP_CONNECTION_TIMEOUT || 15000);
const SMTP_SOCKET_TIMEOUT = Number(process.env.CONTACT_SMTP_SOCKET_TIMEOUT || 15000);
const SMTP_GREETING_TIMEOUT = Number(process.env.CONTACT_SMTP_GREETING_TIMEOUT || 15000);
const SMTP_POOL = String(process.env.CONTACT_SMTP_POOL || 'false').toLowerCase() === 'true';

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.mp4': 'video/mp4',
};

const createHttpError = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const sendError = (res, statusCode, message) => {
    res.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(message);
};

const sendJson = (res, statusCode, payload) => {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    });
    res.end(JSON.stringify(payload));
};

const resolveSiteRoot = async (hostname) => {
    const candidate = (hostname || '').toLowerCase();

    if (candidate) {
        const siteDir = path.join(SITES_ROOT, candidate);
        try {
            const stats = await fs.promises.stat(siteDir);
            if (stats.isDirectory() && siteDir.startsWith(SITES_ROOT)) {
                return siteDir;
            }
        } catch (error) {
            // Ignore and fall back to default site.
        }
    }

    return path.join(SITES_ROOT, DEFAULT_SITE);
};

const sanitizeRelativePath = (rawPath) => {
    let cleaned = rawPath;

    if (cleaned.endsWith('/')) {
        cleaned += 'index.html';
    }

    cleaned = cleaned.replace(/^[/\\]+/, '');
    cleaned = path.normalize(cleaned);
    cleaned = cleaned.replace(/^(?:\.\.(?:[\/\\]|$))+/, '');

    if (!cleaned || cleaned === '.' || cleaned === '..') {
        cleaned = 'index.html';
    }

    return cleaned;
};

const sanitizeText = (value) => (typeof value === 'string' ? value.trim() : '');

const normalizePhone = (value) => sanitizeText(value).replace(/[^+\d]/g, '');

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const readJsonBody = (req, limit = MAX_JSON_SIZE) => new Promise((resolve, reject) => {
    let received = 0;
    let body = '';

    req.setEncoding('utf8');

    req.on('data', (chunk) => {
        received += chunk.length;

        if (received > limit) {
            req.destroy();
            reject(createHttpError(413, 'Слишком большой запрос'));
            return;
        }

        body += chunk;
    });

    req.on('end', () => {
        if (!body) {
            resolve({});
            return;
        }

        try {
            resolve(JSON.parse(body));
        } catch (error) {
            reject(createHttpError(400, 'Некорректный JSON в запросе'));
        }
    });

    req.on('error', (error) => {
        reject(error);
    });
});

const parseContactPayload = (raw) => {
    if (!raw || typeof raw !== 'object') {
        throw createHttpError(400, 'Некорректный формат запроса');
    }

    const type = raw.type === 'b2b' ? 'b2b' : 'b2c';
    const privacyAccepted = Boolean(raw.privacyAccepted);

    if (!privacyAccepted) {
        throw createHttpError(400, 'Необходимо подтвердить согласие на обработку данных.');
    }

    const page = sanitizeText(raw.page);

    if (type === 'b2c') {
        const contact = {
            type,
            page,
            privacyAccepted,
            subjectHint: '',
            replyTo: '',
            data: {
                fullName: sanitizeText(raw.name),
                city: sanitizeText(raw.city),
                diagnosis: sanitizeText(raw.diagnosis),
                email: sanitizeText(raw.email),
                phoneRaw: sanitizeText(raw.phone),
            },
        };

        contact.data.phone = normalizePhone(contact.data.phoneRaw);
        contact.subjectHint = contact.data.fullName;
        contact.replyTo = contact.data.email;

        const missing = [];
        if (!contact.data.fullName) missing.push('ФИО');
        if (!contact.data.city) missing.push('Город');
        if (!contact.data.phoneRaw) missing.push('Телефон');
        if (!contact.data.email) missing.push('Email');

        if (missing.length) {
            throw createHttpError(400, `Заполните обязательные поля: ${missing.join(', ')}`);
        }

        if (!isValidEmail(contact.data.email)) {
            throw createHttpError(400, 'Укажите корректный email.');
        }

        return contact;
    }

    const contact = {
        type,
        page,
        privacyAccepted,
        subjectHint: '',
        replyTo: '',
        data: {
            company: sanitizeText(raw.company),
            role: sanitizeText(raw.role),
            location: sanitizeText(raw.location),
            email: sanitizeText(raw.b2bEmail),
            phoneRaw: sanitizeText(raw.b2bPhone),
            comment: sanitizeText(raw.comment),
        },
    };

    contact.data.phone = normalizePhone(contact.data.phoneRaw);
    contact.subjectHint = contact.data.company;
    contact.replyTo = contact.data.email;

    const missing = [];
    if (!contact.data.company) missing.push('Компания');
    if (!contact.data.role) missing.push('Должность');
    if (!contact.data.location) missing.push('Страна/Город');
    if (!contact.data.phoneRaw) missing.push('Телефон');
    if (!contact.data.email) missing.push('Email');

    if (missing.length) {
        throw createHttpError(400, `Заполните обязательные поля: ${missing.join(', ')}`);
    }

    if (!isValidEmail(contact.data.email)) {
        throw createHttpError(400, 'Укажите корректный email.');
    }

    return contact;
};

const composeEmailSubject = (contact) => {
    const base = contact.type === 'b2b' ? 'B2B заявка' : 'Заявка от пациента';
    const suffix = contact.subjectHint ? ` — ${contact.subjectHint}` : '';
    return `[cancero.tech] ${base}${suffix}`;
};

const composeEmailBody = (contact, context) => {
    const lines = [];

    lines.push(`Тип заявки: ${contact.type === 'b2b' ? 'B2B (фарма/лаборатории)' : 'Пациент'}`);
    lines.push(`Получатель: ${EMAIL_RECIPIENTS}`);
    lines.push(`Хост: ${context.hostname || '-'}`);
    lines.push(
        `Отправлено: ${new Date().toLocaleString('ru-RU', {
            timeZone: CONTACT_TIMEZONE,
            hour12: false,
        })}`,
    );

    if (contact.page) {
        lines.push(`Страница: ${contact.page}`);
    }

    if (context.referer) {
        lines.push(`Referer: ${context.referer}`);
    }

    lines.push('');

    if (contact.type === 'b2c') {
        const data = contact.data;
        lines.push(`ФИО: ${data.fullName}`);
        lines.push(`Город: ${data.city}`);
        if (data.diagnosis) {
            lines.push(`Диагноз/Стадия: ${data.diagnosis}`);
        }
        lines.push(`Телефон: ${data.phoneRaw || data.phone || '-'}`);
        lines.push(`Email: ${data.email}`);
    } else {
        const data = contact.data;
        lines.push(`Компания: ${data.company}`);
        lines.push(`Должность: ${data.role}`);
        lines.push(`Страна/Город: ${data.location}`);
        lines.push(`Телефон: ${data.phoneRaw || data.phone || '-'}`);
        lines.push(`Email: ${data.email}`);
        if (data.comment) {
            lines.push('');
            lines.push('Комментарий:');
            lines.push(data.comment);
        }
    }

    lines.push('');
    lines.push(`IP: ${context.ip || '-'}`);
    if (context.userAgent) {
        lines.push(`User-Agent: ${context.userAgent}`);
    }

    return lines.join('\n');
};

const createEmailTransport = () => {
    if (process.env.CONTACT_TRANSPORT_URL) {
        return nodemailer.createTransport(process.env.CONTACT_TRANSPORT_URL);
    }

    if (process.env.CONTACT_SMTP_HOST) {
        const port = process.env.CONTACT_SMTP_PORT
            ? Number(process.env.CONTACT_SMTP_PORT)
            : 587;
        const secure = String(process.env.CONTACT_SMTP_SECURE || '').toLowerCase() === 'true';
        const user = process.env.CONTACT_SMTP_USER;
        const pass = process.env.CONTACT_SMTP_PASS;

        const transportConfig = {
            host: process.env.CONTACT_SMTP_HOST,
            port: Number.isFinite(port) ? port : 587,
            secure,
            pool: SMTP_POOL,
            connectionTimeout: SMTP_CONNECTION_TIMEOUT,
            socketTimeout: SMTP_SOCKET_TIMEOUT,
            greetingTimeout: SMTP_GREETING_TIMEOUT,
        };

        if (user && pass) {
            transportConfig.auth = { user, pass };
        }

        return nodemailer.createTransport(transportConfig);
    }

    if (process.env.CONTACT_USE_SENDMAIL === 'true') {
        return nodemailer.createTransport({
            sendmail: true,
            newline: 'unix',
            path: process.env.SENDMAIL_PATH || '/usr/sbin/sendmail',
        });
    }

    return null;
};

let emailTransport;
let emailTransportInitialized = false;

const getEmailTransport = () => {
    if (!emailTransportInitialized) {
        emailTransportInitialized = true;
        try {
            emailTransport = createEmailTransport();
            if (!emailTransport) {
                console.warn('Email transport is not configured. Contact form submissions will fail.');
            }
        } catch (error) {
            console.error('Failed to initialize email transport:', error);
        }
    }

    return emailTransport;
};

const handleContactRequest = async (req, res, requestUrl, hostname) => {
    try {
        const payload = await readJsonBody(req, MAX_JSON_SIZE);
        const contact = parseContactPayload(payload);
        const transport = getEmailTransport();

        if (!transport) {
            throw createHttpError(
                500,
                'Отправка заявок временно недоступна. Свяжитесь с нами другим способом.',
            );
        }

        const context = {
            hostname,
            origin: `${requestUrl.protocol}//${requestUrl.host}`,
            page: contact.page,
            referer: req.headers.referer || req.headers.referrer || '',
            ip: (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress,
            userAgent: req.headers['user-agent'] || '',
        };

        const subject = composeEmailSubject(contact);
        const text = composeEmailBody(contact, context);

        await transport.sendMail({
            from: EMAIL_FROM,
            to: EMAIL_RECIPIENTS,
            replyTo: contact.replyTo || EMAIL_FROM,
            subject,
            text,
        });

        sendJson(res, 201, {
            status: 'ok',
            message: 'Заявка отправлена. Мы свяжемся с вами в ближайшее время.',
        });
    } catch (error) {
        if (!error.statusCode) {
            console.error('Contact form handler error:', error);
        }

        const statusCode = error.statusCode || 500;
        const message = statusCode >= 500
            ? 'Не удалось отправить заявку. Попробуйте позже.'
            : error.message || 'Некорректные данные формы.';

        sendJson(res, statusCode, { error: message });
    }
};

const server = http.createServer(async (req, res) => {
    try {
        const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const hostname = requestUrl.hostname;
        const pathname = requestUrl.pathname;

        if (pathname === '/api/contact') {
            if (req.method === 'OPTIONS') {
                res.writeHead(204, {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                });
                res.end();
                return;
            }

            if (req.method !== 'POST') {
                sendJson(res, 405, { error: 'Метод не поддерживается' });
                return;
            }

            await handleContactRequest(req, res, requestUrl, hostname);
            return;
        }

        const siteRoot = await resolveSiteRoot(hostname);
        let relativePath = decodeURIComponent(requestUrl.pathname);

        if (relativePath.includes('\0')) {
            sendError(res, 400, 'Bad Request');
            return;
        }

        const sanitizedPath = sanitizeRelativePath(relativePath);
        const absolutePath = path.join(siteRoot, sanitizedPath);

        if (!absolutePath.startsWith(siteRoot)) {
            sendError(res, 403, 'Forbidden');
            return;
        }

        let fileStats;
        try {
            fileStats = await fs.promises.stat(absolutePath);
        } catch {
            sendError(res, 404, 'Not Found');
            return;
        }

        let filePath = absolutePath;
        if (fileStats.isDirectory()) {
            filePath = path.join(absolutePath, 'index.html');
            try {
                fileStats = await fs.promises.stat(filePath);
            } catch {
                sendError(res, 404, 'Not Found');
                return;
            }
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': fileStats.size,
        });

        const readStream = fs.createReadStream(filePath);
        readStream.on('error', () => {
            sendError(res, 500, 'Internal Server Error');
        });
        readStream.pipe(res);
    } catch (error) {
        console.error('Server error:', error);
        sendError(res, 500, 'Internal Server Error');
    }
});

server.listen(PORT, () => {
    console.log(`Static site is running on http://localhost:${PORT}`);
});
