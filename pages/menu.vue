<template>
  <div class="menu-wrapper">
    <van-sidebar
      class="rank-van-sidebar"
      v-model="activeKey"
      @change="changeFn"
    >
      <van-sidebar-item
        v-for="(item, index) in keyMap"
        :title="item.title"
        :key="index"
      />
    </van-sidebar>
    <ul class="books-list">
      <li
        class="blue"
        v-for="(book, bIndex) in list"
        :key="book.book_id"
        @click="navigate(book)"
      >
        {{ (pageNum - 1) * pageSize + bIndex + 1 }}.{{ book.book_name }}
        <span style="color:#888"> / {{ book.author }}</span>
      </li>
    </ul>
    <template v-if="!loading">
      <float-button
        :class="{disabled: pageNum <= 1}"
        record-name="btn-prev-page"
        :right="170"
        :visibility-height="0"
        :size="50"
        :bottom="75"
        :move-horizontal="true"
        @on-click="searchPage(-1)"
      >
        上一页
      </float-button>
      <float-button
        record-name="btn-page-info"
        :right="90"
        :visibility-height="0"
        :size="60"
        :bottom="70"
        :move-horizontal="true"
      >
        {{pageNum}}/{{pageTotal}}
      </float-button>
      <float-button
        :class="{disabled: pageNum >= pageTotal}"
        record-name="btn-next-page"
        :right="20"
        :visibility-height="0"
        :size="50"
        :bottom="75"
        :move-horizontal="true"
        @on-click="searchPage(1)"
      >
        下一页
      </float-button>
    </template>
  </div>
</template>
<script>
import { Indicator } from "mint-ui";
import FloatButton from "@/components/float-button";
export default {
  layout: "hbar",
  components: {
    FloatButton
  },
  data() {
    return {
      activeKey: 0,
      keyMap: {
        0: {
          title: "玄幻奇幻",
          menu_id: "xuanhuan"
        },
        1: {
          title: "修真仙侠",
          menu_id: "xianxia"
        },
        2: {
          title: "青春都市",
          menu_id: "qingchun"
        },
        3: {
          title: "历史穿越",
          menu_id: "chuanyue"
        },
        4: {
          title: "网游竞技",
          menu_id: "jingji"
        },
        5: {
          title: "科幻悬疑",
          menu_id: "xuanyi"
        }
      },
      loading: false,
      page_id: "",
      pageNum: 1,
      pageSize: 0,
      pageTotal: 1,
      pageCode: "1_",
      list: []
    };
  },
  computed: {
    menu_id() {
      return (this.keyMap && this.keyMap[this.activeKey].menu_id) || "";
    }
  },
  methods: {
    changeFn() {
      this.searchFn();
    },
    searchPage(num) {
      let page = this.pageNum + num;
      if (page < 1 || page > this.pageTotal) {
        return;
      }
      let page_id = this.pageCode + page + ".html";
      this.searchFn(page_id);
    },
    searchFn(page_id = "") {
      Indicator.open("加载中...");
      this.loading = true;
      this.list = [];
      this.$axios("/viewMenu", { menu_id: this.menu_id, page: page_id })
        .then(res => {
          this.list = res.data.list || [];
          this.pageCode = res.data.page_code;
          this.pageNum = res.data.page_num;
          this.pageTotal = res.data.total;
          if (!this.pageSize) this.pageSize = this.list.length;
        })
        .catch(err => {
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
.menu-wrapper {
  padding-left: 125px;
  padding-bottom: 145px;
  .rank-van-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    width: 100px;
    .van-sidebar-item {
      padding: 15px 15px 15px 12px !important;
      &.van-sidebar-item--select {
        border-color: #26a2ff !important;
      }
    }
  }
  ul {
    padding-top: 10px;
    width: calc(100vw - 160px);
    li {
      width: 100%;
      line-height: 2em;
    }
  }
}
</style>
