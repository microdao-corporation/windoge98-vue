mvlgq-eiaaa-aaaan-qepnq-cai



dfx canister call mvlgq-eiaaa-aaaan-qepnq-cai icrc1_balance_of "(record {owner = principal \"mpj4f-dbzed-uhjgp-5abtz-tdbtu-vkrbd-ehlcr-6lt2i-biofh-radfs-wae\"; subaccount=null;})" --network=ic

dfx canister call mvlgq-eiaaa-aaaan-qepnq-cai icrc1_transfer "(record{
                    to= record {owner = principal \"nc4qw-llheq-vhirg-g54gf-n4kk5-3lbfl-joz5v-equ6a-ghnv4-36tin-cae\"; subaccount=null;};
                    amount = 5_000_000;
                })" --network ic
