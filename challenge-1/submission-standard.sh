./build.sh
cargo test -- --nocapture
near login
ID=MY_ACCOUNT_NAME
echo $ID
near deploy --wasmFile res/non_fungible_token.wasm --accountId $ID
near call $ID new_default_meta '{"owner_id": "'$ID'"}' --accountId $ID
near view $ID nft_metadata
near call $ID nft_mint '{"token_id": "0", "receiver_id": "'$ID'", "token_metadata": { "title": "Olympus Mons", "description": "Tallest mountain in charted solar system", "media": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Olympus_Mons_alt.jpg/1024px-Olympus_Mons_alt.jpg", "copies": 1}}' --accountId $ID --deposit 10


near create-account alice.$ID --masterAccount $ID --initialBalance 10
near view $ID nft_tokens_for_owner '{"account_id": "'alice.$ID'"}'
near call $ID nft_transfer '{"token_id": "0", "receiver_id": "alice.'$ID'", "memo": "transfer ownership"}' --accountId $ID --deposit 0.000000000000000000000001


