
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    app: {
        type: Object as () => { name: string; icon: string; position?: { x: number; y: number; } },
        required: true
    },
    isSelected: Boolean,
    positionStyle: Object
});

const emits = defineEmits(['select', 'dragend']);

const handleSelection = (event: MouseEvent) => {
    emits('select', { app: props.app, event });
};

const handleDragStart = (event: DragEvent) => {
    event.dataTransfer?.setData('text/plain', JSON.stringify(props.app));
};

const handleDragEnd = (event: DragEvent) => {
    emits('dragend', { app: props.app, event, x: event.clientX, y: event.clientY });
};

</script>

<template>
    <div class="desktop-icon" :class="{ 'icon-selected': isSelected }" :style="positionStyle" @click="handleSelection"
        @dragstart="handleDragStart" @dragend="handleDragEnd">
        <img :src="app.icon" :alt="app.name" />
        <div class="desktop-icon-name">{{ app.name }}</div>
    </div>
</template>
  
<style scoped>
.desktop-icon {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80px;
    height: 100px;
    cursor: pointer;
}

.desktop-icon img {
    width: 64px;
    height: 64px;
    object-fit: cover;
    image-rendering: pixelated;
}

.desktop-icon-name {
    font-size: 12px;
    color: #ffffff;
    text-align: center;
    line-height: 1.2;
    word-break: break-word;
    margin-top: 6px;
}

.icon-selected {
    background-color: #000080;
    color: white;
}

.icon-selected img {
    opacity: 0.5;
}

.icon-selected .desktop-icon-name {
    color: white;
}
</style>
  