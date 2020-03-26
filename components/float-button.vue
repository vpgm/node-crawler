<template>
  <div
    class="float-button-wrapper"
    :style="style"
    v-show="scrollHeight >= visibilityHeight"
    @click="clickFn"
    @touchstart="touchstartFn"
    @touchmove="touchmoveFn"
    @touchend="touchendFn"
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
    },
    moveHorizontal: {
      type: Boolean,
      default: false
    },
    moveVertical: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrollHeight: document.documentElement.scrollTop,
      snapshot_bottom: 0,
      snapshot_right: 0,
      touch: {
        flag: false,
        pageX: 0,
        pageY: 0,
        snapshot_bottom: 0,
        snapshot_right: 0
      }
    };
  },
  computed: {
    style() {
      let size = typeof this.size === "number" ? this.size + "px" : this.size;
      return {
        width: size,
        height: size,
        right:
          typeof this.snapshot_right === "number"
            ? this.snapshot_right + "px"
            : this.snapshot_right,
        bottom:
          typeof this.snapshot_bottom === "number"
            ? this.snapshot_bottom + "px"
            : this.snapshot_bottom
      };
    }
  },
  methods: {
    clickFn(e) {
      this.$emit("on-click", e);
    },
    touchstartFn(e) {
      this.touch.flag = true;
      this.touch.pageX = e.touches[0].pageX;
      this.touch.pageY = e.touches[0].pageY;
      this.touch.snapshot_right = this.snapshot_right;
      this.touch.snapshot_bottom =
        this.snapshot_bottom - document.documentElement.scrollTop;
    },
    touchmoveFn(e) {
      if (!this.touch.flag) return;
      let pageX = e.touches[0].pageX;
      let pageY = e.touches[0].pageY - document.documentElement.scrollTop;
      let max_right = window.innerWidth - parseFloat(this.size);
      let max_bottom = window.innerHeight - parseFloat(this.size);
      if (this.moveHorizontal) {
        this.snapshot_right = Math.min(
          Math.max(this.touch.pageX - pageX + this.touch.snapshot_right, 0),
          max_right
        );
      }
      if (this.moveVertical) {
        this.snapshot_bottom = Math.min(
          Math.max(this.touch.pageY - pageY + this.touch.snapshot_bottom, 0),
          max_bottom
        );
      }
    },
    touchendFn(e) {
      this.touch.flag = false;
    }
  },
  mounted() {
    this.snapshot_bottom = this.bottom;
    this.snapshot_right = this.right;
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
  z-index: 99;
}
</style>
