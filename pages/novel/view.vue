<template>
  <div
    class="novel-view-wrapper"
    :style="{ backgroundColor: styles.backgroundColor }"
  >
    <template v-if="loaded">
      <p class="title" :style="titleStyle">
        {{ current.chapter_name }}
      </p>
      <p
        class="content"
        @click="showStylePopup = true"
        :style="contentStyle"
        v-html="current.content"
      ></p>
      <!-- 上一章 封面 目录 下一章 -->
      <float-button
        :right="230"
        :visibility-height="0"
        :size="50"
        :bottom="20"
        @on-click="prevChapter()"
      >
        上一章
      </float-button>
      <float-button
        :right="160"
        :visibility-height="0"
        :size="50"
        :bottom="20"
        @on-click="viewCover()"
      >
        封面
      </float-button>
      <float-button
        :right="90"
        :visibility-height="0"
        :size="50"
        :bottom="20"
        @on-click="viewChapterList()"
      >
        目录
      </float-button>
      <float-button
        :right="20"
        :visibility-height="0"
        :size="50"
        :bottom="20"
        @on-click="nextChapter()"
      >
        下一章
      </float-button>
    </template>
    <!-- 目录弹出层 -->
    <van-popup
      v-model="showChapterPopup"
      position="left"
      :style="{ width: '80%', height: '100%' }"
    >
      <div class="chapter-popup-wrapper">
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
          @click="showFontFamilyPicker = true"
        />
        <van-field
          readonly
          clickable
          name="picker"
          :value="styles.fontSize"
          label="字号"
          placeholder="点击选择字号"
          @click="showFontSizePicker = true"
        />
        <van-field
          readonly
          clickable
          name="picker"
          :value="styles.lineHeight"
          label="行高"
          placeholder="点击选择行高"
          @click="showLineHeightPicker = true"
        />
        <van-field
          readonly
          clickable
          name="picker"
          :value="styles.backgroundColor"
          label="背景"
          placeholder="点击选择背景"
          @click="showBgColorPicker = true"
        />
        <van-field
          readonly
          clickable
          name="picker"
          :value="styles.color"
          label="字色"
          placeholder="点击选择字色"
          @click="showColorPicker = true"
        />
      </van-cell-group>
    </van-popup>
    <!-- 选择字体弹出层 -->
    <van-popup v-model="showFontFamilyPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="fontFamilyLib"
        value-key="name"
        @confirm="onFontFamilyConfirm"
        @cancel="showFontFamilyPicker = false"
      />
    </van-popup>
    <!-- 选择字号弹出层 -->
    <van-popup v-model="showFontSizePicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="fontSizeLib"
        @confirm="onFontSizeConfirm"
        @cancel="showFontSizePicker = false"
      />
    </van-popup>
    <!-- 选择行高弹出层 -->
    <van-popup v-model="showLineHeightPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="lineHeightLib"
        @confirm="onLineHeightConfirm"
        @cancel="showLineHeightPicker = false"
      >
      </van-picker>
    </van-popup>
    <!-- 选择背景弹出层 -->
    <van-popup
      v-model="showBgColorPicker"
      closeable
      position="bottom"
      :style="{ maxHeight: '50%' }"
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
    <van-popup v-model="showColorPicker" closeable position="bottom">
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
import {
  getBookId,
  updateReadNovelRecord,
  updateVisitNovelRecord,
  getVisitNovel
} from "@/storage/novel";
export default {
  components: {
    FloatButton
  },
  data() {
    return {
      chapter_id: this.$route.query.chapter_id,
      loaded: false,
      mode: "sun",
      showStylePopup: false,
      showChapterPopup: false,
      showFontFamilyPicker: false,
      showFontSizePicker: false,
      showLineHeightPicker: false,
      showBgColorPicker: false,
      showColorPicker: false,
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
      order_by: "asc" // asc 正序 || desc 倒序
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
          updateReadNovelRecord({
            chapter_id,
            chapter_name: res.data.chapter_name,
            prev: res.data.prev,
            next: res.data.next
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
      let prev_chapter = this.current.prev;
      if (!prev_chapter || !prev_chapter.includes(".html")) return;
      this.search(prev_chapter);
    },
    // 下一章
    nextChapter() {
      let next_chapter = this.current.next;
      if (!next_chapter || !next_chapter.includes(".html")) return;
      this.search(next_chapter);
    },
    // 封面
    viewCover() {
      this.$router.push({
        path: "/novel/book",
        query: { book_id: getBookId(this.chapter_id) }
      });
    },
    // 目录
    viewChapterList() {
      this.showChapterPopup = true;
      if (this.chapters.length) return;
      let book_id = getBookId(this.chapter_id);
      let novel = getVisitNovel(book_id);
      if (novel && novel.list && novel.list.length) {
        return (this.chapters = novel.list);
      }
      this.chapters = [];
      this.$axios("/viewBook", { book_id })
        .then(res => {
          this.chapters = res.data.list || [];
          updateVisitNovelRecord({
            book_id,
            list: res.data.list,
            book_name: res.data.info.book_name,
            author: res.data.info.author
          });
        })
        .catch(err => {
          console.log(err);
          this.$toast.fail("服务器错误");
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
      this.showFontFamilyPicker = false;
    },
    onFontSizeConfirm(value) {
      this.styles.fontSize = value;
      this.showFontSizePicker = false;
    },
    onLineHeightConfirm(value) {
      this.styles.lineHeight = value;
      this.showLineHeightPicker = false;
    }
  },
  mounted() {
    this.styles = getReadStyle();
    let family = FONT_FAMILY_LIB.find(
      item => item.code == this.styles.fontFamily
    );
    this.fontFamilyName = family ? family.name : "微软雅黑";
    this.search(this.chapter_id);
  }
};
</script>
<style lang="less" scoped>
.novel-view-wrapper {
  box-sizing: border-box;
  padding: 50px 0 0;
  min-height: 100vh;
  width: 100vw;
  overflow-x: hidden;
  .title {
    box-sizing: border-box;
    padding: 0 12px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 50px;
    line-height: 50px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
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
