const {tryGettingAccount} = require("../accountHook");

export const NFT_CONTRACT_ADDRESS = "0xdf910808ff4595d1bf45cc5d62818c11530adb18";
export const AUCTION_CONTRACT_ADDRESS = "0xd7c94c6ecef5fa22cd6fc1094c9023a56effb7d8";


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

export async function usingNFTContract(func) {
    return await usingZilPay(async (zilpay) => {
        const contract = zilpay.contracts.at(NFT_CONTRACT_ADDRESS);
        return await func(contract, zilpay);
    })
}

export async function usingAuctionContract(func) {
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

export const selfAccount = (zilpay) => zilpay.wallet?.defaultAccount?.base16
