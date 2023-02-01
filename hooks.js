import { initToyReact } from "./lib.js";

const { useState } = initToyReact(App);

function App() {
  const [counter, setCounter] = useState(0);

  const frag = document.createDocumentFragment();
  const decrementButton = document.createElement("button");
  decrementButton.textContent = "decrement";
  decrementButton.addEventListener("click", () => {
		setCounter(counter - 1);
		setCounter(counter - 1);
	});
  if (counter) {
    decrementButton.removeAttribute("disabled");
  } else {
    decrementButton.setAttribute("disabled", "");
  }

  const display = document.createElement("p");
  display.textContent = counter === 0 ? "no clicks" : `${counter} clicks`;

  const incrementButton = document.createElement("button");
  incrementButton.textContent = "increment";
  incrementButton.addEventListener("click", () => {
		setCounter(counter + 1)
		setCounter(counter + 1)
		setCounter(counter + 1)
	});

  frag.append(decrementButton, display, incrementButton);
  mountPoint.innerHTML = "";
  mountPoint.append(frag);
}

const mountPoint = document.getElementById("app");
App();
