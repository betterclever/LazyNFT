import {useParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import {getAllTokenUris, getCollection, getCurrentCollectionEntryPrice} from "../utils/contract/readState";

export function ImagePreview({src}) {
    console.log(src)
    return <div className="col-span-1">
        <img src={src}/>
    </div>
}

export function CollectionImages({ipfsMetadataLinks}) {
    const [imageUrls, setImageUrls] = useState([]);

    function ipfsToHttps(ipfsUrl) {
        const ref = ipfsUrl.split('://')[1].split('/')[0]
        const fileName = ipfsUrl.split('://')[1].split('/')[1]
        return `https://${ref}.ipfs.dweb.link/${fileName}`
    }

    async function getImageUrl(metadataLink) {
        console.log(metadataLink)
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

    return <div className="grid grid-cols-8 gap-5 col-start-7 col-span-4 mt-20 ">
        {imageUrls.map((url) => <ImagePreview key={url} src={url}/>)}
    </div>
}

export function AuctionTimer() {
    return <div className="mt-10">
        <div className="flex flex-col">
            <span className="text-2xl text-gray-800"> ending in  </span>
            {' '}
            <span className="text-3xl text-gray-500"> 2 hours 3 minutes 30 seconds </span>
        </div>
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

export function PlaceBidView() {
    return <div className="mt-10 mb-20 flex flex-row">
        <button
            className="text-xl w-40  flex-grow shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 roundedshadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
            Claim your NFT
        </button>
    </div>
}

export function BondingCurve() {
    return <div className="mt-10 ">
        <span className="text-2xl text-gray-800 col-span-2"> Price Distribution </span>
        <div className="grid grid-cols-4 gap-5 mt-5">
            <span className="text-2xl text-gray-800 col-span-2"> 1-20  </span>
            <span className="text-2xl text-red-800 col-span-2"> 100 ZIL </span>
        </div>
        <div className="grid grid-cols-4 gap-5">
            <span className="text-2xl text-gray-800 col-span-2"> 20-40  </span>
            <span className="text-2xl text-red-800 col-span-2"> 150 ZIL </span>
        </div>
        <div className="grid grid-cols-4 gap-5">
            <span className="text-2xl text-gray-800 col-span-2"> 20-75  </span>
            <span className="text-2xl text-red-800 col-span-2"> 250 ZIL </span>
        </div>
        <div className="grid grid-cols-4 gap-5">
            <span className="text-2xl text-gray-800 col-span-2"> 75-100  </span>
            <span className="text-2xl text-red-800 col-span-2"> 400 ZIL </span>
        </div>
    </div>
}

export function AuctionCollectionInfo({collection}) {
    return <div className="col-span-4 col-start-2 mt-20 flex flex-col">
        <h1 className="font-bold text-6xl text-gray-600"> {collection.name} </h1>
        <CurrentBidView
            currentPrice={getCurrentCollectionEntryPrice(collection)}
            participantCount={Object.keys(collection.participants).length}
            totalSpots={collection.tokenIds.length}
        />
        <BondingCurve/>
        <AuctionTimer/>
        <PlaceBidView/>
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