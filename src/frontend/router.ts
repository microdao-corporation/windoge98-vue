import { createRouter, createWebHashHistory } from 'vue-router'
import DesktopView from "./views/DesktopView.vue";
import ShutdownView from "./views/ShutdownView.vue";
import VerificationView from './views/VerificationView.vue';

const routes = [
  { 
    path: "/", 
    component: DesktopView 
},
  { 
    path: "/shutdown", 
    component: ShutdownView 
  },
  {
    path: '/verification',
    component: VerificationView
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router