const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = 1000;
const SITES_ROOT = __dirname;
const DEFAULT_SITE = 'cancero.tech';

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

const sendError = (res, statusCode, message) => {
    res.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(message);
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

const server = http.createServer(async (req, res) => {
    try {
        const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const hostname = requestUrl.hostname;
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
        sendError(res, 500, 'Internal Server Error');
    }
});

server.listen(PORT, () => {
    console.log(`Static site is running on http://localhost:${PORT}`);
});
