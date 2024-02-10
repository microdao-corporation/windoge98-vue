  dfx deploy windoge --argument "(variant {Init = 
  record {
       token_symbol = \"gdf\";
       token_name = \"ghjhghj\";
       minting_account = record { owner = principal \"7ohni-sbpse-y327l-syhzk-jn6n4-hw277-erei5-xhkjr-lbh6b-rjqei-sqe\" };
       transfer_fee = 10_000;
       metadata = vec {};
       feature_flags = opt record{icrc2 = true};
       initial_balances = vec { record { record { owner = principal \"7ohni-sbpse-y327l-syhzk-jn6n4-hw277-erei5-xhkjr-lbh6b-rjqei-sqe\"; }; 100_000_000_000; }; };
       archive_options = record {
           num_blocks_to_archive = 1000;
           trigger_threshold = 2000;
           controller_id = principal \"7ohni-sbpse-y327l-syhzk-jn6n4-hw277-erei5-xhkjr-lbh6b-rjqei-sqe\";
           cycles_for_archive_creation = opt 10000000000000;
       };
   }
  })"
  


  ofvyw-5f42c-2lzr6-faukj-2hcrj-54gur-chhgu-ywug6-n6iv4-4vieo-jae



  dfx canister call windoge icrc1_transfer "(record{
                    to= record {owner = principal \"ofvyw-5f42c-2lzr6-faukj-2hcrj-54gur-chhgu-ywug6-n6iv4-4vieo-jae\"; subaccount=null;};
                    amount = 10_000_000;
                })"  