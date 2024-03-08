<script setup lang="ts">
import { onMounted, ref, defineProps } from "vue";
import { useGtag } from "vue-gtag-next";
import { useMenuItemStore } from "../stores/menuItemStore";

const { event } = useGtag();
const iframeRef = ref<HTMLIFrameElement>();
const { startMenuData } = useMenuItemStore();

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
  init: {
    type: Function,
    required: false,
  },
});

onMounted(() => {
  event("window.open", {
    url: props.url,
    title: props.title,
  });

  const items = startMenuData.main[0];
  if (items && items.submenu) {
    const item = items.submenu.find((item: any) => item.name == props.title);

    if (item && item.init) {
      item.init(iframeRef.value);
    }
  }
});
</script>

<template>
  <iframe
    ref="iframeRef"
    :title="title"
    :frameborder="frameBorder"
    :src="url"
  />
</template>

<style lang="css">
iframe {
  width: 100%;
  flex: 1 1 auto;
}
</style>
