import { useWindowStore } from "../stores/useWindowStore";
import { v4 as uuidv4 } from "uuid";

interface MenuItem {
  name: string;
  icon: string;
  url?: string;
  visible?: boolean;
  active?: boolean;
  type?: string;
  color?: string;
  subType?: string;
  maximised?: boolean;
  init?: () => void;
  action?: () => void;
  height?: number;
  width?: number;
}

class EventBus {
  private _onOpenVirtualWindow: ((win: MenuItem) => void) | undefined = undefined;

  onOpenVirtualWindow(fn: (win: MenuItem) => void) {
    this._onOpenVirtualWindow = fn;
  }

  openVirtualWindow(win: MenuItem) {
    const windowStore = useWindowStore();
    if (this._onOpenVirtualWindow) {
      this._onOpenVirtualWindow(win);
    } else {
      const newWindow = {
        id: uuidv4(),
        title: win.name,
        icon: win.icon,
        url: win.url,
        visible: true,
        active: true,
        type: win.type,
        color: win.color,
        subType: win.subType,
        maximised: false,
        dimensions: {
          height: win.height || 420,
          width: win.width || 600,
          x: 100 + windowStore.windows.length * 20,
          y: 200 + windowStore.windows.length * 20,
        },
      };

      windowStore.windows.push(newWindow);
      windowStore.activateWindow(newWindow.id);
    }
  }
}

export const eventBus = new EventBus();
