import { eventBus } from "../utils/bus";
import { initialise } from "@open-ic/openchat-xframe";
import { useWindowStore } from "../stores/useWindowStore";
import { v4 as uuidv4 } from 'uuid';

export const openNewWindow = async (item: MenuItem) => {
  if(item.submenu && item.submenu.length > 0) { return }

  if (item.action) {
    item.action();
    return;
  }

  const windowStore = useWindowStore();

  if (item.virtualWindow == "iframe") {
    console.log("We'll open this in a virtual window");
    eventBus.openVirtualWindow(item);
  } else if (item.virtualWindow == "blank") {
    window.open(item.url, "_blank");
  } else {
    windowStore.windows.push({
      id: uuidv4(),
      zIndex: 100,
      title: item.name,
      icon: item.icon,
      visible: true,
      active: true,
      maximised: false,
      type: item.virtualWindow,
      subType: item.subType,
      dimensions: {
        height: item.height || 420,
        width: item.width || 600,
        x: 100,
        y: 5,
      },
    },);
  }
};

export function initialiseOpenChat(frame: HTMLIFrameElement) {
  initialise(frame, {
    targetOrigin: "https://oc.app",
    initialPath:
      "/community/ow6el-gyaaa-aaaar-av5na-cai/?ref=y3rqn-fyaaa-aaaaf-a7z6a-cai",
    theme: {
      base: "light",
      name: "windoge98",
      overrides: {},
    },
  });
}
