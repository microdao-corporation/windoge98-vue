// src/components/DesktopApps.vue

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import DesktopApp from "./DesktopApp.vue";
import { useMenuItemStore } from "../stores/menuItemStore";
import { openNewWindow } from "../utils/windowUtils";

const { startMenuData } = useMenuItemStore();
const ICON_MARGIN = 2;
const ICON_TOTAL_WIDTH = 100;
const ICON_TOTAL_HEIGHT = 100;

function arrangeIcons(apps: MenuItem[]): MenuItem[] {
  const containerHeight = window.innerHeight;
  const iconsPerCol = Math.floor(containerHeight / ICON_TOTAL_HEIGHT);

  apps.forEach((app, index) => {
    const col = Math.floor(index / iconsPerCol); // current column based on index
    const row = index % iconsPerCol; // current row in the current column

    const x = col * ICON_TOTAL_WIDTH + ICON_MARGIN;
    const y = row * ICON_TOTAL_HEIGHT + ICON_MARGIN;

    app.position = { x, y };
  });

  return apps;
}

let desktopApps = computed((): MenuItem[] => {
  const apps: MenuItem[] = [];

  startMenuData.main.forEach((item) => {
    if (!item.visible) return;
    if (item.submenu) {
      apps.push(...item.submenu);
    }
  });

  startMenuData.bottom.forEach((item) => {
    if (!item.visible) return;
    if (item.submenu) {
      apps.push(...item.submenu);
    }
  });

  return apps;
});

const selectedApps = ref<string[]>([]);

function isSelected(appName: string): boolean {
  return selectedApps.value.includes(appName);
}

function toggleSelection({ app, event }: { app: MenuItem; event: MouseEvent }): void {
  const index = selectedApps.value.indexOf(app.name);
  if (event.ctrlKey) {
    // Ctrl+click:
    if (index !== -1) {
      selectedApps.value.splice(index, 1);
    } else {
      selectedApps.value.push(app.name);
    }
  } else {
    // regular click: select only this app
    if (index === -1) {
      selectedApps.value = [app.name]; // Select only this app
    } else {
      // already selected? then its deselection time
      if (selectedApps.value.length === 1) {
        selectedApps.value = [];
      } else {
        // there are multiple selections? select only this app
        selectedApps.value = [app.name];
      }
    }
  }
  event.preventDefault(); // Prevent text selection
}

function handleDragEnd({ app, x, y }: { app: MenuItem; x: number; y: number }) {
  const newX =
    Math.round((x - ICON_MARGIN) / ICON_TOTAL_WIDTH) * ICON_TOTAL_WIDTH + ICON_MARGIN;
  const newY =
    Math.round((y - ICON_MARGIN) / ICON_TOTAL_HEIGHT) * ICON_TOTAL_HEIGHT + ICON_MARGIN;

  // Find if there's an app at the new position
  const overlappingApp = findAppByPosition(newX, newY, app.name);
  if (overlappingApp) {
    // Swap positions if there's an overlap
    swapPositions(app, overlappingApp);
  } else {
    // If no overlap, just move the app to the new position
    app.position = { x: newX, y: newY };
  }
}

function findAppByPosition(
  x: number,
  y: number,
  excludeAppName: string
): MenuItem | null {
  return (
    desktopApps.value.find((app) => {
      return (
        app.name !== excludeAppName && app.position?.x === x && app.position?.y === y
      );
    }) || null
  );
}

function swapPositions(app1: MenuItem, app2: MenuItem) {
  const tempPosition = app1.position;
  app1.position = app2.position;
  app2.position = tempPosition;
}

function handleDoubleClick(app: MenuItem) {
  if (app.url) {
    console.log(`Opening ${app.url}`);
    openNewWindow(app);
  }
  selectedApps.value = [];
}

onMounted(() => {
  arrangeIcons(desktopApps.value);
  document.addEventListener("mousedown", (event) => {
    if (!(event.target instanceof Element) || !event.target.closest(".desktop-icon")) {
      selectedApps.value = [];
    }
  });
  const handleResize = () => {
    arrangeIcons(desktopApps.value);
  };
  window.addEventListener("resize", handleResize);
});
</script>

<template>
  <DesktopApp
    v-for="app in desktopApps"
    :key="app.name"
    :app="app"
    :isSelected="isSelected(app.name)"
    :positionStyle="{ left: app.position?.x + 'px', top: app.position?.y + 'px' }"
    @select="toggleSelection"
    @dragend="handleDragEnd"
    @dblclick="() => handleDoubleClick(app)"
  />
</template>
