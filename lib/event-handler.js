'use strict';

const EventEmitter = require('events');

class EventHandler extends EventEmitter {
  constructor() {
    super();
    this.listeners = new Map();
    this.proxies = new Map();
  }

  bindListener(name, to, callback) {
    if (!this.listeners.has(to)) {
      this.listeners.set(to, new Map());
    }

    const listeners = this.listeners.get(to);
    const listener = callback.bind(this);
    listeners.set(name, listener);

    to.addListener(name, listener);
    this.listeners.set(to, listeners);
  }

  unbindListener(name, to) {
    const listeners = this.listeners.get(to);
    to.removeListener(name, listeners.get(name));
    listeners.delete(name);

    if (listeners.size) {
      this.listeners.set(to, listeners);
    } else {
      this.listeners.delete(to);
    }
  }

  proxyListener(name, to) {
    if (!this.proxies.has(to)) {
      this.proxies.set(to, new Map());
    }

    const proxies = this.proxies.get(to);
    const proxy = this.emit.bind(this, name);
    proxies.set(name, proxy);

    to.addListener(name, proxy);
    this.proxies.set(to, proxies);
  }

  unproxyListener(name, to) {
    const proxies = this.proxies.get(to);
    to.removeListener(name, proxies.get(name));
    proxies.delete(name);

    if (proxies.size) {
      this.proxies.set(to, proxies);
    } else {
      this.proxies.delete(to);
    }
  }
}

module.exports = EventHandler;
