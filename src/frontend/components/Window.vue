<script setup lang="ts">
// Define props and emits
const props = defineProps({
  title: String,
  icon: String,
  url: String,
  init: Function,
});
const emit = defineEmits(["onClose", "onMaximise", "onMinimise"]);

</script><Window v-for="window in windows" :key="window.id" :window="window" />


<template>
  <div class="window">
    <div class="title-bar" @dblclick="emit('onMaximise')">
      <div class="title-bar-text" style="display: flex; align-items: center">
        <img :src="props.icon" style="width: 16px; height: 16px; margin-right: 4px" v-if="props.icon" />
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
  overflow: auto;
  min-width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.window-body {
  flex: auto;
  display: flex;
  flex-direction: column;
}

</style>
