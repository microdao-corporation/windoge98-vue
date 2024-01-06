import { reactive, watch, onMounted, onUnmounted, ref } from 'vue';
import { eventBus } from '../utils/bus';
import { useGtag } from 'vue-gtag-next';
import { initialiseOpenChat } from '../utils/windowUtils';
import WelcomeWindow from '../components/WelcomeWindow.vue';
import DevelopersWindow from '../components/DevelopersWindow.vue';
import IframeWindow from '../components/IframeWindow.vue';

export function useWindowManagement() {
  const { event } = useGtag();
  const DEFAULT_WIDTH = 600; // Set initial width
  const DEFAULT_HEIGHT = 440; // Set initial height
  const MIN_WIDTH = 550; // Minimum width
  const MIN_HEIGHT = '100%'; // Minimum height
  const STATE_KEY = 'windoge98_window_state';
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
    title: "Developers",
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

  onUnmounted(() => {
    window.removeEventListener('resize', updateScreenDimensions);
  });

  watch(windows, (val) => {
    if (!initialised) return;
    const filtered = val.filter(w => w.id > 1);
    localStorage.setItem(STATE_KEY, JSON.stringify(filtered));
  });

  function activateWindow(id: number) {
    windows.forEach((w) => {
      w.active = w.id === id;
    });
  };

  function findWindow(id: number): DesktopWindow | undefined {
    return windows.find((w) => w.id === id);
  }

  function zIndexForWindow(id: number) {
    return findWindow(id)?.active ? 100 : 1;
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

  function closeWindow(win: DesktopWindow) {
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

  function minimiseWindow(win: DesktopWindow) {
    event("window.minimize", {
      url: win.url,
      title: win.title,
    });
    // just close it for now
    closeWindow(win);
  }

  function getComponentForWindowType(windowData: DesktopWindow) {
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
  }

  function onDragEnd(id: number, left: number, top: number) {
    const winIndex = windows.findIndex((win) => win.id === id);
    if (winIndex !== -1) {
      windows[winIndex].dimensions.x = left;
      windows[winIndex].dimensions.y = top;
    }
  };

  return {
    windows,
    screenWidth,
    screenHeight,
    MIN_WIDTH,
    MIN_HEIGHT,
    DEFAULT_WIDTH,
    activateWindow,
    zIndexForWindow,
    onResize,
    closeWindow,
    maximiseWindow,
    minimiseWindow,
    getComponentForWindowType,
    onDragEnd,
  };
}