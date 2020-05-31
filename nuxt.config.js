module.exports = {
  mode: "spa",
  /*
   ** Headers of the page
   */
  head: {
    title: "春秋一笔",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "寻书 阅书 听书 藏书"
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: [
    "@/assets/css/global.css",
    "mint-ui/lib/style.css",
    "vant/lib/index.css",
    "@/assets/css/icon.css",
    "@/assets/css/font.css"
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "@/plugins/mint-ui.js",
    "@/plugins/vant.js",
    "@/plugins/event.js",
    "@/plugins/fetch.js",
    "@/plugins/lazy.js"
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: [],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, { isDev, isClient }) {}
  }
};
