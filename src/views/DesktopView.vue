<script setup lang="ts">
import { ref, reactive } from "vue";
import WelcomeWindow from "../components/WelcomeWindow.vue";
import DevelopersWindow from "../components/DevelopersWindow.vue";

const activeWindow = ref(1);
const initialWidth = 600; // Set initial width
const initialHeight = 420; // Set initial height
const minWidth = 550; // Minimum width
const minHeight = 300; // Minimum height
const windowStatus: any = reactive({
  window1: true,
  window2: true,
});

function closeWindow(window: number) {
  console.log("Closing window " + window);
  windowStatus["window" + window] = false;
}

// Function to activate a window
const activateWindow = (windowNumber: number) => {
  console.log("Activating window " + windowNumber);
  activeWindow.value = windowNumber;
};

const zIndexForWindow = (windowNumber: number) => {
  return activeWindow.value === windowNumber ? 100 : 1;
};
</script>

<template>
  <div class="window-container">
    <vue-draggable-resizable
      class="responsive-container"
      :active="activeWindow == 1"
      @activated="activateWindow(1)"
      :style="{ zIndex: zIndexForWindow(1) }"
      :w="600"
      :h="520"
      :minw="minWidth"
      :minh="minHeight"
      :x="-20"
      :y="5"
      v-if="windowStatus.window1"
    >
      <WelcomeWindow @onClose="closeWindow" :windowNumber="1" />
    </vue-draggable-resizable>

    <vue-draggable-resizable
      class="responsive-container"
      :active="activeWindow == 2"
      @activated="activateWindow(2)"
      :style="{ zIndex: zIndexForWindow(2) }"

      :w="initialWidth"
      :h="initialHeight"
      :minw="minWidth"
      :minh="minHeight"
      :x="20"
      :y="540"
      v-if="windowStatus.window2"
    >
      <DevelopersWindow @onClose="closeWindow" :windowNumber="2" />
    </vue-draggable-resizable>
  </div>
</template>
