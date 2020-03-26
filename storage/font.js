// 存储字段
const READ_BOOK_FONT_FIELD = "read_book_font";

// 字体
const FONT_FAMILY_LIB = [
  {
    name: "微软雅黑",
    code: "Microsoft YaHei"
  },
  {
    name: "宋体",
    code: "SongTi"
  },
  {
    name: "楷体",
    code: "KaiTi"
  },
  {
    name: "黑体",
    code: "HeiTi"
  },
  {
    name: "仿宋",
    code: "FangSong"
  },
  {
    name: "幼圆",
    code: "YouYuan"
  },
  {
    name: "隶书",
    code: "LiShu"
  },
  {
    name: "瘦金体",
    code: "SouJinTi"
  },
  {
    name: "田氏颜体字体",
    code: "YanTi"
  },
  {
    name: "诺基亚古印",
    code: "NokiaTi"
  },
  {
    name: "方正粗圆",
    code: "FzCuYuan"
  },
  {
    name: "方正古隶",
    code: "FzGuLi"
  },
  {
    name: "方正静蕾简体",
    code: "FzJingLei"
  },
  {
    name: "方正卡通简体",
    code: "FzKaTong"
  },
  {
    name: "方正启体简体",
    code: "FzQiTi"
  },
  {
    name: "方正小篆",
    code: "FzXiaoZuan"
  },
  {
    name: "方正正圆",
    code: "FzZhengYuan"
  },
  {
    name: "方正准圆",
    code: "FzZhunYuan"
  },
  {
    name: "方正姚体",
    code: "FzYaiTi"
  },
  {
    name: "方正舒体",
    code: "FzShuTi"
  },
  {
    name: "方正粗黑宋简体",
    code: "FzCuHeiSong"
  },
  {
    name: "华康娃娃体",
    code: "HkWaWaTi"
  },
  {
    name: "华文彩云",
    code: "HwCaiYun"
  },
  {
    name: "华文行楷",
    code: "HwXingKai"
  },
  {
    name: "华文中宋",
    code: "HwZhongSong"
  },
  {
    name: "华文细黑",
    code: "HwXiHei"
  },
  {
    name: "华文宋体",
    code: "HwSongTi"
  },
  {
    name: "华文隶书",
    code: "HwLiShu"
  },
  {
    name: "华文楷体",
    code: "HwKaiTi"
  },
  {
    name: "华文仿宋",
    code: "HwFangSong"
  },
  {
    name: "等线常规",
    code: "DxChangGui"
  },
  {
    name: "等线细体",
    code: "DxXiTi"
  },
  {
    name: "等线粗体",
    code: "DxCuTi"
  },
  {
    name: "方正硬笔楷书繁",
    code: "FzYingBiFan"
  },
  {
    name: "方正兰亭超细黑繁体",
    code: "FzLanTingFan"
  },
  {
    name: "方正卡通繁体",
    code: "FzKaTongFan"
  },
  {
    name: "方正启体繁体",
    code: "FzQiTiFan"
  },
  {
    name: "方正隶书繁体",
    code: "FzLiShuFan"
  },
  {
    name: "方正宋黑繁体",
    code: "FzSongHeiFan"
  },
  {
    name: "方正准圆繁体",
    code: "FzZhunYuanFan"
  },
  {
    name: "方正中倩繁体",
    code: "FzZhongQianFan"
  },
  {
    name: "方正铁筋隶书繁体",
    code: "FzTieJinLiSHuFan"
  },
  {
    name: "方正宋繁体",
    code: "FzSongFan"
  },
  {
    name: "方正粗活意繁体",
    code: "FzCuHuoYiFan"
  }
];

// 字号
const FONT_SIZE_LIB = [
  "12px",
  "13px",
  "14px",
  "15px",
  "16px",
  "17px",
  "18px",
  "19px",
  "20px",
  "21px",
  "22px",
  "23px",
  "24px",
  "25px",
  "26px",
  "27px",
  "28px",
  "29px",
  "30px"
];

// 行高
const LINE_HEIGHT_LIB = [
  "1em",
  "1.1em",
  "1.2em",
  "1.3em",
  "1.4em",
  "1.5em",
  "1.6em",
  "1.7em",
  "1.8em",
  "1.9em",
  "2em",
  "2.1em",
  "2.2em",
  "2.3em",
  "2.4em",
  "2.5em",
  "2.6em",
  "2.7em",
  "2.8em",
  "2.9em",
  "3em"
];

// 字色
const COLOR_LIB = [
  "#000000",
  "#333333",
  "#666666",
  "#ff0000",
  "#db7093",
  "#ff7f00",
  "#d98719",
  "#5c3317",
  "#32cd99",
  "#5f9f9f",
  "#9932cd",
  "#0000ff",
  "#ff00ff",
  "#3232cd",
  "#7f00ff",
  "#dddddd",
  "#eeeeee",
  "#ffffff"
];

// 背景
const BACKGROUND_COLOR_LIB = [
  "#ffffff",
  "#eeeeee",
  "#dddddd",
  "#036564",
  "#6b5a52",
  "#5a0d43",
  "#576069",
  "#234862",
  "#220807",
  "#342e0c",
  "#35424a",
  "#0f403d",
  "#5a4c43",
  "#737081",
  "#03230e",
  "#666666",
  "#333333",
  "#000000"
];

// 默认样式
const DEFAULT_STYLE = {
  fontFamily: "Microsoft YaHei",
  fontSize: "16px",
  lineHeight: "1.8em",
  backgroundColor: "#ffffff",
  color: "#000000"
};

// 存储阅读样式
function setReadStyle(style) {
  if (!(style instanceof Object)) style = Object.assign({}, DEFAULT_STYLE);
  localStorage.setItem(READ_BOOK_FONT_FIELD, JSON.stringify(style));
}

// 获取阅读样式
function getReadStyle() {
  let style;
  try {
    style = JSON.parse(localStorage.getItem(READ_BOOK_FONT_FIELD));
  } catch (err) {}
  if (!(style instanceof Object)) style = Object.assign({}, DEFAULT_STYLE);
  return style;
}

export {
  READ_BOOK_FONT_FIELD,
  FONT_FAMILY_LIB,
  FONT_SIZE_LIB,
  LINE_HEIGHT_LIB,
  BACKGROUND_COLOR_LIB,
  COLOR_LIB,
  DEFAULT_STYLE,
  setReadStyle,
  getReadStyle
};
