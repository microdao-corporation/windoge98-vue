import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import wasm from "vite-plugin-wasm";
import vueJsx from "@vitejs/plugin-vue-jsx";
import EnvironmentPlugin from "vite-plugin-environment";

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    // he global object varies between environments (like window in browsers, global in Node.js), leading to compatibility issues.
    // By defining global as globalThis, developers unify access to the global scope, as globalThis is a standard and
    // environment-agnostic way to refer to the global object/
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  server: {
    host: "127.0.0.1",
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
      },
    },
  },
  plugins: [
    vue(),
    wasm(),
    vueJsx(),
    EnvironmentPlugin("all", { prefix: "CANISTER_" }),
    EnvironmentPlugin("all", { prefix: "DFX_" }),
  ],
});
