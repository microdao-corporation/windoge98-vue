<script setup lang="ts">
import { onMounted } from "vue";
import { useWindowStore } from "./stores/useWindowStore";

const store = useWindowStore();
onMounted(() => {
  // random time between 50 seconds and 8 minutes
  let time = Math.floor(Math.random() * 450000) + 30000;
  setInterval(() => {
    let existingCount = store.windows.filter((w) => w.type === "ad").length;
    if (existingCount < 4) {
      store.openAdWindow();
    }
  }, time);
});
</script>

<template>
  <RouterView />
</template>

<style scoped>
.desktop-icon {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 80px;
  background-image: url("/assets/desktop.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.desktop-icon img {
  width: 100%;
  height: 100%;
}
.icon-title {
  width: 100%;
  color: #fff;
  font-family: Arial;
  font-size: 11px;
  text-align: center;
  background-color: #0b6666;
}
</style>
