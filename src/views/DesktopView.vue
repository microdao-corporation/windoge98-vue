<script setup lang="ts">
import Window from "../components/Window.vue";
import Toolbar from "../components/Toolbar.vue";
import { useWindowManagement } from "../hooks/useWindowManager";

const {
  windows,
  screenWidth,
  screenHeight,
  MIN_WIDTH,
  MIN_HEIGHT,
  activateWindow,
  zIndexForWindow,
  onResize,
  closeWindow,
  maximiseWindow,
  minimiseWindow,
  getComponentForWindowType,
  onDragEnd,
} = useWindowManagement();

// This was setup for anvil to play with a window in console.
declare global {
  interface Window {
    createWindow: (url: string, title: string, height: number, width: number) => void;
  }
}

function createWindow(url: string, title: string, height: number, width: number) {
  const id = windows.length;
  windows.push({
    id,
    title,
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
</script>

<template>
  <div v-for="win in windows" :key="win.id">
    <vue-draggable-resizable
      class="responsive-container"
      :active="win.active"
      @activated="activateWindow(win.id)"
      @dragstop="(left: number, top: number) => onDragEnd(win.id, left, top)"
      @resizestop="
        (left: number, top: number, width: number, height: number) =>
          onResize(win.id, left, top, width, height)
      "
      :style="{ zIndex: zIndexForWindow(win.id) }"
      :w="win.maximised ? screenWidth : win.dimensions.width"
      :h="win.maximised ? screenHeight : win.dimensions.height"
      :minw="MIN_WIDTH"
      :minh="MIN_HEIGHT"
      :x="win.maximised ? 0 : win.dimensions.x"
      :y="win.maximised ? 0 : win.dimensions.y"
      v-if="win.visible"
      :handles="['tr', 'tl', 'bl', 'br']"
    >
      <Window
        :title="win.title"
        :icon="win.icon"
        @onMinimise="minimiseWindow(win)"
        @onMaximise="maximiseWindow(win)"
        @onClose="closeWindow(win)"
      >
        <component
          :is="getComponentForWindowType(win).component"
          v-bind="getComponentForWindowType(win).props"
        />
      </Window>
    </vue-draggable-resizable>
    <Toolbar />
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
