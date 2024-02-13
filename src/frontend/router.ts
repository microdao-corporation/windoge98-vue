import { createRouter, createWebHashHistory } from "vue-router";
import DesktopView from "./views/DesktopView.vue";
import ShutdownView from "./views/ShutdownView.vue";
import VerificationView from "./views/VerificationView.vue";
import DogVertiserView from "./views/DogVertiserView.vue";
import NewDogvertisment from "./views/NewDogvertisment.vue";
import LoadingView from "./views/LoadingView.vue";
import BootView from "./views/BootView.vue";
import BsodView from "./views/BsodView.vue";
import startSound from "./assets/sounds/start_up_sound.mp3";
import shutdownSound from "./assets/sounds/shutting_down_sound.mp3";

const routes = [
  {
    path: "/",
    name: "Desktop",
    component: DesktopView,
  },
  {
    path: "/boot",
    name: "Boot",
    component: BootView,
  },
  {
    path: "/shutdown",
    name: "Shutdown",
    component: ShutdownView,
  },
  {
    path: "/bsod",
    name: "Bsod",
    component: BsodView,
  },
  {
    path: "/loading",
    name: "Loading",
    component: LoadingView,
  },
  {
    path: "/verification",
    name: "Verification",
    component: VerificationView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

function playSound(soundFile: string): void {
  const audio = new Audio(soundFile);
  audio.volume = 0.1;
  audio.play().catch((e) => {
    console.log(audio);
    console.error("Failed to play sound", e);
  });
}

router.beforeEach((to, from) => {
  const visitedBefore = localStorage.getItem("visitedBefore");
  if (!visitedBefore && to.path !== "/boot" && to.path !== "/bsod") {
    localStorage.setItem("visitedBefore", "true");
    return "/boot";
  }

  if (from.path === "/" && to.path === "/loading") {
    playSound(shutdownSound);
  } else if (from.path === "/loading" && to.path === "/") {
    playSound(startSound);
  }
});

export default router;
