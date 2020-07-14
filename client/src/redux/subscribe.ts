import io from "socket.io-client";
const socket = io("localhost:5001");

socket.on("test", (data: any): void => {
  console.log(data);
});

export default (store: any): void => {};
