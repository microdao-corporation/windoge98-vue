<script setup>
import { ref, watch, onMounted } from "vue";
import { useAuthStore } from "../auth";
import { storeToRefs } from "pinia";
import NewDogvertisement from "./NewDogvertisement.vue";
import { useDogvertiserNavStore } from "../stores/dogvertiserNavStore";
import { Principal } from "@dfinity/principal";
import { useClipboard } from "@vueuse/core";
import { canisterId as dogvertiserCanisterId } from "../../declarations/dogvertiser";
import adsIcon from "../assets/advertise_icon.png";

const authStore = useAuthStore();
const whoami = ref("");
const balance = ref("loading...");
const dogvertiserBalance = ref("loading...");
const myAds = ref([]);
const { copy, copied, isSupported, text } = useClipboard();
const isTransfering = ref(false);
const creationErrors = ref([]);
const showWallet = ref(false);
const isBoosting = ref({
  status: false,
  index: null,
});

const { isAuthenticated } = storeToRefs(authStore);
const { currentScreen, back, toScreen } = useDogvertiserNavStore();

onMounted(async () => {
  if (authStore.dogvertiserActor !== null && authStore.dogvertiserActor !== undefined) {
    whoami.value = await authStore.dogvertiserActor.whoami();

    let dogvertiseBalanceRaw = await authStore.dogvertiserActor.exe_balance_of(
      whoami.value
    );
    // Ensure dogvertiserBalance is formatted with 8 decimal places
    dogvertiserBalance.value = Number(dogvertiseBalanceRaw);

    let newBalanceRaw = await authStore.windogeActor.icrc1_balance_of({
      owner: Principal.fromText(whoami.value),
      subaccount: [],
    });
    // Ensure balance is formatted with 8 decimal places
    balance.value = Number(newBalanceRaw);
    handleGetMyads();
  } else {
    // Handle the case when authStore.dogvertiserActor is null or undefined
  }
});

const handleDappDeposit = async () => {
  if (authStore.dogvertiserActor !== null && authStore.dogvertiserActor !== undefined) {
    isTransfering.value = true;
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
    await refresh();
    isTransfering.value = false;
  }
};

const handleTransferToWalletl = async () => {
  if (authStore.dogvertiserActor !== null && authStore.dogvertiserActor !== undefined) {
    isTransfering.value = true;
    let principal = Principal.fromText(whoami.value);
    //@ts-ignore
    let response = await authStore.dogvertiserActor.transfer_to_wallet();
    //@ts-ignore
    await refresh();
  } else {
    // Handle the case when authStore.dogvertiserActor is null or undefined
  }
  isTransfering.value = false;
};

const handleGetMyads = async () => {
  //@ts-ignore
  let userAds = await authStore.dogvertiserActor.fetch_user_ads();
  myAds.value = userAds;
};

watch(isAuthenticated, async (value) => {
  if (value) {
    if (authStore.dogvertiserActor !== null && authStore.dogvertiserActor !== undefined) {
      whoami.value = await authStore.dogvertiserActor.whoami();
      let principal = Principal.fromText(whoami.value);
      //@ts-ignore
      let dogvertiseBalance = await authStore.dogvertiserActor.exe_balance_of(
        whoami.value
      );
      dogvertiserBalance.value = Number(dogvertiseBalance).toString();
      // @ts-ignore
      let newBalance = await authStore.windogeActor.icrc1_balance_of({
        owner: principal,
        subaccount: [],
      });
      balance.value = Number(newBalance).toString();
      handleGetMyads();
    } else {
      // Handle the case when authStore.dogvertiserActor is null or undefined
    }
  }
});

const refresh = async () => {
  if (authStore.dogvertiserActor !== null && authStore.dogvertiserActor !== undefined) {
    isTransfering.value = true;
    whoami.value = await authStore.dogvertiserActor.whoami();

    let dogvertiseBalanceRaw = await authStore.dogvertiserActor.exe_balance_of(
      whoami.value
    );
    console.log("dogvertiseBalanceRaw", dogvertiseBalanceRaw);
    // Ensure dogvertiserBalance is formatted with 8 decimal places
    dogvertiserBalance.value = Number(dogvertiseBalanceRaw);

    let newBalanceRaw = await authStore.windogeActor.icrc1_balance_of({
      owner: Principal.fromText(whoami.value),
      subaccount: [],
    });
    // Ensure balance is formatted with 8 decimal places
    balance.value = Number(newBalanceRaw);
    handleGetMyads();
  } else {
    // Handle the case when authStore.dogvertiserActor is null or undefined
  }
  isTransfering.value = false;
};

const handleTransfer = async () => {
  if (authStore.dogvertiserActor !== null && authStore.dogvertiserActor !== undefined) {
    isTransfering.value = true;
    let principal = Principal.fromText(whoami.value);
    let promptAnswer = prompt("Enter the amount to transfer", "10");
    let promptPrincipal = prompt(
      "Enter the principal to transfer to",
      "rrkah-fqaaa-aaaaa-aaaaq-cai"
    );
    console.log("promptAnswer", promptPrincipal);
    let to = Principal.fromText(promptPrincipal.trim());
    let amount = promptAnswer;
    let confirmTx = confirm(`Are you sure you want to transfer ${amount} to ${to}?`);
    if (!confirmTx) {
      return;
    }

    // Ensure the amount is correctly formatted with 8 digits to the right of the decimal point
    let amountAsFloat = parseFloat(amount); // Convert user input to float
    let amountInSmallestUnit = Math.round(amountAsFloat * 1e8); // Adjust and remove decimal point

    let tx = await authStore.windogeActor.icrc1_transfer({
      fee: [],
      amount: amountInSmallestUnit,
      memo: [],
      from_subaccount: [],
      to: { owner: to, subaccount: [] },
      created_at_time: [],
    });

    console.log("tx", tx);

    let newBalance = await authStore.windogeActor.icrc1_balance_of({
      owner: Principal.fromText(whoami.value),
      subaccount: [],
    });
    balance.value = Number(newBalance).toString();
  } else {
    // Handle the case when authStore.dogvertiserActor is null or undefined
  }
  isTransfering.value = false;
};

function updateIsBoosting(status = false, index = null) {
  isBoosting.value.status = status;
  isBoosting.value.index = index;
}

const handleBoost = async (index) => {
  if (authStore.dogvertiserActor !== null && authStore.dogvertiserActor !== undefined) {
    updateIsBoosting(true, index);
    let amount = prompt("Enter the amount of EXE to boost", "10");
    let amountAsFloat = parseFloat(amount); // Convert user input to float
    let amountInSmallestUnit = Math.round(amountAsFloat * 1e8); // Adjust and remove decimal point
    let response = await authStore.dogvertiserActor.boost_ad(index, amountInSmallestUnit);
    await refresh();
    updateIsBoosting(false);
  } else {
    // Handle the case when authStore.dogvertiserActor is null or undefined
  }
};

function formatBigDecimalToString(amount) {
  // Convert the number to a string
  let amountStr = amount.toString();

  // Ensure there are at least 8 digits to add leading zeros if necessary
  amountStr = amountStr.padStart(9, "0"); // Ensure at least 8 digits + 1 for leading zeros

  // Insert the decimal point at the correct position
  let formattedAmount = amountStr.slice(0, -8) + "." + amountStr.slice(-8);

  // If the number is less than 1, ensure it starts with '0.'
  if (formattedAmount.startsWith(".")) {
    formattedAmount = "0" + formattedAmount;
  }

  return formattedAmount;
}
</script>

<template>
  <div class="header">
    <div style="display: flex; align-items: center; align-content: center">
      <img :src="adsIcon" style="width: 30%; margin-right: 8px" />
      <h1 class="title" style="margin: 0px">Dogvertiser</h1>
    </div>
    <div style="display: flex">
      <div class="sign-out" @click="refresh" style="margin-right: 4px">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          style="width: 14px; height: 14px"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </div>
      <div class="sign-out" @click="back" style="margin-right: 4px">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          style="width: 14px; height: 14px"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
          />
        </svg>
      </div>
      <div
        class="sign-out"
        @click="showWallet = !showWallet"
        style="margin-right: 4px"
        v-if="authStore.isAuthenticated"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          style="width: 14px; height: 14px"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
          />
        </svg>
      </div>
      <div
        class="dogvertiser-create-button"
        @click="toScreen('new-ad')"
        v-if="authStore.isAuthenticated"
      >
        New Advert
      </div>
      <div
        class="dogvertiser-create-button"
        @click="authStore.login"
        v-if="!authStore.isAuthenticated"
      >
        SIGN IN
      </div>
    </div>
  </div>
  <div class="row-grid" v-if="showWallet">
    <!-- Column 1: My Principal -->
    <div class="column">
      <h1 class="column-title">My Principal</h1>
      <p>{{ whoami }}</p>

      <div v-if="whoami" @click="copy(whoami)" class="button inline-block">
        <!-- by default, `copied` will be reset in 1.5s -->
        <span v-if="!copied">📋 Copy</span>
        <span v-else>✅ Copied!</span>
      </div>
    </div>

    <!-- Column 2: My Wallet -->
    <div class="column">
      <h1 class="column-title">My Wallet</h1>
      <div class="spinner" v-if="isTransfering">
        <span class="loader"></span>
      </div>
      <p v-if="!isTransfering">
        {{ isTransfering ? " " : formatBigDecimalToString(balance) + " EXE" }}
      </p>
      <div>
        <div
          class="button inline-block"
          :style="`pointer-events: ${isTransfering ? 'none' : ''}`"
          @click="handleTransfer"
          style="margin-right: 4px"
        >
          <span class="button__text">Withdraw</span>
        </div>
        <div
          class="button inline-block"
          :style="`pointer-events: ${isTransfering ? 'none' : ''}`"
          @click="handleDappDeposit()"
        >
          <span class="button__text">Transfer to DApp</span>
        </div>
      </div>
      <h1 class="column-title">Dapp Wallet</h1>
      <div class="spinner" v-if="isTransfering">
        <span class="loader"></span>
      </div>
      <p v-if="!isTransfering">
        {{ isTransfering ? " " : formatBigDecimalToString(dogvertiserBalance) + " EXE" }}
      </p>
      <div class="wallet-buttons">
        <div
          class="button inline-block"
          :style="`pointer-events: ${isTransfering ? 'none' : ''}`"
          @click="handleTransferToWalletl()"
        >
          <span class="button__text">Transfer to My Wallet</span>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="currentScreen.screen == 'main'"
    style="
      background-color: white;
      min-height: 100%;
      max-height: 500px;
      overflow: auto;
      font-family: Arial, sans-serif;
    "
    class="dog-container"
  >
    <div v-if="authStore.isAuthenticated">
      <div class="my-ads">
        <h3>My Ads</h3>
        <!-- List of Ads -->
        <div class="ad-list">
          <!-- Example Ad Card -->
          <div class="ad-card" v-for="ad in myAds" v-if="myAds" key="ad.index">
            <div
              style="display: flex; align-items: center; justify-content: space-between"
            >
              <h3 style="margin: 0; padding: 0">{{ ad.title }}</h3>
            </div>
            <div>
              <div
                style="
                  margin-top: 4px;
                  background-color: rgb(255, 223, 223);
                  color: rgb(144, 0, 0);
                  padding: 2px 8px;
                  border-radius: 4px;
                  font-size: 12px;
                  font-weight: bold;
                "
              >
                <span v-if="isBoosting.index != ad.index"
                  >{{ formatBigDecimalToString(ad.total_burned) }} EXE Burned</span
                >
                <span v-else-if="isBoosting.status && isBoosting.index == ad.index"
                  >Boosting...</span
                >
              </div>
            </div>
            <div class="ad-url">
              Links to <a :href="ad.link" target="_blank">{{ ad.link }}</a>
            </div>
            <br />

            <img :src="ad.image" alt="Ad Image" />
            <div
              :class="`button ${
                isBoosting.status && isBoosting.index == ad.index ? 'button--loading' : ''
              }`"
              :style="`pointer-events: ${
                isBoosting.status && isBoosting.index == ad.index ? 'none' : ''
              }`"
              @click="handleBoost(ad.index)"
            >
              <span class="button__text" style="font-size: 16px">🚀 &nbsp; Boost Ad</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="login-container">
      <img :src="adsIcon" />
      <div><h2 style="margin-top: 0px">Dogvertiser</h2></div>
    </div>
  </div>
  <div v-if="currentScreen.screen == 'new-ad'">
    <NewDogvertisement />
  </div>
</template>

<style>
.spinner {
  display: flex;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 12px;
}
.my-ads {
  padding: 8px;
}
.wallet-buttons {
  display: flex;
  justify-content: space-between;
}
.ad-url {
  margin-top: 4px;
  font-size: 12px;
  color: #333;
  margin-bottom: 10px;
}
.dogvertiser-create-button {
  display: inline-block;
  background-color: #33b14c;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.dogvertiser-button {
  display: inline-block;
  cursor: pointer;
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between !important;
  min-height: 100%;
}
.sign-in-button {
  background-color: #4caf50;
  color: white;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
}
.header {
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #eeecec;
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
  background-color: #eeecec;
}

.column {
  flex: 1;
  padding: 20px;
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
  width: auto;
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

.dog-container {
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
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
