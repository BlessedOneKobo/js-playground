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
  let elm;

  if (tagName === "#fragment") {
    elm = document.createDocumentFragment();
  } else {
    elm = document.createElement(tagName);

    if (typeof props === "string") {
      elm.innerHTML = props;
    } else if (typeof props === "object" && props) {
      Object.keys(props).forEach((k) => {
        if (k.startsWith("on")) {
          const evtName = k.slice(2);
          elm.addEventListener(
            `${evtName[0].toLowerCase()}${evtName.slice(1)}`,
            props[k],
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

export function createState(updateDOM) {
  const hooks = [];
  let currentHookIdx = 0;

  const useState = (initialValue) => {
    const pair = hooks[currentHookIdx];
    if (pair) {
      currentHookIdx++;
      return pair;
    }

    const idx = currentHookIdx;
    function setValue(newValue) {
      const pair = hooks[idx];
      if (typeof newValue === "function") {
        pair[0] = newValue(pair[0]);
      } else {
        pair[0] = newValue;
      }
      currentHookIdx = 0;
      updateDOM();
    }

    hooks[currentHookIdx] = [initialValue, setValue];
    return hooks[currentHookIdx++];
  };

  return useState;
}
