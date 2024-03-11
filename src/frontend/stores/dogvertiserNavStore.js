import { reactive, watch, ref } from "vue";
import { defineStore } from "pinia";
import { useAuthStore } from "../auth";

export const useDogvertiserNavStore = defineStore("dogvertiserNav", () => {
  const currentScreen = reactive({ screen: "main" });
  const screenHistory = ref(["main"]);

  const toScreen = (screen) => {
    screenHistory.value.push(screen);
    currentScreen.screen = screen;
  };

  const back = () => {
    if (screenHistory.value.length > 1) {
      screenHistory.value.pop();
      currentScreen.screen =
        screenHistory.value[screenHistory.value.length - 1];
    }
  };

  return {
    currentScreen,
    screenHistory,
    toScreen,
    back,
  };
});
