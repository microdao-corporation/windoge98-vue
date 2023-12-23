<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useGtag } from "vue-gtag-next";

const { event } = useGtag();
const iframe = ref<HTMLIFrameElement>();

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
  onMount: {
    type: Function,
    required: false,
  },
});

onMounted(() => {
  event("window.open", {
    url: props.url,
    title: props.title,
  });
  if (props.onMount) {
    props.onMount(iframe.value);
  }
});
</script>

<template>
  <iframe ref="iframe" :title="title" :frameborder="frameBorder" :src="url" />
</template>

<style lang="css">
iframe {
  width: 100%;
  flex: 1 1 auto;
}
</style>
