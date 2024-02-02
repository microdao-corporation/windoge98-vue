// auth.js
import { ref, provide, inject, onMounted } from 'vue';
import { AuthClient } from "@dfinity/auth-client";
import { createActor } from "../declarations/dogvertiser";

const authSymbol = Symbol();

export function useAuthClient(options = {}) {
  const isAuthenticated = ref(false);
  const authClient = ref(null);
  const identity = ref(null);
  const principal = ref(null);
  const backendActor = ref(null);

  onMounted(() => {
    AuthClient.create(options.createOptions).then(async (client) => {
      updateClient(client);
    });
  });

  const login = () => {
    authClient.value.login({
      ...options.loginOptions,
      onSuccess: () => {
        updateClient(authClient.value);
      },
    });
  };

  async function updateClient(client) {
    const isAuthenticatedValue = await client.isAuthenticated();
    isAuthenticated.value = isAuthenticatedValue;

    const clientIdentity = client.getIdentity();
    identity.value = clientIdentity;

    const clientPrincipal = clientIdentity.getPrincipal();
    principal.value = clientPrincipal;

    authClient.value = client;

    const actor = createActor(canisterId, {
      agentOptions: {
        identity: clientIdentity,
      },
    });
    backendActor.value = actor;
  }

  async function logout() {
    await authClient.value?.logout();
    await updateClient(authClient.value);
  }

  provide(authSymbol, {
    isAuthenticated,
    login,
    logout,
    authClient,
    identity,
    principal,
    backendActor
  });

  return {
    isAuthenticated,
    login,
    logout,
    authClient,
    identity,
    principal,
    backendActor
  };
}

export function useAuth() {
  const auth = inject(authSymbol);
  if (!auth) {
    throw new Error('useAuth must be used within a Vue component wrapped in the AuthProvider.');
  }
  return auth;
}
