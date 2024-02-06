// auth.ts
import { defineStore } from 'pinia';
import { AuthClient, AuthClientCreateOptions, AuthClientLoginOptions } from '@dfinity/auth-client';
import { Identity } from '@dfinity/agent';
import { createActor, canisterId } from '../declarations/dogvertiser';
import { toRaw } from 'vue';

let IICanister = process.env.CANISTER_ID_internet_identity;

interface DogvertiserActor {
  whoami: () => Promise<string>;
}

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
    identityProvider: import.meta.env.DFX_NETWORK === 'ic'
      ? 'https://identity.ic0.app/#authorize'
      : `http://${IICanister}.localhost:8000`,
  },
};

function actorFromIdentity(identity: Identity | Promise<Identity> | undefined) {
  return createActor(canisterId, {
    agentOptions: {
      identity,
    },
  });
}

export const useAuthStore = defineStore('auth', {
  state: (): {
    isReady: boolean;
    isAuthenticated: boolean | null;
    identity: Identity | null;
    dogvertiserActor: DogvertiserActor | null;
    authClient: AuthClient | null;
  } => {
    return {
      isReady: false,
      isAuthenticated: null,
      identity: null,
      dogvertiserActor: null,
      authClient: null,
    };
  },
  actions: {
    async init() {
      const authClient = await AuthClient.create(defaultOptions.createOptions);
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
      const authClient = await AuthClient.create(defaultOptions.createOptions);
      this.authClient = toRaw(authClient);

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
