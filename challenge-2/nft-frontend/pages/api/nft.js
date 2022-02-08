const nearAPI = require("near-api-js");
const fs = require("fs");
const homedir = require("os").homedir();
const { connect, keyStores, KeyPair } = nearAPI;
const BN = require('bn.js');

const ACCOUNT_ID = "dev-1644038625906-15095311362465";  // NEAR account tied to the keyPair
const NETWORK_ID = "testnet";
const CONTRACT_ID = "dev-1644038625906-15095311362465";

// path to your custom keyPair location (ex. function access key for example account)
const KEY_PATH = `/.near-credentials/testnet/${ACCOUNT_ID}.json`;

const credentials = JSON.parse(fs.readFileSync(homedir + KEY_PATH));
const keyStore = new keyStores.InMemoryKeyStore();
keyStore.setKey(NETWORK_ID, ACCOUNT_ID, KeyPair.fromString(credentials.private_key));

const config = {
    networkId: "testnet",
    keyStore, // optional if not signing transactions
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
};


export default async function handler(req, res) {
    if (req.method != "POST") {
        return res.send();
    }
    else {
        try {
            const near = await connect(config);
            const account = await near.account(ACCOUNT_ID);
            const contract = new nearAPI.Contract(account, CONTRACT_ID, {
                viewMethods: ["nft_tokens_for_owner"],
                changeMethods: ["nft_mint", "nft_transfer"],
                sender: account
            });
            const payload = JSON.parse(req.body);
            console.log("incoming request", payload);
            const nft_mint = await contract.nft_mint({ ...payload, receiver_id: ACCOUNT_ID }, new BN('300000000000000'), new BN('1000000000000000000000000'));
            console.log("nft_mint response", nft_mint);
            const nftTransferPayload = { "token_id": payload.token_id, "receiver_id": payload.receiver_id, "memo": "transfer ownership" };
            console.log("nftTransferPayload", nftTransferPayload)
            const nft_transfer = await contract.nft_transfer(nftTransferPayload, new BN('300000000000000'), new BN('1'))
            console.log("nft_transfer", nft_transfer)
            res.status(200).json({ nft_transfer: true });
        }
        catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }
}
