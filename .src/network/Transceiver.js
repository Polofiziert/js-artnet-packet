/**
 * Art-Net Transceiver
 * Handles UDP send/receive of Art-Net packets
 */

const dgram = require('dgram');
const EventEmitter = require('events');
const PacketParser = require('../parser/PacketParser');
const { ARTNET_PORT, ARTNET_BROADCAST } = require('../constants');

class Transceiver extends EventEmitter {
  /**
   * @param {number} port - UDP port (default: 6454)
   * @param {string} address - Bind address (default: "0.0.0.0")
   * @param {string} broadcast - Broadcast address (default: "255.255.255.255")
   */
  constructor(port = ARTNET_PORT, address = "0.0.0.0", broadcast = ARTNET_BROADCAST) {
    super();

    this.port = port;
    this.address = address;
    this.broadcast = broadcast;
    this.socket = null;
    this.isListening = false;
  }

  /**
   * Create and bind UDP socket
   * @param {Function} callback - Called when socket is ready
   */
  listen(callback) {
    if (this.isListening) {
      if (callback) callback();
      return;
    }

    this.socket = dgram.createSocket('udp4');

    // Set socket options
    this.socket.on('error', (err) => {
      this.emit('error', err);
    });

    this.socket.on('message', (buffer, rinfo) => {
      this._handleMessage(buffer, rinfo);
    });

    this.socket.on('listening', () => {
      this.isListening = true;
      this.emit('listening', {
        port: this.port,
        address: this.address,
      });
      if (callback) callback();
    });

    // Enable reuse address
    this.socket.bind(this.port, this.address);
  }

  /**
   * Close the UDP socket
   * @param {Function} callback - Called when socket is closed
   */
  close(callback) {
    if (!this.socket) {
      if (callback) callback();
      return;
    }

    this.socket.close(() => {
      this.isListening = false;
      this.socket = null;
      this.emit('close');
      if (callback) callback();
    });
  }

  /**
   * Send a packet
   * @param {Object} packet - The packet to send (must have toBuffer method)
   * @param {string} remoteAddress - Remote address (default: broadcast)
   * @param {Function} callback - Called when sent
   */
  send(packet, remoteAddress = this.broadcast, callback) {
    if (!this.socket) {
      const err = new Error("Socket not initialized. Call listen() first.");
      if (callback) callback(err);
      this.emit('error', err);
      return;
    }

    try {
      const buffer = packet.toBuffer();
      this.socket.send(buffer, 0, buffer.length, this.port, remoteAddress, (err) => {
        if (err) {
          this.emit('error', err);
        } else {
          this.emit('sent', {
            packet: packet.constructor.name,
            size: buffer.length,
            address: remoteAddress,
          });
        }
        if (callback) callback(err);
      });
    } catch (err) {
      this.emit('error', err);
      if (callback) callback(err);
    }
  }

  /**
   * Send a packet and wait for response
   * @param {Object} packet - The packet to send
   * @param {string} remoteAddress - Remote address
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise}
   */
  sendAndWait(packet, remoteAddress = this.broadcast, timeout = 3000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("No response received"));
      }, timeout);

      const handler = (data, info) => {
        clearTimeout(timer);
        this.removeListener('packet', handler);
        resolve({ packet: data, info });
      };

      this.on('packet', handler);
      this.send(packet, remoteAddress, (err) => {
        if (err) {
          clearTimeout(timer);
          this.removeListener('packet', handler);
          reject(err);
        }
      });
    });
  }

  /**
   * Internal message handler
   * @private
   */
  _handleMessage(buffer, rinfo) {
    try {
      // Check if valid Art-Net packet
      if (!PacketParser.isArtNetPacket(buffer)) {
        this.emit('invalidPacket', { buffer, info: rinfo });
        return;
      }

      // Parse packet
      const packet = PacketParser.parse(buffer);

      // Emit events
      this.emit('packet', packet, rinfo);
      this.emit(packet.constructor.name, packet, rinfo);

    } catch (err) {
      this.emit('parseError', { error: err, buffer, info: rinfo });
    }
  }

  /**
   * Get socket address information
   * @returns {Object|null}
   */
  getAddress() {
    if (!this.socket) {
      return null;
    }
    return this.socket.address();
  }

  /**
   * Set broadcast option
   * @param {boolean} enabled
   */
  setBroadcast(enabled) {
    if (!this.socket) {
      throw new Error("Socket not initialized");
    }
    this.socket.setBroadcast(enabled);
  }

  /**
   * Get multicast membership
   * @returns {Array}
   */
  getMulticastMembership() {
    if (!this.socket) {
      throw new Error("Socket not initialized");
    }
    return this.socket.getMulticastMembership();
  }
}

module.exports = Transceiver;
