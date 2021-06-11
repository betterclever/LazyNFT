import {selfAccount, usingAuctionContract} from "./contractOps";

const {usingNFTContract} = require("./contractOps");

export async function getAllCollections() {
    return await usingAuctionContract(async (contract, zilPay) => {
        const state = await contract.getState();
        // const blockChainState = zilPay.blockchain.getBlock
        const collectionInfo = {};
        const bi = await zilPay.blockchain.getBlockChainInfo()
        const currentBlock = bi.result.CurrentMiniEpoch;

        const utils = zilPay.utils;

        for (let i = 1; i <= state.collection_count; i++) {
            const endblock = state.collection_auction_endblock[i];
            collectionInfo[i] = {
                name: state.collection_names[i],
                entryPrices: state.collection_entry_prices[i].map((price) => {
                    return utils.units.fromQa(new utils.BN(price), utils.units.Units.Zil)
                }),
                participants: state.collection_participants[i],
                creator: state.collection_owners[i],
                tokenIds: state.collection_tokens[i],
                unclaimedTokenIds: state.collection_unclaimed_tokens[i],
                auctionEndblock: endblock,
                auctionBlockTimeRemaining: endblock - currentBlock,
                auctionEnded: endblock < currentBlock
            }
        }
        await getTokensOwnedByUser("0xd87a675ebf1c11a34239d447f49bd883b4d6d619");
        return collectionInfo;
    })
}
export async function getTokensOwnedByUser(address){
  const owners=await getAllTokenOwners();
  const newList=Object.entries(owners).filter(([key,value])=>value===address).reduce((acc,[x,y])=>({...acc,[x]:y}),{})
  
}
export async function getCollection(collection_id) {
    const collections = await getAllCollections();
    return collections[collection_id];
}

export async function getAllTokenUris() {
    return await usingNFTContract(async (contract) => {
        const state = await contract.getSubState('token_uris');
        return state.token_uris
    })
}
export async function getAllTokenOwners() {
  return await usingNFTContract(async (contract) => {
      const state = await contract.getSubState('token_owners');
      return state.token_owners
  })
}

export async function getIsParticipantInCollectionId(collection_id) {
    const collections = await getAllCollections();
    if(collections[collection_id]) {
        const collection = collections[collection_id];
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