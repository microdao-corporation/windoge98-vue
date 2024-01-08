/// <reference types="vite/client" />
declare module "vue-draggable-resizable-vue3";
declare module "./hooks/icrc1-idl";

type WindowType = "welcome" | "developers" | VirtualWindowType;

type Dimensions = {
  height: number | string;
  width: number | string;
  x: number;
  y: number;
};

type DesktopWindow = {
  id: number;
  zIndex: number;
  component?: any;
  url?: string;
  icon?: string;
  title?: string;
  type: WindowType;
  subType: VirtualWindowSubtype;
  visible: boolean;
  active: boolean;
  maximised: boolean;
  dimensions: Dimensions;
  init?: (frame: HTMLIFrameElement) => void;
};

type MenuItem = {
  name: string;
  url?: string;
  type?: WindowType;
  virtualWindow: VirtualWindowType;
  subType: VirtualWindowSubtype;
  icon?: string;
  iconHeight?: number;
  height?: number;
  width?: number;
  submenu?: StartMenuItem[];
  init?: (frame: HTMLIFrameElement) => void;
};

type ToolbarItem = MenuItem & {
  class: string;
};

type StartMenuData = {
  main: MenuItem[];
  bottom: MenuItem[];
};

type VirtualWindowType = "iframe" | "none" | "welcome" | "blank";

type VirtualWindowSubtype = "openchat" | "unknown";
