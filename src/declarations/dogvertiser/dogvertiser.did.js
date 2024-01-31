export const idlFactory = ({ IDL }) => {
  const NewItemRequest = IDL.Record({
    'cost' : IDL.Nat,
    'name' : IDL.Text,
    'available' : IDL.Bool,
    'merchant' : IDL.Principal,
    'category' : IDL.Text,
  });
  const Result_3 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Profile = IDL.Record({
    'name' : IDL.Text,
    'description' : IDL.Text,
    'profilePicture' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const Result = IDL.Variant({ 'ok' : Profile, 'err' : IDL.Text });
  const Subaccount = IDL.Vec(IDL.Nat8);
  const Account = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(Subaccount),
  });
  const Invoice = IDL.Record({
    'to' : Account,
    'itemId' : IDL.Nat,
    'merchant' : IDL.Principal,
    'amount' : IDL.Nat,
  });
  const Result_2 = IDL.Variant({ 'ok' : Invoice, 'err' : IDL.Text });
  const Item = IDL.Record({
    'id' : IDL.Nat,
    'cost' : IDL.Nat,
    'name' : IDL.Text,
    'available' : IDL.Bool,
    'merchant' : IDL.Principal,
    'category' : IDL.Text,
    'wallet' : IDL.Opt(Subaccount),
  });
  const Result_1 = IDL.Variant({ 'ok' : Item, 'err' : IDL.Text });
  return IDL.Service({
    'addNewItem' : IDL.Func([NewItemRequest], [Result_3], []),
    'addNewProfile' : IDL.Func([Profile], [Result], []),
    'getInvoice' : IDL.Func([IDL.Nat], [Result_2], []),
    'getItem' : IDL.Func([IDL.Nat], [Result_1], []),
    'getProfile' : IDL.Func([IDL.Principal], [Result], []),
    'updateItem' : IDL.Func([IDL.Nat, Item], [Result_1], []),
    'updateProfile' : IDL.Func([Profile], [Result], []),
    'whoami' : IDL.Func([], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
