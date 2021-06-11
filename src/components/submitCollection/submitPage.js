import {FormSection} from "./formSection";
import {useEffect, useState} from "react";
import {checkIsMinter, getMinterAccess, getTransaction} from "../../utils/contract/contractOps";
import {useInterval} from "../../hooks/useInterval";

export function ApplyMinter({recheckStatus}) {
    const [trxState, setTrxState] = useState({
        id: null,
        resultAwaited: false,
        transaction: null
    });

    const triggerCheckStatusIfSuccessful = (trx) => {
        if(trx.receipt.success === true) {
            recheckStatus()
        }
    }

    useInterval(async () => {
        if(trxState.resultAwaited === true && trxState.id !== null) {
            try {
                const trxData = await getTransaction(trxState.id);
                if(trxData?.receipt !== undefined) {
                    setTrxState({
                        id: trxState.id,
                        transaction: trxData,
                        resultAwaited: false,
                    })
                    console.log('trxData', trxData);
                    triggerCheckStatusIfSuccessful(trxData)
                }
            } catch (ex) {}
        }
    }, 1000);

    const applyMinter = async () => {
        const trx = await getMinterAccess();
        setTrxState({
            id: trx.ID,
            resultAwaited: true,
            transaction: trx
        })
    };

    return <div className="">
        <h2> You need to become a minter to create your own collections </h2>
        <button onClick={applyMinter}> Become minter </button>
    </div>
}

export function SubmitPage() {
    const [isMinter, setIsMinter] = useState(false);

    const checkMintStatus = () => {
        checkIsMinter().then((result) => {
            if(result === true) {
                setIsMinter(true);
            } else setIsMinter(false);
        })
    }

    useEffect(() => {
        checkMintStatus()
    }, []);

    return <div>
        {isMinter ?
            <FormSection/> :
            <ApplyMinter recheckStatus={() => checkMintStatus()}/>
        }
    </div>
}