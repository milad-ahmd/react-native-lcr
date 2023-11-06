export class DataType {
  constructor(length = null) {
    this.length = length;
  }
}

export class AsciiType extends DataType {
  /**
   * Processes a byte as an ascii character
   *
   * @param {[Int]} bytes - An array of bytes represented as decimal
   */
  read(bytes) {
    var content = '';
    for (var i = 0; i < bytes.length; i++) {
      content += String.fromCharCode(bytes[i]);
    }
    return content;
  }
}

export class FloatType extends DataType {
  /**
   * Processes a byte as float
   *
   * @param {[Int]} bytes - An array of bytes represented as decimal
   */
  read(bytes) {
    // Create a buffer
    const buff = new ArrayBuffer(4);
    // Create a data view of it
    const view = new DataView(buff);

    // set bytes
    bytes.forEach(function (b, i) {
      view.setUint8(i, b);
    });
    const result = view.getFloat32(0).toFixed(2);
    return parseFloat(result);
  }
}

export class DecimalType extends DataType {
  /**
   * Processes a byte as decimal
   *
   * @param {[Int]} bytes - An array of bytes represented as decimal
   */
  read(bytes) {
    let binary = bytes.map(val => {
      let b = val.toString(2);
      // creates full 8 bit byte: toString(2) doesn't always include 8 bits
      let pad = new Array(8 - b.length + 1).join('0');
      return pad + b;
    });
    return parseInt(binary.join(''), 2);
  }
}

export class BitfieldType extends DataType {
  /**
   * Processes a byte as an array of bits
   */
  read(bytes) {
    let binary = bytes.map(byte => {
      let data = [];
      if (byte != null) {
        data = byte.toString(2).split('');
      }
      return new Array(8).fill(0).map(val => {
        return Number(data.pop() || 0) == 1;
      });
    });
    return [].concat(...binary.reverse()); //flatten
  }
}

export class StreamResponse {
  /**
   * Initializes a message.
   *
   * @constructor
   * @param {String} bytes - A decimal array containing the message contents in the following format:
   *                            ~~<to><from><status><len0><data0>...<datalen-1><crc0><crc1>
   * @param {(MessageDataType)} data - Message structure expected for data portion of the message
   */
  constructor(data = {}) {
    this.data = data;
  }

  read(bytes) {
    let prefix = new AsciiType().read([bytes[0], bytes[1]]);
    if (prefix != '~~') {
      return;
    }
    //bytes 0 and 1 represent "~~" prefix portion of message
    this.to = new DecimalType(1).read([bytes[2]]);
    this.from = new DecimalType(1).read([bytes[3]]);
    this.status = new BitfieldType(1).read([bytes[4]]);

    var message = bytes.slice(6, bytes.length - 2);
    const response = {};
    for (var key in this.data) {
      let type = this.data[key];
      if (type.length == null) {
        response[key] = type.read(message);
      } else {
        response[key] = type.read(message.splice(0, type.length));
      }
    }
    this.response = response;
    return response;
  }
}
