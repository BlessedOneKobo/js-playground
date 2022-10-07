const buttonRef = createElement("button", 0, (value) => `counter: ${value}`);
buttonRef.element.style.marginBottom = "1rem";
buttonRef.element.onclick = () => buttonRef.state.value++;
document.body.append(buttonRef.element);

const ul = document.createElement("ul");
const liRef = createLoopElement("li", [], ul);

const form = document.createElement("form");
form.onsubmit = (e) => {
  e.preventDefault();

  if (!inputRef.state.value) {
    return;
  }

  liRef.state.value.push(inputRef.state.value);
  inputRef.state.value = "";
};
const inputRef = createElement("input", "");
form.append(inputRef.element);
document.body.append(form);
document.body.append(ul);

function createElement(tagName, initialValue, callback) {
  const prop = tagName === "input" ? "value" : "textContent";
  const element = document.createElement(tagName);
  const state = {};
  let value = initialValue;
  element[prop] = callback ? callback(value) : value;

  if (tagName === "input") {
    element.addEventListener("input", (e) => {
      state.value = e.target.value;
    });
  }

  Object.defineProperty(state, "value", {
    get() {
      return value;
    },
    set(newValue) {
      if (value !== newValue) {
        value = newValue;
        element[prop] = callback ? callback(value) : value;
      }
    },
  });

  return { element, state };
}

function createLoopElement(tagName, initialArray, parent) {
  const hasCustomParent = !!parent.state && !!parent.element;

  const proxy = new Proxy(initialArray, {
    set(target, p, value) {
      if (p !== "length" && target[p] === value) {
        return;
      }

      target[p] = value;
      const fragment = document.createDocumentFragment();
      target.forEach((v) => {
        const elm = document.createElement(tagName);
        elm.textContent = v;
        fragment.append(elm);
      });

      const newElm = document.createElement(parent.tagName);
      newElm.append(fragment);
      const parentElement = hasCustomParent ? parent.element : parent;
      [...parentElement.children].forEach((child) => child.remove());
      [...newElm.children].forEach((child) => parentElement.append(child));
      return true;
    },
  });
  return { state: { value: proxy } };
}
