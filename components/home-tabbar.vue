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
          id: "",
          title: "书架",
          router: "/",
          icon: "&#xe628;"
        },
        {
          id: "aim",
          title: "找书",
          router: "/aim",
          icon: "&#xe600;"
        },
        {
          id: "rank",
          title: "榜单",
          router: "/rank",
          icon: "&#xe8a3;"
        },
        {
          id: "menu",
          title: "分类",
          router: "/menu",
          icon: "&#xe652;"
        }
      ]
    };
  },
  watch: {
    nav(val) {}
  },
  methods: {
    goto(item) {
      this.$router.push(item.router);
    }
  },
  created() {
    this.$event.add(
      "route-change",
      val => {
        this.nav = val;
      },
      this
    );
  }
};
</script>
<style lang="less">
.mint-header-title {
  overflow: visible !important;
}
</style>
