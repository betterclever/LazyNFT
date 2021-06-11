import {checkIsMinter, selfAccount, usingNFTContract} from "./contractOps";

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
