<script setup lang="ts">
import { onMounted, ref, defineProps } from "vue";
import { useGtag } from "vue-gtag-next";
import { initialiseOpenChat } from "../utils/windowUtils";

const { event } = useGtag();
const iframeRef = ref<HTMLIFrameElement>();

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
  subType: {
    type: String,
    required: false,
  },
});

onMounted(() => {
  event("window.open", {
    url: props.url,
    title: props.title,
  });
  if (props.subType == "openchat" && iframeRef.value) {
    initialiseOpenChat(iframeRef.value); // Pass the iframe element
  }
});
</script>

<template>
  <iframe ref="iframeRef" :title="title" :frameborder="frameBorder" :src="url" />
</template>

<style lang="css">
iframe {
  width: 100%;
  flex: 1 1 auto;
}
</style>
