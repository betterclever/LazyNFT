import { useEffect } from 'react';
import { TopBar } from "./topBar";
import Countdown from 'react-countdown';
import { Link } from 'react-router-dom'
import { getAllCollections, getIsParticipantInCollectionId, getCurrentCollectionEntryPrice, hasParticipantClaimedNFT, getAllTokenUris } from '../utils/contract/readState';
import { useState } from 'react/cjs/react.development';
import { CollectionImages } from '../components/auctionpage';
const PARTICIPATION_STATUS = {
  NOT_PARTICIPATED: "NOT_PARTICIPATED",
  PARTICIPATED: "PARTICIPATED",
  CLAIMED: "CLAIMED",
}
export function ItemCard({ item }) {

  const [collectionTokenMetadataLinks, setCollectionTokenMetadataLinks] = useState([]);
  const { collection, collectionName, currentPrice, collectionId, endTime } = item;

  useEffect(() => {
    getCollectionImages();
  }, [])

  function getColorById() {
    let h = collectionId % 360;
    return 'hsl(' + h + ', ' + 90 + '%, ' + 90 + '%)';
  }
  async function getCollectionImages() {
    const allTokenUris = await getAllTokenUris();
    const collectionTokenIds = collection.tokenIds;
    const metadataUrls = collectionTokenIds.map((tokenId) => allTokenUris[tokenId]);
    setCollectionTokenMetadataLinks(metadataUrls.slice(0, 6));
  }

  return <div className="col-span-1 p-10 shadow-lg hover:shadow-xl rounded-xl " >
    <div className="flex flex-row justify-between  " >
      <div className="flex flex-col">
        <span className="text-4xl"> {collectionName} </span>
        <div className="mt-2">
          <span className="text-gray-800"> Current Price:  </span>
          <span className="text-blue-800 mt-1"> {currentPrice} </span>
          <div className="flex ">
            <span className="text-md text-gray-800 mr-2"> ending in  </span>
            <Countdown date={Date.now() + 100000}
              daysInHours={true} />
          </div>
          <div>
          </div>
        </div>
      </div>
      <Participate collectionId={collectionId} />
    </div>
    <CollectionImages ipfsMetadataLinks={collectionTokenMetadataLinks} />
    {/* {status!=='' && <div className=" mt-2" style={{flexDirection:'row',textAlign:'center'}}>
                                        <span className="text-green-800 mt-10"> {status} </span>
                                    </div>} */}


  </div>
}

export function Participate({ collectionId }) {
  const [status, setStatus] = useState(PARTICIPATION_STATUS.NOT_PARTICIPATED);
  useEffect(() => {
    getParticipantStatus();
  }, [])

  async function getParticipantStatus() {
    const hasParticipated = await getIsParticipantInCollectionId(collectionId);
    if (hasParticipated) {
      const claimed = await hasParticipantClaimedNFT(collectionId);
      console.log(claimed);
    }
  }
  switch (status) {
    case PARTICIPATION_STATUS.NOT_PARTICIPATED:
      return <Link to={`/auctions/${collectionId}`} className=" h-10 align-middle bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-0 px-4 rounded inline-flex items-center">
        <span className="content-center w-full"> Participate Now </span>
      </Link>
    default:
      return null
  }
}
export function AuctionsGrid() {
  const [collections, setCollections] = useState({});
  useEffect(() => {
    fetchCollections();
  }, [])
  async function fetchCollections() {
    const res = await getAllCollections();
    setCollections(res);
    Object.entries(res).map(([key, value]) => console.log("key", key, "value", value));
  }
  return <div className="grid grid-cols-2 gap-x-20 gap-y-20 m-10">
    {Object.entries(collections).map(([key, value]) =>
      <ItemCard item={{ collection: value, collectionId: key, collectionName: value.name, currentPrice: `${getCurrentCollectionEntryPrice(value)} ZIL`, endTime: '' }} />)}
  </div>
}

export function AllAuctionsPage() {
  return <div>
    <AuctionsGrid />
  </div>
}