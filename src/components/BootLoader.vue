<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"

const selectedOption = ref(1); // 1 for hard disk, 2 for CD-ROM
const blink = ref(true);

function toggleBlink() {
    blink.value = !blink.value;
}

let intervalId: number | undefined;

onMounted(() => {
    intervalId = window.setInterval(toggleBlink, 500);
    window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
    if (intervalId !== undefined) {
        window.clearInterval(intervalId);
    }

    window.removeEventListener('keydown', handleKeyDown);
});

function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
        selectedOption.value = 1;
    } else if (event.key === 'ArrowDown') {
        selectedOption.value = 2;
    } else if (event.key === 'Enter') {
        if (selectedOption.value === 1) {
            // Logic for booting from Hard Disk
            console.log('Boot from Hard Disk');
        } else {
            // Logic for booting from CD-ROM
            console.log('Boot from CD-ROM');
            // TODO will just open a screen saying no CD-ROM inserted
        }
    }
}
</script>

<template>
    <div class="bootloader">
        <h1>Microsoft Windows 98 CD-ROM Startup Menu</h1>
        <ul>
            <li :class="{ selected: selectedOption === 1 }">1. Boot from Hard Disk</li>
            <li :class="{ selected: selectedOption === 2 }">2. Boot from CD-ROM</li>
        </ul>
        <p>Enter your choice: <span v-if="blink" class="blink">_</span></p>
    </div>
</template>

<style scoped>
.bootloader {
    color: white;
    background-color: black;
    font-family: 'Courier New', monospace;
    width: 100vw;
    height: 100vh;
}

.bootloader h1 {
    margin: 20;
    font-family: 'Courier New', monospace;
}

.bootloader ul {
    padding: 0;
}

.bootloader li {
    margin-bottom: 5px;
}

.bootloader li.selected {
    color: #000000;
    background-color: #ffffff;
}

.blink {
    display: inline-block;
    width: 10px;
    animation: blinker infinite;
}
</style>
