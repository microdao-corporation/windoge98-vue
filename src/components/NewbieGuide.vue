<script setup lang="ts">
import { Ref, ref } from "vue";
import walletIcon from "../assets/wallet.png";
import plugHeader from "../assets/plug-header.png";
// import { calculateBurned, natToFormattedString } from "../utils/numberUtils";

const currentSection: Ref<string> = ref("wallet-info");

const showSection = (section: string) => {
  currentSection.value = section;
};

const activeClass = (section: string) => {
  return currentSection.value == section ? "active" : "";
};
</script>

<template>
  <div>
    <div>
      <div style="display: flex; justify-content: center; align-items: center">
        <img :src="walletIcon" height="70" />
        <h3 style="padding-left: 10px; padding-right: 10px">Windoge98 Wallet Guide</h3>
        <img :src="walletIcon" height="70" />
      </div>
    </div>
    <div style="display: flex; margin-bottom: 10px">
      <ul class="tree-view tree-scroll">
        <li @click="showSection('wallet-info')" :class="activeClass('wallet-info')">
          What is a wallet?
        </li>
        <li>
          <details open>
            <summary>Wallets</summary>
            <ul>
              <li @click="showSection('plug-info')" :class="activeClass('plug-info')">
                Plug (recommended)
              </li>
              <li>Internet Identity</li>
              <li>Bitfinity</li>
            </ul>
          </details>
        </li>
      </ul>
      <div style="max-height: 400px; min-height: 400px; overflow: auto">
        <div v-if="currentSection == 'wallet-info'">
          <h5 style="margin-bottom: 0px; margin-top: 0px">What is a wallet?</h5>
          <p>
            A cryptocurrency wallet is a digital tool that allows users to store, manage,
            and transact with cryptocurrencies like Bitcoin, Ethereum, ICP and others.
          </p>
          <p>
            It operates by interacting with various blockchain networks to enable the
            sending and receiving of cryptocurrency transactions and for checking the
            user's balance.
          </p>
          <p>There are several key aspects to understand about cryptocurrency wallets:</p>

          <strong>Key Aspects</strong>
          <ul>
            <li>
              <strong>Types of Wallets</strong>:
              <ul>
                <li>Software Wallets: Applications for computers or mobile devices.</li>
                <li>
                  Hardware Wallets: Physical devices storing cryptocurrency offline.
                </li>
                <li>
                  Paper Wallets: Documents with cryptocurrency addresses and private keys.
                </li>
              </ul>
            </li>
            <li>
              <strong>Security</strong>: Requires safekeeping of private keys/seed phrase
              and secure internet connections.
            </li>
            <li>
              <strong>Multi-Currency vs. Single-Currency Wallets</strong>: Some support
              multiple types of cryptocurrencies, others only one.
            </li>
            <li>
              <strong>User Control</strong>: Custodial (managed by a third party) and
              non-custodial (user-managed) wallets.
            </li>
            <li>
              <strong>Integration with Services</strong>: Many offer integrated services
              like exchanges for buying, selling, or trading.
            </li>
          </ul>

          <p>
            Note: Cryptocurrency wallets do not store actual coins but provide tools to
            interact with blockchain networks. The balance is recorded on the blockchain,
            with the wallet offering a user interface for interaction.
          </p>
        </div>
        <div v-if="currentSection == 'plug-info'">
          <img :src="plugHeader" style="width: 100%" />
          <h5 style="margin-bottom: 0px">Plug Wallet</h5>
          <p>
            The Plug Wallet is a browser extension that allows you to interact with the
            Internet Computer. It is the easiest way to get started with the Internet
            Computer. It is available for Chrome, Firefox, and Edge.
          </p>
          <p>
            The Plug Wallet is a browser extension that allows you to interact with the
            Internet Computer. It is the easiest way to get started with the Internet
            Computer. It is available for Chrome, Firefox, and Edge.
          </p>
          <p>
            The Plug Wallet is a browser extension that allows you to interact with the
            Internet Computer. It is the easiest way to get started with the Internet
            Computer. It is available for Chrome, Firefox, and Edge.
          </p>
          <p>
            The Plug Wallet is a browser extension that allows you to interact with the
            Internet Computer. It is the easiest way to get started with the Internet
            Computer. It is available for Chrome, Firefox, and Edge.
          </p>
          <p>
            The Plug Wallet is a browser extension that allows you to interact with the
            Internet Computer. It is the easiest way to get started with the Internet
            Computer. It is available for Chrome, Firefox, and Edge.
          </p>
          <p>
            The Plug Wallet is a browser extension that allows you to interact with the
            Internet Computer. It is the easiest way to get started with the Internet
            Computer. It is available for Chrome, Firefox, and Edge.
          </p>
          <p>
            The Plug Wallet is a browser extension that allows you to interact with the
            Internet Computer. It is the easiest way to get started with the Internet
            Computer. It is available for Chrome, Firefox, and Edge.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.active {
  background-color: #010081;
  color: white;
  padding: 1px;
  padding-left: 2px;
}

.tree-scroll {
  margin-top: 0px;
  min-width: 25%;
  max-width: 25%;
  height: 300px;
  overflow-y: auto;
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
  margin-right: 10px;
}
.tree-view::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}
</style>
