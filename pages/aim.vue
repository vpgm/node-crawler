<template>
  <div class="aim-wrapper">
    <mt-search class="aim-mt-search" v-model="value"></mt-search>
    <div class="search-result">
      <ul class="book-list" v-if="list && list.length">
        <li class="tips">【已为您搜索到{{ list.length }}本相关作品】</li>
        <li v-for="(item, index) in list" :key="index" @click="navigate(item)">
          <span class="blue">{{ item["book_name"] }}</span>
          <span class="grey author" v-if="item.author">/{{ item.author }}</span>
        </li>
      </ul>
      <div class="nodata" v-else-if="!loading">
        {{ value ? config.nodata : config.placeholder }}
      </div>
    </div>
  </div>
</template>

<script>
import { Indicator } from "mint-ui";
export default {
  layout: "hbar",
  data() {
    return {
      value: "",
      loading: false,
      config: {
        placeholder: "请输入关键词查找小说！",
        nodata: "没有找到相关小说，换个关键词查询试试！"
      },
      list: []
    };
  },
  watch: {
    value(val) {
      this.searchFn(val);
    }
  },
  methods: {
    search(val) {
      this.list = [];
      if (this.$route.query.name !== val) {
        this.$router.replace({ query: { name: val } });
      }
      if (!val) return;
      Indicator.open("加载中...");
      this.loading = true;
      this.$axios("/findBookList", { name: val })
        .then(res => {
          this.list = res.data || [];
        })
        .catch(err => {
          this.list = [];
          console.log("findBookList", err);
          this.$toast.fail("服务器错误");
        })
        .finally(() => {
          this.loading = false;
          Indicator.close();
        });
    },
    navigate(item) {
      let book_id = (item.book_id || "").replace(/\//g, "");
      this.$router.push({ path: "/book/detail", query: { book_id } });
    }
  },
  mounted() {
    this.$event.fire("route-change", this.$route.path.replace("/", ""))
    this.searchFn = this.$lazy(this.search, 1000);
    if (this.$route.query.name) {
      this.value = this.$route.query.name;
    }

  },
  destroyed() {
    Indicator.close();
  }
};
</script>

<style lang="less" scoped>
.aim-wrapper {
  padding-top: 40px;
  .aim-mt-search {
    position: fixed;
    top: 0px;
    width: 100vw;
    height: max-content;
    .mint-search-list {
      height: 0px;
    }
  }
  .search-result {
    padding: 10px 15px 80px;
    line-height: 2.5em;
    .book-list {
      padding: 0;
      li {
        text-indent: 0.5em;
        width: 100%;
        border-bottom: solid #efefef 1px;
        .author {
          font-size: 0.8em;
        }
      }
      .tips {
        text-indent: 0em;
        color: #888;
      }
    }
    .nodata {
      color: #888;
    }
  }
}
</style>
