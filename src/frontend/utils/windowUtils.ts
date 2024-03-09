import { useWindowStore } from "../stores/useWindowStore";
import { v4 as uuidv4 } from "uuid";
import { eventBus } from "../utils/bus";

export const openNewWindow = async (item: any) => {
  const windowStore = useWindowStore();

  if (item.submenu && item.submenu.length > 0) {
    return;
  }

  if (item.action) {
    item.action();
    return;
  }

  const newWindow = {
    id: uuidv4(),
    zIndex: 100,
    title: item.name || "New Window",
    icon: item.icon || "defaultIcon",
    component: item.component || "DefaultComponent",
    visible: true,
    active: true,
    maximised: false,
    type: item.virtualWindow || "defaultType",
    subType: item.subType || "unknown",
    dimensions: {
      height: item.height || 570,
      width: item.width || 600,
      x: item.x || (window.innerWidth - (item.width || 600)) / 2,
      y: item.y || (window.innerHeight - (item.height || 570)) / 2,
    },
  };

  if (item.virtualWindow === "iframe") {
    console.log("Opening in a virtual window");
    eventBus.openVirtualWindow(item);
  } else if (item.virtualWindow === "blank") {
    window.open(item.url, "_blank");
  } else {
    windowStore.windows.forEach((win: any) => {
      win.active = false;
    });

    windowStore.windows.push(newWindow);
  }
};
