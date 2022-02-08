./build.sh
cargo test -- --nocapture
near dev-deploy --wasmFile res/non_fungible_token.wasm --helperUrl https://near-contract-helper.onrender.com
source neardev/dev-account.env
echo $CONTRACT_NAME
export ID=$CONTRACT_NAME

near call $CONTRACT_NAME new_default_meta '{"owner_id": "'$CONTRACT_NAME'"}' --accountId $CONTRACT_NAME
near view $CONTRACT_NAME nft_metadata
near call $ID nft_mint '{"token_id": "0", "receiver_id": "'$ID'", "token_metadata": { "title": "Olympus Mons", "description": "Tallest mountain in charted solar system", "media": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Olympus_Mons_alt.jpg/1024px-Olympus_Mons_alt.jpg", "copies": 1}}' --accountId $ID --deposit 10

near create-account alice.$ID --masterAccount $ID --initialBalance 10
near view $ID nft_tokens_for_owner '{"account_id": "'alice.$ID'"}'
near call $ID nft_transfer '{"token_id": "0", "receiver_id": "alice.'$ID'", "memo": "transfer ownership"}' --accountId $ID --deposit 0.000000000000000000000001
near view $ID nft_tokens_for_owner '{"account_id": "'alice.$ID'"}'


# TEST
near call $CONTRACT_NAME nft_mint '{"token_id": "1", "receiver_id": "saic.testnet", "token_metadata": { "title": "Olympus Mons", "description": "Tallest mountain in charted solar system", "media": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Olympus_Mons_alt.jpg/1024px-Olympus_Mons_alt.jpg", "copies": 1}}' --accountId  $ID --deposit 10
near call $CONTRACT_NAME nft_transfer '{"token_id": "1", "receiver_id": "saic.testnet", "memo": "transfer ownership"}' --accountId $ID --deposit 0.000000000000000000000001

# Transfer to another account
# near login - with the account that currently owns the nft
near call $CONTRACT_NAME nft_transfer '{"token_id": "1", "receiver_id": "gtacodingtutor.testnet", "memo": "transfer ownership"}' --accountId saic.testnet --deposit 0.000000000000000000000001
near view $ID nft_tokens_for_owner '{"account_id": "gtacodingtutor.testnet"}'
