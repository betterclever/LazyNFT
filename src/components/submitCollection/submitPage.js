import {FormSection} from "./formSection";
import {useEffect, useState} from "react";
import {checkIsMinter, getTransaction} from "../../utils/contract/contractOps";
import {useInterval} from "../../hooks/useInterval";
import {getMinterAccess} from "../../utils/contract/nftContract";

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

    return <div style={{flex:1}}>
      <div className="mt-60 justify-items-center" style={{display: "flex",flexDirection:'column', justifyContent: "center", alignItems: "center"}}>
        <h2 > You need to become a minter to create your own collections </h2>
        <button
                className="mt-6 mx-4 align-middle bg-gradient-to-r from-red-400 to-yellow-500 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                onClick={applyMinter}>
                <span className="content-center w-full"> Become minter </span>
        </button>
    </div>
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