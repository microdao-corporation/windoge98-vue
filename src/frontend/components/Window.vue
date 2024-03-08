<script setup lang="ts">
// Define props and emits
const props = defineProps({
  title: String,
  icon: String,
  url: String,
  init: Function,
  color: {
    type: String,
    default: "none",
  },
});
const emit = defineEmits(["onClose", "onMaximise", "onMinimise"]);
</script>

<template>
  <div class="window" :style="`background-color: ${props.color};`">
    <div class="title-bar" @dblclick="emit('onMaximise')">
      <div class="title-bar-text" style="display: flex; align-items: center">
        <img
          :src="props.icon"
          style="height: 18px; margin-right: 8px"
          v-if="props.icon"
        />
        {{ props.title }}
      </div>
      <div class="title-bar-controls">
        <button aria-label="Minimize" @click="emit('onMinimise')" />
        <button aria-label="Maximize" @click="emit('onMaximise')" />
        <button aria-label="Close" @click="emit('onClose')" />
      </div>
    </div>
    <div class="window-body">
      <!-- Window Content -->
      <slot />
    </div>
  </div>
</template>

<style scoped>
* {
  cursor: url("../assets/cursors/arrow.cur"), auto;
}

.window {
  min-width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.window-body {
  padding: 0px;
  margin: 0px;
  flex: auto;
  display: flex;
  padding: 8px;
  flex-direction: column;
}
</style>
