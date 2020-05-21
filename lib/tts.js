// 听书
export default class TTS {
  constructor(parentEl) {
    this.createTTSUrl();
    this.createTTSWrapper(parentEl);
    this.initTTSEvents();
  }

  initTTSEvents() {
    this.event_names = [
      "ended",
      "error",
      "pause",
      "play",
      "playing",
      "progress"
    ];
    this.events = {};
  }

  createTTSUrl() {
    let url = "http://tts.baidu.com/text2audio";
    let flag = url.includes("?");
    let options = {
      lan: "zh",
      ie: "UTF-8",
      spd: 5,
      pit: 5,
      vol: 15,
      per: 0,
      text: ""
    };
    Object.entries(options).forEach(([key, value]) => {
      if (!flag) {
        url += `?${key}=${value}`;
        flag = true;
      } else {
        url += `&${key}=${value}`;
      }
    });
    this.url = url;
  }

  createTTSWrapper(parentEl) {
    let $parent = parentEl || document.body;
    this.ttsWrapper = $parent.querySelector("#baidu_tts_wrapper");
    if (!this.ttsWrapper) {
      this.ttsWrapper = document.createElement("div");
      this.ttsWrapper.id = "baidu_tts_wrapper";
      $parent.appendChild(this.ttsWrapper);
    }
  }

  speak(text) {
    if (this.sound) {
      this.sound.remove();
    }
    this.ttsWrapper.innerHTML = `
        <audio id="baidu_tts_audio" autoplay="autoplay">
          <source id="tts_source_id" src="${this.url + text}" type="audio/mpeg">
        </audio>
      `;
    this.sound = this.ttsWrapper.querySelector("#baidu_tts_audio");
    this.sound.play();
    this.event_names.forEach(name => {
      this.sound["on" + name] = e => {
        if (name === "ended") name = "end";
        this.fire(name, e);
      };
    });
  }

  on(name, fn, scope) {
    this.events[name] = fn;
    fn && (fn.scope = scope);
  }

  fire(name, ...args) {
    if (typeof this.events[name] === "function") {
      this.events[name].call(this.events[name].scope || null, ...args);
    }
  }

  pause() {
    this.sound && this.sound.pause();
  }

  cancel() {
    this.sound && this.sound.pause();
  }
}
