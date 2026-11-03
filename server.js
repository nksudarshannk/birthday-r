const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 8080;
const MIME = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.mp3': 'audio/mpeg'
};

const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/') reqPath = '/index.html';
    const filePath = path.join(__dirname, reqPath);

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, '0.0.0.0', () => {
    const interfaces = os.networkInterfaces();
    let localIp = 'localhost';
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                localIp = iface.address;
                break;
            }
        }
    }
    console.log('==============================================================');
    console.log('  🎂 FLYING BOSS - BIRTHDAY SURPRISE LOCAL SERVER ACTIVE!     ');
    console.log('==============================================================');
    console.log(`  🖥️ On your PC browser:    http://localhost:${PORT}`);
    console.log(`  📱 On your Android phone:  http://${localIp}:${PORT}`);
    console.log('==============================================================');
    console.log('  Tip: Connect PC & Android phone to the same Wi-Fi network.');
    console.log('  Press Ctrl+C in this window to stop the server.');
    console.log('==============================================================');
});
