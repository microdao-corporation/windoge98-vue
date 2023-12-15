class EventBus {
  private _onOpenOC: (() => void) | undefined = undefined;

  onOpenOC(fn: () => void) {
    this._onOpenOC = fn;
  }
  openOC() {
    if (this._onOpenOC) {
      this._onOpenOC();
    }
  }
}

export const eventBus = new EventBus();
