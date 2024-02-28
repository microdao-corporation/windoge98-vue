<template>
  <div class="AdvertisementForm">
    <h2>Create New Advertisement</h2>
    <button @click="back">Back</button>
    <label>
      Title:
      <input type="text" v-model="title" />
    </label>
    <!-- Add conditional rendering for Image and Description fields -->
    <label v-if="adType === 'text'">
      Description:
      <input type="text" v-model="description" />
    </label>
    <label v-else-if="adType === 'image'">
      Image:
      <input type="file" @change="onFileChange" />
    </label>
    <!-- Add dropdown for ad type -->
    <label>
      Ad Type:
      <select v-model="adType">
        <option value="text">Text</option>
        <option value="image">Image</option>
      </select>
    </label>
    <button @click="onSubmit">Submit</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useDogvertiserNavStore } from "../stores/dogvertiserNavStore";
import { useAuthStore } from "../auth";

const authStore = useAuthStore();
const isLoading = ref(false);
const modal = ref(false);
const modalMsg = ref("");
const { currentScreen, back, toScreen } = useDogvertiserNavStore();

const title = ref("");
const image = ref(null); // Blob
const caller = ref(""); // Principal
const totalBurned = ref(0); // Nat
const adType = ref("text"); // Default ad type to "text"
const description = ref("Text"); // Description field

const onFileChange = (e) => {
  image.value = e.target.files[0];
};

const onSubmit = async () => {
  if (adType.value === "image" && !image.value) {
    // Check if image is required for Image type
    console.error("Image is required for Image type");
    modalMsg.value = "Image is required for Image type";
    modal.value = true;
    return;
  }
  await uploadAdvertisement();
};

const uploadAdvertisement = async () => {
  const timestamp = new Date().getTime();

  isLoading.value = true;
  console.log("values",description.value, title.value)
  const advertisementData = {
    title: title.value,
    caller: caller.value,
    total_burned: totalBurned.value,
    timestamp: timestamp,
    adtype: adType.value, // Include ad type in the advertisement data
    description: [description.value], // Include description in the advertisement data
    image:[]
  };

  if (adType.value === "image") {
    const file = image.value;
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target.result;
        const uint8Array = new Uint8Array(arrayBuffer);
        const vec8 = Array.from(uint8Array);

        advertisementData.image = vec8;

        let response = await authStore.dogvertiserActor.newAdRequest(
          advertisementData
        );
        console.log(response);

        title.value = "";
        image.value = [];
        caller.value = "";
        totalBurned.value = 0;
      } catch (error) {
        console.error("Error uploading advertisement:", error);
        modalMsg.value = "Error uploading advertisement";
        modal.value = true;
      }

      isLoading.value = false;
    };

    reader.readAsArrayBuffer(file);
  } else {
    try {
      // Send advertisement data to backend for Text type
      let response = await authStore.dogvertiserActor.newAdRequest(
        advertisementData
      );
      console.log(response);

      title.value = "";
      description.value = "";
      caller.value = "";
      totalBurned.value = 0;
    } catch (error) {
      console.error("Error uploading advertisement:", error);
      modalMsg.value = "Error uploading advertisement";
      modal.value = true;
    }

    isLoading.value = false;
  }
};
</script>

<style scoped>
.AdvertisementForm {
  /* Add your CSS styles here */
}
</style>
