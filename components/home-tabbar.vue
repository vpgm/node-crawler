<template>
  <mt-tab-container>
    <mt-tabbar fixed v-model="nav">
      <mt-tab-item
        v-for="item in navs"
        :id="item.id"
        :key="item.id"
        @click.native="goto(item)"
      >
        <p slot="icon" class="mt-icon mt-lg" v-html="item.icon"></p>
        {{ item.title }}
      </mt-tab-item>
    </mt-tabbar>
  </mt-tab-container>
</template>

<script>
export default {
  data() {
    return {
      nav: "",
      navs: [
        {
          id: "novel",
          title: "小说",
          router: "/novel",
          icon: "&#xe628;"
        },
        {
          id: "tv",
          title: "剧集",
          router: "/tv",
          icon: "&#xe604;"
        },
        {
          id: "movie",
          title: "电影",
          router: "/movie",
          icon: "&#xe8ae;"
        },
        {
          id: "music",
          title: "音乐",
          router: "/music",
          icon: "&#xe609;"
        }
      ]
    };
  },
  watch: {
    nav(val) {
      // this.$router.push("/" + val);
    }
  },
  methods: {
    goto(item) {
      this.$router.push(item.router);
    }
  }
};
</script>
