import app from './App';
import http from 'http';
import socket from './socket';

const server = http.createServer(app);
socket.init(server);

const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(port);
});
