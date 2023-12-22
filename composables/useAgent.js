import { ref } from "vue";
import { Actor, HttpAgent } from "@dfinity/agent";
import idlFactory from "../src/icrc1-idl.js";

export function useDfinityAgent(canisterId) {
  const agent = new HttpAgent({ host: "https://localhost:8000" });
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
  const data = ref(null);
  const error = ref(null);

  async function fetchData() {
    try {
      data.value = await actor.yourCanisterMethod();
    } catch (e) {
      error.value = e;
      console.error("Error fetching data:", e);
    }
  }

  // Fetch the root key for local/development environments
  if (process.env.NODE_ENV !== "production") {
    agent.fetchRootKey().catch((e) => {
      console.error("Error fetching root key:", e);
    });
  }

  return { data, error, fetchData };
}
