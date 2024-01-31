import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Time "mo:base/Time";

module {



  public type Subaccount = Blob;
  public type Account = {
    owner : Principal;
    subaccount : ?Subaccount;
  };



public type Advertisement = {
        index : Nat;
        title : Text;
        image : Blob;
        caller : Principal;
        total_burned : Nat;
        timestamp : Time.Time;
    };



};