<script setup lang="ts">
import { onMounted } from "vue";
import { initOrbiter } from "@junobuild/analytics";

onMounted(async () => {
  await initOrbiter({
    satelliteId: "4hy5z-qaaaa-aaaal-addrq-cai",
    orbiterId: "ikgsc-2qaaa-aaaal-adagq-cai",
  });
});
</script>

<template>
  <RouterView />
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
