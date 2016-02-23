'use strict';

const EventEmitter = require('events');

class EventHandler extends EventEmitter {
  constructor() {
    super();

    this.listeners = [];
    this.proxies = [];
    this.timeouts = new Map();
  }

  bindListener(name, to, original, ...extra) {
    const listener = original.bind(this, ...extra);

    this.listeners.push({
      name,
      to,
      original,
      listener
    });

    const args = name ? [name, listener] : [listener];

    to[to.addListener ?
      'addListener' :
      'addEventListener'](...args);
  }

  unbindListener(name, to, original) {
    let listener = null;
    let index = -1;

    this.listeners.every((item, i) => {
      if (item.name === name &&
        item.to === to &&
        item.original === original) {

        index = i;
        listener = item.listener;
        return false;
      }

      return true;
    });

    if (index === -1) {
      return;
    }

    this.listeners.splice(index, 1);

    const args = name ? [name, listener] : [listener];

    to[to.removeListener ?
      'removeListener' :
      'removeEventListener'](...args);
  }

  proxyListener(name, to) {
    const proxy = this.emit.bind(this, name);

    this.proxies.push({
      name,
      to,
      proxy
    });

    to[to.addListener ?
      'addListener' :
      'addEventListener'](name, proxy);
  }

  unproxyListener(name, to) {
    let proxy = null;
    let index = -1;

    this.proxies.every((item, i) => {
      if (item.name === name && item.to === to) {
        proxy = item.proxy;
        index = i;
      }
    });

    if (index === -1) {
      return;
    }

    this.proxies.splice(index, 1);

    to[to.removeListener ?
      'removeListener' :
      'removeEventListener'](name, proxy);
  }

  debounce(method, delay) {
    clearTimeout(this.timeouts.get(method));

    this.timeouts.set(method, setTimeout(() => {
      method.bind(this)();
      this.timeouts.delete(method);
    }, delay));
  }
}

module.exports = EventHandler;
