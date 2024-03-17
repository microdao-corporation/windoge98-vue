import Result "mo:base/Result";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Buffer "mo:base/Buffer";
import WT "./windoge";
import Order "mo:base/Order";
import Blob "mo:base/Blob";
import Array "mo:base/Array";
import Types "./types";
import { setTimer; recurringTimer } = "mo:base/Timer";
import { abs } = "mo:base/Int";
import {
  to_subaccount;
  hash_text;
  is_url;
} "utils";

actor Dogvertiser {

  type IC = actor {
    ecdsa_public_key : ({
      canister_id : ?Principal;
      derivation_path : [Blob];
      key_id : { curve : { #secp256k1 }; name : Text };
    }) -> async ({ public_key : Blob; chain_code : Blob });
    sign_with_ecdsa : ({
      message_hash : Blob;
      derivation_path : [Blob];
      key_id : { curve : { #secp256k1 }; name : Text };
    }) -> async ({ signature : Blob });
  };

  // Variables
  let Windoge : WT.Self = actor ("rh2pm-ryaaa-aaaan-qeniq-cai");
  let BURN_PRINCIPAL : Principal = Principal.fromText("xscoq-ggfay-isg3d-ivuvu-6qpnt-mvlt6-llf4q-ve6q7-3nht5-4ab7q-4qe");
  let ic : IC = actor ("aaaaa-aa");

  stable var _stable_ads : [(Text, Types.Advertisement)] = [];
  stable var _stable_burn_records : [Types.BurnRecord] = [];
  stable var _ad_creation_fee : Nat = 1_000_000_000;

  var advertisements = HashMap.fromIter<Text, Types.Advertisement>(Iter.fromArray(_stable_ads), _stable_ads.size(), Text.equal, hash_text);
  var burn_records = Buffer.Buffer<Types.BurnRecord>(0);

  // Public query functions
  public query func dapp_metadata() : async Types.DappMetadata {
    return {
      name = "Dogvertiser";
      version = "0.1.0";
      canisterId = Principal.fromActor(Dogvertiser);
    };
  };

  public query ({ caller }) func whoamisub() : async Types.Subaccount {
    return to_subaccount(caller);
  };

  public query ({ caller }) func whoami() : async Text {
    return Principal.toText(caller);
  };

  public shared query func fetch_burn_records() : async [Types.BurnRecord] {
    return Buffer.toArray(burn_records);
  };

  public shared query func ad_creation_fee() : async Nat {
    return _ad_creation_fee;
  };

  public shared query func fetch_total_burned() : async Nat {
    let heap_array = Buffer.toArray(burn_records);
    let join : [Types.BurnRecord] = Array.append(_stable_burn_records, heap_array);
    var totalBurned : Nat = 0;
    for (record in Iter.fromArray(join)) {
      totalBurned := totalBurned + record.amount;
    };
    return totalBurned;
  };

  public shared query func fetch_ads() : async [Types.Advertisement] {
    // Convert the Buffer to an Array
    let entries_array = Iter.toArray<(Text, Types.Advertisement)>(advertisements.entries());
    let res = Array.map<(Text, Types.Advertisement), Types.Advertisement>(
      entries_array,
      func(ad : (Text, Types.Advertisement)) : Types.Advertisement {
        ad.1;
      },
    );
    return Array.sort<Types.Advertisement>(
      res,
      func(a, b) : Order.Order {
        if (a.total_burned > b.total_burned) {
          return #less;
        } else {
          return #greater;
        };
      },
    );
  };

  public shared query ({ caller }) func fetch_user_ads() : async [Types.Advertisement] {
    let entries_array = Iter.toArray<(Text, Types.Advertisement)>(advertisements.entries());
    let user_ads : [(Text, Types.Advertisement)] = Array.filter<(Text, Types.Advertisement)>(
      entries_array,
      func(ad : (Text, Types.Advertisement)) : Bool {
        ad.1.caller == caller;
      },
    );
    return Array.map<(Text, Types.Advertisement), Types.Advertisement>(
      user_ads,
      func(ad : (Text, Types.Advertisement)) : Types.Advertisement {
        ad.1;
      },
    );
  };

  // Public functions
  public shared func exe_balance_of(principal : Text) : async Nat {
    return await Windoge.icrc1_balance_of({
      owner = Principal.fromActor(Dogvertiser);
      subaccount = ?Blob.fromArray(to_subaccount(Principal.fromText(principal)));
    });
  };

  public shared ({ caller }) func transfer_to_wallet() : async Result.Result<Nat, Types.TransferError> {
    let amount = await Windoge.icrc1_balance_of({
      owner = Principal.fromActor(Dogvertiser);
      subaccount = ?Blob.fromArray(to_subaccount(caller));
    });

    let fee = await Windoge.icrc1_fee();
    let request : WT.TransferArgs = {
      amount = amount - fee;
      fee = null;
      memo = null;
      from_subaccount = ?Blob.fromArray(to_subaccount(caller));
      to = { owner = caller; subaccount = null };
      created_at_time = null;
    };
    let response : Types.TransferResult = await Windoge.icrc1_transfer(request);
    switch (response) {
      case (#Ok(msg)) {
        return #ok(msg);
      };
      case (#Err(msg)) {
        return #err(msg);
      };
    };
  };

  public shared ({ caller }) func boost_ad(index : Nat, amount : Nat) : async Result.Result<Nat, Types.TransferError> {
    switch (advertisements.get(Nat.toText(index))) {
      case (?advertisement) {
        let request : WT.TransferArgs = {
          amount = amount;
          fee = null;
          memo = null;
          from_subaccount = ?Blob.fromArray(to_subaccount(caller));
          to = {
            owner = BURN_PRINCIPAL;
            subaccount = null;
          };
          created_at_time = null;
        };
        let response : Types.TransferResult = await Windoge.icrc1_transfer(request);
        let new_burnt = advertisement.total_burned + amount;

        switch (response) {
          case (#Ok(msg)) {
            let burnRecord : Types.BurnRecord = {
              ad_index = index;
              amount = amount;
              from = { owner = caller; subaccount = null };
              timestamp = Time.now();
            };
            burn_records.add(burnRecord);
            // Update the total_burned in the buffer
            let updated_message = {
              index = advertisement.index;
              title = advertisement.title;
              link = advertisement.link;
              image = advertisement.image;
              caller = advertisement.caller;
              total_burned = new_burnt;
              timestamp = advertisement.timestamp;
              description = advertisement.description;
            };
            advertisements.put(Nat.toText(index), updated_message);
            return #ok(msg);
          };
          case (#Err(msg)) {
            return #err(msg);
          };
        };
      };
      case null {
        let error_msg : Types.TransferError = #GenericError {
          message = "Ad Not found";
          error_code = 1;
        };
        #err error_msg;
      };
    };

  };

  public shared ({ caller }) func create_advertisement(ad : Types.NewAdRequest) : async Result.Result<Nat, Types.TransferError> {
    switch (validate_advertisement(ad)) {
      case (#err(msg)) {
        let error_msg : Types.TransferError = #GenericError {
          message = msg;
          error_code = 1;
        };
        return #err error_msg;
      };
      case (#ok(_)) {
        let request : WT.TransferArgs = {
          amount = _ad_creation_fee;
          burn = null;
          fee = null;
          memo = null;
          from_subaccount = ?Blob.fromArray(to_subaccount(caller));
          to = {
            owner = BURN_PRINCIPAL;
            subaccount = null;
          };
          created_at_time = null;
        };

        let response : Types.TransferResult = await Windoge.icrc1_transfer(request);
        switch (response) {
          case (#Ok(msg)) {
            let burnRecord : Types.BurnRecord = {
              ad_index = advertisements.size();
              amount = _ad_creation_fee;
              from = { owner = caller; subaccount = null };
              timestamp = Time.now();
            };
            burn_records.add(burnRecord);
            let new_id = advertisements.size();
            let new_ad : Types.Advertisement = {
              index = new_id;
              link = ad.link;
              image = ad.image;
              caller = caller;
              total_burned = _ad_creation_fee;
              timestamp = Time.now();
              title = ad.title;
              description = ad.description;
            };
            advertisements.put(Nat.toText(new_id), new_ad);
            return #ok(msg);

          };
          case (#Err(msg)) {
            return #err(msg);
          };
        };
      };
    };
  };

  public shared (msg) func set_ad_creation_fee(fee : Nat) : async Result.Result<Nat, Text> {
    if (Principal.fromText("7ohni-sbpse-y327l-syhzk-jn6n4-hw277-erei5-xhkjr-lbh6b-rjqei-sqe") != msg.caller) {
      return #err("Unauthorized");
    };
    _ad_creation_fee := fee;
    #ok(fee);
  };

  public query func fetch_stable_ads() : async [(Text, Types.Advertisement)] {
    return _stable_ads;
  };

  public query func fetch_heap_ads() : async [(Text, Types.Advertisement)] {
    return Iter.toArray(advertisements.entries());
  };

  // Private functions
  private func validate_advertisement(ad : Types.NewAdRequest) : Result.Result<Bool, Text> {
    let url_validation = is_url(ad.link);
    switch (url_validation) {
      case (true) {
        return #ok(true);
      };
      case (false) {
        return #err("Invalid URL");
      };
    };
  };

  // Upgrade canister
  system func preupgrade() {
    // Serialize your data structures and store them in stable variables
    // Assuming _stable_ads and _stable_burn_records are declared as stable variables
    _stable_ads := Array.append(_stable_ads, Iter.toArray(advertisements.entries()));
    _stable_burn_records := Array.append(_stable_burn_records, Buffer.toArray(burn_records));
  };

  system func postupgrade() {
    // Reinitialize `advertisements` as empty
    advertisements := HashMap.fromIter<Text, Types.Advertisement>(Iter.fromArray(_stable_ads), 0, Text.equal, hash_text);
    // Reinitialize emmpty buffer
    burn_records := Buffer.fromArray(_stable_burn_records);
  };

};
