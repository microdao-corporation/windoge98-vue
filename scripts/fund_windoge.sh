dfx canister call windoge icrc1_balance_of "(record {owner = principal \"dgrgz-snxwk-qyair-vkgeu-kphha-kib2a-nzs3u-zvko4-2s3jj-cmax6-fqe\"; subaccount=null;})"

dfx canister call windoge icrc1_transfer "(record{
                    to= record {owner = principal \"dgrgz-snxwk-qyair-vkgeu-kphha-kib2a-nzs3u-zvko4-2s3jj-cmax6-fqe\"; subaccount=null;};
                    amount = 100_000_000_000;
                })"
