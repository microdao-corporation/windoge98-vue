dfx deps pull
dfx deps init --argument '(null)' internet_identity
dfx deps deploy internet_identity
sh ./deploy_icrc1.local.sh
dfx deploy
