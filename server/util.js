let http = require("http");
let https = require("https");
let iconv = require("iconv-lite");
let zlib = require("zlib");
// 返回新对象
function extendsFrom(...targets) {
  let obj = {};
  targets.forEach(item => {
    if (item instanceof Object) {
      Object.entries(item).forEach(([key, value]) => {
        if (value !== undefined) {
          obj[key] = value;
        }
      });
    }
  });
  return obj;
}

// 爬取网页
function fetch(url, options) {
  return new Promise((resolve, reject) => {
    let mod = http;
    if (typeof url !== "string") url = "";
    if (url.startsWith("https")) mod = https;
    mod
      .get(url, options, res => {
        let chunks = [],
          length = 0,
          output;
        if (res.headers["content-encoding"] == "gzip") {
          let gzip = zlib.createGunzip();
          res.pipe(gzip);
          output = gzip;
        } else {
          output = res;
        }
        output.on("data", chunk => {
          chunks.push(chunk);
          length += chunk.length;
        });
        output.on("end", () => {
          let data = iconv.decode(Buffer.concat(chunks, length), "utf-8");
          resolve(data);
        });
        output.on("error", err => {
          reject(err);
        });
      })
      .on("error", err => {
        fetch(url, options).then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        })
      });
  });
}

module.exports = {
  extendsFrom,
  fetch
};
