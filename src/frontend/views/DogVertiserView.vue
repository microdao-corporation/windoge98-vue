<script setup>
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '../auth';
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const whoami = ref('');

const { isReady, isAuthenticated } = storeToRefs(authStore);

onMounted(() => {
  if (isReady.value) {
    authStore.init();
  }
});

watch(isAuthenticated, async (value) => {
  if (value) {
    whoami.value = await authStore.dogvertiserActor.whoami();
  }
});
</script>

<template>
  <div v-if="authStore.isAuthenticated" class="container">
    <!-- Header -->
    <div class="header">
      <h1 class="title">Dogvertiser</h1>
      <button class="sign-out" @click="authStore.logout">Sign Out</button>
    </div>

    <!-- Tab Menu -->
    <div class="tab-menu">
      <div class="tab">Current Ads</div>
      <div class="tab">My Ads</div>
      <div class="tab">New Ad</div>
    </div>

    <!-- Row Grid -->
    <div class="row-grid">
      <!-- Column 1: My Principal -->
      <div class="column">
        <h1 class="column-title">My Principal</h1>
        <p>{{ whoami }}</p>
      </div>

      <!-- Column 2: My Wallet -->
      <div class="column">
        <h1 class="column-title">My Wallet</h1>
        <p>0.00000000 EXE</p>
      </div>
    </div>

    <!-- List of Ads -->
    <div class="ad-list">
      <!-- Example Ad Card -->
      <div class="ad-card">
        <h2 class="ad-title">Ad Title</h2>
        <p class="ad-description">Description text goes here.</p>
        <button class="boost-button">Boost</button>
      </div>
      <!-- Add more ad cards here -->
    </div>
  </div>

  <div v-else>
    <h1>Please sign in to access Dogvertiser</h1>
    <button @click="authStore.login">Sign In</button>
  </div>
</template>

<style>
.container {
  margin: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 24px;
}

.sign-out {
  background-color: #ccc;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.tab-menu {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
}

.tab {
  cursor: pointer;
}

.row-grid {
  display: flex;
  margin-bottom: 20px;
}

.column {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.column-title {
  font-size: 18px;
}

.ad-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.ad-card {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
}

.ad-card img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.ad-title {
  font-size: 16px;
  margin-top: 10px;
}

.ad-description {
  font-size: 14px;
}

.boost-button {
  background-color: #4CAF50;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
