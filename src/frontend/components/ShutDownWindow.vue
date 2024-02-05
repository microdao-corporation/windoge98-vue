<script setup lang="ts">
import computerImage from "../assets/shut_down.png";

const emit = defineEmits(["onClose"]);

const handleClose = () => {
  console.log("close emitted from window template component");
  emit("onClose");
};

</script>

<template>
  <div class="shutdown-dialog">
    <div class="dialog-body">
      <div class="icon-section">
        <img :src="computerImage" alt="Shutdown Icon" />
      </div>
      <div class="options-section">
        <div class="title"><span>What do you want the computer to do?</span></div>
        <form class="options">
          <label class="option">
            <input type="radio" name="option" value="shutdown" />
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
          <button type="button">OK</button>
          <button @click="handleClose" type="button">Cancel</button>
          <button type="button">Help</button>
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
