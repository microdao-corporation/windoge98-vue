import { VirtualWindowType } from "./windowTypes";

class EventBus {
  private _onOpenVirtualWindow:
    | ((winType: VirtualWindowType) => void)
    | undefined = undefined;

  onOpenVirtualWindow(fn: (winType: VirtualWindowType) => void) {
    this._onOpenVirtualWindow = fn;
  }
  openVirtualWindow(winType: VirtualWindowType) {
    if (this._onOpenVirtualWindow) {
      this._onOpenVirtualWindow(winType);
    }
  }
}

export const eventBus = new EventBus();
