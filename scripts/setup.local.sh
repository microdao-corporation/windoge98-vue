dfx deps pull
dfx deps init --argument '(null)' internet_identity
dfx deps deploy internet_identity

dfx deploy windoge --argument "(variant {Init = 
  record {
       token_symbol = \"gdf\";
       token_name = \"ghjhghj\";
       minting_account = record { owner = principal \"7ohni-sbpse-y327l-syhzk-jn6n4-hw277-erei5-xhkjr-lbh6b-rjqei-sqe\" };
       transfer_fee = 1_000_000;
       metadata = vec {};
       feature_flags = opt record{icrc2 = true};
       initial_balances = vec { record { record { owner = principal \"7ohni-sbpse-y327l-syhzk-jn6n4-hw277-erei5-xhkjr-lbh6b-rjqei-sqe\"; }; 100_000_000_000; }; };
       archive_options = record {
           num_blocks_to_archive = 1000;
           trigger_threshold = 2000;
           controller_id = principal \"7ohni-sbpse-y327l-syhzk-jn6n4-hw277-erei5-xhkjr-lbh6b-rjqei-sqe\";
           cycles_for_archive_creation = opt 1_000_000_000_000_000;
       };
   }
  })" --specified-id rh2pm-ryaaa-aaaan-qeniq-cai

dfx deploy dogvertiser --specified-id z7fgw-zaaaa-aaaao-a3i5a-cai
dfx deploy