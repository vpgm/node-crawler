import Vue from "vue";
import axios from "axios";

function fetch(...args) {
  return new Promise((resolve, reject) => {
    axios
      .post(...args)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

Vue.prototype.$axios = fetch;
