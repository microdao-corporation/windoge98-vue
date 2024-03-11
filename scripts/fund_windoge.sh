#!/bin/bash

# Store the first argument provided to the script
principal="$1"
amount="100_000_000_000"

# Check if an argument was provided
if [[ -z "$principal" ]]; then
    echo "Error: Please provide the owner principal as an argument."
    exit 1
fi

if [[ -n "$2" ]]; then
    # Use the provided argument
    amount="$2"
fi

# Call the dfx canister commands using the provided argument
dfx canister call windoge icrc1_balance_of "(record {owner = principal \"$principal\"; subaccount=null;})"

dfx canister call windoge icrc1_transfer "(record {
                    to= record {owner = principal \"$principal\"; subaccount=null;};
                    amount = $amount;
                })"
