<script setup lang="ts">
import { onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import logo from "../assets/windoge98-pixel-banner.png";
import { shuttingDownState } from "../states/sharedStates.vue";

const router = useRouter();

onMounted(() => {
  const preventDefaultAction = (event: Event) => {
    event.preventDefault();
  };

  document.addEventListener("contextmenu", preventDefaultAction);
  document.addEventListener("click", preventDefaultAction);

  if (shuttingDownState.value === true) {
    console.log("Shutting down..., value is true");
    shuttingDownState.value = false;
    setTimeout(() => {
      router.push("/boot");
    }, 3000);
  } else {
    console.log("starting shuttingDownState..., value is false");
    setTimeout(() => {
      router.push("/");
    }, 3000);
  }

  onUnmounted(() => {
    document.removeEventListener("contextmenu", preventDefaultAction);
    document.removeEventListener("click", preventDefaultAction);
  });
});
</script>

<template>
  <div class="container">
    <div class="background">
      <img class="logo" :src="logo" alt="Windoge 98 Logo" />
    </div>
  </div>
</template>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

* {
  cursor: url("../assets/cursors/loading.cur"), wait;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("../assets/windoge98clouds.webp");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
}

.logo {
  max-width: 1000px;
  max-height: auto;
  width: 80vw;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}
</style>
