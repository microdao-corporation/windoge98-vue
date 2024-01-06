// stores/useWindowStore.d.ts

// First, declare interfaces or types if needed
export interface WindowDimension {
  height: number;
  width: number;
  x: number;
  y: number;
}

export interface DesktopWindow {
  id: number;
  zIndex: number;
  title: string;
  icon: string;
  visible: boolean;
  active: boolean;
  maximised: boolean;
  type: string;
  subType: string;
  dimensions: WindowDimension;
}

// Then, declare the module and its structure
declare module "../stores/useWindowStore" {
  import { StoreDefinition } from 'pinia';

  // Adjust the type here to match what your JS file is exporting
  export const useWindowStore: StoreDefinition<string, {
    windows: DesktopWindow[];
    highestZIndex: number;
    screenWidth: number;
    screenHeight: number;
  }, {}, {
    activateWindow(id: number): void;
    closeWindow(id: number): void;
    maximiseWindow(id: number): void;
    minimiseWindow(id: number): void;
    onResize(id: number, left: number, top: number, width: number, height: number): void;
    getWindowById(id: number): DesktopWindow | undefined;
    
  }>;
}
