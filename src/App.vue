<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const contextMenuPosition = ref({ x: '0px', y: '0px' });
const contextMenuVisible = ref(false);

onMounted(() => {
  document.addEventListener("contextmenu", showContextMenuWindow);
});

onUnmounted(() => {
  document.removeEventListener("contextmenu", showContextMenuWindow);
});

function showContextMenuWindow(e: MouseEvent) {
  e.preventDefault();
  contextMenuPosition.value = { x: `${e.pageX}px`, y: `${e.pageY}px` };
  contextMenuVisible.value = true;
}

function closeContextMenu() {
  contextMenuVisible.value = false;
}

</script>

<template>
  <RouterView />
  <div class="context-menu"
    v-if="contextMenuVisible" 
    :style="{ position: 'absolute', top: contextMenuPosition.y, left: contextMenuPosition.x }"
    @mouseleave="closeContextMenu"
  >
    <div @click="closeContextMenu">Arrange Icons</div>
    <div @click="closeContextMenu">Option 2</div>
    <div @click="closeContextMenu">Option 3</div>
  </div>
</template>

<style scoped>
.submenu-expand-icon {
  align-self: center;
  margin-left: 6px;
}

.context-menu {
  background-color: #c0c0c0;
  font-size: 11px;
  color: black;
  border: 2px solid #7c7c7c;
  border-top-color: #fff;
  border-left-color: #fff;
  width: fit-content;
  max-height: fit-content;
  padding-top: 2px;
  padding-bottom: 2px;
  display: flex;
  flex-direction: column;
  animation: grow-effect 0.3s ease-out forwards;
  overflow: hidden;
}

.context-menu div:hover {
  background-color: #000080;
  fill: white;
  color: white;
  cursor: url("./assets/cursors/pointer.cur");
}
.context-menu div {
  display: flex;
  padding-left: 3px;
  overflow: hidden;
}

.desktop-icon {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 80px;
  background-image: url("/assets/desktop.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.desktop-icon img {
  width: 100%;
  height: 100%;
}
.icon-title {
  width: 100%;
  color: #fff;
  font-family: Arial;
  font-size: 11px;
  text-align: center;
  background-color: #0b6666;
}

@keyframes grow-effect {
  from {
    width: 0px;
    height: 0px;
  }
  to {
    width: 110px;
    height: 60px;
  }
}
</style>
