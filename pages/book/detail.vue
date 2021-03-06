<template>
  <div class="book-detail-wrapper">
    <mt-header fixed title="书籍详情">
      <nuxt-link :to="'/aim?name=' + book_info.book_name" slot="left">
        <mt-button icon="back"></mt-button>
      </nuxt-link>
    </mt-header>
    <div class="content" v-if="!loading">
      <div class="info">
        <div class="img">
          <img :src="book_info.img" />
        </div>
        <div class="intro">
          <h3 class="blue" @click="showSheet = true">
            {{ book_info.book_name }}
          </h3>
          <p>{{ book_info.author }}</p>
          <p>{{ book_info.latest_time }}</p>
          <div class="btns-ui">
            <mt-button
              type="primary"
              size="small"
              style="margin-right:10px"
              :disabled="on_shelf"
              @click.native="addShelf()"
            >
              加入书架
            </mt-button>
            <mt-button type="primary" size="small" @click.native="read()">
              {{ readed ? "继续" : "开始" }}阅读
            </mt-button>
          </div>
        </div>
      </div>
      <div class="desc">
        <h4>简介</h4>
        <p v-html="book_info.desc"></p>
      </div>
      <div class="chapter">
        <h4>
          <span>目录</span>
          <span class="order_by blue" @click="change_order_by()">
            {{ order_by === "desc" ? "倒序" : "正序" }}
          </span>
        </h4>
        <ul>
          <li
            class="blue"
            v-for="(item, index) in chapters"
            :key="index"
            @click="navigate(item)"
          >
            {{ item.chapter_name }}
          </li>
        </ul>
      </div>
    </div>
    <back-top :size="50" :right="20" :bottom="20"></back-top>
    <van-action-sheet
      v-model="showSheet"
      :actions="actions"
      @select="onSelect"
      cancel-text="取消"
      @cancel="onCancel"
    />
  </div>
</template>

<script>
import { Indicator } from "mint-ui";
import BackTop from "@/components/back-top.vue";
import {
  isBookOnShelf,
  addBookToShelf,
  updateVisitRecord,
  isBookReaded
} from "@/storage/record";
export default {
  components: {
    BackTop
  },
  data() {
    return {
      book_id: this.$route.query.book_id,
      readed: false,
      on_shelf: false,
      showSheet: false,
      actions: [
        {
          name: "下载最新10章",
          action: "download",
          count: 10
        },
        {
          name: "下载最新50章",
          action: "download",
          count: 50
        },
        {
          name: "下载最新100章",
          action: "download",
          count: 100
        },
        {
          name: "下载全本",
          action: "download",
          count: ""
        }
      ],
      loading: false,
      order_by: "desc", // asc 正序 || desc 倒序
      book_info: {},
      list: []
    };
  },
  methods: {
    search(book_id = "") {
      this.book_info = {};
      this.list = [];
      this.loading = true;
      Indicator.open("加载中...");
      this.$axios("/viewBook", { book_id })
        .then(res => {
          this.book_info = res.data.info || {};
          this.list = res.data.list || [];
          let first = this.list[0];
          let last = this.list[this.list.length - 1];
          updateVisitRecord({
            book_id: book_id,
            book_name: res.data.info.book_name,
            author: this.book_info.author,
            image: this.book_info.img,
            latest_time: this.book_info.latest_time,
            first_chapter: (first && first.chapter_id) || "",
            latest_chapter: (last && last.chapter_id) || ""
          });
        })
        .catch(err => {
          console.log(err);
          this.$toast.fail("服务器错误");
        })
        .finally(() => {
          this.loading = false;
          Indicator.close();
        });
    },
    change_order_by() {
      this.order_by = ["desc", "asc"].find(item => item !== this.order_by);
    },
    addShelf() {
      addBookToShelf(this.book_id);
      this.on_shelf = true;
    },
    getChapterContent(chapter) {
      let me = this;
      return new Promise((resolve, reject) => {
        let count = 0;
        function fetch() {
          me.$axios("/viewChapter", { chapter_id: chapter.chapter_id })
            .then(res => {
              resolve({
                chapter_name: chapter.chapter_name,
                content: res.data.content
              });
            })
            .catch(err => {
              count++;
              if (count < 5) {
                fetch();
              } else {
                resolve({
                  chapter_name: chapter.chapter_name,
                  content: "缺失章节"
                });
              }
            });
        }
        fetch();
      });
    },
    getContents(count) {
      let me = this;
      let arr = [];
      let length = this.list.length;
      let list = count
        ? this.list.slice(Math.max(length - count, 0), length)
        : this.list;
      let total = count ? Math.min(count, length) : length;
      return new Promise((resolve, reject) => {
        function next(idx) {
          if (idx === list.length) {
            resolve(arr);
            me.$toast.clear();
          } else {
            me.$toast.loading({
              message: `下载进度[${idx + 1}/${total}]`,
              forbidClick: true
            });
            me.getChapterContent(list[idx]).then(data => {
              arr.push(data);
              next(idx + 1);
            });
          }
        }
        next(0);
      });
    },
    download(count) {
      this.getContents(count).then(arr => {
        let contents = arr
          .map(item => {
            return `${item.chapter_name} \r\n${item.content
              .replace(/&#x([a-zA-Z\d]*);/g, (_, m) => {
                if (m == "A0") return "";
                let unicode =
                  "\\u" + ("0000" + m.toLowerCase()).substr(m.length, 4);
                return eval("'" + unicode + "'");
              })
              .replace(/\<\/p\>/gi, "")
              .replace(/\<(p|br\/?)\>/gi, "\r\n")}`;
          })
          .join("\r\n");
        let a = document.createElement("a");
        a.href = window.URL.createObjectURL(new Blob([contents]));
        a.download = `${this.book_info.book_name}.txt`;
        a.click();
      });
    },
    read() {
      let readed = this.readed;
      if (readed) {
        let has_next = readed.next_chapter && readed.next_chapter.includes(".html");
        this.$router.push({
          path: "/book/view",
          query: { chapter_id: has_next ? readed.next_chapter : readed.curr_chapter }
        });
      } else {
        if (!this.list || !this.list.length) {
          return this.$toast.fail("未获取到目录！");
        }
        this.$router.push({
          path: "/book/view",
          query: { chapter_id: this.list[0].chapter_id }
        });
      }
    },
    onSelect(item) {
      this.showSheet = false;
      if (item.action === "download") {
        this.download(item.count);
      }
    },
    onCancel() {
      this.showSheet = false;
    },
    navigate(item) {
      this.$router.push({
        path: "/book/view",
        query: { chapter_id: item.chapter_id }
      });
    }
  },
  computed: {
    chapters() {
      let list = JSON.parse(JSON.stringify(this.list));
      return this.order_by === "asc" ? list : list.reverse();
    }
  },
  mounted() {
    this.readed = isBookReaded(this.book_id);
    this.on_shelf = isBookOnShelf(this.book_id);
    this.search(this.book_id);
  },
  destroyed() {
    Indicator.close();
  }
};
</script>

<style lang="less" scoped>
.book-detail-wrapper {
  padding-top: 40px;
  .content {
    padding: 10px;
    .info {
      display: flex;
      padding-bottom: 5px;
      justify-content: flex-start;
      width: calc(100vw - 20px);
      border-bottom: solid 1px #eee;
      img {
        width: 36vw;
        height: 48vw;
      }
      .intro {
        position: relative;
        padding-left: 5vw;
        h3 {
          padding: 10px 0;
        }
        p {
          line-height: 2em;
          color: #666;
        }
        .btns-ui {
          position: absolute;
          width: max-content;
          bottom: 15px;
        }
      }
    }
    .desc {
      padding-bottom: 10px;
      border-bottom: solid 1px #eee;
      h4 {
        line-height: 2.5em;
      }
      p {
        line-height: 1.8em;
        color: #666;
      }
    }
    .chapter {
      padding-bottom: 50px;
      h4 {
        display: flex;
        justify-content: space-between;
        line-height: 2.5em;
        .order_by {
          font-weight: 400;
        }
      }
      ul {
        padding-left: 1.5em;
        li {
          line-height: 2em;
        }
      }
    }
  }
}
</style>
