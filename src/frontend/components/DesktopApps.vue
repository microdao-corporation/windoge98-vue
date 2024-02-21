<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import DesktopApp from "./DesktopApp.vue";
import { useMenuItemStore } from "../stores/menuItemStore";
import { openNewWindow } from "../utils/windowUtils";

const props = defineProps({
  arrangeIconsTrigger: Boolean,
});

watch(
  () => props.arrangeIconsTrigger,
  () => {
    arrangeIcons();
  }
);

const { startMenuData } = useMenuItemStore();
const ICON_MARGIN = 2;
const ICON_TOTAL_WIDTH = 100;
const ICON_TOTAL_HEIGHT = 100;
const TASKBAR_HEIGHT = 50;

const selectionStart = ref({ x: 0, y: 0 });
const selectionEnd = ref({ x: 0, y: 0 });
const isSelecting = ref(false);
const selectedApps = ref<string[]>([]);
const selectionVisible = ref(false);
const desktopAreaRef = ref<HTMLElement | null>(null);

function arrangeIcons(): void {
  const containerHeight = window.innerHeight - TASKBAR_HEIGHT; // Adjusted for taskbar
  const iconsPerCol = Math.floor(containerHeight / ICON_TOTAL_HEIGHT);

  desktopApps.value.forEach((app, index) => {
    const col = Math.floor(index / iconsPerCol);
    const row = index % iconsPerCol;

    const x = col * ICON_TOTAL_WIDTH + ICON_MARGIN;
    const y = row * ICON_TOTAL_HEIGHT + ICON_MARGIN;

    app.position = { x, y };
  });
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

function isSelected(appName: string): boolean {
  return selectedApps.value.includes(appName);
}

function toggleSelection({ app, event }: { app: MenuItem; event: MouseEvent }): void {
  if (!isSelecting.value) {
    const index = selectedApps.value.indexOf(app.name);
    if (event.ctrlKey) {
      if (index !== -1) {
        selectedApps.value.splice(index, 1);
      } else {
        selectedApps.value.push(app.name);
      }
    } else {
      selectedApps.value = [app.name];
    }
    event.preventDefault();
  }
}

function handleDragEnd({ app, x, y }: { app: MenuItem; x: number; y: number }): void {
  if (!selectedApps.value.includes(app.name)) {
    updateAppPosition(app, x, y);
  } else {
    const offsetX = app.position ? x - app.position.x : 0;
    const offsetY = app.position ? y - app.position.y : 0;

    selectedApps.value.forEach((appName) => {
      const selectedApp = desktopApps.value.find((a) => a.name === appName);
      if (selectedApp) {
        const newX = selectedApp.position ? selectedApp.position.x + offsetX : 0;
        const newY = selectedApp.position ? selectedApp.position.y + offsetY : 0;
        updateAppPosition(selectedApp, newX, newY);
      }
    });
  }
}

function updateAppPosition(
  app: MenuItem,
  x: number,
  y: number,
  isInitialCall: boolean = true
): void {
  let gridX = Math.round((x - ICON_MARGIN) / ICON_TOTAL_WIDTH);
  let gridY = Math.round((y - ICON_MARGIN) / ICON_TOTAL_HEIGHT);

  gridY = Math.max(
    0,
    Math.min(
      gridY,
      Math.floor((window.innerHeight - TASKBAR_HEIGHT) / ICON_TOTAL_HEIGHT) - 1
    )
  );
  gridX = Math.max(
    0,
    Math.min(gridX, Math.floor(window.innerWidth / ICON_TOTAL_WIDTH) - 1)
  );

  if (isInitialCall) {
    const freeSpot = findNearestFreeSpot(gridX, gridY, app.name);
    gridX = freeSpot.x;
    gridY = freeSpot.y;
  }

  app.position = {
    x: gridX * ICON_TOTAL_WIDTH + ICON_MARGIN,
    y: gridY * ICON_TOTAL_HEIGHT + ICON_MARGIN,
  };
}

function findNearestFreeSpot(
  startX: number,
  startY: number,
  excludeAppName: string
): { x: number; y: number } {
  const gridWidth = Math.floor(window.innerWidth / ICON_TOTAL_WIDTH);
  const gridHeight = Math.floor(
    (window.innerHeight - TASKBAR_HEIGHT) / ICON_TOTAL_HEIGHT
  );
  const grid = Array.from({ length: gridHeight }, () => Array(gridWidth).fill(false));

  desktopApps.value.forEach((app) => {
    if (app.name !== excludeAppName && app.position) {
      const x = Math.round((app.position.x - ICON_MARGIN) / ICON_TOTAL_WIDTH);
      const y = Math.round((app.position.y - ICON_MARGIN) / ICON_TOTAL_HEIGHT);
      if (y < gridHeight && x < gridWidth) {
        grid[y][x] = true;
      }
    }
  });

  for (let radius = 0; radius < Math.max(gridWidth, gridHeight); radius++) {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const newY = startY + dy;
        const newX = startX + dx;
        if (
          newY >= 0 &&
          newY < gridHeight &&
          newX >= 0 &&
          newX < gridWidth &&
          !grid[newY][newX]
        ) {
          return { x: newX, y: newY };
        }
      }
    }
  }

  return { x: startX, y: startY };
}

function onMouseDown(event: MouseEvent) {
  if (event.target !== desktopAreaRef.value) return;
  // event.stopPropagation();
  if (event.button === 2) return; // Right-click has a button value of 2

  const clickedElement = event.target as HTMLElement;
  const isClickOnBackground =
    clickedElement === desktopAreaRef.value || !clickedElement.closest(".desktop-icon");

  if (isClickOnBackground && event.button !== 2) {
    // Also allow to also select icons with left click
    selectionStart.value = { x: event.clientX, y: event.clientY };
    selectionEnd.value = { x: event.clientX, y: event.clientY };
    isSelecting.value = true;
    selectionVisible.value = true;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  } else {
    if (!event.ctrlKey && event.button === 0) {
      selectedApps.value = [];
    }
  }
}

function onMouseMove(event: MouseEvent): void {
  if (!isSelecting.value) return;

  selectionEnd.value = { x: event.clientX, y: event.clientY };
}

function onMouseUp(): void {
  isSelecting.value = false;
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);

  const rectStartX = Math.min(selectionStart.value.x, selectionEnd.value.x);
  const rectEndX = Math.max(selectionStart.value.x, selectionEnd.value.x);
  const rectStartY = Math.min(selectionStart.value.y, selectionEnd.value.y);
  const rectEndY = Math.max(selectionStart.value.y, selectionEnd.value.y);

  if (!(event as MouseEvent).ctrlKey) {
    selectedApps.value = [];
  }

  desktopApps.value.forEach((app) => {
    const appX = app.position?.x ?? 0;
    const appY = app.position?.y ?? 0;
    const appRightX = appX + ICON_TOTAL_WIDTH;
    const appBottomY = appY + ICON_TOTAL_HEIGHT;

    if (
      appX < rectEndX &&
      appRightX > rectStartX &&
      appY < rectEndY &&
      appBottomY > rectStartY
    ) {
      if (!selectedApps.value.includes(app.name)) {
        selectedApps.value.push(app.name);
      }
    }
    selectionVisible.value = false;
  });
}

function handleDoubleClick(app: MenuItem): void {
  selectedApps.value = [];
  if (app.url) {
    console.log(`Opening ${app.url}`);
    openNewWindow(app);
  }
}

onMounted(() => {
  arrangeIcons();
  document.addEventListener("mousedown", onMouseDown, true);
});

onUnmounted(() => {
  document.removeEventListener("mousedown", onMouseDown, true);
});

function getSelectionStyle() {
  if (!selectionVisible.value) return {};
  const startX = Math.min(selectionStart.value.x, selectionEnd.value.x);
  const startY = Math.min(selectionStart.value.y, selectionEnd.value.y);
  const width = Math.max(selectionStart.value.x, selectionEnd.value.x) - startX;
  const height = Math.max(selectionStart.value.y, selectionEnd.value.y) - startY;

  return {
    left: `${startX}px`,
    top: `${startY}px`,
    width: `${width}px`,
    height: `${height}px`,
    position: "absolute",
    zIndex: 1000,
    border: "1px dashed #333",
    backgroundColor: "rgba(128, 128, 255, 0.2)",
  } as any;
}
</script>

<template>
  <div @mousedown="onMouseDown" class="desktop-area" ref="desktopAreaRef">
    <!-- Selection rectangle -->
    <div
      v-show="selectionVisible"
      class="selection-rectangle"
      :style="getSelectionStyle()"
    ></div>

    <!-- Desktop icons/apps -->
    <DesktopApp
      v-for="app in desktopApps"
      :key="app.name"
      :app="app"
      :isSelected="isSelected(app.name)"
      :style="{
        left: `${app.position?.x}px`,
        top: `${app.position?.y ?? 0}px`,
      }"
      @dragend="handleDragEnd"
      @click="toggleSelection({ app, event: $event })"
      @dblclick="handleDoubleClick(app)"
    />
  </div>
</template>

<style>
.desktop-area {
  width: 100%;
  height: 100vh;
  position: relative;
  user-select: none;
}

.selection-rectangle {
  border: 2px dashed #333;
  background-color: rgba(128, 128, 255, 0.2);
  position: absolute;
}
</style>
