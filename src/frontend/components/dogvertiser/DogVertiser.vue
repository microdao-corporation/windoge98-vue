<script setup>
import { ref, watch, onMounted } from "vue";
import { useAuthStore } from "../../auth";
import { storeToRefs } from "pinia";
import NewDogvertisement from "./NewDogvertisement.vue";
import { useDogvertiserNavStore } from "../../stores/dogvertiserNavStore";
import { Principal } from "@dfinity/principal";
import { useClipboard } from "@vueuse/core";
import { canisterId as dogvertiserCanisterId } from "../../../declarations/dogvertiser";
import adsIcon from "../../assets/advertise_icon.png";

const authStore = useAuthStore();
const whoami = ref("");
const balance = ref("loading...");
const dogvertiserBalance = ref("loading...");
const myAds = ref([]);
const { copy, copied, isSupported, text } = useClipboard();
const isTransfering = ref(false);
const creationErrors = ref([]);
const showWallet = ref(false);
const allAds = ref([]);
const totalBurned = ref(0);
const loadingMyAds = ref(false);
const isBoosting = ref({
  status: false,
  index: null,
});

const { isAuthenticated } = storeToRefs(authStore);
const { currentScreen, back, toScreen, screenHistory } = useDogvertiserNavStore();

onMounted(async () => {
  loadingMyAds.value = true;
  await authStore.init();
  await refresh();
  loadingMyAds.value = false;
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

async function handleGetMyads() {
  loadingMyAds.value = true;
  try {
    let userAdsRaw = await authStore.dogvertiserActor.fetch_user_ads();
    myAds.value = userAdsRaw;
    console.log("userAds", myAds.value);
  } catch (error) {
    console.error("Error fetching user ads:", error);
  } finally {
    loadingMyAds.value = false;
  }
}

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
      authStore.init();
    }
    allAds.value = await authStore.dogvertiserActor.fetch_ads();
    totalBurned.value = await authStore.dogvertiserActor.fetch_total_burned();
  }
});

const refresh = async () => {
  // Ensure the dogvertiserActor is initialized
  if (!authStore.dogvertiserActor) {
    await authStore.init();
  }

  isTransfering.value = true;

  try {
    whoami.value = await authStore.dogvertiserActor.whoami();
    let dogvertiseBalanceRaw = await authStore.dogvertiserActor.exe_balance_of(
      whoami.value
    );
    dogvertiserBalance.value = Number(dogvertiseBalanceRaw).toFixed(8); // Formatting with 8 decimal places

    let newBalanceRaw = await authStore.windogeActor.icrc1_balance_of({
      owner: Principal.fromText(whoami.value),
      subaccount: [],
    });
    balance.value = Number(newBalanceRaw).toFixed(8); // Formatting with 8 decimal places

    let userAds = await authStore.dogvertiserActor.fetch_user_ads();
    // Ensure userAds is a valid JSON string before parsing
    console.log("userAds", userAds);
  } catch (error) {
    console.error("An error occurred during the refresh process:", error);
    // Handle errors appropriately
  } finally {
    allAds.value = await authStore.dogvertiserActor.fetch_ads();
    totalBurned.value = await authStore.dogvertiserActor.fetch_total_burned();
    isTransfering.value = false;
  }
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

const handleBoost = async (ad) => {
  if (authStore.dogvertiserActor !== null && authStore.dogvertiserActor !== undefined) {
    updateIsBoosting(true, ad.index);
    console.log(ad);
    let amount = prompt(
      `Enter the amount of EXE to boost advertisement ${ad.title} (${ad.link})...`,
      "1"
    );
    if (!amount) {
      updateIsBoosting(false);
      return;
    }
    let amountAsFloat = parseFloat(amount); // Convert user input to float
    let amountInSmallestUnit = Math.round(amountAsFloat * 1e8); // Adjust and remove decimal point
    let response = await authStore.dogvertiserActor.boost_ad(
      ad.index,
      amountInSmallestUnit
    );
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

function formatBigDecimalToString2(amount) {
  // Convert the number to a string
  let amountStr = amount.toString();

  // Ensure there are at least 8 digits to add leading zeros if necessary
  amountStr = amountStr.padStart(9, "0"); // Ensure at least 8 digits + 1 for leading zeros

  // Insert the decimal point at the correct position
  let formattedAmount = amountStr.slice(0, -8) + "." + amountStr.slice(-2);

  // If the number is less than 1, ensure it starts with '0.'
  if (formattedAmount.startsWith(".")) {
    formattedAmount = "0" + formattedAmount;
  }

  return formattedAmount;
}

const handleLogin = async () => {
  await authStore.login();
  await refresh();
};
</script>

<template>
  <div class="container">
    <div class="header">
      <div style="display: flex; align-items: center; align-content: center">
        <img :src="adsIcon" style="width: 30%; margin-right: 12px; margin-top: -18px" />
        <h1 class="title" style="margin: 0px">Dogvertiser BETA</h1>
      </div>
      <div style="display: flex">
        <div
          class="sign-out"
          @click="back"
          style="display: flex; align-items: center; justify-content: center"
          v-if="screenHistory.length > 1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            style="width: 14px; height: 14px; margin-right: 4px"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
            />
          </svg>
          Back
        </div>
        <div
          class="sign-out"
          @click="refresh"
          style="display: flex; align-items: center; justify-content: center"
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
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </div>

        <div
          class="sign-out"
          @click="showWallet = !showWallet"
          v-if="authStore.isAuthenticated"
          style="display: flex; align-items: center; justify-content: center"
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
          class="sign-out"
          @click="toScreen('main')"
          v-if="authStore.isAuthenticated"
          style="display: flex; align-items: center; justify-content: center"
        >
          My Ads
        </div>
        <div
          class="sign-out"
          @click="toScreen('all-ads')"
          style="display: flex; align-items: center; justify-content: center"
        >
          All Ads
        </div>
        <div
          class="dogvertiser-create-button"
          @click="toScreen('new-ad')"
          v-if="authStore.isAuthenticated"
          style="display: flex; align-items: center; justify-content: center"
        >
          New Advert
        </div>
        <div
          class="dogvertiser-create-button"
          @click="handleLogin"
          v-if="!authStore.isAuthenticated"
          style="display: flex; align-items: center; justify-content: center"
        >
          SIGN IN
        </div>
      </div>
    </div>
    <div class="row-grid dogvertiser-wallet" v-if="showWallet">
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
          {{
            isTransfering ? " " : formatBigDecimalToString(dogvertiserBalance) + " EXE"
          }}
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
      style="background-color: #c0c0c0; overflow: auto; font-family: Arial, sans-serif"
      class="dog-container"
    >
      <div v-if="authStore.isAuthenticated">
        <div class="my-ads">
          <h3>Dogvertiser has burned {{ formatBigDecimalToString2(totalBurned) }} EXE</h3>
          <div style="font-size: 14px">
            <strong>How it works</strong>
            <br />
            1. Create a new ad, this costs 10 EXE which is burned.
            <br />
            2. Optionally boost your ad by burning more EXE to increase the frequency it
            appears.
            <br />
            3. Much wow.
          </div>
        </div>
        <div class="my-ads">
          <h3>My Ads</h3>
          <!-- List of Ads -->
          <div class="ad-list">
            <!-- Example Ad Card -->
            <div class="" v-if="myAds.length == 0 && !loadingMyAds">
              <a @click="toScreen('new-ad')"
                >You haven't created any ads yet. Create one now!</a
              >
            </div>
            <div v-if="loadingMyAds">
              <div class="spinner"><span class="loader"></span> Loading...</div>
            </div>
            <div class="ad-card" v-for="ad in myAds" v-if="myAds" key="ad.index">
              <div
                style="display: flex; align-items: center; justify-content: space-between"
              >
                <h4 style="margin: 0; padding: 0">{{ ad.title }}</h4>
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

              <img :src="ad.image" alt="Ad Image" width="250" heigh="250" />
              <div
                :class="`button ${
                  isBoosting.status && isBoosting.index == ad.index
                    ? 'button--loading'
                    : ''
                }`"
                :style="`pointer-events: ${
                  isBoosting.status && isBoosting.index == ad.index ? 'none' : ''
                }; display:flex; justify-content: center; align-items: center`"
                @click="handleBoost(ad)"
              >
                <span class="button__text" style="font-size: 16px">{{
                  isBoosting.status && isBoosting.index == ad.index
                    ? "Boosting..."
                    : "🚀 &nbsp; Boost Ad"
                }}</span>
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

    <div
      v-if="currentScreen.screen == 'all-ads'"
      style="background-color: #c0c0c0; font-family: Arial, sans-serif"
      class="dog-container"
    >
      <div>
        <div class="my-ads">
          <h3>Dogvertiser has burned {{ formatBigDecimalToString2(totalBurned) }} EXE</h3>
          <div style="font-size: 14px">
            <strong>How it works</strong>
            <br />
            1. Create a new ad, this costs 10 EXE which is burned.
            <br />
            2. Optionally boost your ad by burning more EXE to increase the frequency it
            appears.
            <br />
            3. Much wow.
          </div>
        </div>
        <div class="my-ads">
          <h3>All Ads</h3>
          <!-- List of Ads -->
          <div class="ad-list">
            <!-- Example Ad Card -->
            <div class="" v-if="allAds.length == 0">
              <a @click="toScreen('new-ad')">No ads have been created yet.</a>
            </div>
            <div class="ad-card" v-for="ad in allAds" v-if="allAds" key="ad.index">
              <div
                style="display: flex; align-items: center; justify-content: space-between"
              >
                <h4 style="margin: 0; padding: 0">{{ ad.title }}</h4>
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

              <img :src="ad.image" alt="Ad Image" height="250" width="250" />
              <div
                :class="`button ${
                  isBoosting.status && isBoosting.index == ad.index
                    ? 'button--loading'
                    : ''
                }`"
                :style="`pointer-events: ${
                  isBoosting.status && isBoosting.index == ad.index ? 'none' : ''
                }; display:flex; justify-content: center; align-items: center`"
                @click="handleBoost(ad)"
              >
                <span class="button__text" style="font-size: 16px">{{
                  isBoosting.status && isBoosting.index == ad.index
                    ? "Boosting..."
                    : "🚀 &nbsp; Boost Ad"
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="currentScreen.screen == 'new-ad'">
      <NewDogvertisement :refresh="refresh" />
    </div>
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
.dogvertiser-wallet {
  font-family: Arial, sans-serif;
  font-smooth: antialiased;
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
  margin-left: 4px;
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
  justify-content: center;
  max-height: 100%;
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
  margin-left: 4px;
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
  background-color: white;
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
  background-color: #c0c0c0;
  max-height: 100%;
  min-height: 100%;
}

.container {
  max-height: 600px;
  overflow-y: auto;
  font-size: 14px;
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
  font-family: Arial, sans-serif;
}

.ad-description {
  font-size: 14px;
}

.boost-button {
  background-color: #4caf50;
  color: #c0c0c0;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
