export const EventEmitter = () => {
  let emitter = {
    list: {},
    on: function (event, fn) {
      (this.list[event] || (this.list[event] = [])).push(fn);
    },
    emit: function (...args) {
      const event = args.shift();
      const fns = [...this.list[event]];
      if (!fns || fns.length === 0) return false;
      fns.forEach(fn => fn.apply(this, args));
      return this;
    }
  };
  return emitter;
};
