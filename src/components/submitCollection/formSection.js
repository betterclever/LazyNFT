import {useEffect, useState} from "react";
import {checkIsMinter, getTransaction, mintTokens} from "../../utils/contractOps";
import {nftStorageClient} from "../../utils/nftStorage";
import {useInterval} from "../../hooks/useInterval";
import {PriceDistribution} from "./priceDistribution";
import {FileUploadButton} from "./fileUploadButton";
import {TextInputField} from "./textInputField";
import {PreviewSection} from "./previewSection";

const UPLOAD_IPFS_STAGE = 1;
const CREATE_AUCTION_STAGE = 3;
const AUCTION_CREATED_STAGE = 4;

const MINT_STAGE = {
    NOT_INITIATED: "NOT_INITIATED",
    UPLOADING: "UPLOADING",
    UPLOADED: "UPLOADED",
    VERIFYING_MINTING_TRANSACTION: "VERIFYING_MINTING_TRANSACTION",
    WAITING_FOR_TRANSACTION_COMPLETION: "WAITING_FOR_TRANSACTION_COMPLETION",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED"
}

export function FormSection() {
    const [files, setFiles] = useState([]);
    const [mintStage, setMintStage] = useState(MINT_STAGE.NOT_INITIATED);

    const [mintTrx, setMintTrx] = useState({
        id: null,
        transaction: null,
        resultAwaited: false
    })

    useInterval(async () => {
        if (mintTrx.resultAwaited === true && mintTrx.id !== null) {
            try {
                const trxData = await getTransaction(mintTrx.id);
                const receipt = trxData?.receipt;
                if (receipt !== undefined) {
                    setMintTrx({
                        id: mintTrx.id,
                        transaction: trxData,
                        resultAwaited: false
                    })
                    const success = receipt.success;
                    if(success) {
                        setMintStage(MINT_STAGE.COMPLETED);
                    } else {
                        setMintStage(MINT_STAGE.FAILED);
                    }
                }
            } catch (ex) {
            }
        }
    }, 1000);

    function postImage(file) {
        return nftStorageClient.store({
            name: 'Test 2',
            description: 'Test image 2',
            image: file
        });
    }

    async function uploadImagesToIPFS() {
        try {
            const promises = Array.from(files).map(async (file) => postImage(file));
            const result = await Promise.all(promises);
            console.log("result", result);
            return result
        } catch (error) {
            console.log(error)
        }
    }

    async function mintCollection() {
        setMintStage(MINT_STAGE.UPLOADING);
        const ipfsLinks = await uploadImagesToIPFS();
        setMintStage(MINT_STAGE.UPLOADED);
        setMintStage(MINT_STAGE.VERIFYING_MINTING_TRANSACTION);
        const trx = await mintTokens(ipfsLinks.map(l => l.url));
        setMintStage(MINT_STAGE.WAITING_FOR_TRANSACTION_COMPLETION);
        console.log(trx);

        // Reset the minTrxState
        setMintTrx({
            id: trx.ID,
            resultAwaited: true,
            transaction: trx
        })
    }


    return <div className="grid grid-cols-12">
        <div className="col-span-4 mt-20 ml-10 flex flex-col">
            <div> Step: 1</div>
            {
                (mintStage === MINT_STAGE.NOT_INITIATED || mintStage === MINT_STAGE.FAILED) &&
                <div className="flex flex-col">
                    <FileUploadButton setFiles={setFiles}/>
                    <button
                        className="mt-6 mx-4 align-middle bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                        onClick={mintCollection}>
                        <span className="content-center w-full"> Mint NFTs </span>
                    </button>
                </div>
            }

            {(mintStage === MINT_STAGE.UPLOADING) &&
                <span> Uploading to IPFS </span>
            }
            {(mintStage === MINT_STAGE.UPLOADED) &&
                <span> Files Uploaded to IPFS </span>
            }
            {(mintStage === MINT_STAGE.VERIFYING_MINTING_TRANSACTION) &&
                <span> Verifying minting transaction </span>
            }
            {(mintStage === MINT_STAGE.WAITING_FOR_TRANSACTION_COMPLETION) &&
                <span> Waiting for transaction completion </span>
            }
            {(mintStage === MINT_STAGE.COMPLETED) &&
                <span> Minting successful </span>
            }

            <div className="mt-10"> Step: 2</div>
            <TextInputField fieldLabel="Collection Name"/>
            <div className="col-span-2"><TextInputField fieldLabel={"Auction Duration"} placeHolder={"in hrs"}/></div>
            <PriceDistribution/>

            <button
                className="mt-6 mb-20 mx-4 align-middle bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                onClick={mintCollection}>
                <span className="content-center w-full"> Start Auction </span>
            </button>
        </div>
        <PreviewSection files={files}/>
    </div>
}