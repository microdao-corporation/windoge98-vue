import { eventBus } from "../utils/bus";
import { useWindowStore } from "../stores/useWindowStore";
import { v4 as uuidv4 } from "uuid";

export const openNewWindow = async (item: MenuItem) => {
  console.log("Opening new window", item);
  if (item.submenu && item.submenu.length > 0) {
    return;
  }

  if (item.action) {
    item.action();
    return;
  }

  const windowStore = useWindowStore();
  let windowData;

  if (item.virtualWindow == "iframe") {
    console.log("We'll open this in a virtual window");
    eventBus.openVirtualWindow(item);
  } else if (item.virtualWindow == "blank") {
    window.open(item.url, "_blank");
  } else {
    console.log("else", item);
    windowData = {
      id: uuidv4(),
      zIndex: 100,
      title: item.name,
      icon: item.icon,
      visible: true,
      active: true,
      color: item.color,
      maximised: false,
      type: item.virtualWindow,
      subType: item.subType,
      dimensions: {
        height: item.height || (item.virtualWindow === "shutdown" ? 165 : 420),
        width: item.width || (item.virtualWindow === "shutdown" ? 310 : 600),
        x:
          (window.innerWidth -
            (item.width || (item.virtualWindow === "shutdown" ? 310 : 600))) /
          2,
        y:
          (window.innerHeight -
            (item.height || (item.virtualWindow === "shutdown" ? 165 : 420))) /
          2,
      },
    };
    windowStore.windows.push(windowData);
    windowStore.activateWindow(windowData.id);
  }
  return windowData;
};
