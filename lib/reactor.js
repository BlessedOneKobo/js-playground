let computedFunc;

export class Reactor {
  #value;
  #subscribers;

  constructor(initialValue) {
    this.#value = initialValue;
    this.#subscribers = new Set();
  }

  get value() {
    if (computedFunc) {
      this.subscribe(computedFunc);
    }
    return this.#value;
  }

  set value(newValue) {
    this.#value = newValue;
    for (const callback of this.#subscribers) {
      callback(newValue);
    }
  }

  subscribe(callback, immediate = false) {
    this.#subscribers.add(callback);
    if (immediate) {
      callback(this.#value);
    }
  }

  static computed(callback) {
    const reactor = new Reactor();
    const preComputedFunc = computedFunc;
    computedFunc = () => (reactor.value = callback());
    computedFunc();
    computedFunc = preComputedFunc;
    return reactor;
  }
}
