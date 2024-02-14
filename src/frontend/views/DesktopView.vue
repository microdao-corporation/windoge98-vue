<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import Window from "../components/Window.vue";
import Toolbar from "../components/Toolbar.vue";
import Clippy from "../components/Clippy.vue";
import { useWindowStore } from "../stores/useWindowStore";
import { openNewWindow } from "../utils/windowUtils";
import clippyImage from "../assets/clippy.png";
import DesktopApps from "../components/DesktopApps.vue";
import { useRouter } from "vue-router";
import { startMenuData } from "../data/menuItems";

const router = useRouter();
const windowStore = useWindowStore();
const activateWindow = windowStore.activateWindow;
const clippyText = ref("");
const contextMenuPosition = ref({ x: "0px", y: "0px" });
const contextMenuVisible = ref(false);
let closeTimer: number | null = null;


function isMobileUser(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

onMounted(() => {
  document.addEventListener("contextmenu", showContextMenuWindow);
});

onUnmounted(() => {
  document.removeEventListener("contextmenu", showContextMenuWindow);
});

function handleActivateToolbarWindow(windowId: number) {
  activateWindow(windowId);
}

function showContextMenuWindow(e: MouseEvent) {
  if (!isMobileUser()) {
    e.preventDefault();
    contextMenuPosition.value = { x: `${e.pageX}px`, y: `${e.pageY}px` };
    contextMenuVisible.value = true;
  }
}

function closeContextMenu(): void {
  if (!contextMenuVisible.value) return;
  if (closeTimer !== null) {
    clearTimeout(closeTimer);
  }
  closeTimer = window.setTimeout(() => {
    contextMenuVisible.value = false;
    closeTimer = null;
  }, 360); // actually the sweet spot
}

function cancelCloseContextMenu(): void {
  if (closeTimer !== null) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
}

function forceCloseContextMenu(): void {
  contextMenuVisible.value = false;
}

const arrangeIconsTrigger = ref(false);

function triggerArrangeIcons() {
  forceCloseContextMenu();
  arrangeIconsTrigger.value = !arrangeIconsTrigger.value; // toggle
}

const closeShutdownWindow = () => {
  windowStore.windows.forEach((win: DesktopWindow) => {
    if (win.title === "Shut Down") {
      windowStore.closeWindow(win.id);
    }
  });
};

function openBsodWindow() {
  forceCloseContextMenu();
  closeShutdownWindow();
  router.push("/bsod");
}

function openShutdownWindow() {
  forceCloseContextMenu();
  const shutdownItem = startMenuData.bottom.find((item) => item.name === "Shut Down");
  if (shutdownItem) {
    openNewWindow(shutdownItem);
  }
}
</script>

<template>
  <div
    class="context-menu"
    v-if="contextMenuVisible"
    :style="{
      top: contextMenuPosition.y,
      left: contextMenuPosition.x,
    }"
    @mouseleave="closeContextMenu"
    @mouseenter="cancelCloseContextMenu"
  >
    <div class="context-item" @click="triggerArrangeIcons">Arrange icons</div>
    <div class="context-item" @click="openBsodWindow">New folder</div>
    <div class="context-item" @click="openShutdownWindow">Shutdown</div>
  </div>
  <div
    @contextmenu="showContextMenuWindow"
    v-if="windowStore.windows"
    v-for="win in windowStore.windows"
    :key="win.id"
  >
    <vue-draggable-resizable
      class="responsive-container"
      :active="win.active"
      @activated="windowStore.activateWindow(win.id)"
      @dragstop="
        (left: number, top: number) => windowStore.onDragEnd(win.id, left, top)
      "
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
          @onClose="windowStore.closeWindow(win.id)"
        />
      </Window>
    </vue-draggable-resizable>
  </div>
  <Clippy :clippyText="clippyText" :clippyImage="clippyImage" />
  <DesktopApps :arrange-icons-trigger="arrangeIconsTrigger" />
  <Toolbar @activateToolbarWindow="handleActivateToolbarWindow" />
</template>

<style>
body {
  background-color: teal;
  background-size: initial;
  overflow: hidden;
  cursor: url("../assets/cursors/arrow.cur"), auto;
}

.clippy-bubble::after {
  content: "";
  position: absolute;
  bottom: -20px;
  /* Adjust as needed */
  right: 20px;
  /* Align with Clippy */
  border-width: 10px;
  border-style: solid;
  border-color: #fafbcf transparent transparent transparent;
}

.clippy-bubble {
  background-color: #fafbcf;
  border: 1px solid black;
}

.title-bar-controls button {
  cursor: url("../assets/cursors/pointer.cur"), pointer;
}

.context-menu {
  position: absolute;
  width: 300px;
  height: 200px;
  background-color: #c0c0c0;
  font-family: Arial;
  font-size: 14px;
  color: black;
  border: 2px solid #7c7c7c;
  border-top-color: #fff;
  border-left-color: #fff;
  margin-top: 2px;
  margin-bottom: 2px;
  display: flex;
  flex-direction: column;
  animation: grow-effect 0.3s ease-out forwards;
  z-index: 1000;
}

.context-menu div:hover {
  background-color: #000080;
  fill: white;
  color: white;
  cursor: url("./assets/cursors/pointer.cur");
}
.context-menu div {
  display: flex;
  padding-left: 3px;
  overflow: hidden;
}

.context-item {
  padding: 5px;
  margin-top: 2px;
  margin-bottom: 2px;
  color: black;
  cursor: pointer;
}

@keyframes grow-effect {
  from {
    width: 0px;
    height: 0px;
  }
  to {
    width: 200px;
    height: 100px;
  }
}
</style>
