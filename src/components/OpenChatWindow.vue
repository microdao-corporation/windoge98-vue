<script setup lang="ts">
import { onMounted, ref } from "vue";
import { initialise } from "@open-ic/openchat-xframe";

const iframe = ref<HTMLIFrameElement>();

onMounted(() => {
  console.log("XFRAME_HOST: setting client in store");
  if (iframe.value) {
    initialise(iframe.value, {
      targetOrigin: "https://oc.app/community/ow6el-gyaaa-aaaar-av5na-cai",
      theme: {
        base: "light",
        name: "windoge98",
        overrides: {},
      },
    });
  }
});
</script>

<template>
  <iframe ref="iframe" title="OpenChat" frameborder="0" />
</template>

<style lang="css" scoped>
iframe {
  width: 100%;
  flex: 1 1 auto;
}
</style>
