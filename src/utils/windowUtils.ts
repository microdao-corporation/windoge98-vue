import { eventBus } from "../utils/bus";
import { trackEvent } from "@junobuild/analytics";

export const openNewWindow = async (item: MenuItem) => {
  await trackEvent({
    name: "window.open",
    metadata: item,
  });
  if (item.virtualWindow !== "none") {
    console.log("We'll open this in a virtual window");
    eventBus.openVirtualWindow(item.virtualWindow);
  } else {
    window.open(item.url, "_blank");
  }
}
