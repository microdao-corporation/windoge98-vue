<script setup>
import { ref } from "vue";
import { useDogvertiserNavStore } from "../stores/dogvertiserNavStore";
// import { useAuth } from '../../auth';

// Define reactive states
const isLoading = ref(false);
const modal = ref(false);
const modalMsg = ref("");
const { currentScreen, back, toScreen } = useDogvertiserNavStore();

const title = ref("");
const image = ref(null); // Blob
const caller = ref(""); // Principal
const totalBurned = ref(0); // Nat
const timestamp = ref(""); // Time.Time

// const { backendActor, isAuthenticated } = useAuth();

const onFileChange = (e) => {
  image.value = e.target.files[0];
};

const onSubmit = async () => {
  if (image.value) {
    await uploadAdvertisement();
  }
};

const uploadAdvertisement = async () => {
  const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB in bytes
  let contest = 1;

  // Retrieve active contest from backend
  /*
  let response = await backendActor.getActiveContest();
  if (response.ok) {
    contest = response.ok.id;
  } else {
    isLoading.value = false;
    modal.value = true;
    modalMsg.value = "No ongoing contest ATM";
    return;
  }

  if (image.value.size > maxSizeInBytes) {
    modalMsg.value = "The file needs to be smaller than 10 MBs";
    modal.value = true;
    return;
  }
  */

  isLoading.value = true;

  // Prepare advertisement data
  const advertisementData = {
    title: title.value,
    image: image.value, // Send the whole blob
    caller: caller.value,
    total_burned: totalBurned.value,
    timestamp: timestamp.value,
    contest: contest,
  };

  // Send advertisement data to backend
  try {
    // await backendActor.addNewAdvertisement(advertisementData);
    // Reset form fields if needed
    title.value = "";
    image.value = null;
    caller.value = "";
    totalBurned.value = 0;
    timestamp.value = "";
  } catch (error) {
    // Handle errors
    console.error("Error uploading advertisement:", error);
    modalMsg.value = "Error uploading advertisement";
    modal.value = true;
  }

  isLoading.value = false;
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
