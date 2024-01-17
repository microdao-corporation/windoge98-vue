<script setup lang="ts">
import { ref, onMounted } from "vue";
import clippyImage from "../assets/clippy.png";
import { useClippyAgent } from "../hooks/useClippyAgent";

const clippyText = ref("");
const { getAllSubmissions, data } = useClippyAgent();

onMounted(async () => {
  await getAllSubmissions();
  getRandomClippyJoke();
});

function getRandomClippyJoke() {
  const jokes = data.value.texts;

  const randomIndex = Math.floor(Math.random() * jokes.length);
  clippyText.value = jokes[randomIndex].text;
}
</script>

<template>
  <div
    class="clippy-bubble"
    style="
      position: absolute;
      bottom: 150px; /* Adjust as needed */
      right: 20px; /* Align with Clippy */
      width: 200px; /* Adjust as needed */
      padding: 10px;
      background: #fafbcf;
      border-radius: 10px;
      box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
      z-index: 1;
    "
  >
    {{ clippyText }}
  </div>
  <img
    :src="clippyImage"
    style="
      width: 100px;
      height: 100px;
      position: absolute;
      bottom: 40px;
      right: 20px;
      z-index: 900;
    "
  />
</template>

<style>
.clippy-bubble::after {
  content: "";
  position: absolute;
  bottom: -20px; /* Adjust as needed */
  right: 20px; /* Align with Clippy */
  border-width: 10px;
  border-style: solid;
  border-color: #fafbcf transparent transparent transparent;
}
.clippy-bubble {
  background-color: #fafbcf;
  border: 1px solid black;
}
</style>
