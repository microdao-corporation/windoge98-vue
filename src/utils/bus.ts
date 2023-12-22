class EventBus {
  private _onOpenVirtualWindow: ((winType: MenuItem) => void) | undefined =
    undefined;

  onOpenVirtualWindow(fn: (winType: MenuItem) => void) {
    this._onOpenVirtualWindow = fn;
  }
  openVirtualWindow(winType: MenuItem) {
    if (this._onOpenVirtualWindow) {
      this._onOpenVirtualWindow(winType);
    }
  }
}

export const eventBus = new EventBus();
