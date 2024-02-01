import { ref, reactive } from "vue";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "./icrc1-idl.js";
import { Principal } from "@dfinity/principal";

export function useIcrc1Agent(canisterId) {
  const agent = new HttpAgent();
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
  const data = reactive({
    max_supply: null,
  });
  const error = ref("");

  async function fetchMaxSupply() {
    try {
      data.max_supply = await actor.icrc1_total_supply().then((res) => {
        return res.toString();
      });
    } catch (e) {
      error.value = e;
      console.error("Error fetching data:", e);
    }
  }

  async function fetchIcrc1BalanceOf(principal, key) {
    try {
      let res = await actor
        .icrc1_balance_of({
          owner: Principal.fromText(principal),
          subaccount: [],
        })
        .then((res) => {
          return res.toString();
        });
      data[key] = res;
    } catch (e) {
      error.value = e;
      console.error("Error fetching data:", e);
    }
  }

  return { data, error, fetchMaxSupply, fetchIcrc1BalanceOf };
}
