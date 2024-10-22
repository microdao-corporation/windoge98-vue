export const idlFactory = ({ IDL }) => {
  const TransferError = IDL.Variant({
    GenericError: IDL.Record({
      message: IDL.Text,
      error_code: IDL.Nat,
    }),
    TemporarilyUnavailable: IDL.Null,
    BadBurn: IDL.Record({ min_burn_amount: IDL.Nat }),
    Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
    BadFee: IDL.Record({ expected_fee: IDL.Nat }),
    CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
    TooOld: IDL.Null,
    InsufficientFunds: IDL.Record({ balance: IDL.Nat }),
  });
  const Result = IDL.Variant({ ok: IDL.Nat, err: TransferError });
  const NewAdRequest = IDL.Record({
    title: IDL.Text,
    link: IDL.Text,
    description: IDL.Opt(IDL.Text),
    image: IDL.Text,
  });
  const DappMetadata = IDL.Record({ name: IDL.Text, version: IDL.Text });
  const Time = IDL.Int;
  const Advertisement = IDL.Record({
    title: IDL.Text,
    total_burned: IDL.Nat,
    link: IDL.Text,
    description: IDL.Opt(IDL.Text),
    timestamp: Time,
    caller: IDL.Principal,
    image: IDL.Text,
    index: IDL.Nat,
  });
  const Subaccount = IDL.Vec(IDL.Nat8);
  const Account = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(Subaccount),
  });
  const Balance = IDL.Nat;
  const BurnRecord = IDL.Record({
    from: Account,
    ad_index: IDL.Nat,
    timestamp: Time,
    amount: Balance,
  });
  return IDL.Service({
    boost_ad: IDL.Func([IDL.Nat, IDL.Nat], [Result], []),
    create_advertisement: IDL.Func([NewAdRequest], [Result], []),
    dapp_metadata: IDL.Func([], [DappMetadata], ["query"]),
    exe_balance_of: IDL.Func([IDL.Text], [IDL.Nat], []),
    fetch_ads: IDL.Func([], [IDL.Vec(Advertisement)], ["query"]),
    fetch_burn_records: IDL.Func([], [IDL.Vec(BurnRecord)], ["query"]),
    fetch_user_ads: IDL.Func([], [IDL.Vec(Advertisement)], ["query"]),
    set_ad_creation_fee: IDL.Func([IDL.Nat], [], ["oneway"]),
    transfer_to_wallet: IDL.Func([], [Result], []),
    whoami: IDL.Func([], [IDL.Text], ["query"]),
    whoamisub: IDL.Func([], [Subaccount], ["query"]),
  });
};
export const init = ({ IDL }) => {
  return [];
};
