<script setup>
import { ref } from "vue";
import { useDogvertiserNavStore } from "../stores/dogvertiserNavStore";
import { useAuthStore } from "../auth";


// import { useAuth } from '../../auth';

// Define reactive states
const authStore = useAuthStore();
const isLoading = ref(false);
const modal = ref(false);
const modalMsg = ref("");
const { currentScreen, back, toScreen } = useDogvertiserNavStore();

const title = ref("");
const image = ref(null); // Blob
const caller = ref(""); // Principal
const totalBurned = ref(0); // Nat

// const { backendActor, isAuthenticated } = useAuth();

const onFileChange = (e) => {
  image.value = e.target.files[0];
};

const onSubmit = async () => {
  console.log("before upload")
  if (image.value) {
      console.log("uploading")
    await uploadAdvertisement();
      console.log("after upload")

  }
};

const uploadAdvertisement = async () => {
  const timestamp = new Date().getTime(); // This will return the current timestamp in milliseconds

  isLoading.value = true;

  // Prepare advertisement data
  const advertisementData = {
    title: title.value,
    caller: caller.value,
    total_burned: totalBurned.value,
    timestamp: timestamp,
  };

  // Read and convert image file
  const file = image.value;
  const reader = new FileReader();

  reader.onload = async (event) => {
    try {
      const arrayBuffer = event.target.result;
      const uint8Array = new Uint8Array(arrayBuffer);
      const vec8 = Array.from(uint8Array);

      // Add image data to advertisement data
      advertisementData.image = vec8;

      // Send advertisement data to backend
      let response = await authStore.dogvertiserActor.newAdRequest(advertisementData);
       console.log("",response)
      // Reset form fields if needed
      title.value = "";
      image.value = null;
      caller.value = "";
      totalBurned.value = 0;

    } catch (error) {
      // Handle errors
      console.error("Error uploading advertisement:", error);
      modalMsg.value = "Error uploading advertisement";
      modal.value = true;
    }

    isLoading.value = false;
  };

  reader.readAsArrayBuffer(file);
};

</script>

<template>
  <div class="AdvertisementForm">
    <h2>Create New Advertisement</h2>
    <button @click="back">Back</button>
    <label>
      Title:
      <input type="text" v-model="title" />
    </label>
    <label>
      Image:
      <input type="file" @change="onFileChange" />
    </label>
    <!-- Other fields as needed -->
    <button @click="onSubmit">Submit</button>
  </div>
</template>

<style scoped>
.AdvertisementForm {
  /* Add your CSS styles here */
}
</style>
