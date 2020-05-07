// 听书
export default class TTS {
  constructor(parentEl) {
    this.createTTSUrl();
    this.createTTSWrapper(parentEl);
    this.initTTSEvents();
  }

  // abort		        在退出时运行的脚本。
  // canplay		        当文件就绪可以开始播放时运行的脚本（缓冲已足够开始时）。
  // canplaythrough		当媒介能够无需因缓冲而停止即可播放至结尾时运行的脚本。
  // durationchange		当媒介长度改变时运行的脚本。
  // emptied		        当发生故障并且文件突然不可用时运行的脚本（比如连接意外断开时）。
  // ended		        当媒介已到达结尾时运行的脚本（可发送类似“感谢观看”之类的消息）。
  // error		        当在文件加载期间发生错误时运行的脚本。
  // loadeddata		    当媒介数据已加载时运行的脚本。
  // loadedmetadata		当元数据（比如分辨率和时长）被加载时运行的脚本。
  // loadstart		    在文件开始加载且未实际加载任何数据前运行的脚本。
  // pause		        当媒介被用户或程序暂停时运行的脚本。
  // play		            当媒介已就绪可以开始播放时运行的脚本。
  // playing		        当媒介已开始播放时运行的脚本。
  // progress		        当浏览器正在获取媒介数据时运行的脚本。
  // ratechange		    每当回放速率改变时运行的脚本（比如当用户切换到慢动作或快进模式）。
  // readystatechange		每当就绪状态改变时运行的脚本（就绪状态监测媒介数据的状态）。
  // seeked		        当 seeking 属性设置为 false（指示定位已结束）时运行的脚本。
  // seeking		        当 seeking 属性设置为 true（指示定位是活动的）时运行的脚本。
  // stalled		        在浏览器不论何种原因未能取回媒介数据时运行的脚本。
  // suspend		        在媒介数据完全加载之前不论何种原因终止取回媒介数据时运行的脚本。
  // timeupdate		    当播放位置改变时（比如当用户快进到媒介中一个不同的位置时）运行的脚本。
  // volumechange		    每当音量改变时（包括将音量设置为静音）时运行的脚本。
  // waiting              当媒介已停止播放但打算继续播放时（比如当媒介暂停已缓冲更多数据）运行脚本
  initTTSEvents() {
    this.event_names = [
      "abort",
      "canplay",
      "canplaythrough",
      "durationchange",
      "emptied",
      "ended",
      "error",
      "loadeddata",
      "loadedmetadata",
      "loadstart",
      "pause",
      "play",
      "playing",
      "progress",
      "ratechange",
      "readystatechange",
      "seeked",
      "seeking",
      "stalled",
      "suspend",
      "timeupdate",
      "volumechange",
      "waiting"
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
    if (this.ttsAudio) {
      this.ttsAudio.remove();
    }
    this.ttsWrapper.innerHTML = `
        <audio id="baidu_tts_audio" autoplay="autoplay">
          <source id="tts_source_id" src="${this.url + text}" type="audio/mpeg">
        </audio>
      `;
    this.ttsAudio = this.ttsWrapper.querySelector("#baidu_tts_audio");
    this.ttsAudio.play();
    this.event_names.forEach(name => {
      this.ttsAudio["on" + name] = e => {
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
}
