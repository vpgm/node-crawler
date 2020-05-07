<template>
  <div>
    <nuxt />
    <home-tabbar />
  </div>
</template>
<script>
import HomeTabbar from "@/components/home-tabbar";
export default {
  name: "hbar",
  components: { HomeTabbar }
};
</script>
