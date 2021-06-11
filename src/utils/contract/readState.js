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
        return collectionInfo;
    })
}
export async function getTokensOwnedByUser(){
  try{
    const address = await selfAccount(window.zilPay);
    const owners=await getAllTokenOwners();
    const tokenUris=await getAllTokenUris();
    console.log('uri', tokenUris);
    console.log('token_owners', owners);
    console.log('address', address);
    const tokenIdList=Object.entries(owners).filter(([key,value])=>value===address.toLowerCase()).map(([key,value])=>key)
    console.log('tokenIds', tokenIdList);
    const tokenUriList=Object.entries(tokenUris).filter(([key,value])=>tokenIdList.includes(key)).map(([key,value])=>value);
    console.log('tokenUris', tokenUriList);
    return tokenUriList;
  }catch(e){
    console.error('err', e);
    return [];
  }
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