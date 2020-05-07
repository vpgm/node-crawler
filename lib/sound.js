// 听书
export default class Sound {
  constructor() {
    if (
      typeof window.SpeechSynthesisUtterance !== "undefined" &&
      typeof window.speechSynthesis !== "undefined"
    ) {
      this.sound = null;
    } else {
      throw new Error(
        `Brower does not support "SpeechSynthesisUtterance" or "speechSynthesis"`
      );
    }
    this.events = {};
  }

  initOptions(options = {}) {
    let opt = Object.assign(
      {
        lang: "zh-cn",
        rate: 1,
        volume: 100,
        pitch: 1
      },
      options
    );
    Object.entries(opt).forEach(([key, value]) => {
      this.sound[key] = value;
    });
  }

  speak(text, options = {}) {
    this.sound = new window.SpeechSynthesisUtterance();
    this.initOptions(options);
    this.sound.text = text + "";
    Object.entries(this.events).forEach(([key, value]) => {
      this.sound[key] = value;
    });
    window.speechSynthesis.speak(this.sound);
  }

  pause() {
    window.speechSynthesis.pause(this.sound);
  }

  cancel() {
    window.speechSynthesis.cancel(this.sound);
  }

  resume() {
    window.speechSynthesis.resume(this.sound);
  }

  on(name, fn, scope) {
    if (typeof fn === "function") {
      this.events["on" + name] = fn.bind(scope || null);
    }
  }
}
