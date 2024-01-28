<script setup lang="ts">
import { ref, onMounted } from "vue";
import Window from "../components/Window.vue";
import Toolbar from "../components/Toolbar.vue";
import { useWindowStore } from "../stores/useWindowStore";
import clippyImage from "../assets/clippy.png";
import DesktopApps from "../components/DesktopApps.vue";

const windowStore = useWindowStore();
const activateWindow = windowStore.activateWindow;
const clippyText = ref("");

onMounted(() => {
  clippyText.value = getRandomClippyJoke();
});

function handleActivateToolbarWindow(windowId: number) {
  activateWindow(windowId);
}

function getRandomClippyJoke() {
  const jokes = [
    "Here's the deal, you give me your ICP or i put you in the ICU.",
    "Always buy EXE. Never sell EXE.",
    "Protect your digital gold by setting up a strong password and keeping your private keys as secure as a dog's buried treasure!",
    "I see you're working hard. Need a break? Why did the dog get a Windoge98 token? Because he wanted to 'invest' in the 'bark'chain!",
    "Hey, want to hear a joke while your code compiles? What do you call a dog who uses Windoge98? A 'tech-savvy terrier'!",
    "Looks like you could use a laugh. What's a dog's favorite feature of Windoge98? 'Barking' up the right data tree!",
    "Need a smile? Why don't dogs like using slow operating systems? They prefer the 'fast and fur-ious' speed of Windoge98!",
    "Feeling ruff? Here's a joke: Why did the dog start mining Windoge98 tokens? He heard it was a 'howling' success!",
    "Hey, a little humor goes a long way! What do you call a dog who's an expert in Windoge98? A 'Byte' technician!",
    "Looking for a chuckle? Why was the dog excited about Windoge98? Because he thought it was 'pawfect' for his 'data-fetching' needs!",
    "Here's a joke to lighten your day: How do dogs log in to Windoge98? They use their 'bark-codes'!",
  ];

  const randomIndex = Math.floor(Math.random() * jokes.length);
  return jokes[randomIndex];
}
</script>

<template>
  <div v-if="windowStore.windows" v-for="win in windowStore.windows" :key="win.id">
    <vue-draggable-resizable
      class="responsive-container"
      :active="win.active"
      @activated="windowStore.activateWindow(win.id)"
      @dragstop="(left: number, top: number) => windowStore.onDragEnd(win.id, left, top)"
      @resizestop="
        (left: number, top: number, width: number, height: number) =>
        windowStore.onResize(win.id, left, top, width, height)
      "
      :style="{ zIndex: win.zIndex, display: win.visible ? 'block' : 'none' }"
      :w="win.maximised ? windowStore.screenWidth : win.dimensions.width"
      :h="win.maximised ? windowStore.screenHeight : win.dimensions.height"
      :minw="windowStore.MIN_WIDTH"
      :minh="windowStore.MIN_HEIGHT"
      :x="win.maximised ? 0 : win.dimensions.x"
      :y="win.maximised ? 0 : win.dimensions.y"
      :handles="['tr', 'tl', 'bl', 'br']"
    >
      <Window
        :title="win.title"
        :icon="win.icon"
        @onMinimise="windowStore.minimiseWindow(win.id)"
        @onMaximise="windowStore.maximiseWindow(win.id)"
        @onClose="windowStore.closeWindow(win.id)"
      >
        <component
          :is="windowStore.getComponentForWindowType(win).component"
          v-bind="windowStore.getComponentForWindowType(win).props"
        />
      </Window>
    </vue-draggable-resizable>
  </div>
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
      z-index: 10;
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
      bottom: 50px;
      right: 20px;
      z-index: 10;
    "
  />
  <DesktopApps />
  <Toolbar @activateToolbarWindow="handleActivateToolbarWindow" />
</template>

<style>
body {
  background-color: teal;
  background-size: initial;
  height: 100%;
  width: 100vw;
  overflow: hidden;
}
.clippy-bubble::after {
  content: "";
  position: absolute;
  bottom: -10px; /* Adjust as needed */
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
