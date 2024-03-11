// auth.ts
import { defineStore } from "pinia";
import { AuthClient } from "@dfinity/auth-client";
import {
  createActor as createDogvertiserActor,
  canisterId as dogvertiserId,
} from "../declarations/dogvertiser";
import {
  createActor as createWindogeActor,
  canisterId as windgoeCanisterId,
} from "../declarations/windoge";
import { toRaw } from "vue";

let IICanister = process.env.CANISTER_ID_internet_identity;

const defaultOptions = {
  createOptions: {
    idleOptions: {
      // Set to true if you do not want idle functionality
    },
  },
  loginOptions: {
    identityProvider:
      process.env.DFX_NETWORK === "ic"
        ? "https://identity.ic0.app/#authorize"
        : `http://${IICanister}.localhost:8000`,
  },
};

function dogvertiserActorFromIdentity(identity) {
  return createDogvertiserActor(dogvertiserId, {
    agentOptions: {
      verifyQuerySignatures: false,
      identity,
    },
  });
}

function windogeActorFromIdentity(identity) {
  return createWindogeActor(windgoeCanisterId, {
    agentOptions: {
      verifyQuerySignatures: false,
      identity,
    },
  });
}

export const useAuthStore = defineStore("auth", {
  state() {
    return {
      isReady: false,
      isAuthenticated: null,
      identity: null,
      dogvertiserActor: null,
      windogeActor: null,
      authClient: null,
    };
  },
  actions: {
    async init() {
      const authClient = await AuthClient.create(defaultOptions.createOptions);
      this.authClient = authClient;
      const isAuthenticated = await authClient.isAuthenticated();
      const identity = isAuthenticated ? authClient.getIdentity() : null;
      const dogvertiserActor = dogvertiserActorFromIdentity(
        identity || undefined,
      );
      const windogeActor = windogeActorFromIdentity(identity || undefined);
      this.isAuthenticated = isAuthenticated;
      this.identity = identity;
      this.dogvertiserActor = dogvertiserActor;
      this.windogeActor = windogeActor;
      this.isReady = true;
    },
    async login() {
      let authClient = await AuthClient.create();
      // start the login process and wait for it to finish
      await new Promise((resolve) => {
        authClient.login({
          identityProvider:
            process.env.DFX_NETWORK === "ic"
              ? "https://identity.ic0.app/#authorize"
              : `http://${IICanister}.localhost:8000`,
          onSuccess: async () => {
            this.isAuthenticated = await authClient.isAuthenticated();
            this.identity = this.isAuthenticated
              ? authClient.getIdentity()
              : null;
            this.windogeActor = this.identity
              ? windogeActorFromIdentity(this.identity)
              : null;
            this.dogvertiserActor = this.identity
              ? dogvertiserActorFromIdentity(this.identity)
              : null;
            resolve;
          },
        });
      });
      this.authClient = toRaw(authClient);
    },
    async logout() {
      const authClient = toRaw(this.authClient);
      await authClient?.logout();
      this.isAuthenticated = false;
      this.identity = null;
      this.dogvertiserActor = null;
    },
  },
  actions: {
    async init() {
      const authClient = await AuthClient.create(defaultOptions.createOptions);
      this.authClient = authClient;
      const isAuthenticated = await authClient.isAuthenticated();
      const identity = isAuthenticated ? authClient.getIdentity() : null;
      const dogvertiserActor = dogvertiserActorFromIdentity(
        identity || undefined,
      );
      const windogeActor = windogeActorFromIdentity(identity || undefined);

      this.isAuthenticated = isAuthenticated;
      this.identity = identity;
      this.dogvertiserActor = dogvertiserActor;
      this.windogeActor = windogeActor;
      this.isReady = true;
    },
    async login() {
      let authClient = await AuthClient.create();

      // start the login process and wait for it to finish
      await new Promise((resolve) => {
        authClient.login({
          identityProvider:
            process.env.DFX_NETWORK === "ic"
              ? "https://identity.ic0.app/#authorize"
              : `http://${IICanister}.localhost:8000`,
          onSuccess: async () => {
            this.isAuthenticated = await authClient.isAuthenticated();
            this.identity = this.isAuthenticated
              ? authClient.getIdentity()
              : null;
            this.windogeActor = this.identity
              ? windogeActorFromIdentity(this.identity)
              : null;
            this.dogvertiserActor = this.identity
              ? dogvertiserActorFromIdentity(this.identity)
              : null;
            resolve;
          },
        });
      });
      this.authClient = toRaw(authClient);
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
