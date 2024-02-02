import { ref, reactive } from "vue";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "./clippy-idl.js";

export function useClippyAgent() {
  const agent = new HttpAgent({ host: "http://localhost:8000" });
  agent.fetchRootKey().catch((e) => {
    console.error("Unable to fetch root key:", e);
  });
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId: "bkyz2-fmaaa-aaaaa-qaaaq-cai",
  });
  const data = ref({
    texts: null,
  });
  const error = ref("");

  function bigintReplacer(key, value) {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  }
  
  async function getAllSubmissions() {
    try {
      const res = await actor.getAllSubmissions();
      console.log("Clippy res", res);
      // Use the replacer function for handling BigInt
      const resWithBigIntHandled = JSON.parse(JSON.stringify(res, bigintReplacer));
      data.value.texts = resWithBigIntHandled;
      console.log("Clippy data", data.value.texts);
    } catch (e) {
      error.value = e;
      console.error("Error fetching data:", e);
    }
  }
  
  return { data, error, getAllSubmissions };
}
