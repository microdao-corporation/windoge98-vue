



dfx canister call windoge icrc1_balance_of "(record {owner = principal \"ofvyw-5f42c-2lzr6-faukj-2hcrj-54gur-chhgu-ywug6-n6iv4-4vieo-jae\"; subaccount=null;})"


dfx canister call windoge icrc1_transfer "(record{
                    to= record {owner = principal \"ofvyw-5f42c-2lzr6-faukj-2hcrj-54gur-chhgu-ywug6-n6iv4-4vieo-jae\"; subaccount=null;};
                    amount = 10_000_000_000;
                })"