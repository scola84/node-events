export default class EventEmitter {
  constructor() {
    this._listeners = {};
    this._maxListeners = 10;
  }

  addListener(event, listener) {
    this._listeners[event] = this._listeners[event] || [];
    this._listeners[event].push(listener);

    return this._checkMaxListeners(event);
  }

  emit(event, ...args) {
    if (!this._listeners[event]) {
      return this;
    }

    this._listeners[event].forEach((listener) => {
      listener(...args);
    });

    return this;
  }

  eventNames() {
    return Object.keys(this._listeners);
  }

  getMaxListeners() {
    return this._maxListeners;
  }

  listenerCount(event) {
    if (!this._listeners[event]) {
      return 0;
    }

    return this._listeners[event].length;
  }

  listeners(event) {
    return this._listeners[event];
  }

  on(event, listener) {
    return this.addListener(event, listener);
  }

  once(event, listener) {
    return this.addListener(event, (...args) => {
      this.removeListener(event, listener);
      listener(...args);
    });
  }

  prependListener(event, listener) {
    this._listeners[event] = this._listeners[event] || [];
    this._listeners[event].unshift(listener);

    return this._checkMaxListeners(event);
  }

  prependOnceListener(event, listener) {
    return this.prependListener(event, (...args) => {
      this.removeListener(event, listener);
      listener(...args);
    });
  }

  removeAllListeners(event) {
    if (event) {
      delete this._listeners[event];
    } else {
      this._listeners = {};
    }

    return this;
  }

  removeListener(event, listener) {
    if (!this._listeners[event]) {
      return this;
    }

    this._listeners[event]
      .splice(this._listeners[event].indexOf(listener), 1);

    return this;
  }

  setMaxListeners(max) {
    this._maxListeners = max;
    return this;
  }

  _checkMaxListeners(event) {
    if (this._listeners[event].length > this._maxListeners) {
      throw new Error('More than ' + this._maxListeners + ' listeners added');
    }

    return this;
  }
}
