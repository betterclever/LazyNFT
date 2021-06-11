import {useEffect, useState} from "react";
import {checkIsMinter, getTransaction, mintTokens} from "../../utils/contractOps";
import {nftStorageClient} from "../../utils/nftStorage";
import {useInterval} from "../../hooks/useInterval";
import {PriceDistribution} from "./priceDistribution";
import {FileUploadButton} from "./fileUploadButton";
import {TextInputField} from "./textInputField";
import {PreviewSection} from "./previewSection";

const UPLOAD_IPFS_STAGE = 1;
const MINT_STAGE = 2;
const CREATE_AUCTION_STAGE = 3;
const AUCTION_CREATED_STAGE = 4;

export function FormSection() {
    const [files, setFiles] = useState([]);
    const [stage, setStage] = useState(0);

    const [mintTrx, setMintTrx] = useState({
        id: null,
        transaction: null,
        resultAwaited: false
    })

    useInterval(async () => {
        if(mintTrx.resultAwaited === true && mintTrx.id !== null) {
            try {
                const trxData = await getTransaction(mintTrx.id);
                if(trxData?.receipt?.success === true) {
                    setMintTrx({
                        id: mintTrx.id,
                        transaction: trxData,
                        resultAwaited: false
                    })
                }
            } catch (ex) {}
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
        const ipfsLinks = await uploadImagesToIPFS();
        const trx = await mintTokens(ipfsLinks.map(l => l.url));
        console.log(trx);

        // Reset the minTrxState
        setMintTrx({
            id: trx.ID,
            resultAwaited: true,
            transaction: trx
        })
    }


    return <div className="grid grid-cols-12">
        <div className="col-span-4 flex flex-col mt-20 ml-10">
            <TextInputField fieldLabel="Collection Name"/>
            <span className="text-md font-bold ml-4 ">AUCTION DURATION</span>
            <div className="grid grid-cols-10 align-middle">
                <div className="col-span-2"><TextInputField placeHolder={"in hrs"}/></div>
            </div>

            <PriceDistribution/>
            <FileUploadButton setFiles={setFiles}/>
            <button
                className="mt-6 mx-4 align-middle bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                onClick={mintCollection}>
                <span className="content-center w-full"> MINT YOUR COLLECTION </span>
            </button>
        </div>
        <PreviewSection files={files}/>
    </div>
}