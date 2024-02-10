<script setup lang="ts">
// @ts-ignore
import { ref, watch } from "vue";
import { useAuthStore } from "../auth";
// @ts-ignore
import { storeToRefs } from "pinia";
// @ts-ignore
import NewDogvertisement from "./NewDogvertisement.vue";
import { useDogvertiserNavStore } from "../stores/dogvertiserNavStore";
import { Principal } from "@dfinity/principal";

const authStore = useAuthStore();
const whoami = ref("");
const balance = ref("00000.000");
const dogvertiserBalance = ref("00000.000");

const { isAuthenticated } = storeToRefs(authStore);
// @ts-ignore
const { currentScreen, back, toScreen } = useDogvertiserNavStore();

const handleTransferDapp = async () => {
  if (
    authStore.dogvertiserActor !== null &&
    authStore.dogvertiserActor !== undefined
  ) {
    let dogvertiserCanisterId =
      await authStore.dogvertiserActor.dogvertiserCanister();
    let whoamisub = await authStore.dogvertiserActor.whoamisub();
    let account = {
      owner: Principal.fromText(dogvertiserCanisterId),
      subaccount: [whoamisub], // Pass the extracted array as the subaccount
    };

    let transerBalance = Number(balance.value) - 100000;
    // @ts-ignore
    let transferResult = await authStore.windogeActor.icrc1_transfer({
      fee: [],
      amount: transerBalance,
      memo: [],
      from_subaccount: [],
      to: account,
      created_at_time: [],
    });
      console.log("transferResult",transferResult)
      //@ts-ignore
         let dogvertiseBalance = await authStore.dogvertiserActor.getBalance();
      dogvertiserBalance.value = Number(dogvertiseBalance).toString();
      balance.value = "0000.000"
  }
};

const handleWithdrawl = async () => {
  if (
    authStore.dogvertiserActor !== null &&
    authStore.dogvertiserActor !== undefined
  ) {
    let principal = Principal.fromText(whoami.value);
    //@ts-ignore
    let response = await authStore.dogvertiserActor.withdraw();
    //@ts-ignore
     let newBalance = await authStore.windogeActor.icrc1_balance_of({
        owner: principal,
        subaccount: [],
      });
      balance.value = Number(newBalance).toString();
      dogvertiserBalance.value = "0000.000"
  } else {
    // Handle the case when authStore.dogvertiserActor is null or undefined
  }
};

watch(isAuthenticated, async (value: any) => {
  if (value) {
    if (
      authStore.dogvertiserActor !== null &&
      authStore.dogvertiserActor !== undefined
    ) {
      whoami.value = await authStore.dogvertiserActor.whoami();
      let principal = Principal.fromText(whoami.value);
      //@ts-ignore
      let dogvertiseBalance = await authStore.dogvertiserActor.getBalance();
      dogvertiserBalance.value = Number(dogvertiseBalance).toString();
      // @ts-ignore
      let newBalance = await authStore.windogeActor.icrc1_balance_of({
        owner: principal,
        subaccount: [],
      });
      balance.value = Number(newBalance).toString();
    } else {
      // Handle the case when authStore.dogvertiserActor is null or undefined
    }
  }
});
</script>

<template>
  <div v-if="currentScreen.screen == 'main'">
    <div v-if="authStore.isAuthenticated" class="container">
      <!-- Header -->
      <div class="header">
        <h1 class="title">Dogvertiser</h1>
        <button class="sign-out" @click="back">Back</button>
        <button class="sign-out" @click="authStore.logout">Sign Out</button>
      </div>

      <!-- Tab Menu -->
      <div class="tab-menu">
        <div class="tab">Current Ads</div>
        <div class="tab">My Ads</div>
        <button class="tab" @click="toScreen('new-ad')">New Ad</button>
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
          <button class="tab" @click="handleTransferDapp()">
            Transfer to dapp
          </button>
          <button class="tab" @click="handleWithdrawl()">Withdral</button>

          <h1 class="column-title">My Wallet</h1>
          <p>{{ balance }}</p>
          <h1 class="column-title">Dapp Wallet</h1>
          <p>{{ dogvertiserBalance }}</p>
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
  </div>
  <div v-if="currentScreen.screen == 'new-ad'">
    <NewDogvertisement />
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
  background-color: #4caf50;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
