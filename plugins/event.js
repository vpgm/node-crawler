import Vue from "vue";

function isFunction(fn) {
  return typeof fn === "function";
}

let Event_Pool = {};

const manager = {
  add(name, fn, scope) {
    if (!Event_Pool[name]) {
      Event_Pool[name] = [];
    }
    isFunction(fn) && Event_Pool[name].push(fn);
    scope && (fn.scope = scope);
  },
  fire(name, fn) {
    let fnsArray = Event_Pool[name] || [];
    let flag = isFunction(fn);
    let args = [].slice.call(arguments, flag ? 2 : 1);
    for (let i = 0; i < fnsArray.length; i++) {
      if (!flag) {
        fnsArray[i].apply(fnsArray[i].scope || null, args);
      } else if (fnsArray[i] === fn) {
        fn.apply(fn.scope || null, args);
        break;
      }
    }
  },
  remove(name, fn) {
    let fnsArray = Event_Pool[name] || [];
    if (isFunction(fn)) {
      for (let i = 0; i < fnsArray.length; i++) {
        if (fnsArray[i] === fn) {
          fnsArray.splice(i, 1);
          break;
        }
      }
    } else {
      Event_Pool[name] = [];
    }
  },
  once(name, fn, scope) {
    var _self = this;
    function wrap() {
      fn.apply(fn.scope || scope || null, args);
      _self.remove(name, wrap);
    }
    this.add(name, wrap, scope);
  }
};

Vue.prototype.$event = manager;
