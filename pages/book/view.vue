<template>
  <div
    class="book-view-wrapper"
    :class="{ 'popup-overlay-visible': showChapterPopup }"
    :style="{ backgroundColor: styles.backgroundColor }"
  >
    <p v-show="loaded" class="title" :style="titleStyle">
      <span class="text">{{ current.chapter_name }} </span>
      <span class="icon" @click="showOperSheet = true">
        <van-icon name="ellipsis" />
      </span>
    </p>
    <p
      v-show="loaded"
      class="content"
      @click.prevent="showStylePopup = true"
      :style="contentStyle"
      v-html="current.content"
    ></p>
    <!-- 上一章 目录 听书 下一章 -->
    <float-button
      v-show="loaded"
      :class="{ disabled: !current.prev || !current.prev.includes('.html') }"
      record-name="btn-prev-chapter"
      :right="230"
      :visibility-height="0"
      :size="50"
      :bottom="20"
      :move-horizontal="true"
      @on-click="prevChapter()"
    >
      上一章
    </float-button>
    <float-button
      v-show="loaded"
      record-name="btn-chapters"
      :right="160"
      :visibility-height="0"
      :size="50"
      :bottom="20"
      :move-horizontal="true"
      @on-click="viewChapterList()"
    >
      目录
    </float-button>
    <float-button
      v-show="loaded"
      record-name="btn-listen"
      :right="90"
      :visibility-height="0"
      :size="50"
      :bottom="20"
      :move-horizontal="true"
      @on-click="speakAction()"
    >
      <span v-show="speakFlag" class="mt-icon" style="font-size: 18px"
        >&#xe601;</span
      >
      {{ speakFlag ? "" : "听书" }}
    </float-button>
    <float-button
      v-show="loaded"
      :class="{ disabled: !current.next || !current.next.includes('.html') }"
      record-name="btn-next-chapter"
      :right="20"
      :visibility-height="0"
      :size="50"
      :bottom="20"
      :move-horizontal="true"
      @on-click="nextChapter()"
    >
      下一章
    </float-button>
    <!-- 目录弹出层 -->
    <van-popup
      v-model="showChapterPopup"
      position="left"
      :style="{ width: '75%', height: '100%' }"
    >
      <div class="chapter-popup-wrapper">
        <div class="chapter-popup-loading" v-if="chaptersLoading">
          <van-loading color="#1989fa" :size="40"></van-loading>
          <p>目录加载中...</p>
        </div>
        <template v-else>
          <p>
            <span class="grey">共{{ chapters.length }}章</span>
            <span class="blue" @click="change_order_by()">
              {{ order_by === "desc" ? "倒序" : "正序" }}
            </span>
          </p>
          <ul>
            <li
              v-for="item in chapter_list"
              :class="[item.chapter_id === chapter_id ? 'blue' : '']"
              :key="item.chapter_id"
              @click="viewChapter(item)"
            >
              {{ item.chapter_name }}
            </li>
          </ul>
        </template>
      </div>
    </van-popup>
    <!-- 样式设置弹出层 -->
    <van-popup v-model="showStylePopup" position="bottom">
      <van-cell-group>
        <van-field name="radio" label="模式">
          <template #input>
            <van-radio-group v-model="mode" direction="horizontal">
              <van-radio name="sun">白天</van-radio>
              <van-radio name="moon">夜晚</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
          readonly
          clickable
          name="picker"
          :value="fontFamilyName"
          label="字体"
          placeholder="点击选择字体"
          @click="showFontFamilyPopup = true"
        />
        <van-field
          readonly
          clickable
          name="picker"
          :value="styles.fontSize"
          label="字号"
          placeholder="点击选择字号"
          @click="showFontSizePopup = true"
        />
        <van-field
          readonly
          clickable
          name="picker"
          :value="styles.lineHeight"
          label="行高"
          placeholder="点击选择行高"
          @click="showLineHeightPopup = true"
        />
        <van-field
          readonly
          clickable
          name="picker"
          :value="styles.backgroundColor"
          label="背景"
          placeholder="点击选择背景"
          @click="showBgColorPopup = true"
        />
        <van-field
          readonly
          clickable
          name="picker"
          :value="styles.color"
          label="字色"
          placeholder="点击选择字色"
          @click="showColorPopup = true"
        />
      </van-cell-group>
    </van-popup>
    <!-- 选择字体弹出层 -->
    <van-popup v-model="showFontFamilyPopup" position="bottom">
      <van-picker
        show-toolbar
        :columns="fontFamilyLib"
        value-key="name"
        @confirm="onFontFamilyConfirm"
        @cancel="showFontFamilyPopup = false"
      />
    </van-popup>
    <!-- 选择字号弹出层 -->
    <van-popup v-model="showFontSizePopup" position="bottom">
      <van-picker
        show-toolbar
        :columns="fontSizeLib"
        @confirm="onFontSizeConfirm"
        @cancel="showFontSizePopup = false"
      />
    </van-popup>
    <!-- 选择行高弹出层 -->
    <van-popup v-model="showLineHeightPopup" position="bottom">
      <van-picker
        show-toolbar
        :columns="lineHeightLib"
        @confirm="onLineHeightConfirm"
        @cancel="showLineHeightPopup = false"
      >
      </van-picker>
    </van-popup>
    <!-- 选择背景弹出层 -->
    <van-popup
      v-model="showBgColorPopup"
      closeable
      position="bottom"
      :style="{ height: '264px' }"
    >
      <van-radio-group v-model="styles.backgroundColor" direction="horizontal">
        <van-radio
          style="width:26vw;padding: 10px"
          v-for="item in backgroundColorLib"
          :name="item"
          :checkedColor="item == '#ffffff' ? '#000' : item"
          :key="item"
          >{{ item }}</van-radio
        >
      </van-radio-group>
    </van-popup>
    <!-- 选择字色弹出层 -->
    <van-popup
      v-model="showColorPopup"
      :style="{ height: '264px' }"
      closeable
      position="bottom"
    >
      <van-radio-group v-model="styles.color" direction="horizontal">
        <van-radio
          style="width:26vw;padding: 10px"
          v-for="item in colorLib"
          :name="item"
          :checkedColor="item == '#ffffff' ? '#000' : item"
          :key="item"
          >{{ item }}</van-radio
        >
      </van-radio-group>
    </van-popup>
    <!-- action-sheet -->
    <van-action-sheet
      v-model="showOperSheet"
      :actions="actions"
      @select="onSelect"
      cancel-text="取消"
      @cancel="onCancel"
    />
  </div>
</template>

<script>
import { Indicator } from "mint-ui";
import FloatButton from "@/components/float-button";
import {
  FONT_FAMILY_LIB,
  FONT_SIZE_LIB,
  LINE_HEIGHT_LIB,
  BACKGROUND_COLOR_LIB,
  COLOR_LIB,
  setReadStyle,
  getReadStyle
} from "@/storage/font";
import { getBookId, updateVisitRecord } from "@/storage/record";
import Sound from "@/lib/sound.js";
export default {
  components: {
    FloatButton
  },
  data() {
    return {
      chapter_id: this.$route.query.chapter_id,
      book_id: "",
      loaded: false,
      chaptersLoading: false,
      speakFlag: false,
      mode: "sun",
      showStylePopup: false,
      showChapterPopup: false,
      showFontFamilyPopup: false,
      showFontSizePopup: false,
      showLineHeightPopup: false,
      showBgColorPopup: false,
      showColorPopup: false,
      showOperSheet: false,
      // 样式库
      fontFamilyLib: FONT_FAMILY_LIB,
      fontSizeLib: FONT_SIZE_LIB,
      lineHeightLib: LINE_HEIGHT_LIB,
      backgroundColorLib: BACKGROUND_COLOR_LIB,
      colorLib: COLOR_LIB,
      // 样式
      fontFamilyName: "",
      styles: {},
      current: {},
      chapters: [],
      order_by: "asc", // asc 正序 || desc 倒序
      actions: [
        {
          name: "前往首页",
          action: "route_index"
        },
        {
          name: "搜索小说",
          action: "route_novel"
        },
        {
          name: "回到封面",
          action: "route_book"
        }
      ]
    };
  },
  watch: {
    mode(val) {
      if (val === "sun") {
        this.styles.backgroundColor = "#ffffff";
        this.styles.color = "#000000";
      } else {
        this.styles.backgroundColor = "#000000";
        this.styles.color = "#ffffff";
      }
    },
    styles: {
      deep: true,
      handler(val) {
        setReadStyle(val);
      }
    }
  },
  computed: {
    titleStyle() {
      let obj = {};
      for (let key in this.styles) {
        if (key !== "lineHeight") {
          obj[key] = this.styles[key];
        }
      }
      return obj;
    },
    contentStyle() {
      return this.styles;
    },
    chapter_list() {
      let list = JSON.parse(JSON.stringify(this.chapters));
      return this.order_by === "asc" ? list : list.reverse();
    }
  },
  methods: {
    // 搜索章节内容
    search(chapter_id) {
      this.current = {};
      if (this.$route.query.chapter_id !== chapter_id) {
        this.chapter_id = chapter_id;
        this.$router.replace({ query: { chapter_id } });
      }
      this.loaded = false;
      Indicator.open("加载中...");
      this.$axios("/viewChapter", { chapter_id })
        .then(res => {
          this.current = res.data || {};
          updateVisitRecord({
            book_id: this.book_id,
            curr_chapter: chapter_id,
            curr_chapter_name: res.data.chapter_name,
            prev_chapter: res.data.prev,
            next_chapter: res.data.next
          });
        })
        .catch(err => {
          console.log(err);
          this.$toast.fail("服务器错误");
        })
        .finally(() => {
          document.documentElement.scrollTop = 0;
          Indicator.close();
          this.loaded = true;
        });
    },
    // 上一章
    prevChapter() {
      this.cancelSpeak();
      let prev_chapter = this.current.prev;
      if (!prev_chapter || !prev_chapter.includes(".html")) return;
      this.search(prev_chapter);
    },
    // 下一章
    nextChapter() {
      this.cancelSpeak();
      let next_chapter = this.current.next;
      if (!next_chapter || !next_chapter.includes(".html")) return;
      this.search(next_chapter);
    },
    // 目录
    viewChapterList() {
      this.showChapterPopup = true;
      if (this.chapters.length) return;
      this.chapters = [];
      this.chaptersLoading = true;
      this.$axios("/viewBook", { book_id: this.book_id })
        .then(res => {
          this.chapters = res.data.list || [];
        })
        .catch(err => {
          console.log(err);
          this.$toast.fail("服务器错误");
        })
        .finally(() => {
          this.chaptersLoading = false;
        });
    },
    change_order_by() {
      this.order_by = ["desc", "asc"].find(item => item !== this.order_by);
    },
    // 阅读章节
    viewChapter(item) {
      this.showChapterPopup = false;
      this.search(item.chapter_id);
    },
    // 选择样式
    onFontFamilyConfirm(value) {
      this.fontFamilyName = value.name;
      this.styles.fontFamily = value.code;
      this.showFontFamilyPopup = false;
    },
    onFontSizeConfirm(value) {
      this.styles.fontSize = value;
      this.showFontSizePopup = false;
    },
    onLineHeightConfirm(value) {
      this.styles.lineHeight = value;
      this.showLineHeightPopup = false;
    },
    onSelect(item) {
      this.showOperSheet = false;
      switch (item.action) {
        case "route_index":
          return this.$router.push("/");
        case "route_novel":
          return this.$router.push("/aim");
        case "route_book":
          return this.$router.push({
            path: "/book/detail",
            query: { book_id: this.current.book_id }
          });
      }
    },
    onCancel() {
      this.showOperSheet = false;
    },
    // 听书
    initSound() {
      this.sound = new Sound();
      this.sound.on(
        "end",
        () => {
          this.doSpeak();
        },
        this
      );
      this.sound.on(
        "error",
        () => {
          this.doSpeak();
        },
        this
      );
    },
    speakAction() {
      if (!this.speakFlag) {
        this.speakFlag = true;
        this.nodeIndex = this.getReadNodeIndex() || 0;
        this.doSpeak();
      } else {
        this.cancelSpeak();
      }
    },
    cancelSpeak() {
      this.speakFlag = false;
      this.sound && this.sound.cancel();
      this.removeSelection();
    },
    doSpeak() {
      if (!this.speakFlag) return;
      let node = this.getReadTextNodes()[this.nodeIndex];
      if (node) {
        let rect = this.getRangeRect(node);
        if (rect.top < 0) {
          document.documentElement.scrollTop -= 50 - rect.top;
        } else if (rect.top > window.innerHeight * 0.5) {
          document.documentElement.scrollTop += rect.top - 50;
        }
        this.activeSelection(node);
        this.sound.speak(node.textContent);
        this.nodeIndex++;
      } else {
        this.removeSelection();
        this.speakFlag = false;
      }
    },
    getReadNodeIndex() {
      let arr = this.getReadTextNodes();
      return arr.findIndex((node, index) => {
        if (document.documentElement.scrollTop === 0 && index === 0) {
          return true;
        }
        if (index >= 1) {
          let rect1 = this.getRangeRect(node);
          let rect2 = this.getRangeRect(arr[index - 1]);
          if (rect1.top >= 50 && rect2.top < 50) {
            return true;
          }
        }
      });
    },
    // 获取所有文本节点
    getReadTextNodes() {
      let content = this.$el.querySelector(".content");
      let childNodes = Array.from(content.childNodes);
      return childNodes.filter(node => {
        let textContent = (node.textContent || "").replace("↵", "").trim();
        return node.nodeType === 3 && !!textContent;
      });
    },
    // 获取选区边界
    getRangeRect(node) {
      let range = this.activeSelection(node).range;
      let rect = range.getBoundingClientRect().toJSON();
      this.removeSelection();
      return rect;
    },
    // 激活文本选区
    activeSelection(node) {
      let selection = window.getSelection();
      let range = document.createRange();
      if (node.nodeType === 3) {
        range.selectNodeContents(node);
      } else {
        range.setStart(node, 0);
        range.setEnd(node, 0);
      }
      selection.removeAllRanges();
      selection.addRange(range);
      return { selection, range };
    },
    // 移除所有选区
    removeSelection() {
      let selection = window.getSelection();
      selection.removeAllRanges();
    }
  },
  mounted() {
    this.styles = getReadStyle();
    this.book_id = getBookId(this.chapter_id);
    let family = FONT_FAMILY_LIB.find(
      item => item.code == this.styles.fontFamily
    );
    this.fontFamilyName = family ? family.name : "微软雅黑";
    this.search(this.chapter_id);
    this.initSound();
  },
  destroyed() {
    Indicator.close();
    this.cancelSpeak();
  }
};
</script>
<style lang="less" scoped>
.book-view-wrapper {
  box-sizing: border-box;
  padding: 50px 0 0;
  min-height: 100vh;
  width: 100vw;
  overflow-x: hidden;
  .title {
    box-sizing: border-box;
    padding: 0 12px;
    display: flex;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 50px;
    line-height: 50px;
    span {
      display: inline-block;
    }
    .text {
      width: calc(100vw - 74px);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .icon {
      font-size: 1.1em;
      text-align: right;
      width: 50px;
      height: 50px;
      .van-icon {
        transform: rotate(90deg);
      }
    }
  }
  .content {
    padding: 0 12px 90px;
    text-align: justify;
  }
  .loading-box {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: max-content;
    display: flex;
    .tips {
      color: #666;
      padding-left: 10px;
    }
  }
}
.chapter-popup-wrapper {
  position: relative;
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
  .chapter-popup-loading {
    padding-bottom: 36px;
    position: absolute;
    width: max-content;
    height: max-content;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    p {
      position: absolute;
      width: max-content;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      font-size: 12px;
      color: #aaa;
    }
  }
  p {
    display: flex;
    padding: 15px 15px 10px;
    justify-content: space-between;
  }
  ul {
    padding: 0 15px 15px;
  }
  li {
    line-height: 2em;
  }
}
</style>
