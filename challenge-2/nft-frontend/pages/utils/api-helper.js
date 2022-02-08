export function getAvailableNfts() {
    return global.fetch("/api/nfts",{
        method: "GET",
    })
        .then(r => r.json())
}

export function buyNft(nft) {
    return global.fetch("/api/nft", {
        method: "POST",
        body: JSON.stringify(nft)
    })
        .then(r => r.json())
}