// auth.js
import { ref, provide, inject, onMounted } from 'vue';
import { AuthClient } from "@dfinity/auth-client";
import { createActor,canisterId } from "../declarations/dogvertiser";

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
      import.meta.env.DFX_NETWORK === "ic"
        ?
        "https://identity.ic0.app/#authorize":
        `http://127.0.0.1:8000?canisterId=${IICanister}#authorize`
       ,
  },
};



export function useAuthClient(options = defaultOptions) {
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
    console.log("in login")
    authClient.value.login({
      ...options.loginOptions,
      onSuccess: () => {
        console.log("suppp")
       //updateClient(authClient.value);
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


