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

  bind({ attr, value, modifier }) {
    if (this.#tagName === "input" && attr === "value") {
      this.$el.addEventListener("input", (e) => {
        value.value =
          e.target.value && modifier ? modifier(e.target.value) : e.target.value;
      });
    }

    if (value instanceof Reactor) {
      value.subscribe((newValue) => {
        if (typeof newValue === "boolean" && !newValue) {
          this.$el.removeAttribute(attr);
        } else {
          this.$el.setAttribute(attr, newValue);
        }
      }, true);
    } else {
      this.$el.setAttribute(attr, value);
    }
    return this;
  }

  model({ value, modifier }) {
    this.bind({ attr: "value", value, modifier });
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
