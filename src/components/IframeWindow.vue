<script setup lang="ts">
import { onMounted } from "vue";
import { useGtag } from "vue-gtag-next";

const { event } = useGtag();

const props = defineProps({
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

onMounted(() => {
  event("window.open", {
    url: props.url,
    title: props.title,
  });
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
