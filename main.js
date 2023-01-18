import { reactive, createElement } from "./lib.js";

const data = reactive({
  clicks: 0,
  resets: 0,
});

const headingElm = createElement("h1", `Clicks ${data.clicks}`);
const buttonElm = createElement(
  "button",
  {
    style: "cursor: pointer",
    onClick: () => data.clicks++,
  },
  "Click me"
);
const resetButtonElm = createElement(
  "button",
  {
    style: "cursor: pointer",
    disabled: !data.clicks,
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
  resetButtonElm.disabled = !value;
  headingElm.textContent = `Clicks ${value}`;
});
data.$watch("resets", (value) => {
  paraElm.textContent = `Resets ${value}`;
});

const app = createElement("div", { id: "app" }, [
  headingElm,
  createElement("div", { style: "display: flex; gap: 1rem;" }, [
    buttonElm,
    resetButtonElm,
  ]),
  paraElm,
]);

document.body.appendChild(app);
