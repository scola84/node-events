'use strict';

const EventEmitter = require('events');

class EventHandler extends EventEmitter {
  constructor() {
    super();

    this.listeners = [];
    this.proxies = [];
  }

  bindListener(name, to, original, ...extra) {
    const listener = original.bind(this, ...extra);

    this.listeners.push({
      name,
      to,
      original,
      listener
    });

    return to.addListener ?
      to.addListener(name, listener) :
      to.addEventListener(name, listener);
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

    const remover = to.removeListener ?
      to.removeListener :
      to.removeEventListener;

    this.listeners.splice(index, 1);
    remover(name, listener);
  }

  proxyListener(name, to) {
    const proxy = this.emit.bind(this, name);

    this.proxies.push({
      name,
      to,
      proxy
    });

    return to.addListener ?
      to.addListener(name, proxy) :
      to.addEventListener(name, proxy);
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

    const remover = to.removeListener ?
      to.removeListener :
      to.removeEventListener;

    this.proxies.splice(index, 1);
    remover(name, proxy);
  }
}

module.exports = EventHandler;
