import {selfAccount, usingAuctionContract} from "./contractOps";

const {usingNFTContract} = require("./contractOps");

export async function getAllCollections() {
    return await usingAuctionContract(async (contract, zilPay) => {
        const state = contract.getState();
        // const blockChainState = zilPay.blockchain.getBlock
        const collectionInfo = new Map();
        const bi = await zilPay.blockchain.getBlockChainInfo()
        const currentBlock = bi.result.CurrentMiniEpoch;

        for (let i = 1; i <= state.collection_count; i++) {
            const endblock = state.collection_auction_endblock[i];
            collectionInfo[i] = {
                name: state.collection_names[i],
                entryPrices: state.collection_entry_prices[i],
                participants: state.collection_participants[i],
                creator: state.collection_owners[i],
                tokenIds: state.collection_tokens[i],
                unclaimedTokenIds: state.collection_unclaimed_tokens[i],
                auctionEndblock: endblock,
                auctionBlockTimeRemaining: endblock - currentBlock,
                auctionEnded: endblock < currentBlock
            }
        }
        return collectionInfo;
    })
}

export async function getAllTokenUris() {
    return await usingNFTContract(async (contract) => {
        const state = await contract.getSubState('token_uris');
        return state.token_uris
    })
}

export async function getIsParticipantInCollectionId(collection_id) {
    const collections = getAllCollections();
    if(collections.has(collection_id)) {
        const collection = collections.get(collection_id);
        const accountId = selfAccount(window.zilPay);
        return accountId in collection.participants;
    } else return null
}

export async function hasParticipantClaimedNFT(collection_id) {
    const collections = getAllCollections();
    if(collections.has(collection_id)) {
        const collection = collections.get(collection_id);
        const accountId = selfAccount(window.zilPay);
        if(accountId in collection.participants) {
            return collection.participants[accountId]
        } else return false
    } else return null
}

export function getCurrentCollectionEntryPrice(collection) {
    const currentParticipantCount = Object.keys(collection.participants).length;
    return collection.entryPrices[currentParticipantCount];
}