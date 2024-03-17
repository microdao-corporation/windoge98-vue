import { useWindowStore } from "../stores/useWindowStore"; // Adjust the path as needed
import { v4 as uuidv4 } from "uuid";

class EventBus {
  private _onOpenVirtualWindow: ((win: MenuItem) => void) | undefined =
    undefined;

  onOpenVirtualWindow(fn: (win: MenuItem) => void) {
    this._onOpenVirtualWindow = fn;
  }

  openVirtualWindow(win: MenuItem) {
    const windowStore = useWindowStore();
    if (this._onOpenVirtualWindow) {
      this._onOpenVirtualWindow(win);
    } else {
      const newWindowId = windowStore.windows.length;

      // Handle the creation of new window directly
      windowStore.windows.push({
        id: uuidv4(),
        title: win.name,
        zIndex: 100,
        icon: win.icon,
        url: win.url,
        visible: true,
        active: true,
        type: win.virtualWindow,
        color: win.color,
        subType: win.subType,
        maximised: false,
        init: win.init,
        action: win.action,
        dimensions: {
          height: win.height || 420,
          width: win.width || 600,
          x: 100 + windowStore.windows.length * 20,
          y: 200 + windowStore.windows.length * 20,
        },
      });

      windowStore.activateWindow(newWindowId);
    }
  }
}

export const eventBus = new EventBus();
