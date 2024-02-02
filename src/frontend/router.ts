import { createRouter, createWebHashHistory } from 'vue-router'
import DesktopView from "./views/DesktopView.vue";
import ShutdownView from "./views/ShutdownView.vue";
import VerificationView from './views/VerificationView.vue';
<<<<<<< HEAD:src/frontend/router.ts
import DogVertiserView from './views/DogVertiserView.vue';
import NewDogvertisment from './views/NewDogvertisment.vue';

const routes = [
  { 
    path: "/", 
    component: DesktopView 
},
  { 
    path: "/shutdown", 
    component: ShutdownView 
=======
import LoadingView from './views/LoadingView.vue';
import BootView from './views/BootView.vue';

const routes = [
  {
    path: "/",
    component: BootView
  },
  {
    path: "/desktop",
    component: DesktopView
  },
  {
    path: "/shutdown",
    component: ShutdownView
  },
  {
    path: "/loading",
    component: LoadingView
>>>>>>> booting-and-shutting-down:src/router.ts
  },
  {
    path: '/verification',
    component: VerificationView
  },
  {
    path: '/dogvertiser',
    component: DogVertiserView
  },
  {
    path: '/newdogvertisment',
    component: NewDogvertisment
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router