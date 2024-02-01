import { createApp } from "vue";
import App from "./App.vue";
import "98.css";
import { VueDraggableResizable } from "vue-draggable-resizable-vue3";
import router from "./router";
import VueGtag from "vue-gtag-next";
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import "./style.css";
import "./assets/snow.css";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// Define `global` if it's not already defined
window.global = window;

app.use(router);
app.use(VueDraggableResizable);
app.use(VueGtag, {
  property: { id: "G-VTN5H782M8" }
});
app.use(pinia);
app.mount("#app");

