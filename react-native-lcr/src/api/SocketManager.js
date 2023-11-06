const tcp = require('react-native-tcp-socket');
const Buffer = require('buffer').Buffer;

const SOCKET_TIMEOUT = 2000;
const RECONNECT_DELAY = 3000;

const StreamStatus = {
  Disconnected: 'disconnected',
  Connected: 'connected',
  Connecting: 'connecting',
};

export default class SocketManager {
  constructor({onIdle, onLog, onStatusChange, onResponse}) {
    this.onIdle = onIdle;
    this.onLog = onLog;
    this.onStatusChange = onStatusChange;
    this.onResponse = onResponse;
    this.createSocket = this.createSocket.bind(this);
    this.connected = this.connected.bind(this);
    this.reconnect = this.reconnect.bind(this);
    this.connect = this.connect.bind(this);
    this.sendWriteBuffer = this.sendWriteBuffer.bind(this);
    this.socketValid = this.socketValid.bind(this);
  }

  write(message) {
    // if (this.writeBuffer) {
    //   this.onLog("Busy")
    // } else {
    this.writeBuffer = new Buffer(message, 'base64');
    this.sendWriteBuffer();
    // }
  }

  connect(environment) {
    this.environment = environment;
    this.connectedOnce = false;
    this.onLog('Connecting to: ' + environment.host + ':' + environment.port);
    this.createSocket();
  }

  createSocket() {
    try {
      if (this.socketValid()) {
        this.onLog('Socket already exists, reusing');
        this.onStatusChange(StreamStatus.Connected);
        return;
      }
      const {host, port} = this.environment;
      this.onStatusChange(StreamStatus.Connecting);

      let expired = false;
      const timer = setTimeout(() => {
        expired = true;
        this.onLog('Connection timeout');
        // this.socket.destroy();
        this.reconnect();
      }, SOCKET_TIMEOUT);

      this.socket = tcp.createConnection({host, port});
      this.socket.on('connect', () => {
        if (!expired) {
          this.discardSocket = false;
          clearTimeout(timer);
          this.onLog('Connected');
          this.connected();
        }
      });
      this.socket.on('error', error => {
        this.onLog('socket error event: ', error);
      });
    } catch (error) {
      this.onStatusChange(StreamStatus.Disconnected);
      this.onLog('Error creating socket: ' + error);
    }
  }

  connected() {
    if (!this.socketValid()) {
      this.onLog(
        'Error: connect() trying to add listeners to an unprepared socket',
      );
      return;
    }
    this.onStatusChange(StreamStatus.Connected);
    this.socket.on('close', () => this.reconnect());
    if (this.writeBuffer) {
      this.sendWriteBuffer();
    }
  }

  reconnect() {
    this.onLog(`Refreshing connection in ${RECONNECT_DELAY / 1000} seconds`);
    this.discardSocket = true;
    this.onStatusChange(StreamStatus.Disconnected);
    setTimeout(() => this.createSocket(), RECONNECT_DELAY); //delay a few seconds before retrying
  }

  socketValid() {
    return (
      this.socket &&
      !this.discardSocket &&
      !this.socket.destroyed &&
      !this.socket.connecting
    );
  }

  sendWriteBuffer() {
    if (!this.socketValid()) {
      return;
    }
    let buffer = new Buffer([]);
    let timer = null;
    const incDataTimeout = 300;

    this.socket.on('data', data => {
      clearTimeout(timer);
      buffer = Buffer.concat([buffer, data]);

      timer = setTimeout(() => {
        this.onResponse(buffer.toJSON().data);
        this.socket.removeAllListeners('data');
      }, incDataTimeout);
    });

    this.socket.write(this.writeBuffer, () => {
      this.writeBuffer = null;

      timer = setTimeout(() => {
        this.onIdle(true);
        this.socket.removeAllListeners('data');
      }, SOCKET_TIMEOUT);
    });
  }
}
