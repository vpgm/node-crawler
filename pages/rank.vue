<template>
  <div class="rank-wrapper">
    <van-sidebar class="rank-van-sidebar" v-model="activeKey">
      <van-sidebar-item
        v-for="(item, index) in list"
        :title="item.title.replace(/小说[\s\S]*$/, '')"
        :key="index"
      />
    </van-sidebar>
    <ul class="books-list">
      <li
        class="blue"
        v-for="(book, bIndex) in books"
        :key="book.book_id"
        @click="navigate(book)"
      >
        {{ bIndex + 1 }}.{{ book.book_name }}
      </li>
    </ul>
  </div>
</template>
<script>
import { Indicator } from "mint-ui";
export default {
  layout: "hbar",
  data() {
    return {
      activeKey: 0,
      keyMap: {},
      loading: false,
      list: []
    };
  },
  computed: {
    books() {
      return (
        (this.list && this.list.length && this.list[this.activeKey].list) || []
      );
    }
  },
  methods: {
    searchFn() {
      Indicator.open("加载中...");
      this.loading = true;
      this.$axios("/viewRank")
        .then(res => {
          this.list = res.data || [];
        })
        .catch(err => {
          this.list = [];
          this.$toast.fail("服务器错误");
        })
        .finally(() => {
          this.loading = false;
          Indicator.close();
        });
    },
    navigate(item) {
      this.$router.push({
        path: "/book/detail",
        query: { book_id: item.book_id }
      });
    }
  },
  mounted() {
    this.$event.fire("route-change", this.$route.path.replace("/", ""));
    this.searchFn();
  },
  destroyed() {
    Indicator.close();
  }
};
</script>
<style lang="less">
.rank-wrapper {
  padding-left: 125px;
  padding-bottom: 80px;
  .rank-van-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    width:100px;
    .van-sidebar-item {
      padding: 15px 15px 15px 12px !important;
      &.van-sidebar-item--select {
        border-color: #26a2ff !important;
      }
    }
  }
  ul.books-list {
    padding-top: 10px;
    width: calc(100vw - 160px);
    li {
      width: 100%;
      line-height: 2em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
