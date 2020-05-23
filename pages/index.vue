<template>
  <div class="index-container">
    <div class="bookshelf-wrapper">
      <ul
        class="bookshelf-list"
        :style="{ height: Math.ceil(records.length / 3) * 45 + 10 + 'vw' }"
      >
        <li
          class="bookshelf-item"
          v-for="(item, index) in records"
          :key="index"
          :data-index="index"
          :data-bookid="item.book_id"
          @touchstart.stop="touchstartFn(item, index, $event)"
          @touchmove.stop="touchmoveFn(item, index, $event)"
          @touchend.stop="touchendFn(item, index, $event)"
        >
          <p class="img" :style="{ backgroundImage: `url(${item.image})` }"></p>
          <span class="blue book-name">{{ item.book_name }}</span>
          <span
            v-show="checkFlag"
            class="check-item-icon"
            @touchstart.stop="item.checked = !item.checked"
          >
            <van-icon
              :name="item.checked ? 'passed' : 'circle'"
              color="red"
              size="30"
          /></span>
        </li>
      </ul>
    </div>
    <float-button
      v-show="records && records.length"
      class="btn-recycle-bin btn-recycle-bin-active"
      :right="30"
      :visibility-height="0"
      :size="50"
      :bottom="80"
      @on-click="checkBooks"
      :move-horizontal="false"
    >
      {{ checkFlag ? "确定" : "下架" }}
    </float-button>
  </div>
</template>

<script>
import FloatButton from "@/components/float-button";
import { getBooksOnShelf, resetBooksOnShelf } from "@/storage/record";
export default {
  layout: "hbar",
  components: {
    FloatButton
  },
  data() {
    return {
      routerFlag: false,
      records: [],
      checkFlag: false,
      li: null,
      copyLi: null,
      touch: {
        flag: false,
        clickMark: 0,
        startIndex: 0,
        endIndex: 0
      }
    };
  },
  methods: {
    setBooks() {
      let records = getBooksOnShelf();
      records.forEach(item => {
        item.checked = false;
      });
      this.records = records;
      setTimeout(() => {
        let children = Array.from(
          document.querySelectorAll(".bookshelf-list>li")
        );
        children.forEach((node, index) => {
          let col = index % 3;
          let row = Math.floor(index / 3);
          node.style.left = col * 31.5 + 2.75 + "vw";
          node.style.top = row * 45 + 2.75 + "vw";
        });
      });
    },
    natigate(item) {
      let chapter_id = "";
      if ((item.curr_chapter + "").endsWith(".html")) {
        chapter_id = item.curr_chapter;
      }
      if (chapter_id) {
        this.$router.push({
          path: "/book/view",
          query: { chapter_id: chapter_id }
        });
      } else {
        this.$router.push({
          path: "/book/detail",
          query: { book_id: item.book_id }
        });
      }
      this.routerFlag = true;
    },
    lookupElement(dom, selector = "div") {
      let ret = null;
      let parent = dom;
      while (!ret && parent && parent !== document.body) {
        let arr = Array.from(parent.parentNode.querySelectorAll(selector));
        if (arr.includes(parent)) {
          return parent;
        }
        parent = parent.parentNode;
      }
    },
    touchstartFn(item, index, e) {
      this.touch.clickMark = 1;
      let target = e.target;
      this.li = this.lookupElement(target, "li");
      let rect = this.li.getBoundingClientRect().toJSON();
      let pageX = e.touches[0].pageX;
      let pageY = e.touches[0].pageY;
      let center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
      if (
        (center.x - rect.width / 6 - pageX) *
          (center.x + rect.width / 6 - pageX) <
          0 &&
        (center.y - rect.height / 6 - pageY) *
          (center.y + rect.height / 6 - pageY) <
          0
      ) {
        this.li.classList.add("moonlight");
        this.touch.flag = true;
        this.touch.startIndex = this.li.dataset.index;
        this.copyLi = document.createElement("div");
        this.copyLi.classList.add("book-copy-box");
        this.copyLi.style.left = rect.left + "px";
        this.copyLi.style.top = rect.top + "px";
        this.copyLi.innerHTML = this.li.querySelector("p.img").outerHTML;
        document.body.appendChild(this.copyLi);
      }
    },
    touchmoveFn(item, index, e) {
      this.touch.clickMark = 0;
      if (!this.touch.flag) return;
      e.preventDefault();
      let pageX = e.touches[0].pageX;
      let pageY = e.touches[0].pageY;
      let rect = this.copyLi.getBoundingClientRect().toJSON();
      this.copyLi.style.zIndex = 1;
      this.copyLi.style.left = `${pageX - rect.width / 2}px`;
      this.copyLi.style.top = `${pageY - rect.height / 2}px`;
      this.deferredExecution();
    },
    touchendFn(item, index, e) {
      if (this.touch.clickMark === 1) this.natigate(item);
      if (!this.touch.flag) return;
      this.touch.flag = false;
      this.li.classList.remove("moonlight");
      let rect = this.li
        .querySelector("p.img")
        .getBoundingClientRect()
        .toJSON();
      this.copyLi.style.transition = "all 0.3s ease-in-out";
      this.copyLi.style.width = rect.width + "px";
      this.copyLi.style.height = rect.height + "px";
      this.copyLi.style.left = rect.left + "px";
      this.copyLi.style.top = rect.top + "px";
      setTimeout(() => {
        this.copyLi.remove();
        let children = Array.from(
          document.querySelectorAll(".bookshelf-list>li")
        ).map(node => {
          return {
            dataIndex: Number(node.dataset.index),
            book_id: node.dataset.bookid
          };
        });
        children.sort((item1, item2) => {
          let index1 = item1.dataIndex;
          let index2 = item2.dataIndex;
          return index1 - index2;
        });
        !this.routerFlag &&
          resetBooksOnShelf(children.map(item => item.book_id));
      }, 300);
    },
    execution() {
      let rect2 = this.copyLi.getBoundingClientRect().toJSON();
      let center = {
        x: rect2.left + rect2.width / 2,
        y: rect2.top + rect2.height / 2
      };
      let endIndex = this.getEndIndex(center);
      if (endIndex !== -1 && endIndex !== this.touch.startIndex) {
        this.touch.endIndex = endIndex;
        this.animate();
      }
    },
    animate() {
      let children = Array.from(
        document.querySelectorAll(".bookshelf-list>li")
      );
      let { startIndex, endIndex } = this.touch;
      let step = endIndex - startIndex > 0 ? -1 : 1;
      let min = Math.min(startIndex, endIndex);
      let max = Math.max(startIndex, endIndex);
      let includes = children.filter(node => {
        let dataIndex = Number(node.dataset.index);
        return dataIndex >= min && dataIndex <= max;
      });
      includes.sort((node1, node2) => {
        let index1 = Number(node1.dataset.index);
        let index2 = Number(node2.dataset.index);
        return index1 - index2;
      });
      let includesRect = includes.map(node => {
        let json = node.getBoundingClientRect().toJSON();
        json.y = json.top =
          json.top + document.querySelector(".bookshelf-wrapper").scrollTop;
        json.dataIndex = node.dataset.index;
        return json;
      });
      let lastIndex = includes.length - 1;
      includes.forEach((node, index) => {
        let nextIndex =
          node === this.li ? (step === 1 ? 0 : lastIndex) : index + step;
        node.style.left = includesRect[nextIndex].left + "px";
        node.style.top = includesRect[nextIndex].top + "px";
        node.dataset.index = includesRect[nextIndex].dataIndex;
      });
      this.touch.startIndex = endIndex;
    },
    getEndIndex({ x, y }) {
      let arr = Array.from(document.querySelectorAll(".bookshelf-list>li")).map(
        node => {
          let rect = node.getBoundingClientRect().toJSON();
          return {
            l: rect.left + rect.width / 4,
            r: rect.left + (rect.width * 3) / 4,
            t: rect.top + rect.height / 4,
            b: rect.top + (rect.height * 3) / 4,
            dataIndex: node.dataset.index
          };
        }
      );
      let obj = arr.find(({ l, r, t, b }) => {
        return (x - l) * (r - x) >= 0 && (y - t) * (b - y) >= 0;
      });
      return obj ? obj.dataIndex : -1;
    },
    checkBooks() {
      if (!this.checkFlag) {
        this.checkFlag = true;
      } else {
        let filter = this.records.filter(item => !item.checked);
        if (filter.length !== this.records.length) {
          resetBooksOnShelf(filter.map(item => item.book_id));
          this.setBooks();
        }
        this.checkFlag = false;
      }
    }
  },
  mounted() {
    this.$event.fire("route-change", this.$route.path.replace("/", ""));
    this.deferredExecution = this.$lazy(this.execution, 200);
    this.setBooks();
  },
  destroyed() {
    this.copyLi && this.copyLi.remove();
  }
};
</script>

<style lang="less">
.index-container {
  width: 100%;
  height: 100vh;
  background-image: url(../assets/images/bg.jpg);
  background-size: 100%;
  background-origin: left top;
  background-repeat: no-repeat;
  background-attachment: fixed;
  .bookshelf-wrapper {
    width: 100%;
    height: calc(100vh - 55px);
    overflow: auto;
    ul {
      position: relative;
      padding-top: 2.75vw;
      padding-left: 2.75vw;
      margin-bottom: 60px;
      width: 100%;
      overflow: hidden;
      li {
        position: absolute;
        padding: 2.75vw 2.75vw 0;
        width: 31.5vw;
        transition: all 0.5s;
        &.moonlight {
          opacity: 0.5;
        }
        &.transparent {
          opacity: 0;
        }
        p.img {
          width: 26vw;
          height: 34vw;
          background-position: center;
          background-size: 100% 100%;
        }
        .book-name {
          display: inline-block;
          padding-left: 5%;
          width: 95%;
          line-height: 8vw;
          font-size: 0.95em;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .check-item-icon {
          display: inline-block;
          width: max-content;
          height: max-content;
          position: absolute;
          top: 0;
          right: 0;
        }
      }
    }
  }
  .btn-recycle-bin {
    color: rgb(252, 122, 122);
    box-shadow: 0 0 6px rgba(252, 122, 122, 0.15);
    &.btn-recycle-bin-active {
      color: rgb(252, 0, 0);
      box-shadow: 0 0 6px rgba(255, 0, 0, 0.35);
    }
  }
}
.book-copy-box {
  position: fixed;
  width: 28vw;
  height: 37vw;
  z-index: -1;
  p.img {
    width: 100%;
    height: 100%;
    background-position: center;
    background-size: 100% 100%;
  }
}
</style>
