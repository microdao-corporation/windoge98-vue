/// <reference types="vite/client" />
declare module 'vue-draggable-resizable-vue3'
declare module './hooks/icrc1-idl'

interface Window {
  global: Window;
}

type MenuItem = {
  url: string;
  virtualWindow: VirtualWindowType;
};

type VirtualWindowType = "openchat" | "none";