<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import logo from "../assets/windoge98-pixel-banner.png";
const router = useRouter();
onMounted(() => {
  setTimeout(() => {
    router.push("/desktop");
  }, 3000);
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
* {
  cursor: url("../assets/cursors/loading.cur"), wait;
}
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.background {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url("../assets/windoge98clouds.webp");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.logo {
  position: absolute;
  width: 1000px;
  height: auto;
  background-image: url("../assets/windoge98-pixel-banner.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}
</style>
