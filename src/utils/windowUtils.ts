import { eventBus } from "../utils/bus";
import { initialise } from "@open-ic/openchat-xframe";

export const openNewWindow = async (item: MenuItem) => {
  if (item.virtualWindow !== "none") {
    console.log("We'll open this in a virtual window");
    eventBus.openVirtualWindow(item);
  } else {
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
