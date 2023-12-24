import { createApp } from "vue";
import App from "./App.vue";
import "98.css";
import { VueDraggableResizable } from "vue-draggable-resizable-vue3";
import router from "./router";
import VueGtag from "vue-gtag-next";

import "./style.css";
import "./assets/snow.css";

const app = createApp(App);

// Define `global` if it's not already defined
window.global = window;

app.use(router);
app.use(VueDraggableResizable);
app.use(VueGtag, {
  property: { id: "G-VTN5H782M8" }
});
app.mount("#app");

