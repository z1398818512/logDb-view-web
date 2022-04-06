'use strict';
const io = require('socket.io-client');
const initIo = (parmse)=>{
  const {roomId} = parmse;
  return new Promise((resolve,reject)=>{
    const socket = io('http://172.16.30.231:7001',{
      query: {roomId}
    });
    // 连接服务端
    socket.on('connect', () => {
      console.log('connect!');
      resolve(socket)
    });

    socket.on('sendError', msg => {
      console.log('myChat from sendError: %s!', JSON.stringify(msg));
      resolve(socket)
    });

    // 系统事件
    socket.on('disconnect', msg => {
      console.log('ops,连接关闭');
      resolve(socket)
    });

    socket.on('disconnecting', () => {
      console.log('ops,连接关闭');
      resolve(socket)
    });

    socket.on('error', msg => {
      console.log('ops,error')
      resolve(socket)
    });
  })
}
   
 
export default initIo;