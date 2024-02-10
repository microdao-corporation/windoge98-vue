import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Advertisement {
  'title' : string,
  'total_burned' : bigint,
  'timestamp' : Time,
  'caller' : Principal,
  'image' : Uint8Array | number[],
  'index' : bigint,
}
export interface NewAdRequest {
  'title' : string,
  'timestamp' : Time,
  'image' : Uint8Array | number[],
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
  'boost_ad' : ActorMethod<[bigint, bigint], Result>,
  'dogvertiserCanister' : ActorMethod<[], string>,
  'getAllads' : ActorMethod<[], Array<Advertisement>>,
  'getBalance' : ActorMethod<[], bigint>,
  'newAdRequest' : ActorMethod<[NewAdRequest], Result>,
  'setCreationFee' : ActorMethod<[bigint], undefined>,
  'whoami' : ActorMethod<[], string>,
  'whoamisub' : ActorMethod<[], Subaccount>,
  'withdraw' : ActorMethod<[], Result>,
}
