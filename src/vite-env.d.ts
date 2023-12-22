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
  url?: string;
  title?: string;
  type: WindowType;
  visible: boolean;
  active: boolean;
  maximised: boolean;
  dimensions: Dimensions;
};

type MenuItem = {
  name: string;
  url: string;
  virtualWindow: VirtualWindowType;
  icon?: string;
  iconHeight?: number;
  submenu?: StartMenuItem[];
};

type ToolbarItem = MenuItem & {
  class: string;
};

type StartMenuData = {
  main: MenuItem[];
  bottom: MenuItem[];
};

type VirtualWindowType = "iframe" | "none";
