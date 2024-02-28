dfx canister call windoge icrc1_balance_of "(record {owner = principal \"6rtoj-omeex-hawum-7u3zx-v3yl6-qra24-43mbh-3qnmt-ipe22-riqye-4ae\"; subaccount=null;})"

dfx canister call windoge icrc1_transfer "(record{
                    to= record {owner = principal \"6rtoj-omeex-hawum-7u3zx-v3yl6-qra24-43mbh-3qnmt-ipe22-riqye-4ae\"; subaccount=null;};
                    amount = 10_000_000_000;
                })"
