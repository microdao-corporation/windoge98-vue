import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Account {
  'owner' : Principal,
  'subaccount' : [] | [Subaccount],
}
export interface Advertisement {
  'title' : string,
  'total_burned' : bigint,
  'link' : string,
  'description' : [] | [string],
  'timestamp' : Time,
  'caller' : Principal,
  'image' : string,
  'index' : bigint,
}
export type Balance = bigint;
export interface BurnRecord {
  'from' : Account,
  'ad_index' : bigint,
  'timestamp' : Time,
  'amount' : Balance,
}
export interface DappMetadata {
  'name' : string,
  'version' : string,
  'canisterId' : Principal,
}
export interface NewAdRequest {
  'title' : string,
  'link' : string,
  'description' : [] | [string],
  'image' : string,
}
export type Result = { 'ok' : bigint } |
  { 'err' : TransferError };
export type Subaccount = Uint8Array | number[];
export type Time = bigint;
export type TransferError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'BadBurn' : { 'min_burn_amount' : bigint } } |
  { 'Duplicate' : { 'duplicate_of' : bigint } } |
  { 'BadFee' : { 'expected_fee' : bigint } } |
  { 'CreatedInFuture' : { 'ledger_time' : bigint } } |
  { 'TooOld' : null } |
  { 'InsufficientFunds' : { 'balance' : bigint } };
export interface _SERVICE {
  'ad_creation_fee' : ActorMethod<[], bigint>,
  'boost_ad' : ActorMethod<[bigint, bigint], Result>,
  'create_advertisement' : ActorMethod<[NewAdRequest], Result>,
  'dapp_metadata' : ActorMethod<[], DappMetadata>,
  'exe_balance_of' : ActorMethod<[string], bigint>,
  'fetch_ads' : ActorMethod<[], Array<Advertisement>>,
  'fetch_ads_by_total_burned' : ActorMethod<[], Array<Advertisement>>,
  'fetch_burn_records' : ActorMethod<[], Array<BurnRecord>>,
  'fetch_total_burned' : ActorMethod<[], bigint>,
  'fetch_user_ads' : ActorMethod<[], Array<Advertisement>>,
  'set_ad_creation_fee' : ActorMethod<[bigint], undefined>,
  'transfer_to_wallet' : ActorMethod<[], Result>,
  'whoami' : ActorMethod<[], string>,
  'whoamisub' : ActorMethod<[], Subaccount>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: ({ IDL }: { IDL: IDL }) => IDL.Type[];
