<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import icpcoinsLogo from "../assets/icpcoins_logo.png";
import pinballIcon from "../assets/pinball-icon.png";
import junoIcon from "../assets/juno_icon.png";
import computerIcon from "../assets/computer-5.png";
import { eventBus } from "../utils/bus";
import { VirtualWindowType } from "../utils/windowTypes";

const currentHours = ref(new Date().getHours());
const currentMinutes = ref(new Date().getMinutes());
const amPm = ref(currentHours.value >= 12 ? "PM" : "AM");
const showColon = ref(true);
const isStartMenuVisible = ref(false);

type MenuItem = {
  url: string;
  virtualWindow: VirtualWindowType;
};

type ToolbarItem = MenuItem & {
  class: string;
};

type StartMenuData = {
  main: StartMenuItem[];
  bottom: StartMenuItem[];
};

type StartMenuItem = MenuItem & {
  name: string;
  icon: string;
  iconHeight: number;
};

const startMenuData: StartMenuData = {
  main: [
    {
      name: "ICPCoins",
      icon: icpcoinsLogo,
      url: "https://icpcoins.com/#/token/EXE",
      iconHeight: 30,
      virtualWindow: "none",
    },
    {
      name: "3D Pinball",
      icon: pinballIcon,
      url: "https://windoge98.com/spacecadetpinball.html",
      iconHeight: 28,
      virtualWindow: "none",
    },
  ],
  bottom: [
    {
      name: "Deployed with Juno",
      icon: junoIcon,
      url: "https://juno.build/",
      iconHeight: 25,
      virtualWindow: "none",
    },
    {
      name: "Shut Down",
      icon: computerIcon,
      url: "https://windoge98.com/spacecadetpinball.com",
      iconHeight: 30,
      virtualWindow: "none",
    },
  ],
};

const toolbarLeftData: ToolbarItem[] = [
  {
    class: "oc",
    url: "https://oc.app/community/ow6el-gyaaa-aaaar-av5na-cai/?ref=y3rqn-fyaaa-aaaaf-a7z6a-cai",
    virtualWindow: "openchat",
  },
  {
    class: "discord",
    url: "https://discord.gg/CnMRrtaj3h",
    virtualWindow: "none",
  },
  {
    class: "sourceforge",
    url: "https://sourceforge.net/p/windoge98-token/code/ci/master/tree/",
    virtualWindow: "none",
  },
  {
    class: "twitter",
    url: "https://x.com/windoge_98",
    virtualWindow: "none",
  },
  {
    class: "telegram",
    url: "https://t.me/windoge98",
    virtualWindow: "none",
  },
  {
    class: "taggr",
    url: "https://taggr.link",
    virtualWindow: "taggr",
  },
];

function toggleStartMenu() {
  isStartMenuVisible.value = !isStartMenuVisible.value;
}

function addZero(i: number) {
  return i < 10 ? "0" + i : i;
}

function formatHour(hour: number) {
  return hour % 12 === 0 ? 12 : hour % 12;
}

function updateTime() {
  const now = new Date();
  currentHours.value = formatHour(now.getHours());
  currentMinutes.value = now.getMinutes();
  amPm.value = now.getHours() >= 12 ? "PM" : "AM";
  showColon.value = !showColon.value;
}

function openNewWindow(item: MenuItem) {
  if (item.virtualWindow !== "none") {
    eventBus.openVirtualWindow(item.virtualWindow);
  } else {
    window.open(item.url, "_blank");
  }
}

let intervalId: number;

onMounted(() => {
  intervalId = window.setInterval(updateTime, 1000);
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <div id="toolbar">
    <div class="toolbar-start-menu">
      <button class="start-button" @click="toggleStartMenu">Start</button>

      <div class="start-menu-wrapper" v-show="isStartMenuVisible">
        <div class="start-menu-title">
          <span class="title"><strong>Windoge</strong>98</span>
        </div>

        <div class="start-menu">
          <div
            v-for="item in startMenuData.main"
            @click="openNewWindow(item)"
            class="start-menu-item"
          >
            <div style="float: left; margin-right: 10px">
              <img :src="item.icon" :height="item.iconHeight" />
            </div>
            {{ item.name }}
          </div>
          <hr />
          <div
            v-for="item in startMenuData.bottom"
            @click="openNewWindow(item)"
            class="start-menu-item"
          >
            <div style="float: left; margin-right: 10px">
              <img :src="item.icon" :height="item.iconHeight" />
            </div>
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
    <div class="toolbar-separator"></div>

    <div class="toolbar-left">
      <button
        v-for="item in toolbarLeftData"
        :class="`toolbar-icon ${item.class}`"
        @click="() => openNewWindow(item)"
      ></button>
    </div>

    <div class="toolbar-separator"></div>

    <div class="toolbar-right">
      <div class="time">
        <span class="hour">{{ addZero(currentHours) }}</span>
        <span>{{ showColon ? ":" : " " }}</span>
        <span class="minutes">{{ addZero(currentMinutes) }}</span> {{ amPm }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.logo {
  display: flex;
  justify-content: center;
}

body {
  cursor: url(http://www.rw-designer.com/cursor-download.php?id=90885), auto;
  font-family: "MS Sans Serif";
  letter-spacing: 0.001em;
  font-size: 14px;
  font-smooth: none;
}

hr {
  color: #797979;
  background-color: #797979;
  border-bottom: 1px solid #fff;
}

#boot-ready {
  width: 100%;
  z-index: 98;
  position: fixed;
  height: 100vh;
  background: #000;
}

strong {
  font-weight: bold;
}

#boot {
  width: 100%;
  z-index: 99;
  position: fixed;
  height: 100vh;
  background: url(https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4989c596-7ba0-4e17-8b98-7c338208ab64/daobodr-7dc4c4b1-7bd3-4b50-87bb-c987e2c4dfb7.jpg/v1/fill/w_1231,h_649,q_70,strp/windows_98_remastered_startup_screen__4k_wallpaper_by_archi_techi_daobodr-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjE2MCIsInBhdGgiOiJcL2ZcLzQ5ODljNTk2LTdiYTAtNGUxNy04Yjk4LTdjMzM4MjA4YWI2NFwvZGFvYm9kci03ZGM0YzRiMS03YmQzLTRiNTAtODdiYi1jOTg3ZTJjNGRmYjcuanBnIiwid2lkdGgiOiI8PTQwOTYifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.79KQdANpp8aaMRj99IcG2XE63yJ8608uZ9IfgP2yYrY)
    no-repeat center -25px / cover;
}

.start-menu-item {
  padding: 10px 10px;
  cursor: pointer;
}
.loading-bar {
  position: absolute;
  width: 100%;
  height: 25px;
  background: linear-gradient(
    220deg,
    rgba(85, 132, 187, 1),
    rgba(202, 232, 251, 1),
    rgba(85, 132, 187, 1)
  );
  background-size: 200% 100%;
  bottom: 0;
  left: 0;
  animation: loading 3s ease forwards infinite;
}

@keyframes loading {
  0% {
    background-position: 0% 51%;
  }
  100% {
    background-position: -200% 51%;
  }
}

#toolbar {
  background: #c0c0c0;
  height: 35px;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  border-top: 2px solid #fff;

  .toolbar-start-menu {
    float: left;

    .start-button {
      background: url("../assets/start-icon.png") no-repeat 2px center / 24px;
      padding-left: 28px;
      padding-right: 5px;
      height: 29px;
      margin: 2px 3px;
      font-weight: bold;
      border: 2px solid #7c7c7c;
      border-top-color: #fff;
      border-left-color: #fff;

      &:hover {
        background-color: darken(#c0c0c0, 10%);
      }
    }

    .start-menu-wrapper {
      border: 2px solid #7c7c7c;
      border-top-color: #fff;
      border-left-color: #fff;
      background: #c0c0c0;
      position: fixed;
      left: 2px;
      bottom: 35px;
      width: 250px;
      min-height: 300px;

      .start-menu-title {
        height: 95%;
        padding: 5px 5px;
        background: linear-gradient(
          135deg,
          #00007b 0%,
          #0000ff 5%,
          #00007b 100%
        );
        color: #fff;
        width: 30px;
        float: left;
        text-transform: uppercase;
        font-size: 18px;
        position: absolute;

        .title {
          transform: rotate(-90deg);
          transform-origin: left 0 !important;
          position: absolute;
          left: 10px;
          bottom: -5px;
        }
      }

      .start-menu {
        margin-left: 40px;
      }
    }
  }

  .toolbar-separator {
    width: 2px;
    height: 26px;
    margin-top: 2px;
    background: #797979;
    float: left;
    border-right: 1px solid #fff;
  }

  .toolbar-left {
    float: left;
    display: flex;
    padding: 0 5px;
    flex-wrap: wrap;
  }

  .toolbar-icon {
    background: no-repeat center / auto 20px;
    width: 25px;
    height: 25px;
    border: none;
    margin-top: 3px;
    margin: 3px 2px;

    &.oc {
      background-image: url("../assets/oc-pixel.png");
    }

    &.discord {
      background-image: url("../assets/discord-pixel2.png");
    }

    &.sourceforge {
      background-image: url("../assets/sf-pixel.png");
    }

    &.twitter {
      background-image: url("../assets/x-pixel.png");
    }
    &.telegram {
      background-image: url("../assets/telegram-pixel.png");
    }

    &.taggr {
      background-image: url("../assets/taggr-pixel.png");
    }
  }

  .toolbar-right {
    float: right;
    margin: 2px 3px;
    height: 29px;
    border: 2px solid #7c7c7c;
    border-bottom-color: #fff;
    border-right-color: #fff;

    .time {
      padding: 6px 10px;
    }
  }
}

.desktop-icons {
  .desktop-icon {
    width: 115px;
    height: 100px;
    color: #fff;
    text-align: center;
    background: no-repeat center top;
    padding-top: 55px;
    margin: 10px;

    &.my-computer {
      background-image: url(https://win98icons.alexmeub.com/icons/png/computer_explorer-5.png);
    }
    &.my-documents {
      background-image: url(https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png);
    }

    &.network {
      background-image: url(https://win98icons.alexmeub.com/icons/png/network_cool_two_pcs-0.png);
    }

    &.trash-empty {
      background-image: url(https://win98icons.alexmeub.com/icons/png/recycle_bin_empty-4.png);
    }
  }
}
</style>
