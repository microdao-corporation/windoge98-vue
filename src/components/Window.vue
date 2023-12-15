<script setup lang="ts">
const emit = defineEmits(["onClose"]);
const props = defineProps(["title"]);
</script>

<template>
  <div class="window">
    <div class="title-bar">
      <div class="title-bar-text">{{ props.title }}</div>
      <div class="title-bar-controls">
        <button aria-label="Minimize" />
        <button aria-label="Maximize" />
        <button aria-label="Close" @click="emit('onClose')" />
      </div>
    </div>

    <div class="window-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
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
