import {useState} from "react";

export function tryGettingAccount() {
    if(typeof window.zilPay !== 'undefined') {
        const zilPay = window.zilPay
        const wallet = zilPay.wallet
        return wallet.isConnect === true ? wallet.defaultAccount.base16 : null;
    } return null
}

export function useAccount() {
    const [accountId, setAccountId] = useState(null);

    const account = tryGettingAccount();
    if(account?.base16 !== accountId) setAccountId(account.base16)

    const connectWallet = async () => {
        if((typeof window.zilPay !== 'undefined')) {
            const zilPay = window.zilPay
            const wallet = zilPay.wallet
            console.log(wallet.defaultAccount)
            if(wallet.isConnect === false) {
                const accepted = await wallet.connect()
                if(accepted) {
                    console.log(wallet.defaultAccount)
                    setAccountId(wallet.defaultAccount.base16)
                } else setAccountId(null)
            } else setAccountId(wallet.defaultAccount.base16)
        }
    }

    // if((typeof window.zilPay !== 'undefined')) {
    //     window.zilPay.wallet.observableAccount().subscribe((account) => {
    //         console.log("account", account)
    //         if(account) {
    //             setAccountId(account)
    //         } else setAccountId(null)
    //     })
    //     window.zilPay.wallet.observableNetwork().subscribe((net) => {
    //         console.log("net", net)
    //     })
    // }

    return [accountId, connectWallet];
}