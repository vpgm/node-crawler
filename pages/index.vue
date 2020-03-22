<template>
  <div class="index-container">
    <div class="history-record">
      <h3 @click="clearRecords()">历史记录</h3>
      <ul>
        <li
          v-for="(item, index) in records"
          :key="index"
          @click="natigate(item)"
        >
          <span class="title">{{ item.title }}</span>
          <span class="blue">{{ item.name }}</span>
          <span class="grey desc">{{ item.desc }}</span>
        </li>
      </ul>
    </div>
    <home-tabbar />
  </div>
</template>

<script>
import HomeTabbar from "@/components/home-tabbar";
import { getVisitRecords, clearVisitRecords } from "@/storage/record";
import { clearVisitNovelRecords, clearReadNovelRecords } from "@/storage/novel";
export default {
  components: { HomeTabbar },
  data() {
    return {
      records: []
    };
  },
  methods: {
    natigate(item) {
      this.$router.push({ path: item.route, query: item.query });
    },
    clearRecords() {
      clearVisitRecords();
      clearVisitNovelRecords();
      clearReadNovelRecords();
      this.records = [];
    }
  },
  mounted() {
    this.records = getVisitRecords();
  }
};
</script>

<style lang="less" scoped>
.index-container {
  padding-top: 20px;
  width: 100vw;
  height: 100vh;
  background-image: url(../assets/images/bg.jpg);
  background-size: 100%;
  background-origin: left top;
  background-repeat: no-repeat;
  background-attachment: fixed;
  .history-record {
    padding-bottom: 80px;
    h3 {
      padding-left: 8px;
      margin-left: 16px;
      line-height: 1em;
      font-weight: 400;
      font-size: 1em;
      color: #fff;
      border-left: #efefef solid 2px;
    }
    ul {
      padding-top: 10px;
      padding-left: 1.5em;
    }
    li {
      line-height: 2em;
    }
    .title {
      font-size: 0.9em;
      color: #555;
    }
    .desc {
      padding-left: 0.5em;
      font-size: 0.8em;
    }
  }
}
</style>
