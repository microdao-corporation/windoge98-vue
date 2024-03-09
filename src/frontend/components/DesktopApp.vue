<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  app: {
    type: Object as () => MenuItem,
    required: true,
  },
  isSelected: Boolean,
  positionStyle: Object,
});

const emits = defineEmits(["select", "dragend", "drop"]);

// const handleSelection = (event: MouseEvent) => {
//   emits("select", { app: props.app, event });
// };

const handleDragStart = (event: DragEvent) => {
  event.dataTransfer?.setData("text/plain", JSON.stringify(props.app));
};

const handleDragEnd = (event: DragEvent) => {
  emits("dragend", { app: props.app, x: event.clientX, y: event.clientY });
};

const handleDrop = (event: DragEvent) => {
  // Prevent default behavior (Prevent from being opened as a link)
  event.preventDefault();

  // Emit drop event with the necessary data
  emits("drop", { app: props.app, event });
};
</script>

<template>
  <div
    class="desktop-icon"
    :class="{ 'icon-selected': isSelected }"
    :style="positionStyle"

    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @drop="handleDrop"
  >
    <img :src="app.icon" :alt="app.name" v-if="app.icon" />
    <div class="desktop-icon-name">{{ app.name }}</div>
  </div>
</template>

<style scoped>
.desktop-icon {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 75px;
  padding: 4px;
  cursor: url("../assets/cursors/pointer.cur"), pointer;
}

.desktop-icon img {
  width: 56px;
  height: 100%;
  object-fit: cover;
}

.desktop-icon-name {
  font-family: "VT323" !important;
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  word-break: break-word;
  margin-top: 6px;
}

.icon-selected {
  background-color: #000080;
  z-index: 2;
  color: white;
}

.icon-selected img {
  opacity: 0.5;
}

.icon-selected .desktop-icon-name {
  color: white;
}
</style>
