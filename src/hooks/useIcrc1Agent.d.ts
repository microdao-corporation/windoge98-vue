// useAgent.d.ts
export function useIcrc1Agent(canisterId: String): {
  data: any; // Replace 'any' with a more specific type
  error: any; // Replace 'any' with a more specific type
  fetchMaxSupply: () => Promise<void>;
  fetchIcrc1BalanceOf: (principal: String, token: String) => Promise<void>;
};g