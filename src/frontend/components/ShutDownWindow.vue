<script setup lang="ts">
import { useRouter } from "vue-router";
import { shuttingDownState } from "../stores/sharedStates";
import computerImage from "../assets/shut_down.png";

const router = useRouter();

const handleShutdown = () => {
  shuttingDownState.value = true;
  emit("onClose"); // close window of shutdown dialog
  router.push("/loading");
};

const handleHelp = () => {
  emit("onClose"); // close window of shutdown dialog
  router.push("/bsod");
};

const emit = defineEmits(["onClose"]);
</script>

<template>
  <div class="shutdown-dialog">
    <div class="dialog-body">
      <div class="icon-section">
        <!-- Dynamic binding for computer image source -->
        <img :src="computerImage" alt="Shutdown Icon" />
      </div>
      <div class="options-section">
        <div class="title">
          <span>What do you want the computer to do?</span>
        </div>
        <form class="options">
          <label class="option">
            <input type="radio" name="option" value="shutdown" checked />
            <span class="checkmark"></span>
            Shut down
          </label>
          <label class="option">
            <input type="radio" name="option" value="restart" />
            <span class="checkmark"></span>
            Restart
          </label>
          <label class="option">
            <input type="radio" name="option" value="msdos" />
            <span class="checkmark"></span>
            Restart in MS-DOS mode
          </label>
        </form>
        <div class="buttons">
          <button @click="handleShutdown" type="button">Ok</button>
          <button @click="emit('onClose')" type="button">Cancel</button>
          <button @click="handleHelp" type="button">Help</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialog-body {
  display: flex;
  padding-top: 8px;
  padding-left: 4px;
}

.icon-section img {
  width: 32px;
  height: 32px;
}

.options-section {
  margin-left: 12px;
}

.title {
  margin-bottom: 10px;
  font-size: 14px;
}

.options .option {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.options .option input[type="radio"] {
  opacity: 0;
  position: absolute;
  cursor: pointer;
}

.checkmark {
  height: 10px;
  width: 10px;
  background-color: #fff;
  border-radius: 50%;
  border: 1px solid #000;
  margin-right: 5px;
  cursor: pointer;
  position: relative;
}

.options .option input[type="radio"]:checked ~ .checkmark {
  background-color: #ffffff;
}

.checkmark::after {
  content: "";
  position: absolute;
  display: none;
}

.options .option input[type="radio"]:checked ~ .checkmark:after {
  display: block;
  top: 3px;
  left: 3px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #000000;
}

.buttons {
  margin-top: 10px;
}

.buttons button {
  color: #000000;
  border: 1px solid #000;
  padding: 2px 8px;
  margin-right: 5px;
  cursor: url("../assets/cursors/pointer.cur"), pointer;
}
</style>
