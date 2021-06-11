import {useParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import {
    getAllTokenUris,
    getCollection,
    getCollectionPriceDistribution, getCurrentBlockNumber,
    getCurrentCollectionEntryPrice
} from "../utils/contract/readState";
import {participateInAuction} from "../utils/contract/auctionContract";
import {useInterval} from "../hooks/useInterval";
import {getTransaction} from "../utils/contract/contractOps";
import Countdown from "react-countdown";

export function ImagePreview({src, imagestyle}) {
    console.log(src)
    return <div className={`col-span-1 ${imagestyle}`}>
        <img src={src}/>
    </div>
}

export function CollectionImages({ipfsMetadataLinks,classname="", imagestyle=""}) {
  console.log('METADATA', ipfsMetadataLinks);
    const [imageUrls, setImageUrls] = useState([]);

    function ipfsToHttps(ipfsUrl) {
        const ref = ipfsUrl.split('://')[1].split('/')[0]
        const fileName = ipfsUrl.split('://')[1].split('/')[1]
        return `https://${ref}.ipfs.dweb.link/${fileName}`
    }

    async function getImageUrl(metadataLink) {
        const httpUrl = ipfsToHttps(metadataLink)
        const data = await fetch(httpUrl);
        const json = await data.json();
        const imageIpfsLink = json.image;
        return ipfsToHttps(imageIpfsLink)
    }

    useEffect(() => {
        Promise.all(
            ipfsMetadataLinks.map(async (link) => await getImageUrl(link))
        ).then(urls => setImageUrls(urls));
    }, [ipfsMetadataLinks]);

    return <div className={`grid grid-cols-3 gap-5 col-start-7 col-span-4 mt-10 ${classname}`}>
        {imageUrls.map((url) => <ImagePreview key={url} src={url} imagestyle={imagestyle}/>)}
    </div>
}

export function AuctionTimer({collection}) {
    const [endTime, setEndTime] = useState(null);

    useInterval(async () => {
        const currentBlockNumber = await getCurrentBlockNumber();
        const endBlock = collection.auctionEndblock;
        const diff = ((endBlock - currentBlockNumber)) * 21;
        console.log('diff', diff);
        setEndTime(Date.now() + diff * 1000);
    }, 10000);

    return <div className="mt-10">
        {
            collection.auctionEnded ?
                <div className="flex flex-col">
                    <span className="text-2xl text-gray-800"> Auction Ended  </span>
                </div> :
                <div className="flex flex-col">
                    <span className="text-2xl text-gray-800"> ending in  </span>
                    {' '}
                    {/*<span className="text-3xl text-gray-500"> 2 hours 3 minutes 30 seconds </span>*/}
                    {
                      endTime !== null &&
                      <Countdown className="text-3xl text-gray-500" date={endTime}
                                   daysInHours={true}/>
                    }
                </div>
        }

    </div>
}

export function CurrentBidView({currentPrice, participantCount, totalSpots}) {
    return <div className="mt-20">
        <div>
            <span className="text-3xl text-gray-800"> Current Price:  </span>
            {' '}
            <span className="text-3xl text-blue-800"> {currentPrice} ZIL </span>
        </div>
        <div className="mt-5">
            <span className="text-3xl text-gray-800"> Spots claimed:  </span>
            {' '}
            <span className="text-3xl text-blue-800"> {participantCount}/{totalSpots} </span>
        </div>
    </div>
}

const ENTER_AUCTION_STATE = {
    NOT_INITIATED: "NOT_INITIATED",
    VERIFYING_TRANSACTION: "VERIFYING_TRANSACTION",
    WAITING_FOR_TRANSACTION_COMPLETION: "WAITING_FOR_TRANSACTION_COMPLETION",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED",
}

export function PlaceBidButton({collectionId, entryPrice}) {
    const [enterAuctionState, setEnterAuctionState] = useState(ENTER_AUCTION_STATE.NOT_INITIATED);
    const [trx, setTrx] = useState({
        id: null,
        transaction: null,
        resultAwaited: false
    })

    const startEnterAuctionTransaction = async () => {
        setEnterAuctionState(ENTER_AUCTION_STATE.VERIFYING_TRANSACTION)
        const trx = await participateInAuction(collectionId, entryPrice);
        setEnterAuctionState(ENTER_AUCTION_STATE.WAITING_FOR_TRANSACTION_COMPLETION)
        setTrx({
            id: trx.ID,
            transaction: trx,
            resultAwaited: true
        })
    }

    useInterval(async () => {
        if(trx.resultAwaited === true && trx.id !== null) {
            try {
                const trxData = await getTransaction(trx.id);
                if(trxData?.receipt !== undefined) {
                    setTrx({
                        id: trx.id,
                        transaction: trxData,
                        resultAwaited: false,
                    })
                    if(trxData.receipt.success) {
                        setEnterAuctionState(ENTER_AUCTION_STATE.COMPLETED);
                    } else {
                        console.log(trx);
                        setEnterAuctionState(ENTER_AUCTION_STATE.FAILED);
                    }
                }
            } catch (ex) {
                console.error(ex);
            }
        }
    }, 300)

    function stateDisplayText() {
        switch (enterAuctionState) {
            case ENTER_AUCTION_STATE.NOT_INITIATED: return "Participate in Auction"
            case ENTER_AUCTION_STATE.VERIFYING_TRANSACTION: return "Verifying transaction"
            case ENTER_AUCTION_STATE.WAITING_FOR_TRANSACTION_COMPLETION: return "Waiting for transaction completion"
            case ENTER_AUCTION_STATE.COMPLETED: return "Participation successful"
            case ENTER_AUCTION_STATE.FAILED: return "Transaction failed. Retry?"
            default: return "Participate in Auction"
        }
    }

    return <div className="mt-10 mb-20 flex flex-row">
        <button
            className="text-xl w-40  flex-grow shadow
            bg-gradient-to-r from-green-400 to-blue-500
            hover:bg-gradient-to-r hover:from-blue-400 hover:to-green-500
            focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4
            roundedshadow focus:shadow-outline focus:outline-none
            text-white font-bold py-2 px-4 rounded"
            onClick={startEnterAuctionTransaction}
        >
            {stateDisplayText()}
        </button>
    </div>
}

export function BondingCurve({distribution}) {
    console.log('distribution', distribution);
    return <div className="mt-10 ">
        <div className="mb-5 text-2xl text-gray-800 col-span-2"> Price Distribution </div>
        {distribution.map((v, index) => {
            return <div className="grid grid-cols-4 gap-5">
            <span className="text-2xl text-gray-800 col-span-2"> { index === 0 ? 'First' : 'Next' } {v.count} </span>
            <span className="text-2xl text-red-800 col-span-2"> {v.price} ZIL </span>
            </div>
        })}
    </div>
}

export function AuctionCollectionInfo({collectionId, collection}) {
    console.log('collection', collection);
    return <div className="col-span-4 col-start-2 mt-20 flex flex-col">
        <h1 className="font-bold text-6xl text-gray-600"> {collection.name} </h1>
        <CurrentBidView
            currentPrice={getCurrentCollectionEntryPrice(collection)}
            participantCount={Object.keys(collection.participants).length}
            totalSpots={collection.tokenIds.length}
        />
        <BondingCurve distribution={getCollectionPriceDistribution(collection)}/>
        <AuctionTimer collection={collection}/>
        {
            !collection.auctionEnded ??
            <PlaceBidButton collectionId={collectionId} entryPrice={getCurrentCollectionEntryPrice(collection)}/>
        }
    </div>
}


export function AuctionView({collectionId}) {
    const [collection, setCollection] = useState(null);
    const [collectionTokenMetadataLinks, setCollectionTokenMetadataLinks] = useState([]);

    useEffect(() => {
        getCollection(collectionId).then(async (collection) => {
            console.log('collection', collection);
            setCollection(collection)
            const allTokenUris = await getAllTokenUris();
            const collectionTokenIds = collection.tokenIds;
            const metadataUrls = collectionTokenIds.map((tokenId) => allTokenUris[tokenId]);
            setCollectionTokenMetadataLinks(metadataUrls);
        })
    }, [collectionId])

    return collection ? <div className="grid grid-cols-12">
        <AuctionCollectionInfo collection={collection}/>
        <CollectionImages ipfsMetadataLinks={collectionTokenMetadataLinks}/>
    </div> : <div> Loading.... </div>
}

export function AuctionPage() {
    let {collectionId} = useParams();
    return <div>
        <AuctionView collectionId={collectionId}/>
    </div>
}