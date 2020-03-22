<template>
  <div
    class="float-button-wrapper"
    :style="style"
    v-show="scrollHeight >= visibilityHeight"
    @click="click($event)"
  >
    <slot>顶部</slot>
  </div>
</template>
<script>
export default {
  props: {
    size: {
      type: [String, Number],
      default: "40px"
    },
    right: {
      type: [String, Number],
      default: "30px"
    },
    bottom: {
      type: [String, Number],
      default: "30px"
    },
    visibilityHeight: {
      type: Number,
      default: 200
    }
  },
  data() {
    return {
      scrollHeight: document.documentElement.scrollTop
    };
  },
  computed: {
    style() {
      let size = typeof this.size === "number" ? this.size + "px" : this.size;
      return {
        width: size,
        height: size,
        right: typeof this.right === "number" ? this.right + "px" : this.right,
        bottom:
          typeof this.bottom === "number" ? this.bottom + "px" : this.bottom
      };
    }
  },
  methods: {
    click(e) {
      this.$emit("on-click", e);
    }
  },
  mounted() {
    window.addEventListener("scroll", e => {
      this.scrollHeight = document.documentElement.scrollTop;
    });
  }
};
</script>
<style lang="less" scoped>
.float-button-wrapper {
  position: fixed;
  background-color: #fff;
  border-radius: 50%;
  color: #409eff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  z-index: 5;
  &:hover {
    background-color: #f2f6fc;
  }
}
</style>
