import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Time "mo:base/Time";
import Nat64 "mo:base/Nat64";
import Nat8 "mo:base/Nat8";
import WT "./windoge"

module {

  public type BlockIndex = Nat;
  public type Tokens = Nat;
  public type TxIndex = Nat;
  public type Subaccount = [Nat8];
  public type TimeStamp = Nat64;
  public type Time = Time.Time;

  public type Account = {
    owner : Principal;
    subaccount : ?Subaccount;
  };

  public type TransferError = {
    #GenericError : { message : Text; error_code : Nat };
    #TemporarilyUnavailable;
    #BadBurn : { min_burn_amount : Nat };
    #Duplicate : { duplicate_of : Nat };
    #BadFee : { expected_fee : Nat };
    #CreatedInFuture : { ledger_time : Nat64 };
    #TooOld;
    #InsufficientFunds : { balance : Nat };
  };

  public type TransferArg = {
    to : Account;
    fee : ?WT.Balance;
    memo : ?[Nat8];
    from_subaccount : ?Subaccount;
    created_at_time : ?TimeStamp;
    amount : WT.Balance;
  };

  public type Advertisement = {
    index : Nat;
    title : Text;
    link : Text;
    image : Text;
    caller : Principal;
    total_burned : Nat;
    timestamp : Time.Time;
    description : ?Text;
  };

  public type NewAdRequest = {
    title : Text;
    image : Text;
    link : Text;
    description : ?Text;
  };

  public type TransferResult = {
    #Ok : BlockIndex;
    #Err : TransferError;
  };

  public type DappMetadata = {
    name : Text;
    version : Text;
    canisterId : Principal;
  };

  public type BurnRecord = {
    ad_index : Nat;
    from : Account;
    amount : WT.Balance;
    timestamp : Time.Time;
  };

};
