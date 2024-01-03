<script setup lang="ts">
import { reactive, watch, onMounted, ref, onUnmounted } from "vue";
import Window from "../components/Window.vue";
import WelcomeWindow from "../components/WelcomeWindow.vue";
import DevelopersWindow from "../components/DevelopersWindow.vue";
import IframeWindow from "../components/IframeWindow.vue";
import { eventBus } from "../utils/bus";
import Toolbar from "../components/Toolbar.vue";
import { useGtag } from "vue-gtag-next";
import { initialiseOpenChat } from "../utils/windowUtils";
// import DaoWindow from "../components/DaoWindow.vue";

const { event } = useGtag();
const DEFAULT_WIDTH = 600; // Set initial width
const DEFAULT_HEIGHT = 440; // Set initial height
const MIN_WIDTH = 550; // Minimum width
const MIN_HEIGHT = "100%"; // Minimum height
const STATE_KEY = "windoge98_window_state";
const screenWidth = ref(window.innerWidth);
const screenHeight = ref(window.innerHeight - 40);

const WELCOME_WINDOW: DesktopWindow = {
  id: 0,
  title: "Welcome to Windoge98",
  visible: true,
  active: true,
  maximised: false,
  type: "welcome",
  subType: "unknown",
  dimensions: {
    height: 570,
    width: DEFAULT_WIDTH,
    x: 100,
    y: 5,
  },
};

const DEV_WINDOW: DesktopWindow = {
  id: 1,
  title: "Happy New Year!",
  visible: true,
  active: false,
  maximised: false,
  type: "developers",
  subType: "unknown",
  dimensions: {
    height: DEFAULT_HEIGHT,
    width: DEFAULT_WIDTH,
    x: 200,
    y: 400,
  },
};

let initialised = false;
let windows: DesktopWindow[] = reactive([WELCOME_WINDOW, DEV_WINDOW]);

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
    const wins = JSON.parse(state) as DesktopWindow[];
    wins.forEach((w) => {
      if ("subType" in w && w.subType === "openchat") {
        w.init = initialiseOpenChat;
      }
    });
    Object.assign(windows, [...windows, ...wins]);
  }
  initialised = true;

  window.addEventListener("resize", updateScreenDimensions);

  eventBus.onOpenVirtualWindow((item: MenuItem) => {
    const id = windows.length;
    windows.push({
      id,
      title: item.name,
      icon: item.icon,
      url: item.url,
      visible: true,
      active: false,
      type: item.virtualWindow,
      subType: item.subType,
      maximised: false,
      dimensions: {
        height: 420,
        width: DEFAULT_WIDTH,
        x: 200,
        y: 540,
      },
      init: item.init,
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

const activateWindow = (id: number) => {
  windows.forEach((w) => {
    w.active = w.id === id;
  });
};

const zIndexForWindow = (id: number) => {
  return findWindow(id)?.active ? 100 : 1;
};

function findWindow(id: number): DesktopWindow | undefined {
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

async function closeWindow(win: DesktopWindow) {
  event("window.close", {
    url: win.url,
    title: win.title,
  });
  windows.splice(win.id, 1);
}

function maximiseWindow(win: DesktopWindow) {
  event("window.maximize", {
    url: win.url,
    title: win.title,
  });
  if (win !== undefined) {
    win.maximised = !win.maximised;
  }
}

async function minimiseWindow(win: DesktopWindow) {
  event("window.minimize", {
    url: win.url,
    title: win.title,
  });
  // just close it for now
  closeWindow(win);
}

const getComponentForWindowType = (windowData: DesktopWindow) => {
  switch (windowData.type) {
    case "welcome":
      return { component: WelcomeWindow, props: {} };
    case "developers":
      return { component: DevelopersWindow, props: {} };
    default:
      return {
        component: IframeWindow,
        props: {
          title: windowData.title,
          url: windowData.url,
          onMount: windowData.init,
        },
      };
    // Add other cases as necessary
  }
};

const onDragEnd = (id: number, left: number, top: number) => {
  const winIndex = windows.findIndex((win) => win.id === id);
  if (winIndex !== -1) {
    windows[winIndex].dimensions.x = left;
    windows[winIndex].dimensions.y = top;
  }
};
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
