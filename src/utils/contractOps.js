const {tryGettingAccount} = require("./accountHook");

const NFT_CONTRACT_ADDRESS = "0xdf910808ff4595d1bf45cc5d62818c11530adb18";
const AUCTION_CONTRACT_ADDRESS = "0xe36379bfbe9d74f0415e756a2848006c135f8c75";


export async function usingZilPay(func) {
    if(typeof window.zilPay !== 'undefined') {
        const zilPay = window.zilPay
        return await func(zilPay);
    }
}

export async function getTransaction(trxId) {
    if(typeof window.zilPay !== 'undefined') {
        const zilPay = window.zilPay
        return await zilPay.blockchain.getTransaction(trxId)
    }
}

async function usingNFTContract(func) {
    return await usingZilPay(async (zilpay) => {
        const contract = zilpay.contracts.at(NFT_CONTRACT_ADDRESS);
        return await func(contract, zilpay);
    })
}

async function usingAuctionContract(func) {
    return await usingZilPay(async (zilpay) => {
        const contract = zilpay.contracts.at(AUCTION_CONTRACT_ADDRESS);
        return await func(contract, zilpay);
    })
}

export async function checkIsMinter() {
    return await usingNFTContract(async (contract, zilpay) => {
        const subState = await contract.getSubState('minters');
        const minters = subState.minters;
        const currentAccount = zilpay.wallet.defaultAccount.base16.toLowerCase();
        return minters[currentAccount] !== undefined;
    })
}

export async function getMinterAccess() {
    return await usingNFTContract(async (contract, zilpay) => {
        const isMinter = await checkIsMinter();
        if(!isMinter) {
            const trx = await contract.call("GetMinterAccess", [], {
                gasLimit: '25000',
                gasPrice: '1000000000'
            })
            return trx;
        } else return null;
    })
}

const selfAccount = (zilpay) => zilpay.wallet?.defaultAccount?.base16

export async function mintTokens(token_uris) {
    return await usingNFTContract(async (contract, zilpay) => {
        const isMinter = await checkIsMinter();
        if(isMinter) {
            const trxParams = {
                gasLimit: '25000',
                gasPrice: '1000000000'
            };
            const transitionParams = [
                {
                    vname: 'to',
                    type: 'ByStr20',
                    value: selfAccount(zilpay),
                },
                {
                    vname: 'token_uris_list',
                    type: 'List (String)',
                    value: token_uris,
                }
            ];
            const trx = await contract.call("BatchMint", transitionParams, trxParams);
            return trx;
        } else {
            throw new Error("Account does not have minter access");
        }
    })
}

export async function startAuction(token_ids, price_distribution, auction_block_count) {
    return await usingAuctionContract(async (contract, zilpay) => {
        const trxParams = {
            gasLimit: '25000',
            gasPrice: '1000000000'
        };
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
                value: price_distribution
            },
            {
                vname: 'auction_block_count',
                type: 'Uint128',
                value: auction_block_count
            }
        ];
        const trx = await contract.call("StartAuction", transitionParams, trxParams);
        return trx;
    })
}

export async function enterAuction(collection_id, ) {

}