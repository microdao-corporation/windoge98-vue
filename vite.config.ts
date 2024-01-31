import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import wasm from "vite-plugin-wasm";
import vueJsx from '@vitejs/plugin-vue-jsx';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), wasm(),vueJsx()],
});
