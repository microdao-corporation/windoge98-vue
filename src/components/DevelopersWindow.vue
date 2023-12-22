<script setup lang="ts">
import { onMounted } from "vue";
import { useIcrc1Agent } from "../hooks/useIcrc1Agent";
const icpActor = useIcrc1Agent("ryjl3-tyaaa-aaaaa-aaaba-cai");
const windogeActor = useIcrc1Agent("rh2pm-ryaaa-aaaan-qeniq-cai");

onMounted(() => {
  windogeActor.fetchMaxSupply();
  icpActor.fetchIcrc1BalanceOf(
    "3scjg-z33zr-ll3bt-hdsov-kkitm-3tsml-tvgkt-d6jwa-onz35-hkfq5-zae",
    "treasury_icp",
  );
  windogeActor.fetchIcrc1BalanceOf(
    "3scjg-z33zr-ll3bt-hdsov-kkitm-3tsml-tvgkt-d6jwa-onz35-hkfq5-zae",
    "treasury_exe",
  );
});
</script>

<template>
  <p>
    Windoge 98 is at the forefront of Internet Computer technology. We are all
    about our "developers, developers, developers". Steve Ballmer of Microsoft
    captures this message perfectly.
  </p>
  <div class="video">
    <iframe
      width="560"
      height="315"
      src="https://www.youtube-nocookie.com/embed/Vhh_GeBPOhs?si=qosE-Amb8AnFo6a8"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    ></iframe>
  </div>
</template>
