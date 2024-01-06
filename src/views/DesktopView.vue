<script setup lang="ts">
import Window from "../components/Window.vue";
import Toolbar from "../components/Toolbar.vue";
import { useWindowStore } from "../stores/useWindowStore";

const windowStore = useWindowStore();
const activateWindow = windowStore.activateWindow;
const getComponentForWindowType = windowStore.getComponentForWindowType;

// This was setup for anvil to play with a window in console.
declare global {
  interface Window {
    createWindow: (url: string, title: string, height: number, width: number) => void;
  }
}

function createWindow(url: string, title: string, height: number, width: number) {
  const id = windowStore.windows.length;
  windowStore.windows.push({
    id,
    title,
    zIndex: 100,
    url,
    visible: true,
    active: false,
    type: "none",
    subType: "unknown",
    maximised: false,
    dimensions: {
      height,
      width,
      x: 200,
      y: 540,
    },
  });

  activateWindow(id);
}
window.createWindow = createWindow;

function handleActivateToolbarWindow(windowId: number) {
  console.log("handleActivateToolbarWindow", windowId);
  activateWindow(windowId);
}
</script>

<template>
  <div v-for="win in windowStore.windows" :key="win.id">
    <vue-draggable-resizable
      class="responsive-container"
      :active="win.active"
      @activated="windowStore.activateWindow(win.id)"
      @dragstop="(left: number, top: number) => windowStore.onDragEnd(win.id, left, top)"
      @resizestop="
        (left: number, top: number, width: number, height: number) =>
        windowStore.onResize(win.id, left, top, width, height)
      "
      :style="{ zIndex: win.zIndex }"
      :w="win.maximised ? windowStore.screenWidth : win.dimensions.width"
      :h="win.maximised ? windowStore.screenHeight : win.dimensions.height"
      :minw="windowStore.MIN_WIDTH"
      :minh="windowStore.MIN_HEIGHT"
      :x="win.maximised ? 0 : win.dimensions.x"
      :y="win.maximised ? 0 : win.dimensions.y"
      v-if="win.visible"
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
          :is="getComponentForWindowType(win).component"
          v-bind="getComponentForWindowType(win).props"
        />
      </Window>
    </vue-draggable-resizable>
    <Toolbar @activateToolbarWindow="handleActivateToolbarWindow" />
  </div>
</template>

<style>
body {
  background-color: teal;
  background-size: initial;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>
