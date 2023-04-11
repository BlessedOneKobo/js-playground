import { Reactor } from "../lib/reactor.js";
import { Elm } from "../lib/dom.js";

const lhs = new Reactor("");
const rhs = new Reactor("");

const lhsElm = new Elm("input").model({ value: lhs, modifier: Number });
const plusElm = new Elm("p", "+");
const rhsElm = new Elm("input").model({ value: rhs, modifier: Number });
const equalElm = new Elm("p", "=");
const sumElm = new Elm(
  "strong",
  Reactor.computed(() => `Sum is ${lhs.value + rhs.value || 0}`),
);
const currentProgress = new Reactor(0);

const func = () => {
  currentProgress.value += 1;
  if (currentProgress.value < 100) {
    timer = setTimeout(func, Math.floor(Math.random() * 100));
  } else {
    clearTimeout(timer);
  }
};
let timer = setTimeout(func, 20);
const progressElm = new Elm("progress").bind({
  style: "display: block",
  min: 0,
  max: 100,
  value: Reactor.computed(() => currentProgress.value),
});

document
  .getElementById("app")
  .append(
    lhsElm.$el,
    plusElm.$el,
    rhsElm.$el,
    equalElm.$el,
    sumElm.$el,
    progressElm.$el,
  );
