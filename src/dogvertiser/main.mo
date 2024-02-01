import Result "mo:base/Result";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Principal "mo:base/Principal";
import Error "mo:base/Error";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Prelude "mo:base/Prelude";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";




//gives error in vscode but should still work

import Types "./types";
import { 
  toAccount; 
  toSubaccount;
  hashNat; 
  hashText;
} "utils";

import Blob "mo:base/Blob";


actor Dogvertiser {

 



  type IC = actor {
    ecdsa_public_key : ({
      canister_id : ?Principal;
      derivation_path : [Blob];
      key_id : { curve: { #secp256k1; } ; name: Text };
    }) -> async ({ public_key : Blob; chain_code : Blob; });
    sign_with_ecdsa : ({
      message_hash : Blob;
      derivation_path : [Blob];
      key_id : { curve: { #secp256k1; } ; name: Text };
    }) -> async ({ signature : Blob });
  };

  let ic : IC = actor("aaaaa-aa");


  stable var stableAds : [(Text, Types.Advertisement)] = [];



  let adsStore = HashMap.fromIter<Text, Types.Advertisement>(Iter.fromArray(stableAds), stableAds.size(), Text.equal, hashText);


  // Upgrade canister
  system func preupgrade() {
    stableAds := Iter.toArray(adsStore.entries());
  };

  system func postupgrade() {
    stableAds := [];
  };






  public shared (msg) func whoami():async Text{
      return Principal.toText(msg.caller);
  };

  

 



//PAYMENTS LOGIC
  //ckBTC icrc services
  // icrc1_name : () -> (text) query;
  // icrc1_symbol : () -> (text) query;
  // icrc1_decimals : () -> (nat8) query;
  // icrc1_metadata : () -> (vec record { text; MetadataValue }) query;
  // icrc1_total_supply : () -> (Tokens) query;
  // icrc1_fee : () -> (Tokens) query;
  // icrc1_minting_account : () -> (opt Account) query;
  // icrc1_balance_of : (Account) -> (Tokens) query;
  // icrc1_transfer : (TransferArg) -> (TransferResult);
  // icrc1_supported_standards : () -> (vec record { name : text; url : text }) query;
  // get_transactions : (GetTransactionsRequest) -> (GetTransactionsResponse) query;
  // get_blocks : (GetBlocksArgs) -> (GetBlocksResponse) query;  
  // get_data_certificate : () -> (DataCertificate) query;   








};
