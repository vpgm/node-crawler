import Vue from "vue";

function lazy(fn, time = 500) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, time);
  };
}

Vue.prototype.$lazy = lazy;
