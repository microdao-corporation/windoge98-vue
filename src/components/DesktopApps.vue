// src/components/DesktopApps.vue

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import DesktopApp from './DesktopApp.vue';
import { startMenuData } from '../data/menuItems';
import { openNewWindow } from "../utils/windowUtils";

interface MenuItem {
    name: string;
    icon: string;
    url: string;
    iconHeight?: number;
    height?: number;
    width?: number;
    virtualWindow: "none" | "iframe" | "newbie_guide" | "blank" | "welcome";
    subType: "unknown" | "openchat";
    visible: boolean;
    submenu?: MenuItem[];
    position?: { x: number; y: number };
}

const ICON_MARGIN = 10;
const ICON_TOTAL_WIDTH = 80;
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

    startMenuData.main.forEach(item => {
        if (item.submenu) {
            apps.push(...item.submenu);
        }
    });

    startMenuData.bottom.forEach(item => {
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
    app.position = {
        x: Math.round((x - ICON_MARGIN) / ICON_TOTAL_WIDTH) * ICON_TOTAL_WIDTH + ICON_MARGIN,
        y: Math.round((y - ICON_MARGIN) / ICON_TOTAL_HEIGHT) * ICON_TOTAL_HEIGHT + ICON_MARGIN
    };
};


function handleDoubleClick(app: MenuItem) {
    if (app.url) {
        console.log(`Opening ${app.url}`);
        openNewWindow(app);
    }
    selectedApps.value = [];
}

onMounted(() => {
    arrangeIcons(desktopApps.value);
    document.addEventListener('mousedown', (event) => {
        if (!(event.target instanceof Element) || !event.target.closest('.desktop-icon')) {
            selectedApps.value = [];
        }
    });
    const handleResize = () => {
        arrangeIcons(desktopApps.value);
    };
    window.addEventListener('resize', handleResize);
});


</script>

<template>
    <div class="desktop-icons-container">
        <DesktopApp v-for="app in desktopApps" :key="app.name" :app="app" :isSelected="isSelected(app.name)"
            :positionStyle="{ left: app.position?.x + 'px', top: app.position?.y + 'px' }" @select="toggleSelection"
            @dragend="handleDragEnd" @dblclick="() => handleDoubleClick(app)" />
    </div>
</template>

<style scoped>
.desktop-icons-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
}
</style>
