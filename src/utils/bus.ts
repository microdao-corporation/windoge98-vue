import { useWindowStore } from "../stores/useWindowStore"; // Adjust the path as needed

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
      const newWindowId = windowStore.windows.length;

      // Handle the creation of new window directly
      windowStore.windows.push({
        id: newWindowId,
        title: win.name,
        icon: win.icon,
        url: win.url,
        visible: true,
        active: true,
        type: win.virtualWindow,
        subType: win.subType,
        maximised: false,
        init: win.init,
        dimensions: {
          height: win.height || 420,
          width: win.width || 600,
          x: 100 + (windowStore.windows.length * 20),
          y: 200 + (windowStore.windows.length * 20),
        },
      });

      windowStore.activateWindow(newWindowId);
      if (win.init) {
        win.init;
      }
    }
  }
}

export const eventBus = new EventBus();
