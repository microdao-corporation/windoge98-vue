import { eventBus } from "../utils/bus";

export const openNewWindow = async (item: MenuItem) => {
  if (item.virtualWindow !== "none") {
    console.log("We'll open this in a virtual window");
    eventBus.openVirtualWindow(item);
  } else {
    window.open(item.url, "_blank");
  }
};
