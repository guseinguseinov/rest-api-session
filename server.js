import app from './app.js';
import http from 'http';

const server = http.createServer(app);

server.listen(8080, () => {
    console.log('Server started at http://localhost:8080');
});