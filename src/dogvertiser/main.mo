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


import Windoge "canister:windoge";

//gives error in vscode but should still work

import Types "./types";
import { 
  toAccount; 
  toSubaccount;
  hashNat; 
  hashText;
} "utils";

import Blob "mo:base/Blob";
import Array "mo:base/Array";
import Nat8 "mo:base/Nat8";


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



  let advertisements = HashMap.fromIter<Text, Types.Advertisement>(Iter.fromArray(stableAds), stableAds.size(), Text.equal, hashText);


  // Upgrade canister
  system func preupgrade() {
    stableAds := Iter.toArray(advertisements.entries());
  };

  system func postupgrade() {
    stableAds := [];
  };

public query ({ caller }) func whoami() : async Text{
    return Principal.toText(caller);
};

public shared({caller}) func boost_ad(index: Nat, amount: Nat): async Result.Result<Nat,Types.TransferError> {
        switch (advertisements.get(Nat.toText(index))) {
            case (?advertisement) {
                let request = {
                    amount = amount;
                    fee = ?1;
                    memo = null;
                    from_subaccount = null;
                    to = toAccount(Principal.fromText("aaaaa-aa"));
                    created_at_time = null;
                };
                let response:Types.TransferResult = await Windoge.icrc1_transfer(request);
                let newBurnt = advertisement.total_burned+amount;

                switch(response) {
                  case(#Ok(msg)) {
                    // Update the total_burned in the buffer
                   let updatedMessage = {
                      index=advertisement.index;
                      title=advertisement.title;
                      image=advertisement.image;
                      caller=advertisement.caller;
                      total_burned=newBurnt;
                      timestamp=advertisement.timestamp
                    };
                    advertisements.put(Nat.toText(index), updatedMessage);
                    return #ok(msg);
                  };
                  case(#Err(msg)) {
                    return #err(msg);
                  };
                };
            };
               case null { 
                let errorMessage:Types.TransferError = #GenericError{message="Ad Not found";error_code=1;};
                #err errorMessage
              };

        };
    };


public shared (msg) func newAddRequest(ad : Types.NewAdRequest) : async Result.Result<Nat, Text> {
  
    let newid = advertisements.size();
    let newAd : Types.Advertisement = {
      index = newid;
      image = ad.image;
      caller = msg.caller;
      total_burned = 0;
      timestamp= ad.timestamp;
      title=ad.title;
    };
    switch (advertisements.put(Nat.toText(newid), newAd)) {
      case (added) {
        return #ok(newid)
      }
    };
    return #err("Couldn't add the advertisement")
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
