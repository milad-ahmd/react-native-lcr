import {StreamResponse, DecimalType} from '../api/StreamResponse';
import ReturnCode from './ReturnCode';
import RequestId from './RequestId';
import {NativeModules} from 'react-native';
import {actions as streamActions} from '../redux/modules/stream';
import Socket from './SocketManager';
import StreamStatus from './StreamStatus';
const MAX_REQUEST_RETRIES = 3;

class StreamQueue {
  constructor() {
    this.requestQueue = [];
    this.reqCount = 0;
    this.queue = this.queue.bind(this);
    this.processNextQueued = this.processNextQueued.bind(this);
    this.processResponse = this.processResponse.bind(this);
    this.setStreamStatus = this.setStreamStatus.bind(this);
    this.connect = this.connect.bind(this);
    this.log = this.log.bind(this);
    this.processIdle = this.processIdle.bind(this);
  }

  connect(emitter) {
    this.emitter = emitter;
    this.log('Sending environment');
    this.socket = new Socket({
      onIdle: this.processIdle,
      onResponse: this.processResponse,
      onLog: this.log,
      onStatusChange: this.setStreamStatus,
    });
    this.socket.connect({
      port: 8899,
      host: '10.10.100.254',
    });
  }

  connect(host, port ,emitter) {
    this.emitter = emitter;
    this.log('Sending environment');
    this.socket = new Socket({
      onIdle: this.processIdle,
      onResponse: this.processResponse,
      onLog: this.log,
      onStatusChange: this.setStreamStatus,
    });
    this.socket.connect({
      port,
      host,
    });
  }


  log(msg) {
    this.emitter(streamActions.log(msg));
  }
  log(msg,streamActions) {
    this.emitter(streamActions.log(msg));
  }

  setStreamStatus(status) {
    if (status != StreamStatus.Connected) {
      status = StreamStatus.Connecting;
    }
    this.emitter(streamActions.setStreamStatus(status));
  }

  setStreamStatus(status,streamActions) {
    if (status != StreamStatus.Connected) {
      status = StreamStatus.Connecting;
    }
    this.emitter(streamActions.setStreamStatus(status));
  }

  queue(request) {
    this.reqCount++;
    const promise = new Promise((resolve, reject) => {
      this.requestQueue.push({
        id: this.reqCount,
        resolve,
        reject,
        retries: MAX_REQUEST_RETRIES,
        ...request,
      });
    });
    this.processNextQueued();
    return promise;
  }

  processNextQueued() {
    if (this.request || this.requestQueue.length == 0) {
      return;
    }

    this.request = this.requestQueue.shift();
    const {address, requestName, body} = this.request;

    this.log(
      `Sending request: ${requestName} (${this.requestQueue.length} queued)`,
    );
    this.sendToSocket(body, address);
  }

  processResponse(response) {
    if (!this.request) {
      console.warn('response received with no request: ' + response);
      return;
    }
    let result = null;
    let code = new DecimalType(1);
    try {
      let message = new StreamResponse({code}).read(response);
      console.log(message);
      result = message.code;
    } catch (e) {
      console.log(e);
    }

    if (result == ReturnCode.Success) {
      this.resolveRequest(response);
    } else if (result == ReturnCode.Queued) {
      this.sendCheckRequest();
    } else {
      this.log('response invalid');
      this.attemptRetry();
    }
  }

  processIdle() {
    if (!this.request) {
      this.log('idle');
    } else if (this.request.ignoreTimeout) {
      this.rejectRequest('timed out');
    } else {
      this.log('timed out');
      this.attemptRetry();
    }
  }

  attemptRetry() {
    if (this.request.retries <= 0) {
      this.log('max retries reached');
      this.rejectRequest('max retries reached');
      return;
    }
    this.request.retries--;
    this.requestQueue.unshift(this.request);
    this.request = null;
    this.processNextQueued();
  }

  resolveRequest(data) {
    const {resolve, response} = this.request;
    const parsed = response.read(data);

    this.log('Response received: ' + JSON.stringify(parsed));
    resolve(parsed);
    this.request = null;
    this.processNextQueued();
  }

  rejectRequest(error) {
    this.log(`Request error (${this.request.requestName}): ${error}`);
    this.request.reject(error);
    this.request = null;
    this.processNextQueued();
  }

  sendCheckRequest() {
    this.log("received 'queued' response - sending check request");
    this.request.retries--;
    setTimeout(() => {
      if (this.request == null) {
        return;
      }
      this.sendToSocket([RequestId.CheckRequest], this.request.address);
    }, 200);
  }

  sendToSocket(body, address) {
    NativeModules.LCR.buildMessageFunc(body, address)
      .then(message => {
        this.socket.write(message);
      })
      .catch(error => {
        this.rejectRequest('Error building message: ' + error);
      });
  }
}
const queue = new StreamQueue();
export default queue;
