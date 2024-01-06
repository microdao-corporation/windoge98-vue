import { useWindowStore } from "../stores/useWindowStore"; // Adjust the path as needed

class EventBus {
  private _onOpenVirtualWindow: ((winType: MenuItem) => void) | undefined = undefined;

  onOpenVirtualWindow(fn: (winType: MenuItem) => void) {
    this._onOpenVirtualWindow = fn;
  }

  openVirtualWindow(winType: MenuItem) {
    const windowStore = useWindowStore();
    if (this._onOpenVirtualWindow) {
      this._onOpenVirtualWindow(winType);
    } else {
      // Handle the creation of new window directly
      const newWindowId = windowStore.windows.length;
      windowStore.windows.push({
        id: newWindowId,
        title: winType.name,
        icon: winType.icon,
        url: winType.url,
        visible: true,
        active: true,
        type: winType.virtualWindow,
        subType: winType.subType,
        maximised: false,
        dimensions: {
          height: 420, // Example default size
          width: 600,
          x: 200,
          y: 540,
        },
      });

      windowStore.activateWindow(newWindowId);
    }
  }
}

export const eventBus = new EventBus();
