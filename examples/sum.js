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

document
  .getElementById("app")
  .append(lhsElm.$el, plusElm.$el, rhsElm.$el, equalElm.$el, sumElm.$el);
