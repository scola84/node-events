const events = require('events');

class EventEmitter extends events.EventEmitter {
  constructor() {
    super();
    this.bindings = [];
  }

  bind(target, event, original) {
    const listener = original.bind(this);

    this.bindings.push({
      target,
      event,
      original,
      listener
    });

    if (target.addListener) {
      target.addListener(event, listener);
    } else if (target.addEventListener) {
      target.addEventListener(event, listener);
    }
  }

  unbind(target, event, original) {
    let listener = null;
    let index = -1;

    this.bindings.every((binding, i) => {
      if (binding.target === target &&
        binding.event === event &&
        binding.original === original) {

        listener = binding.listener;
        index = i;

        return false;
      }

      return true;
    });

    if (index === -1) {
      return;
    }

    this.bindings.splice(index, 1);

    if (target.removeListener) {
      target.removeListener(event, listener);
    } else if (target.removeEventListener) {
      target.removeEventListener(event, listener);
    }
  }
}

module.exports = EventEmitter;
