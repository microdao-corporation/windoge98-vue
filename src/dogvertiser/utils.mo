import Types "./types";
import Blob "mo:base/Blob";
import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Nat8 "mo:base/Nat8";
import Hash "mo:base/Hash";
import Text "mo:base/Text";
import Nat "mo:base/Nat";

module {
  public func hash_nat(id : Nat) : Hash.Hash {
    Text.hash(Nat.toText(id));
  };

  public func hash_text(text : Text) : Hash.Hash {
    Text.hash(text);
  };

  /// Convert Principal to ICRC1.Subaccount
  // from https://github.com/research-ag/motoko-lib/blob/2772d029c1c5087c2f57b022c84882f2ac16b79d/src/TokenHandler.mo#L51
  public func to_subaccount(p : Principal) : Types.Subaccount {
    // p blob size can vary, but 29 bytes as most. We preserve it'subaccount size in result blob
    // and it'subaccount data itself so it can be deserialized back to p
    let bytes = Blob.toArray(Principal.toBlob(p));
    let size = bytes.size();

    assert size <= 29;

    let a = Array.tabulate<Nat8>(
      32,
      func(i : Nat) : Nat8 {
        if (i + size < 31) {
          0;
        } else if (i + size == 31) {
          Nat8.fromNat(size);
        } else {
          bytes[i + size - 32];
        };
      },
    );
    return a;
  };

  public func to_account(caller : Principal) : Types.Account {
    {
      owner = caller;
      subaccount = ?to_subaccount(caller);
    };
  };

  public func is_url(text : Text) : Bool {
    // Basic checks for http:// or https:// schemes
    let httpPrefix = "http://";
    let httpsPrefix = "https://";

    // Check if the text starts with http:// or https://
    if (Text.startsWith(text, #text httpPrefix) or Text.startsWith(text, #text httpsPrefix)) {
      // Perform additional basic checks, e.g., contains a dot indicating a domain part
      // This is a very naive check and might not cover all valid URLs or exclude all invalid ones
      if (Text.contains(text, #text ".")) {
        return true;
      };
    };
    return false;
  };
};
