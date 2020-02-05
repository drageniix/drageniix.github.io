import socket from 'socket.io';
import { Server } from 'http';

let io: socket.Server;

export default {
    init(server: Server): void {
        io = socket(server);
        io.on('connection', socket => {
            console.log('connected');
            socket.on('disconnect', () => console.log('Bye!'));
        });
    },
    getIO(): socket.Server {
        if (!io) throw new Error('No active websocket.');
        return io;
    }
};
