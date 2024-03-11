<script setup lang="ts">
import { Ref, onMounted, ref } from "vue";
import { dogvertiser } from "../../declarations/dogvertiser";

//@ts-ignore
const allAds: Ref<Advertisement[]> = ref([]);
const randomAds: Ref<Advertisement[]> = ref([]);

interface Advertisement {
  index: BigInt;
  title?: string;
  description: string;
  image: string;
  link: string;
  total_burned: BigInt;
  timestamp: BigInt;
}

function customJsonSerialize(obj: any) {
  return JSON.stringify(obj, (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    } else if (Array.isArray(value) && value[0] instanceof Text) {
      // Handle arrays of tuples with Text objects
      return value.map(([text, ad]) => ({ text: text.toString(), ad }));
    }
    return value;
  });
}

onMounted(async () => {
  let ads = await dogvertiser.fetch_ads();
  console.log(ads); // Log the raw ads for debugging

  const serializedAds = customJsonSerialize(ads);
  console.log(serializedAds);

  allAds.value = JSON.parse(serializedAds); // Parse back to object
  randomAds.value = randomizeAds(allAds.value);

  console.log(allAds.value); // Log the parsed ads for verification
});

function randomizeAds(ads: Advertisement[]) {
  // duplicate ads for total_burned / 100000000 then randomly select 4
  let duplicatedAds: Advertisement[] = [];
  ads.forEach((ad: Advertisement) => {
    let numDuplicates = Number(ad.total_burned) / 100000000;
    for (let i = 0; i < numDuplicates; i++) {
      duplicatedAds.push(ad);
    }
  });
  // select 4 random ones and only let an ad be selected once
  let selectedAds: Advertisement[] = [];
  for (let i = 0; i < duplicatedAds.length; i++) {
    let randomIndex = Math.floor(Math.random() * duplicatedAds.length);
    let selectedAd = duplicatedAds[randomIndex];
    if (selectedAds.includes(selectedAd)) {
      continue;
    } else {
      selectedAds.push(selectedAd);
    }
    if (selectedAds.length === 4) {
      break;
    }
  }
  return selectedAds;
}
</script>

<template>
  <div style="padding: 10px">
    <div class="blink blink-animation" style="width: 100%">
      YOU'VE BEEN SELECTED TO WIN 100 BILLION WINDOGES!
    </div>
    <div style="display: flex; justify-content: space-between">
      <img src="/smugdoge.png" style="height: 10%; width: 14%" class="img-spin" />
      <img src="/smugdoge.png" style="height: 10%; width: 14%" class="img-spin" />
      <img src="/smugdoge.png" style="height: 10%; width: 14%" class="img-spin" />
      <img src="/smugdoge.png" style="height: 10%; width: 14%" class="img-spin" />
    </div>
    <div
      style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap"
    >
      <div
        v-for="(ad, index) in randomAds"
        :key="index"
        style="display: flex; align-items: center; justify-content: center; margin: 10px"
      >
        <a :href="ad.link" target="_blank" style="height: 250px; width: 250px"
          ><img :src="ad.image" alt="ad" style="height: 100%; width: 100%"
        /></a>
      </div>
    </div>
    <div style="display: flex; justify-content: space-between">
      <img src="/smugdoge.png" style="height: 10%; width: 14%" class="img-spin" />
      <img src="/smugdoge.png" style="height: 10%; width: 14%" class="img-spin" />
      <img src="/smugdoge.png" style="height: 10%; width: 14%" class="img-spin" />
      <img src="/smugdoge.png" style="height: 10%; width: 14%" class="img-spin" />
    </div>
  </div>
</template>

<style scoped>
.rainbow {
  font-family: Arial, "VT323", sans-serif;
  text-align: center;
  font-weight: 900;
  text-decoration: underline;
  font-size: 32px;
  font-family: monospace;
  letter-spacing: -2px;
}

/* Combine blink and rainbow animations */
.rainbow_text_animated {
  margin-top: 0px;
  font-family: Arial, "VT323", sans-serif;
  font-weight: 900;
  background: linear-gradient(to right, #6666ff, #0099ff, #00ff00, #ff3399, #6666ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  /* Apply both animations and adjust z-index for layering */
  animation: blink 2s linear infinite, rainbow_animation 6s ease-in-out infinite;
  background-size: 400% 100%;
  z-index: 2; /* This layer displays on top of the blinking text */
}

@keyframes rainbow_animation {
  0%,
  100% {
    background-position: 0 0;
  }

  50% {
    background-position: 100% 0;
  }
}

.blink {
  background-color: transparent;
  font-size: 32px;
  font-weight: 900;
  text-align: center;
  letter-spacing: -2px;
}

.blink-animation {
  font-size: 32px;
  font-weight: 900;
  font-family: Arial;
  color: red; /* Inherit color from parent (rainbow in this case) */
  animation: blink 0.5s linear infinite;
}

@keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.img-blink {
  animation: blink 0.1s linear infinite;
}

.img-spin {
  animation: spin 2s linear infinite;
  opacity: 0.7;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.blink-and-spin {
  animation: blink 1s linear infinite, spin 2s linear infinite;
}
</style>
