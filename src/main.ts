import { createApp } from 'vue'
import App from './App.vue'
import "98.css";
import { VueDraggableResizable } from 'vue-draggable-resizable-vue3';
import { createRouter, createWebHashHistory } from 'vue-router'
import DesktopView from "./views/DesktopView.vue";
import "./style.css";

const app = createApp(App)

const routes = [
  { path: '/', component: DesktopView },
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional opti≈ons here, but let's
// keep it simple for now.
const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes, // short for `routes: routes`
})

app.use(router)

// Define `global` if it's not already defined
window.global = window;

app.use(VueDraggableResizable)
app.mount('#app')