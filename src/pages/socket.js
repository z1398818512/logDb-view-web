'use strict';
const io = require('socket.io-client');

const initIo = (params) => {
  const { roomId, onConnection, onClosed, onGetUser } = params;
  return new Promise((resolve) => {
    let timerId = null;

    const socket = io('http://127.0.0.1:7001/admin', {
      path: '/logdb/socket.io',
      query: { roomId, type: 'admin' },
      transports: ['websocket'],
    });

    // 心跳机制
    function handleSendSleep(t = 1000 * 60 * 5) {
      timerId = setInterval(() => {
        socket.emit('sleep', {
          clientType: 'admin',
          data: '',
          roomId: roomId,
          type: 'sleep',
        });
      }, t);
    }

    socket.on('connect', () => {
      handleSendSleep();
      resolve(socket);
    });

    socket.on('userList', (data) => {
      const { userId } = data;
      const users = data.data.map((user) => user);
      onConnection({ userId });
      onGetUser(users);
    });

    socket.on('connection', (data) => {
      const { userId } = data;
      onConnection({ userId });
    });

    socket.on('getUser', (data) => {
      const users = data.map((user) => String(user));
      onGetUser(users);
    });

    socket.on('disconnect', () => {
      onClosed();
      clearInterval(timerId);
    });

    // 保持与wss.js相同的emit接口
    socket.emit = (() => {
      const originalEmit = socket.emit.bind(socket);
      return (type, data) => {
        originalEmit(type, {
          data,
          roomId,
        });
      };
    })();
  });
};

export default initIo;
