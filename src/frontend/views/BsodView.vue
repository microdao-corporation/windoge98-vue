<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const navigate = () => {
  router.push("/boot");
};

onMounted(() => {
  setTimeout(() => {
    navigate();
  }, 5000);
});
</script>

<template>
  <div class="bsod-container">
    <div class="bsod-header">Windoge</div>
    <div class="bsod-body">
      An error has occurred. To continue:
      <p>Press Enter to return to Windoge, or</p>
      <p>Press CTRL+ALT+DEL to restart your computer. If you do this,</p>
      <p>you will lose any unsaved information in all open applications.</p>
      <p>Error: 0E : 016F : BFF9B3D4</p>
    </div>
    <div class="bsod-footer">
      <span>Press any key to continue</span>
      <span class="blinker">_</span>
    </div>
  </div>
</template>

<style scoped>
.bsod-container {
  background-color: #0000aa;
  color: #ffffff;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  align-items: center;
  gap: 20px;
}

.bsod-header {
  padding: 1px 5px;
  width: auto;
  color: #0000aa;
  background-color: rgba(255, 255, 255, 0.75);
  letter-spacing: 1px;
}

.bsod-body {
  text-align: left;
  max-width: 600px;
}

.bsod-footer {
  display: flex;
  align-items: center;
  gap: 5px;
}

.blinker {
  animation: blink 1s infinite;
}

@keyframes blink {
  100% {
    opacity: 0;
  }
  0% {
    opacity: 1;
  }
}
</style>
