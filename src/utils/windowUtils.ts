import { eventBus } from "../utils/bus";
import { initialise } from "@open-ic/openchat-xframe";
import { useWindowStore } from "../stores/useWindowStore";
import startIcon from "../assets/start-icon.png";
import WelcomeWindow from "../components/WelcomeWindow.vue";

export const openNewWindow = async (item: MenuItem) => {
  const windowStore = useWindowStore();
  if (item.virtualWindow == "welcome") {
    const newWindowId = windowStore.windows.length + 1;
      windowStore.windows.push({
        id: newWindowId,
        zIndex: 100,
        title: "About Windoge98",
        icon: startIcon,
        component: WelcomeWindow,
        visible: true,
        active: true,
        maximised: false,
        type: "welcome",
        subType: "unknown",
        dimensions: {
          height: 570,
          width: 600,
          x: 100,
          y: 5,
        },
      },);
  }
  if (item.virtualWindow == "iframe") {
    console.log("We'll open this in a virtual window");
    eventBus.openVirtualWindow(item);
  }
  if (item.virtualWindow == "blank") {
    window.open(item.url, "_blank");
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
