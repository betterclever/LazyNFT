import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {usingZilPay} from "./utils/contract/contractOps";
import {list} from "postcss";

class ZilSubscriptions {
    accountChangeListeners = [];
    networkChangeListeners = [];

    // TrxId to Listeners Map
    trxListeners = new Map();

    addAccountChangeListener(func) {
       this.accountChangeListeners.push(func);
    }

    removeAccountChangeListener(func) {
        this.accountChangeListeners = this.accountChangeListeners.filter((v) => v !== func)
    }

    addTransactionListener(trxId, func) {
        if(this.trxListeners.has(trxId)) {
            this.trxListeners[trxId].push(func)
        } else {
            console.log('trxId', trxId);
            window.zilPay.wallet.addTransactionsQueue(trxId);
            this.trxListeners[trxId] = [func];
        }
    }

    removeTransactionListener(trxId, func) {
        if(this.trxListeners.has(trxId)) {
            this.trxListeners[trxId] = this.trxListeners[trxId].filter((v) => v !== func)
        }
    }

    getAccountChangeListeners() {
        return this.accountChangeListeners;
    }

    getNetworkChangeListeners() {
        return this.networkChangeListeners;
    }

    getTransactionListeners(trxId) {
        return this.trxListeners.get(trxId) ?? [];
    }
}

export const zilSubscriptions = new ZilSubscriptions();
window.zilSubscription = zilSubscriptions;

usingZilPay((zilpay) => {
    setTimeout(() => {
        try {
            zilpay.wallet.observableAccount().subscribe((account) => {
                console.log("account changed", account)
                let listeners = zilSubscriptions.getAccountChangeListeners();
                console.log('total_listeners', listeners.length);
                listeners.forEach((l) => l(account));
            });
            zilpay.wallet.observableNetwork().subscribe((net) => {
                console.log("network changed", net)
                zilSubscriptions.getNetworkChangeListeners().forEach((l) => l(net));
            })
            zilpay.wallet.observableTransaction().subscribe((trx) => {
                console.log('transaction', trx);
                let listeners = zilSubscriptions.getTransactionListeners(trx.id);
                listeners.forEach(l => l(trx));
            })
        } catch(e) {
            console.error(e);
        }
    }, 1000);
});

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
