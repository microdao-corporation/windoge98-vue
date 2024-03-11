dfx deps pull
dfx deps init --argument '(null)' internet_identity
dfx deps deploy internet_identity
sh ./deploy_icrc1.local.sh
dfx deploy dogvertiser --specified-id z7fgw-zaaaa-aaaao-a3i5a-cai
dfx deploy