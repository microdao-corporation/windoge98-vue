// auth.ts
import { defineStore } from "pinia";
import {
  AuthClient,
  AuthClientCreateOptions,
  AuthClientLoginOptions,
} from "@dfinity/auth-client";
import { Identity } from "@dfinity/agent";
import { createActor as createDogvertiserActor, canisterId as dogvertiserId } from "../declarations/dogvertiser";
import {
  createActor as createWindogeActor,
  canisterId as windgoeCanisterId,
} from "../declarations/windoge";
import { toRaw } from "vue";

let IICanister = process.env.CANISTER_ID_internet_identity;
type Subaccount = Uint8Array | number[];

interface DogvertiserActor {
  whoami: () => Promise<string>;
  dogvertiserCanister: () => Promise<string>;
  whoamisub: () => Promise<Subaccount>;
}

interface WindogeActor { }

interface DefaultOptions {
  createOptions: AuthClientCreateOptions;
  loginOptions: AuthClientLoginOptions;
}

const defaultOptions: DefaultOptions = {
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

function dogvertiserActorFromIdentity(identity: Identity | Promise<Identity> | undefined) {
  return createDogvertiserActor(dogvertiserId, {
    agentOptions: {
      identity,
    },
  });
}

function windogeActorFromIdentity(
  identity: Identity | Promise<Identity> | undefined,
) {
  return createWindogeActor(windgoeCanisterId, {
    agentOptions: {
      verifyQuerySignatures: false,
      identity,
    },
  });
}

export const useAuthStore = defineStore("auth", {
  state: (): {
    isReady: boolean;
    isAuthenticated: boolean | null;
    identity: Identity | null;
    dogvertiserActor: DogvertiserActor | null;
    windogeActor: WindogeActor | null;
    authClient: AuthClient | null;
  } => {
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
      const dogvertiserActor = identity ? dogvertiserActorFromIdentity(identity) : null;
      const windogeActor = identity ? windogeActorFromIdentity(identity) : null;

      this.isAuthenticated = isAuthenticated;
      this.identity = identity;
      this.dogvertiserActor = dogvertiserActor as unknown as DogvertiserActor;
      this.windogeActor = windogeActor;
      this.isReady = true;
    },
    async login() {
      const authClient = await AuthClient.create(defaultOptions.createOptions);
      this.authClient = toRaw(authClient);

      authClient.login({
        ...defaultOptions.loginOptions,
        onSuccess: async () => {
          this.isAuthenticated = await authClient.isAuthenticated();
          this.identity = this.isAuthenticated
            ? authClient.getIdentity()
            : null;
          this.windogeActor = this.identity
            ? windogeActorFromIdentity(this.identity)
            : null;
          this.dogvertiserActor = this.identity
            ? (dogvertiserActorFromIdentity(this.identity) as unknown as DogvertiserActor)
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
