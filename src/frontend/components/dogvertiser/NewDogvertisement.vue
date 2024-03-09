<script setup>
import { reactive, toRefs } from "vue";
import { useDogvertiserNavStore } from "../../stores/dogvertiserNavStore";
import { useAuthStore } from "../../auth";

const { back } = useDogvertiserNavStore();
const authStore = useAuthStore();
const props = defineProps({
  refresh: null,
});

// Grouping state variables into a single reactive object
const state = reactive({
  title: "",
  link: "",
  description: "",
  image: null, // For storing the base64 encoded image
  isLoading: false,
  errors: [],
});

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // check if file is under 2MB
  if (file.size > 2 * 1024 * 1024) {
    state.errors.push("Image size must be less than 2MB");
    event.target.value = null;
    return;
  }

  const reader = new FileReader();
  reader.onload = () => (state.image = reader.result);
  reader.readAsDataURL(file);
};

const onSubmit = async () => {
  if (!state.image) {
    // Check if image is required for Image type

    return;
  }
  await uploadAdvertisement();
};

const uploadAdvertisement = async () => {
  const timestamp = new Date().getTime();

  state.isLoading = true;
  const advertisementData = {
    title: state.title,
    link: state.link,
    image: `${state.image}`, // Include the image data only if adType is 'image'
    description: [state.description],
  };

  try {
    // Send advertisement data to backend
    let response = await authStore.dogvertiserActor.create_advertisement(
      advertisementData
    );
    console.log("Advertisement created:", response.err);
    if (response.err) {
      Object.keys(response.err).forEach((key) => {
        state.errors.push(response.err[key].message);
      });
    } else {
      // Reset form values
      await props.refresh();
      resetForm();
      back();
    }
  } catch (error) {
    console.error("Error uploading advertisement:", error);
    state.errors.push(error);
  }

  state.isLoading = false;
};

function resetForm() {
  state.title = "";
  state.link = "";
  state.description = "";
  state.image = null;
}

// Use toRefs to destructure the reactive object for direct usage in the template
const { title, link, isLoading, image, errors } = toRefs(state);
</script>

<template>
  <div class="new-ad-container">
    <div class="new-ad-container2">
      <h3
        style="font-family: Arial; margin-top: 0px; margin-bottom; 20px; text-align: center"
      >
        New Advertisement
      </h3>
      <div class="error" v-if="state.errors.length > 0">
        <div style="font-size: 14px; font-weight: bold; margin-right: 4px">Error:</div>

        <span v-for="error in state.errors" :key="error">{{ error }}, </span>
      </div>
      <div class="form-group">
        <div>
          <img v-if="image" :src="image" alt="Ad Image" class="uploaded-image" />
          <input id="image" type="file" @change="handleImageUpload" />
        </div>

        <div>
          <label class="label-title" for="title">Title:</label>
          <input id="title" type="text" v-model="title" />
        </div>

        <div>
          <label class="label-title" for="link">Link:</label>
          <input id="link" type="text" v-model="link" />
        </div>
      </div>

      <button @click="onSubmit" :disabled="isLoading">Submit</button>
    </div>
  </div>
</template>

<style scoped>
.label-title {
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: bold;
}
.new-ad-container {
  /* Add your CSS styles here */
  width: 100%;
}

.new-ad-container2 {
  padding: 10px;
}
.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  width: 100%;
}
.form-group div {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  width: 100%;
}

label {
  font-family: "VT323", monospace;
  font-size: 2rem;
}

.uploaded-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.error {
  display: flex;
  align-items: center;
  background-color: rgb(254, 154, 154);
  border-radius: 10px;
  margin-bottom: 1rem;
  padding: 6px;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}
</style>
../../stores/dogvertiserNavStore../../auth
