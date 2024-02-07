import { reactive, watch, ref } from "vue";
import { defineStore } from "pinia";
import { useAuthStore } from "../auth";

export const useDogvertiserNavStore = defineStore("dogvertiserNav", () => {
  const currentScreen = reactive({screen: "main"});
  const screenHistory = ref(["main"]);

  const toScreen = (screen) => {
    console.log("toScreen", screen);
    screenHistory.value.push(screen);
    currentScreen.screen = screen;
  };

  const back = () => {
    screenHistory.value.pop();
    currentScreen.screen = screenHistory.value[screenHistory.value.length - 1];
  };

  return {
    currentScreen,
    toScreen,
    back,
  };
});