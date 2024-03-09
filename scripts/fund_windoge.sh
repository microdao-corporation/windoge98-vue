dfx canister call windoge icrc1_balance_of "(record {owner = principal \"qwn6v-4mwo3-kkhcs-giqbi-6c6mr-4xhot-hk4or-cfyqz-73g3o-yz674-wae\"; subaccount=null;})"

dfx canister call windoge icrc1_transfer "(record{
                    to= record {owner = principal \"qwn6v-4mwo3-kkhcs-giqbi-6c6mr-4xhot-hk4or-cfyqz-73g3o-yz674-wae\"; subaccount=null;};
                    amount = 100_000_000_000;
                })"
