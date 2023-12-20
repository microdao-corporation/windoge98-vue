<script setup lang="ts">
import { onMounted } from "vue";
import Toolbar from "./components/Toolbar.vue";
import { initOrbiter } from "@junobuild/analytics";

onMounted(async () => {
  await initOrbiter({
    satelliteId: "4hy5z-qaaaa-aaaal-addrq-cai",
    orbiterId: "ikgsc-2qaaa-aaaal-adagq-cai",
  });
});
</script>

<template>

  <!-- <div class="desktop-icon">
    <img src="./assets/dao_icon.png" alt="desktop" />
    <div class="icon-title">MicroDAO</div>
  </div> -->
  <RouterView></RouterView>
  <Toolbar />
</template>

<style scoped>
.desktop-icon {
  position: absolute;
  top: 10;
  left: 10;
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
