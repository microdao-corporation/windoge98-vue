export const idlFactory = ({ IDL }) => {
  const Timestamp = IDL.Nat64;
  const TextSubmission = IDL.Record({
    id: IDL.Nat,
    principal: IDL.Principal,
    text: IDL.Text,
    timestamp: Timestamp,
  });
  const Result = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  return IDL.Service({
    checkCyclesBalance: IDL.Func([], [IDL.Nat], ["query"]),
    checkStableMemorySize: IDL.Func([], [IDL.Nat64], ["query"]),
    commitBuffer: IDL.Func([], [], []),
    deposit_cycles: IDL.Func([], [], []),
    getAllSubmissions: IDL.Func([], [IDL.Vec(TextSubmission)], ["query"]),
    submit_text: IDL.Func([IDL.Text, IDL.Nat], [Result], []),
  });
};
export const init = ({ IDL }) => {
  return [];
};
