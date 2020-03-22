<template>
  <float-button v-bind="$props" @on-click="backtop($event)">顶部</float-button>
</template>
<script>
import FloatButton from "./float-button"
export default {
  extends: FloatButton,
  components: {
    FloatButton
  },
  methods: {
    backtop(e) {
      document.documentElement.scrollTop = 0;
      this.$emit("on-backtop");
    }
  }
};
</script>