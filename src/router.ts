import { createRouter, createWebHashHistory } from 'vue-router'
import DesktopView from "./views/DesktopView.vue";
import ShutdownView from "./views/ShutdownView.vue";

const routes = [
  { 
    path: "/", 
    component: DesktopView 
},
  { 
    path: "/shutdown", 
    component: ShutdownView 
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router