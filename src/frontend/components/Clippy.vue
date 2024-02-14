<script setup lang="ts">
import { ref, onMounted } from "vue";
import clippyImage from "../assets/clippy.png";
import { getRandomClippyJoke } from "../data/jokes.ts";

const clippyText = ref("");
const clippyVisible = ref(true); // State to control Clippy visibility

onMounted(() => {
  clippyText.value = getRandomClippyJoke();
});

function toggleVisibility() {
  clippyVisible.value = !clippyVisible.value;
}

function showNextJoke() {
  clippyText.value = getRandomClippyJoke();
}
</script>


<template>
  <div v-if="clippyVisible" class="clippy-container">
    <div class="clippy-bubble">
      {{ clippyText }}
      <div class="button-container">
        <button @click="showNextJoke" class="action-btn">Next</button>
        <button @click="toggleVisibility" class="action-btn close-btn">Close</button>
      </div>
    </div>
    <img :src="clippyImage" class="clippy-image"/>
  </div>
  <button v-if="!clippyVisible" @click="toggleVisibility" class="show-clippy-btn">Show Clippy</button>
</template>

<style scoped>
.clippy-container {
  position: absolute;
  bottom: 50px;
  right: 20px;
  z-index: 10;
}

.button-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.clippy-bubble {
  position: absolute;
  bottom: 100px;
  right: 0;
  width: 200px;
  padding: 10px;
  background: #fafbcf;
  border-radius: 10px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.clippy-bubble::after {
  content: "";
  position: absolute;
  bottom: -20px;
  right: 20px;
  border-width: 10px;
  border-style: solid;
  border-color: #fafbcf transparent transparent transparent;
}

.action-btn {
  margin-top: 10px;
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
}

.close-btn {
  background-color: #f44336;
}

.clippy-image {
  width: 100px;
  height: 100px;
  position: absolute;
  bottom: 0;
  right: 0;
}

.show-clippy-btn {
  position: fixed;
  bottom: 40px;
  right: 1px;
  z-index: 11;
  cursor: pointer;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #eeef9f;
  color: black;
  font-size: 14px;
}

.show-clippy-btn:hover, .action-btn:hover {
  opacity: 0.8;
}
</style>
