export function reactive(obj) {
  const reactiveEvents = [];
  const proxy = new Proxy(obj, {
    set: (target, propKey, value, receiver) => {
      const evt = reactiveEvents.find((evt) => evt.key === propKey);
      if (evt) {
        evt.callback(value);
      }
      return Reflect.set(target, propKey, value, receiver);
    },
  });
  Object.defineProperty(proxy, "$watch", {
    value: (key, callback) => {
      if (reactiveEvents.find((evt) => evt.key === key)) {
        throw new Error(`Callback already set for ${key}`);
      }
      reactiveEvents.push({ key: key, callback: callback });
    },
  });
  return proxy;
}

export function createElement(tagName, props, children) {
  const elm = document.createElement(tagName);

  if (typeof props === "string") {
    elm.innerHTML = props;
  } else if (typeof props === "object" && props) {
    Object.keys(props).forEach((k) => {
      if (k.startsWith("on")) {
        const evtName = k.slice(2);
        elm.addEventListener(
          `${evtName[0].toLowerCase()}${evtName.slice(1)}`,
          props[k]
        );
      } else {
        if (typeof props[k] === "boolean") {
          if (props[k]) {
            elm.setAttribute(k, "");
          } else {
            elm.removeAttribute(k);
          }
        } else {
          elm.setAttribute(k, props[k]);
        }
      }
    });
  } else {
    throw new Error("props must be a string or object");
  }

  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === "string") {
        elm.appendChild(document.createTextNode(child));
      } else {
        elm.appendChild(child);
      }
    });
  } else if (typeof children === "string") {
    elm.appendChild(document.createTextNode(children));
  }

  return elm;
}

const hooks = [];
let currentIdx = 0;

export function useHooks(updateDOM) {
  return;
}

export function initToyReact(updateDOM) {
  return {
    useState(initialValue) {
      const pair = hooks[currentIdx];
      if (pair) {
        currentIdx++;
        return pair;
      }

      const idx = currentIdx;
      function setValue(newValue) {
        const pair = hooks[idx];
        pair[0] = newValue;
        currentIdx = 0;
        updateDOM();
      }

      hooks[currentIdx] = [initialValue, setValue];
      return hooks[currentIdx++];
    },
  };
}
