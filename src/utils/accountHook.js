import {useEffect, useState} from "react";
import {accountAtom} from "./atoms";
import {useAtom} from "jotai";
import {zilSubscriptions} from "../index";

export function tryGettingAccount() {
    if(typeof window.zilPay !== 'undefined') {
        const zilPay = window.zilPay
        const wallet = zilPay.wallet
        return wallet.isConnect === true ? wallet.defaultAccount : null;
    } return null
}

export function useAccount() {
    const [account, setAccount] = useAtom(accountAtom);

    const accountChangeListener = (account) => {
        setAccount(account);
    };

    useEffect(() => {
        zilSubscriptions.addAccountChangeListener(accountChangeListener)
        return () => {
            zilSubscriptions.removeAccountChangeListener(accountChangeListener)
        }
    }, []);

    const connectWallet = async () => {
        console.log('here');
        if((typeof window.zilPay !== 'undefined')) {
            console.log('here 2');
            const zilPay = window.zilPay
            const wallet = zilPay.wallet
            console.log(wallet.defaultAccount)
            if(wallet.isConnect === false) {
                const accepted = await wallet.connect()
                if(accepted) {
                    console.log(wallet.defaultAccount)
                    setAccount(wallet.defaultAccount)
                } else setAccount(null)
            } else setAccount(wallet.defaultAccount)
        }
    }

    return [account, connectWallet];
}