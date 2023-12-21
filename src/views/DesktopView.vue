<script setup lang="ts">
import { reactive, watch, onMounted, ref, onUnmounted } from "vue";
import Window from "../components/Window.vue";
import WelcomeWindow from "../components/WelcomeWindow.vue";
import OpenChatWindow from "../components/OpenChatWindow.vue";
import DevelopersWindow from "../components/DevelopersWindow.vue";
import { eventBus } from "../utils/bus";
// import DaoWindow from "../components/DaoWindow.vue";

type Dimensions = {
  height: number | string;
  width: number | string;
  x: number;
  y: number;
};

type Window = {
  id: number;
  title?: string;
  type: WindowType;
  visible: boolean;
  active: boolean;
  maximised: boolean;
  dimensions: Dimensions;
};

type WindowType = "welcome" | "developers" | VirtualWindowType;

const DEFAULT_WIDTH = 600; // Set initial width
const DEFAULT_HEIGHT = 440; // Set initial height
const MIN_WIDTH = 550; // Minimum width
const MIN_HEIGHT = "100%"; // Minimum height
const STATE_KEY = "windoge98_window_state";
const screenWidth = ref(window.innerWidth);
const screenHeight = ref(window.innerHeight - 40);

const WELCOME_WINDOW: Window = {
  id: 0,
  title: "Welcome to Windoge98",
  visible: true,
  active: true,
  maximised: false,
  type: "welcome",
  dimensions: {
    height: 570,
    width: DEFAULT_WIDTH,
    x: 100,
    y: 5,
  },
};

const DEV_WINDOW: Window = {
  id: 1,
  title: "Developers",
  visible: true,
  active: false,
  maximised: false,
  type: "developers",
  dimensions: {
    height: DEFAULT_HEIGHT,
    width: DEFAULT_WIDTH,
    x: 200,
    y: 600,
  },
};

let initialised = false;
let windows: Window[] = reactive([WELCOME_WINDOW, DEV_WINDOW]);

function updateScreenDimensions() {
  screenWidth.value = window.innerWidth;
  screenHeight.value = window.innerHeight - 40;
}

onUnmounted(() => {
  window.removeEventListener("resize", updateScreenDimensions);
});

onMounted(() => {
  const state = localStorage.getItem(STATE_KEY);
  if (state) {
    const wins = JSON.parse(state) as Window[];
    Object.assign(windows, [...windows, ...wins]);
  }
  initialised = true;

  window.addEventListener("resize", updateScreenDimensions);

  eventBus.onOpenVirtualWindow((winType: VirtualWindowType) => {
    const id = windows.length;
    windows.push({
      id,
      visible: true,
      active: false,
      type: winType,
      maximised: false,
      dimensions: {
        height: 420,
        width: DEFAULT_WIDTH,
        x: 200,
        y: 540,
      },
    });

    activateWindow(id);
  });
});

watch(windows, (val) => {
  if (!initialised) return;

  const filtered = val.filter((w) => w.id > 1);

  // let's store the window state in local storage
  localStorage.setItem(STATE_KEY, JSON.stringify(filtered));
});

const activateWindow = (id: number) => {
  windows.forEach((w) => {
    w.active = w.id === id;
  });
};

const zIndexForWindow = (id: number) => {
  return findWindow(id)?.active ? 100 : 1;
};

function findWindow(id: number): Window | undefined {
  return windows.find((w) => w.id === id);
}

function onResize(id: number, left: number, top: number, width: number, height: number) {
  windows.forEach((win) => {
    if (win.id === id) {
      win.dimensions.x = left;
      win.dimensions.y = top;
      win.dimensions.width = width;
      win.dimensions.height = height;
    }
  });
}

async function closeWindow(id: number) {
  windows.splice(id, 1);
}

function maximiseWindow(id: number) {
  const win = windows.find((w) => w.id === id);
  if (win !== undefined) {
    win.maximised = !win.maximised;
  }
}

async function minimiseWindow(id: number) {
  // just close it for now
  closeWindow(id);
}
</script>

<template>
  <div v-for="win in windows" :key="win.id">
    <vue-draggable-resizable
      class="responsive-container"
      :active="win.active"
      @activated="activateWindow(win.id)"
      @resizestop="(left: number, top: number, width: number, height: number) => onResize(win.id, left, top, width, height)"
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
        v-if="win.type === 'welcome'"
        title="Welcome to Windoge98"
        @onMinimise="minimiseWindow(win.id)"
        @onMaximise="maximiseWindow(win.id)"
        @onClose="closeWindow(win.id)"
      >
        <WelcomeWindow />
      </Window>

      <Window
        v-if="win.type === 'developers'"
        title="Developers"
        @onMinimise="minimiseWindow(win.id)"
        @onMaximise="maximiseWindow(win.id)"
        @onClose="closeWindow(win.id)"
      >
        <DevelopersWindow />
      </Window>

      <Window
        v-if="win.type === 'openchat'"
        title="OpenChat"
        @onMinimise="minimiseWindow(win.id)"
        @onMaximise="maximiseWindow(win.id)"
        @onClose="closeWindow(win.id)"
      >
        <OpenChatWindow />
      </Window>
    </vue-draggable-resizable>

    <!-- <vue-draggable-resizable
      class="responsive-container"
      :active="activeWindow == 3"
      @activated="activateWindow(3)"
      :style="{ zIndex: zIndexForWindow(3) }"

      :w="initialWidth"
      :h="initialHeight"
      :minw="minWidth"
      :minh="minHeight"
      :x="20"
      :y="540"
      v-if="windowStatus.window2"
    >
      <DaoWindow @onClose="closeWindow" :windowNumber="3" />
    </vue-draggable-resizable> -->
  </div>
</template>

<style></style>
