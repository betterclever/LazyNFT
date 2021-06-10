const {tryGettingAccount} = require("./accountHook");

const NFT_CONTRACT_ADDRESS = "0xc9a91af8625cbbe278804435a6479f9e70200334";
// const AUCTION_CONTRACT_ADDRESS = "0xc9a91af8625cbbe278804435a6479f9e70200334";


export async function usingZilPay(func) {
    if(typeof window.zilPay !== 'undefined') {
        const zilPay = window.zilPay
        return func(zilPay);
    }
}

async function usingNFTContract(func) {
    return usingZilPay(async (zilpay) => {
        const contract = zilpay.contracts.at(NFT_CONTRACT_ADDRESS);
        return func(contract, zilpay)
    })
}

export async function checkIsMinter() {
    return usingNFTContract(async (contract, zilpay) => {
        const subState = await contract.getSubState('minters');
        const minters = subState.minters;
        const currentAcoount = zilpay.wallet.defaultAccount.base16;
        return minters[currentAcoount] !== undefined;
    })
}

export async function getMinterAccess() {
    return usingNFTContract(async (contract, zilpay) => {
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
    return usingNFTContract(async (contract, zilpay) => {
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
                    value: selfAccount(),
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

export function subscribeToTrx(trxId, onConfirmation, onFail) {

}