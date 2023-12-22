<script setup lang="ts">
defineProps({
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  frameBorder: {
    type: Number,
    default: 0,
  },
});
</script>

<template>
  <iframe :title="title" :frameborder="frameBorder" :src="url" />
</template>

<style lang="css">
iframe {
  width: 100%;
  flex: 1 1 auto;
}
</style>
