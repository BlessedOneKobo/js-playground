import { Reactor } from "../lib/reactor.js";
import { Elm } from "../lib/dom.js";

const clicks = new Reactor(0);
const resets = new Reactor(0);

const headingElm = new Elm(
  "h1",
  Reactor.computed(() => `Clicks ${clicks.value}`),
);

const buttonElm = new Elm("button", "Click me").on(
  "click",
  () => (clicks.value += 1),
);

const resetButtonElm = new Elm("button", "Reset")
  .bind({
    attr: "disabled",
    value: Reactor.computed(() => !clicks.value),
  })
  .on("click", () => {
    if (clicks.value === 0) {
      return;
    }
    clicks.value = 0;
    resets.value++;
  });

const paraElm = new Elm(
  "p",
  Reactor.computed(() => `Resets ${resets.value}`),
);

const buttonContainer = new Elm("div").bind({
  attr: "style",
  value: "display: flex; gap: 1rem",
});
buttonContainer.$el.append(buttonElm.$el, resetButtonElm.$el);

const root = document.getElementById("app");
root.append(headingElm.$el, buttonContainer.$el, paraElm.$el);
