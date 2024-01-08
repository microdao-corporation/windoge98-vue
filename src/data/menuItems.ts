import icpcoinsLogo from "../assets/icpcoins_logo.png";
import ocDogeIcon from "../assets/oc_doge_icon.png";
import pinballIcon from "../assets/pinball-icon.png";
import junoIcon from "../assets/juno_icon.png";
import computerIcon from "../assets/computer-5.png";
import programsIcon from "../assets/programs_icon.png";
import taggrIcon from "../assets/taggr_icon.png";
import dmailIcon from "../assets/dmail_icon.png";
import beaconIcon from "../assets/beacon_icon.png";
import icdrawIcon from "../assets/icdraw_icon.png";
import icpSwapIcon from "../assets/icpswap_icon.png";
import sonicIcon from "../assets/sonic_icon.png";
import pixelIcon from "../assets/start-icon.png";
import { initialiseOpenChat } from "../utils/windowUtils";

export const toolbarLeftData: ToolbarItem[] = [
  {
    name: "OpenChat",
    class: "oc",
    icon: ocDogeIcon,
    url: "https://oc.app/community/ow6el-gyaaa-aaaar-av5na-cai/?ref=y3rqn-fyaaa-aaaaf-a7z6a-cai",
    virtualWindow: "iframe",
    subType: "openchat",
    init: initialiseOpenChat,
  },
  {
    name: "Discord",
    class: "discord",
    url: "https://discord.gg/CnMRrtaj3h",
    virtualWindow: "none",
    subType: "unknown",
  },
  {
    name: "SourceForge",
    class: "sourceforge",
    url: "https://sourceforge.net/p/windoge98-token/code/ci/main/tree/",
    virtualWindow: "none",
    subType: "unknown",
  },
  {
    name: "Twitter",
    class: "twitter",
    url: "https://x.com/windoge_98",
    virtualWindow: "none",
    subType: "unknown",
  },
  {
    name: "Telegram",
    class: "telegram",
    url: "https://t.me/windoge98",
    virtualWindow: "none",
    subType: "unknown",
  },
];

export const startMenuData: StartMenuData = {
  main: [
    {
      name: "Programs",
      iconHeight: 30,
      url: "#",
      virtualWindow: "none",
      icon: programsIcon,
      subType: "unknown",
      submenu: [
        {
          name: "3D Pinball",
          icon: pinballIcon,
          url: "https://windoge98.com/spacecadetpinball.html",
          iconHeight: 28,
          height: 494,
          width: 632,
          virtualWindow: "iframe",
          subType: "unknown",
        },
        {
          name: "Beacon DEX (Experimental!)",
          icon: beaconIcon,
          url: "https://beacondex.link/#/rh2pm-ryaaa-aaaan-qeniq-cai",
          iconHeight: 30,
          virtualWindow: "iframe",
          subType: "unknown",
        },
        {
          name: "Dmail",
          icon: dmailIcon,
          url: "https://mail.dmail.ai/",
          iconHeight: 30,
          virtualWindow: "iframe",
          subType: "unknown",
        },
        {
          name: "ICPCoins",
          icon: icpcoinsLogo,
          url: "https://icpcoins.com/#/token/EXE",
          iconHeight: 30,
          virtualWindow: "iframe",
          subType: "unknown",
        },
        {
          name: "ICPSwap",
          icon: icpSwapIcon,
          url: "https://app.icpswap.com/swap?input=ryjl3-tyaaa-aaaaa-aaaba-cai&output=rh2pm-ryaaa-aaaan-qeniq-cai",
          iconHeight: 30,
          height: 600,
          virtualWindow: "iframe",
          subType: "unknown",
        },
        {
          name: "OpenChat",
          icon: ocDogeIcon,
          url: "https://oc.app/community/ow6el-gyaaa-aaaar-av5na-cai/?ref=y3rqn-fyaaa-aaaaf-a7z6a-cai",
          iconHeight: 30,
          virtualWindow: "iframe",
          init: initialiseOpenChat,
          subType: "openchat",
        },
        {
          name: "Sonic",
          icon: sonicIcon,
          url: "https://app.sonic.ooo/swap?from=rh2pm-ryaaa-aaaan-qeniq-cai&to=ryjl3-tyaaa-aaaaa-aaaba-cai",
          iconHeight: 30,
          height: 600,
          virtualWindow: "iframe",
          subType: "unknown",
        },
        {
          name: "Taggr",
          icon: taggrIcon,
          url: "https://taggr.top",
          iconHeight: 30,
          virtualWindow: "iframe",
          subType: "unknown",
        },
        {
          name: "ICDraw",
          icon: icdrawIcon,
          url: "https://icdraw.com",
          iconHeight: 30,
          virtualWindow: "iframe",
          subType: "unknown",
        },
      ],
    },
    
  ],
  bottom: [
    {
      name: "About Windoge98",
      iconHeight: 30,
      icon: pixelIcon,
      subType: "unknown",
      virtualWindow: "welcome",
    },
    {
      name: "Deployed with Juno",
      icon: junoIcon,
      url: "https://juno.build/",
      iconHeight: 25,
      virtualWindow: "blank",
      subType: "unknown",
    },
    {
      name: "Shut Down",
      icon: computerIcon,
      url: "https://windoge98.com/#/shutdown",
      iconHeight: 30,
      virtualWindow: "none",
      subType: "unknown",
    },
  ],
};
