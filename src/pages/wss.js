// const roomId = sessionStorage.getItem('roomId')

export default function ({ onConnection, onClosed, onGetUser }) {
  return new Promise((resolve) => {
    const { roomId } = parseUrlParams(location.href) || {};
    const onMap = new Map();

    const wss = new WebSocket(
      `wss://oivoee.laf.run/__websocket__?type=admin${
        roomId ? '&userId=' + roomId : ''
      }`,
    );

    wss.onopen = (socket) => {
      console.log('connected');
      // wss.send("hi");
    };

    wss.onmessage = (res) => {
      try {
        const data = JSON.parse(res.data || '{}');
        const { type, userId } = data;
        switch (type) {
          case 'connection':
            resolve(wss);
            onConnection({ userId });

            break;
          case 'getUser':
            onGetUser(data.data);

            break;
          default:
            const fun = onMap.get(type);
            if (fun) {
              fun(data.data);
            }
        }
      } catch (err) {}
    };
    wss.on = (type, fun) => {
      onMap.set(type, fun);
    };
    wss.emit = (type, data) => {
      const sendData = JSON.stringify({
        clientType: 'admin',
        data,
        roomId: roomId,
        type: type,
      });
      wss.send(sendData);
    };

    wss.onclose = () => {
      console.log('closed');
      onClosed();
    };
  });
}
export function parseUrlParams(url) {
  const params = {};
  const queryString = url.split('?')[1];
  if (queryString) {
    const pairs = queryString.split('&');
    pairs.forEach((pair) => {
      const [key, value] = pair.split('=');
      params[key] = decodeURIComponent(value);
    });
  }
  return params;
}
