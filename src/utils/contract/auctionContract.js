import {NFT_CONTRACT_ADDRESS, usingAuctionContract} from "./contractOps";

export async function startAuction(token_ids, collection_name, price_distribution, auction_block_count) {
    return await usingAuctionContract(async (contract, zilPay) => {
            const trxParams = {
                gasLimit: '25000',
                gasPrice: '1000000000'
            };
            const utils = zilPay.utils;
            const transitionParams = [
                {
                    vname: 'token_contract',
                    type: 'ByStr20',
                    value: NFT_CONTRACT_ADDRESS,
                },
                {
                    vname: 'token_list',
                    type: 'List (String)',
                    value: token_ids,
                },
                {
                    vname: 'entry_prices',
                    type: 'List (Uint128)',
                    // Convert to QA
                    value: price_distribution.map((price) => {
                        const bn = (new utils.BN(utils.units.toQa(price, utils.units.Units.Zil)))
                        return bn.toString()
                    })
                },
                {
                    vname: 'collection_name',
                    type: 'String',
                    value: collection_name
                },
                {
                    vname: 'auction_block_count',
                    type: 'Uint128',
                    value: auction_block_count
                }
            ];
            const trx = await contract.call("StartAuction", transitionParams, trxParams);
            return trx;
        }
    )
}

export async function participateInAuction(collectionId, amountToSendInZIL) {
    return await usingAuctionContract(async (contract, zilPay) => {
            const utils = zilPay.utils;
            const trxParams = {
                gasLimit: '25000',
                gasPrice: '1000000000',
                amount: (new utils.BN(utils.units.toQa(amountToSendInZIL.toString(), utils.units.Units.Zil))).toString()
            };
            const transitionParams = [
                {
                    vname: 'collection_id',
                    type: 'Uint256',
                    value: collectionId,
                }
            ];
            const trx = await contract.call("EnterAuction", transitionParams, trxParams);
            return trx;
        }
    )
}

export async function claimNFT(collectionId) {
    return await usingAuctionContract(async (contract, zilPay) => {
            const trxParams = {
                gasLimit: '25000',
                gasPrice: '1000000000',
            };
            const transitionParams = [
                {
                    vname: 'collection_id',
                    type: 'Uint256',
                    value: collectionId,
                }
            ];
            const trx = await contract.call("ClaimNFT", transitionParams, trxParams);
            return trx;
        }
    )
}

