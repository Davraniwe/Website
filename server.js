const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = 1000;
const PUBLIC_DIR = __dirname;

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

const server = http.createServer(async (req, res) => {
    try {
        const requestUrl = new URL(req.url, `http://${req.headers.host}`);
        let relativePath = decodeURIComponent(requestUrl.pathname);

        if (relativePath.includes('\0')) {
            sendError(res, 400, 'Bad Request');
            return;
        }

        if (relativePath.endsWith('/')) {
            relativePath = path.join(relativePath, 'index.html');
        }

        const absolutePath = path.join(PUBLIC_DIR, relativePath);

        if (!absolutePath.startsWith(PUBLIC_DIR)) {
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
