export const idlFactory = ({ IDL }) => {
  const TransferError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'BadBurn' : IDL.Record({ 'min_burn_amount' : IDL.Nat }),
    'Duplicate' : IDL.Record({ 'duplicate_of' : IDL.Nat }),
    'BadFee' : IDL.Record({ 'expected_fee' : IDL.Nat }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : IDL.Nat64 }),
    'TooOld' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : IDL.Nat }),
  });
  const Result = IDL.Variant({ 'ok' : IDL.Nat, 'err' : TransferError });
  const Time = IDL.Int;
  const Advertisement = IDL.Record({
    'title' : IDL.Text,
    'total_burned' : IDL.Nat,
    'timestamp' : Time,
    'caller' : IDL.Principal,
    'image' : IDL.Vec(IDL.Nat8),
    'index' : IDL.Nat,
  });
  const NewAdRequest = IDL.Record({
    'title' : IDL.Text,
    'timestamp' : Time,
    'image' : IDL.Vec(IDL.Nat8),
  });
  const Subaccount = IDL.Vec(IDL.Nat8);
  return IDL.Service({
    'boost_ad' : IDL.Func([IDL.Nat, IDL.Nat], [Result], []),
    'dogvertiserCanister' : IDL.Func([], [IDL.Text], ['query']),
    'getAllads' : IDL.Func([], [IDL.Vec(Advertisement)], ['query']),
    'getBalance' : IDL.Func([], [IDL.Nat], []),
    'newAdRequest' : IDL.Func([NewAdRequest], [Result], []),
    'setCreationFee' : IDL.Func([IDL.Nat], [], ['oneway']),
    'whoami' : IDL.Func([], [IDL.Text], ['query']),
    'whoamisub' : IDL.Func([], [Subaccount], ['query']),
    'withdraw' : IDL.Func([], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
