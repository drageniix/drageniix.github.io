import openSocket from 'socket.io-client';
const io = openSocket('https://barrow-dev.herokuapp.com');

export default (store: any) => {
    console.log('Store connected');
    io.on('test', (data: any) => console.log(data));
};
