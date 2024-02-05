<script setup lang="ts">
import { ref, Ref, onMounted, onUnmounted } from "vue";
import { openNewWindow } from "../utils/windowUtils";
import { useMenuItemStore } from "../stores/menuItemStore";

const isStartMenuVisible = ref(false);
const { startMenuData } = useMenuItemStore();
const filteredMenu = ref(startMenuData);

onMounted(() => {
  document.addEventListener("click", handleOutsideClick);

  console.log("Start menu data", startMenuData);
  filteredMenu.value = startMenuData; // Clone to avoid direct mutation
  if (filteredMenu.value) {
    filterInPlace(filteredMenu.value.main, (item: any) => item.visible === true);
    filterInPlace(filteredMenu.value.bottom, (item: any) => item.visible === true);
  }
});

onUnmounted(() => {
  document.removeEventListener("click", handleOutsideClick);
});

function handleOutsideClick(event: MouseEvent) {
  const startMenuElement = document.querySelector(".start-menu-wrapper");
  const clickedOnStartMenu = startMenuElement?.contains(event.target as Node);

  if (!clickedOnStartMenu) {
    isStartMenuVisible.value = false;
    visibleSubMenu.value = null;
  }
}

function toggleStartMenu() {
  isStartMenuVisible.value = !isStartMenuVisible.value;
}

const visibleSubMenu: Ref<string | null> = ref(null);

function toggleSubMenu(item: MenuItem) {
  visibleSubMenu.value = item.name;
}

function isSubMenuVisible(item: MenuItem) {
  const isVisible = visibleSubMenu.value == item.name;
  return isVisible;
}

const preloadImages = () => {
  startMenuData.main.forEach((item) => {
    if (item.icon) {
      const img = new Image();
      img.src = item.icon;
    }
    item.submenu?.forEach((subItem) => {
      if (subItem.icon) {
        const img = new Image();
        img.src = subItem.icon;
      }
    });
  });

  startMenuData.bottom.forEach((item) => {
    if (item.icon) {
      const img = new Image();
      img.src = item.icon;
    }
  });
};

function filterInPlace(a: any, condition: any) {
  let i = 0,
    j = 0;

  while (i < a.length) {
    const val = a[i];
    if (condition(val, i, a)) a[j++] = val;
    i++;
  }

  a.length = j;
  return a;
}
</script>

<template>
  <div class="toolbar-start-menu">
    <button class="start-button" @click.stop="toggleStartMenu">Start</button>

    <div class="start-menu-wrapper" v-show="isStartMenuVisible">
      <div class="start-menu-title">
        <span class="title"><strong>Windoge</strong>98</span>
      </div>

      <div class="start-menu">
        <div
          v-if="filteredMenu"
          v-for="item in filteredMenu.main"
          class="start-menu-item"
          @mouseenter="toggleSubMenu(item)"
          @click.once="openNewWindow(item)"
          @mouseleave="visibleSubMenu = null"
        >
          <div class="start-menu-item-icon">
            <img
              :src="item.icon"
              :height="item.iconHeight"
              v-if="item.icon"
              rel="preload"
            />
          </div>
          <div
            style="
              display: flex;
              justify-content: space-between;
              width: 100%;
              align-content: center;
            "
          >
            <span>{{ item.name }}</span>
            <span v-if="item.submenu" class="submenu-expand-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                width="8"
                viewBox="0 0 256 512"
              >
                <path
                  d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z"
                /></svg
            ></span>
          </div>

          <!-- Render submenu if it exists -->
          <div v-if="isSubMenuVisible(item)" class="submenu">
            <div
              v-for="subItem in item.submenu?.sort((a, b) =>
                a.name.localeCompare(b.name)
              )"
              @click="openNewWindow(subItem)"
              class="start-menu-item"
            >
              <div class="start-menu-item-icon">
                <img :src="subItem.icon" :width="16" rel="preload" />
              </div>
              {{ subItem.name }}
            </div>
          </div>
        </div>
        <hr />
        <div
          v-if="filteredMenu"
          v-for="item in filteredMenu.bottom"
          @click="openNewWindow(item)"
          class="start-menu-item"
        >
          <div class="start-menu-item-icon">
            <img :src="item.icon" :height="item.iconHeight" rel="preload" />
          </div>
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.submenu-expand-icon {
  margin-right: 0.8rem;
  margin-top: 2px;
  cursor: pointer; /* Optional, to change the mouse cursor on hover */
}

.start-menu-item:hover svg {
  fill: white;
  stroke: white;
  color: white;
}

.start-menu-item-icon {
  float: left;
  margin-right: 10px;
  display: flex;
  justify-content: center;
}
.ml-2 {
  font-size: 14px;
  margin-left: 10px;
  width: 100%;
}
.start-menu-item {
  display: flex;
  align-items: center;
  padding: 10px 10px;
  cursor: pointer;
  font-size: 14px;
}

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
    width: 280px;
    min-height: 300px;

    .start-menu-title {
      height: 95%;
      padding: 5px 5px;
      background: linear-gradient(135deg, #00007b 0%, #0000ff 5%, #00007b 100%);
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

.start-menu-item {
  position: relative;
}

.submenu {
  display: none;
  position: absolute;
  left: 100%; /* Position to the right of the parent item */
  top: -20;
  width: 280px; /* Adjust width as needed */
  min-height: 100%;
  background-color: #c0c0c0;
  font-size: 11px;
  color: black;
  border: 2px solid #7c7c7c;
  border-top-color: #fff;
  border-left-color: #fff;
}

.start-menu-item:hover .submenu {
  display: block; /* Show submenu on hover */
}
</style>
