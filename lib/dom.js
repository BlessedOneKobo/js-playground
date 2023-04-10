import { Reactor } from "./reactor.js";

export const $ = document.querySelector.bind(document);

export class Elm {
  #tagName;
  constructor(tagName, initialValue) {
    this.#tagName = tagName.toLowerCase();
    this.$el = document.createElement(tagName);
    if (initialValue) {
      this.value = initialValue;
    }
    return this;
  }

  bind(binding, modifier) {
    Object.entries(binding).forEach(([k, v]) => {
      if (this.#tagName === "input" && k === "value" && v instanceof Reactor) {
        this.$el.addEventListener("input", (e) => {
          v.value =
            e.target.value && modifier ? modifier(e.target.value) : e.target.value;
        });
      }

      if (v instanceof Reactor) {
        v.subscribe((newValue) => {
          if (typeof newValue === "boolean" && !newValue) {
            this.$el.removeAttribute(k);
          } else {
            this.$el.setAttribute(k, newValue);
          }
        }, true);
      } else {
        this.$el.setAttribute(k, v);
      }
    });
    return this;
  }

  model({ value, modifier }) {
    this.bind({ value }, modifier);
    return this;
  }

  on(eventName, callback) {
    this.$el.addEventListener(eventName, callback);
    return this;
  }

  get value() {
    if (this.#tagName === "input") {
      return this.$el.value;
    }

    return this.$el.textContent;
  }

  set value(val) {
    const attr = this.#tagName === "input" ? "value" : "textContent";
    if (val instanceof Reactor) {
      val.subscribe((newValue) => (this.$el[attr] = newValue), true);
    } else {
      this.$el[attr] = val;
    }
  }

  setValue(val) {
    this.value = val;
    return this;
  }
}
