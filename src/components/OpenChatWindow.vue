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

<style lang="css">
.chat {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgb(0 0 0 / 6%);
  backdrop-filter: blur(5px);
  border: 1px solid rgb(91, 243, 190);
  border-radius: 13px;
}
.header {
  color: #fff;
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid rgb(91, 243, 190);
  filter: drop-shadow(0px 10px 8px rgba(0, 0, 0, 0.3));
}

.header h3 {
  margin: 0;
}
iframe {
  width: 100%;
  flex: 1 1 auto;
}
</style>
