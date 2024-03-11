<script setup lang="ts">
import { onMounted, getCurrentInstance } from "vue";
import { useWindowStore } from "./stores/useWindowStore";

const store = useWindowStore();
onMounted(() => {
  // random time between 50 seconds and 8 minutes
  let time = Math.floor(Math.random() * 450000) + 20000;
  setInterval(() => {
    store.windows.filter((w: any) => w.type === "ad").length;
    // if (existingCount < 4) {
    //   store.openAdWindow();
    // }
  }, time);
});

// Expose function to open dogvertiser window
function openDog() {
  // Assuming your `useWindowStore` has a method `openAdWindow`
  // which is responsible for opening a new ad window
  store.openDogvertiserWindow();
}

// Using getCurrentInstance to safely access the global properties
const instance = getCurrentInstance();
if (instance && instance.appContext.config.globalProperties) {
  instance.appContext.config.globalProperties.$openDog = openDog;
}

// Additionally, attaching the function directly to window for easy access from the browser console
declare global {
  interface Window {
    openDog: () => void;
  }
}

window.openDog = openDog;
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
