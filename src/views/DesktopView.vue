<script setup lang="ts">
import { reactive, watch, onMounted } from "vue";
import Window from "../components/Window.vue";
import WelcomeWindow from "../components/WelcomeWindow.vue";
import OpenChatWindow from "../components/OpenChatWindow.vue";
import DevelopersWindow from "../components/DevelopersWindow.vue";
import { eventBus } from "../utils/bus";

type Dimensions = {
  height: number;
  width: number;
  x: number;
  y: number;
};

type Window = {
  id: number;
  type: WindowType;
  visible: boolean;
  active: boolean;
  dimensions: Dimensions;
};

type WindowType = "welcome" | "developers" | "openchat";

const DEFAULT_WIDTH = 600; // Set initial width
const DEFAULT_HEIGHT = 420; // Set initial height
const MIN_WIDTH = 550; // Minimum width
const MIN_HEIGHT = 300; // Minimum height
const STATE_KEY = "windoge98_window_state";

const WELCOME_WINDOW: Window = {
  id: 0,
  visible: true,
  active: true,
  type: "welcome",
  dimensions: {
    height: DEFAULT_HEIGHT,
    width: DEFAULT_WIDTH,
    x: 100,
    y: 5,
  },
};

const DEV_WINDOW: Window = {
  id: 1,
  visible: true,
  active: false,
  type: "developers",
  dimensions: {
    height: DEFAULT_HEIGHT,
    width: DEFAULT_WIDTH,
    x: 200,
    y: 540,
  },
};

let initialised = false;
let windows: Window[] = reactive([WELCOME_WINDOW, DEV_WINDOW]);

onMounted(() => {
  const state = localStorage.getItem(STATE_KEY);
  if (state) {
    Object.assign(windows, JSON.parse(state) as Window[]);
  }
  initialised = true;

  eventBus.onOpenOC(() => {
    const id = windows.length;
    windows.push({
      id,
      visible: true,
      active: false,
      type: "openchat",
      dimensions: {
        height: DEFAULT_HEIGHT,
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

  console.log("Windows: ", val);
  // let's store the window state in local storage
  localStorage.setItem(STATE_KEY, JSON.stringify(val));
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

function onResize(
  id: number,
  left: number,
  top: number,
  width: number,
  height: number
) {
  windows.forEach((win) => {
    if (win.id === id) {
      win.dimensions.x = left;
      win.dimensions.y = top;
      win.dimensions.width = width;
      win.dimensions.height = height;
    }
  });
}

function onDrag(id: number, left: number, top: number) {
  windows.forEach((win) => {
    if (win.id === id) {
      win.dimensions.x = left;
      win.dimensions.y = top;
    }
  });
}

function closeTheWindow(id: number) {
  const win = windows.find((w) => w.id === id);
  if (win !== undefined) {
    win.visible = false;
  }
}
</script>

<template>
  <div v-for="win in windows" :key="win.id">
    <vue-draggable-resizable
      class="responsive-container"
      :active="win.active"
      @activated="activateWindow(win.id)"
      @resizestop="(left: number, top: number, width: number, height: number) => onResize(win.id, left, top, width, height)"
      @dragstop="(left: number, top: number) => onDrag(win.id, left, top)"
      :style="{ zIndex: zIndexForWindow(win.id) }"
      :w="win.dimensions.width"
      :h="win.dimensions.height"
      :minw="MIN_WIDTH"
      :minh="MIN_HEIGHT"
      :x="win.dimensions.x"
      :y="win.dimensions.y"
      v-if="win.visible"
    >
      <Window
        v-if="win.type === 'welcome'"
        title="Welcome to Windoge98"
        @onClose="closeTheWindow(win.id)"
      >
        <WelcomeWindow />
      </Window>

      <Window
        v-if="win.type === 'developers'"
        title="Developers"
        @onClose="closeTheWindow(win.id)"
      >
        <DevelopersWindow />
      </Window>

      <Window
        v-if="win.type === 'openchat'"
        title="OpenChat"
        @onClose="closeTheWindow(win.id)"
      >
        <OpenChatWindow />
      </Window>
    </vue-draggable-resizable>
  </div>
</template>

<style></style>
