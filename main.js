import { reactive, createElement } from "./lib.js";

const data = reactive({
  clicks: 0,
  resets: 0,
});

const headingElm = createElement("h1", `Clicks ${data.clicks}`);
const buttonElm = createElement(
  "button",
  {
    onClick: () => data.clicks++,
  },
  "Click me"
);
const resetButtonElm = createElement(
  "button",
  {
    onClick: () => {
      if (data.clicks === 0) {
        return;
      }
      data.clicks = 0;
      data.resets++;
    },
  },
  "Reset"
);
const paraElm = createElement("p", `Resets ${data.resets}`);

data.$watch("clicks", (value) => {
  headingElm.textContent = `Clicks ${value}`;
});
data.$watch("resets", (value) => {
  paraElm.textContent = `Resets ${value}`;
});

document.body.append(headingElm, buttonElm, resetButtonElm, paraElm);
