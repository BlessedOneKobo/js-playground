import { createElement, createState } from "./lib.js";

const useState = createState(App);

function App() {
  const mountPoint = document.getElementById("app");
  const [clickCount, setClickCount] = useState(0);
  const [resetCount, setResetCount] = useState(0);

  const handleButtonClick = () => setClickCount(clickCount + 1);
  const handleResetButtonClick = () => {
    if (clickCount === 0) {
      return;
    }
    setClickCount(0);
    setResetCount(resetCount + 1);
  };

  mountPoint.innerHTML = "";
  mountPoint.append(
    createElement("#fragment", null, [
      createElement("h1", `Clicks ${clickCount}`),
      createElement("div", { style: "display: flex; gap: 1rem;" }, [
        createElement(
          "button",
          {
            style: "cursor: pointer",
            onClick: handleButtonClick,
          },
          "Click me",
        ),
        createElement(
          "button",
          {
            style: "cursor: pointer",
            disabled: clickCount === 0,
            onClick: handleResetButtonClick,
          },
          "Reset",
        ),
      ]),
      createElement("p", `Resets ${resetCount}`),
    ]),
  );
}

App();
