<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useWindowStore } from "../stores/useWindowStore";
import StartMenu from "./StartMenu.vue";

const emit = defineEmits(["activateToolbarWindow"]);
const windowStore = useWindowStore();

const currentHours = ref(new Date().getHours());
const currentMinutes = ref(new Date().getMinutes());
const amPm = ref(currentHours.value >= 12 ? "PM" : "AM");
const showColon = ref(true);

function addZero(i: number) {
  return i < 10 ? "0" + i : i;
}

function formatHour(hour: number) {
  return hour % 12 === 0 ? 12 : hour % 12;
}

function updateTime() {
  const now = new Date();
  currentHours.value = formatHour(now.getHours());
  currentMinutes.value = now.getMinutes();
  amPm.value = now.getHours() >= 12 ? "PM" : "AM";
  showColon.value = !showColon.value;
}

let intervalId: number;

onMounted(() => {
  intervalId = window.setInterval(updateTime, 1000);
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
});

function handleWindowClick(windowId: number) {
  windowStore.activateWindow(windowId);
  emit("activateToolbarWindow", windowId);
}
</script>

<template>
  <div id="toolbar">
    <StartMenu />

    <div class="toolbar-separator"></div>
    <div class="toolbar-left" v-if="windowStore.windows">
      <div style="display: flex">
        <div
          v-for="window in windowStore.windows.filter((w: DesktopWindow) => w)"
          class="window-icon"
          :class="{ active: window.active }"
          :key="window.id"
          @click="handleWindowClick(window.id)"
        >
          <img
            :src="window.icon"
            :height="16"
            rel="preload"
            style="margin-right: 10px; padding-top: 1px; padding-bottom: 1px"
          />
          {{ window.title }}
        </div>
      </div>
    </div>
    <div class="toolbar-right">
      <div class="time">
        <span class="hour">{{ addZero(currentHours) }}</span>
        <span>{{ showColon ? ":" : " " }}</span>
        <span class="minutes">{{ addZero(currentMinutes) }}</span> {{ amPm }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.window-icon {
  padding-right: 10px;
  font-family: Arial;
  font-size: 11px;
  background: no-repeat center / auto 20px;
  min-width: 150px;
  height: 30px;
  border: none;
  float: left;
  display: flex;
  padding-left: 10px;
  align-items: center;
  box-shadow: inset -1px -1px #3d3d3d, inset 1px 1px #e3e3e3, inset -2px -2px grey,
    inset 2px 2px #e6e6e6;
  &:hover {
    background-color: darken(#c0c0c0, 10%);
  }
}
.window-icon.active {
  display: flex;
  align-items: center;
  background: no-repeat center / auto 20px;
  height: 30px;
  border: none;
  float: left;
  background-color: #f1f1f1; /* Active background color */
  color: black; /* Text color for active state */
  box-shadow: inset 1px 1px #2c2c2c, inset -1px -1px #d4d4d4, inset 2px 2px grey,
    inset -2px -2px #dfdfdf;
}

.logo {
  display: flex;
  justify-content: center;
}

body {
  font-family: "MS Sans Serif";
  letter-spacing: 0.001em;
  font-size: 14px;
  font-smooth: none;
}

hr {
  color: #797979;
  background-color: #797979;
  border-bottom: 1px solid #fff;
}

#boot-ready {
  width: 100%;
  z-index: 98;
  position: fixed;
  height: 100vh;
  background: #000;
}

strong {
  font-weight: bold;
}

#boot {
  width: 100%;
  z-index: 99;
  position: fixed;
  height: 100vh;
  background: url(https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4989c596-7ba0-4e17-8b98-7c338208ab64/daobodr-7dc4c4b1-7bd3-4b50-87bb-c987e2c4dfb7.jpg/v1/fill/w_1231,h_649,q_70,strp/windows_98_remastered_startup_screen__4k_wallpaper_by_archi_techi_daobodr-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjE2MCIsInBhdGgiOiJcL2ZcLzQ5ODljNTk2LTdiYTAtNGUxNy04Yjk4LTdjMzM4MjA4YWI2NFwvZGFvYm9kci03ZGM0YzRiMS03YmQzLTRiNTAtODdiYi1jOTg3ZTJjNGRmYjcuanBnIiwid2lkdGgiOiI8PTQwOTYifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.79KQdANpp8aaMRj99IcG2XE63yJ8608uZ9IfgP2yYrY)
    no-repeat center -25px / cover;
}

.loading-bar {
  position: absolute;
  width: 100%;
  height: 25px;
  background: linear-gradient(
    220deg,
    rgba(85, 132, 187, 1),
    rgba(202, 232, 251, 1),
    rgba(85, 132, 187, 1)
  );
  background-size: 200% 100%;
  bottom: 0;
  left: 0;
  animation: loading 3s ease forwards infinite;
}

@keyframes loading {
  0% {
    background-position: 0% 51%;
  }
  100% {
    background-position: -200% 51%;
  }
}

#toolbar {
  z-index: 999;
  background: #c0c0c0;
  height: 35px;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  border-top: 2px solid #fff;

  .toolbar-separator {
    width: 2px;
    height: 26px;
    margin-top: 2px;
    background: #797979;
    float: left;
    border-right: 1px solid #fff;
  }

  .toolbar-left {
    float: left;
    display: flex;
    padding: 0 5px;
    flex-wrap: wrap;
  }

  .toolbar-icon {
    background: no-repeat center / auto 20px;
    width: 25px;
    height: 25px;
    border: none;
    margin-top: 3px;
    margin: 3px 2px;
  }

  .toolbar-right {
    float: right;
    margin: 2px 3px;
    height: 29px;
    border: 2px solid #7c7c7c;
    border-bottom-color: #fff;
    border-right-color: #fff;

    .time {
      padding: 6px 10px;
    }
  }
}

.active-button {
  background-color: #fff !important;
}
</style>
