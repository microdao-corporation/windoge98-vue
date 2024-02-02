import { createRouter, createWebHashHistory } from 'vue-router'
import DesktopView from "./views/DesktopView.vue";
import ShutdownView from "./views/ShutdownView.vue";
import VerificationView from './views/VerificationView.vue';
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
  },
  {
    path: '/verification',
    component: VerificationView
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router