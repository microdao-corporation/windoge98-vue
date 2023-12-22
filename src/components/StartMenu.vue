<script setup lang="ts">
import { ref, Ref, onMounted, onUnmounted } from "vue";
import { startMenuData } from "../data/menuItems";
import { openNewWindow } from "../utils/windowUtils";

const isStartMenuVisible = ref(false);

onMounted(() => {
  document.addEventListener("click", handleOutsideClick);
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
  console.log("toggleSubMenu", item);
  visibleSubMenu.value = item.name;
  console.log("visibleSubMenu", visibleSubMenu.value);
}

function isSubMenuVisible(item: MenuItem) {
  const isVisible = visibleSubMenu.value == item.name;
  console.log("isSubMenuVisible", isVisible);
  return isVisible;
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
          v-for="item in startMenuData.main"
          class="start-menu-item"
          @mouseenter="toggleSubMenu(item)"
          @mouseleave="visibleSubMenu = null"
        >
          <div class="start-menu-item-icon">
            <img :src="item.icon" :height="item.iconHeight" v-if="item.icon" />
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
              v-for="subItem in item.submenu"
              @click="openNewWindow(subItem)"
              class="start-menu-item"
            >
              <div class="start-menu-item-icon">
                <img :src="subItem.icon" :width="16" />
              </div>
              {{ subItem.name }}
            </div>
          </div>
        </div>
        <hr />
        <div
          v-for="item in startMenuData.bottom"
          @click="openNewWindow(item)"
          class="start-menu-item"
        >
          <div class="start-menu-item-icon">
            <img :src="item.icon" :height="item.iconHeight" />
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
