module {
  public type Account = { owner : Principal; subaccount : ?Subaccount };
  public type Account__1 = { owner : Principal; subaccount : ?Subaccount };
  public type AdvancedSettings = {
    permitted_drift : Timestamp;
    burned_tokens : Balance;
    transaction_window : Timestamp;
  };
  public type ArchiveInterface = actor {
    append_transactions : shared [Transaction] -> async Result;
    get_first_tx : shared query () -> async Nat;
    get_last_tx : shared query () -> async Nat;
    get_next_archive : shared query () -> async ArchiveInterface__1;
    get_prev_archive : shared query () -> async ArchiveInterface__1;
    get_transaction : shared query TxIndex -> async ?Transaction;
    get_transactions : shared query GetTransactionsRequest__1 -> async TransactionRange;
    max_memory : shared query () -> async Nat;
    remaining_capacity : shared query () -> async Nat;
    set_first_tx : shared Nat -> async Result;
    set_last_tx : shared Nat -> async Result;
    set_next_archive : shared ArchiveInterface__1 -> async Result;
    set_prev_archive : shared ArchiveInterface__1 -> async Result;
    total_transactions : shared query () -> async Nat;
    total_used : shared query () -> async Nat;
  };
  public type ArchiveInterface__1 = actor {
    append_transactions : shared [Transaction] -> async Result;
    get_first_tx : shared query () -> async Nat;
    get_last_tx : shared query () -> async Nat;
    get_next_archive : shared query () -> async ArchiveInterface__1;
    get_prev_archive : shared query () -> async ArchiveInterface__1;
    get_transaction : shared query TxIndex -> async ?Transaction;
    get_transactions : shared query GetTransactionsRequest__1 -> async TransactionRange;
    max_memory : shared query () -> async Nat;
    remaining_capacity : shared query () -> async Nat;
    set_first_tx : shared Nat -> async Result;
    set_last_tx : shared Nat -> async Result;
    set_next_archive : shared ArchiveInterface__1 -> async Result;
    set_prev_archive : shared ArchiveInterface__1 -> async Result;
    total_transactions : shared query () -> async Nat;
    total_used : shared query () -> async Nat;
  };
  public type ArchivedTransaction = {
    callback : QueryArchiveFn;
    start : TxIndex;
    length : Nat;
  };
  public type Balance = Nat;
  public type Balance__1 = Nat;
  public type Burn = {
    from : Account;
    memo : ?Blob;
    created_at_time : ?Nat64;
    amount : Balance;
  };
  public type BurnArgs = {
    memo : ?Blob;
    from_subaccount : ?Subaccount;
    created_at_time : ?Nat64;
    amount : Balance;
  };
  public type GetTransactionsRequest = { start : TxIndex; length : Nat };
  public type GetTransactionsRequest__1 = { start : TxIndex; length : Nat };
  public type GetTransactionsResponse = {
    first_index : TxIndex;
    log_length : Nat;
    transactions : [Transaction];
    archived_transactions : [ArchivedTransaction];
  };
  public type MetaDatum = (Text, Value);
  public type Mint = {
    to : Account;
    memo : ?Blob;
    created_at_time : ?Nat64;
    amount : Balance;
  };
  public type Mint__1 = {
    to : Account;
    memo : ?Blob;
    created_at_time : ?Nat64;
    amount : Balance;
  };
  public type QueryArchiveFn = shared query GetTransactionsRequest__1 -> async TransactionRange;
  public type Result = { #ok; #err : Text };
  public type SetAccountParameterResult = {
    #Ok : Account;
    #Err : SetParameterError;
  };
  public type SetBalanceParameterResult = {
    #Ok : Balance;
    #Err : SetParameterError;
  };
  public type SetNat8ParameterResult = { #Ok : Nat8; #Err : SetParameterError };
  public type SetParameterError = {
    #GenericError : { message : Text; error_code : Nat };
  };
  public type SetTextParameterResult = { #Ok : Text; #Err : SetParameterError };
  public type Subaccount = Blob;
  public type SupportedStandard = { url : Text; name : Text };
  public type Timestamp = Nat64;
  public type TokenInitArgs = {
    fee : Balance;
    advanced_settings : ?AdvancedSettings;
    decimals : Nat8;
    minting_account : ?Account;
    logo : Text;
    name : Text;
    initial_balances : [(Account, Balance)];
    min_burn_amount : Balance;
    max_supply : Balance;
    symbol : Text;
  };
  public type Transaction = {
    burn : ?Burn;
    kind : Text;
    mint : ?Mint__1;
    timestamp : Timestamp;
    index : TxIndex;
    transfer : ?Transfer;
  };
  public type TransactionRange = { transactions : [Transaction] };
  public type Transaction__1 = {
    burn : ?Burn;
    kind : Text;
    mint : ?Mint__1;
    timestamp : Timestamp;
    index : TxIndex;
    transfer : ?Transfer;
  };
  public type Transfer = {
    to : Account;
    fee : ?Balance;
    from : Account;
    memo : ?Blob;
    created_at_time : ?Nat64;
    amount : Balance;
  };
  public type TransferArgs = {
    to : Account;
    fee : ?Balance;
    memo : ?Blob;
    from_subaccount : ?Subaccount;
    created_at_time : ?Nat64;
    amount : Balance;
  };
  public type TransferError = {
    #GenericError : { message : Text; error_code : Nat };
    #TemporarilyUnavailable;
    #BadBurn : { min_burn_amount : Balance };
    #Duplicate : { duplicate_of : TxIndex };
    #BadFee : { expected_fee : Balance };
    #CreatedInFuture : { ledger_time : Timestamp };
    #TooOld;
    #InsufficientFunds : { balance : Balance };
  };
  public type TransferResult = { #Ok : TxIndex; #Err : TransferError };
  public type TxIndex = Nat;
  public type TxIndex__1 = Nat;
  public type Value = { #Int : Int; #Nat : Nat; #Blob : Blob; #Text : Text };
  public type Self = actor {
    burn : shared BurnArgs -> async TransferResult;
    deposit_cycles : shared () -> async ();
    get_archive : shared query () -> async ArchiveInterface;
    get_archive_stored_txs : shared query () -> async Nat;
    get_total_tx : shared query () -> async Nat;
    get_transaction : shared TxIndex__1 -> async ?Transaction__1;
    get_transactions : shared query GetTransactionsRequest -> async GetTransactionsResponse;
    icrc1_balance_of : shared query Account__1 -> async Balance__1;
    icrc1_decimals : shared query () -> async Nat8;
    icrc1_fee : shared query () -> async Balance__1;
    icrc1_metadata : shared query () -> async [MetaDatum];
    icrc1_minting_account : shared query () -> async ?Account__1;
    icrc1_name : shared query () -> async Text;
    icrc1_supported_standards : shared query () -> async [SupportedStandard];
    icrc1_symbol : shared query () -> async Text;
    icrc1_total_supply : shared query () -> async Balance__1;
    icrc1_transfer : shared TransferArgs -> async TransferResult;
    min_burn_amount : shared query () -> async Balance__1;
    mint : shared Mint -> async TransferResult;
    set_decimals : shared Nat8 -> async SetNat8ParameterResult;
    set_fee : shared Balance__1 -> async SetBalanceParameterResult;
    set_logo : shared Text -> async SetTextParameterResult;
    set_min_burn_amount : shared Balance__1 -> async SetBalanceParameterResult;
    set_minting_account : shared Text -> async SetAccountParameterResult;
    set_name : shared Text -> async SetTextParameterResult;
    set_symbol : shared Text -> async SetTextParameterResult;
  };
};
