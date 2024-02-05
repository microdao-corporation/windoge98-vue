// auth.js
import { defineStore } from "pinia";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { createActor, dogvertiser } from "../declarations/dogvertiser";
import { toRaw } from "vue";

let IICanister = process.env.CANISTER_ID_internet_identity;

const defaultOptions = {
  /**
   *  @type {import("@dfinity/auth-client").AuthClientCreateOptions}
   */
  createOptions: {
    idleOptions: {
      // Set to true if you do not want idle functionality
    },
  },
  /**
   * @type {import("@dfinity/auth-client").AuthClientLoginOptions}
   */
  loginOptions: {
    identityProvider:
      import.meta.env.DFX_NETWORK === 'ic'
        ? 'https://identity.ic0.app/#authorize'
        : `http://${IICanister}.localhost:8000`,
  },
};

function actorFromIdentity(identity) {
  return createActor(dogvertiser, {
    agentOptions: {
      identity,
    },
  });
}

export const useAuthStore = defineStore("auth", {
  id: "auth",
  state: () => {
    return {
      isReady: false,
      isAuthenticated: null,
      authClient: null,
      identity: null,
      dogvertiserActor: null,
    };
  },
  actions: {
    async init() {
      let authClient = await AuthClient.create();
      this.authClient = authClient;
      const isAuthenticated = await authClient.isAuthenticated();
      const identity = isAuthenticated ? authClient.getIdentity() : null;
      const dogvertiserActor = identity ? actorFromIdentity(identity) : null;

      this.isAuthenticated = isAuthenticated;
      this.identity = identity;
      this.dogvertiserActor = dogvertiserActor;
      this.isReady = true;
    },
    async login() {
      console.log("login")
      console.log(defaultOptions.loginOptions);
      let client = await AuthClient.create();
      const authClient = toRaw(client);
      authClient.login({
        ...defaultOptions.loginOptions,
        onSuccess: async () => {
          this.isAuthenticated = await authClient.isAuthenticated();
          this.identity = this.isAuthenticated
            ? authClient.getIdentity()
            : null;
          this.dogvertiserActor = this.identity
            ? actorFromIdentity(this.identity)
            : null;
        },
      });
    },
    async logout() {
      const authClient = toRaw(this.authClient);
      await authClient?.logout();
      this.isAuthenticated = false;
      this.identity = null;
      this.dogvertiserActor = null;
    },
  },
});