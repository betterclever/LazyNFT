import { useState, useEffect } from 'react';
import { TopBar } from "./topBar";
import Countdown from 'react-countdown';
import { Link } from 'react-router-dom'
import {
  getAllCollections,
  getIsParticipantInCollectionId,
  getCurrentCollectionEntryPrice,
  hasParticipantClaimedNFT,
  getAllTokenUris,
  getCurrentBlockNumber
} from '../utils/contract/readState';
import { CollectionImages } from './auctionpage';
import { useInterval } from "../hooks/useInterval";
const PARTICIPATION_STATUS = {
  NOT_PARTICIPATED: "NOT_PARTICIPATED",
  PARTICIPATED: "PARTICIPATED",
  CLAIMED: "CLAIMED",
}
export function ItemCard({ item }) {

  const [collectionTokenMetadataLinks, setCollectionTokenMetadataLinks] = useState([]);
  const { collection, collectionName, currentPrice, collectionId } = item;

  const calculatedEndTime = Date.now() + collection.auctionBlockTimeRemaining * 21 * 1000
  const [endTime, setEndTime] = useState(calculatedEndTime);

  useInterval(async () => {
    const currentBlockNumber = await getCurrentBlockNumber();
    const endBlock = collection.auctionEndblock;
    const diff = ((endBlock - currentBlockNumber)) * 21;
    console.log('diff', diff);
    setEndTime(Date.now() + diff * 1000);
  }, 10000);

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
          {endTime !== null &&
            <div className="flex ">
              {
                endTime < Date.now() ?
                  <span className="text-2xl mt-5 text-gray-800 mr-2"> Auction Ended  </span> :
                  <div>
                    <span className="text-md text-gray-800 mr-2"> ending in  </span>
                    <Countdown date={endTime}
                      daysInHours={true} />
                  </div>
              }
            </div>
          }
          <div>
          </div>
        </div>
      </div>
      <Participate collectionId={collectionId} />
    </div>
    <CollectionImages ipfsMetadataLinks={collectionTokenMetadataLinks.slice(0, 3)} />
    {/* {status!=='' && <div className=" mt-2" style={{flexDirection:'row',textAlign:'center'}}>
                                        <span className="text-green-800 mt-10"> {status} </span>
                                    </div>} */}


  </div>
}

export function Participate({ collectionId }) {
  // const [status, setStatus] = useState(PARTICIPATION_STATUS.NOT_PARTICIPATED);
  // useEffect(() => {
  //   getParticipantStatus();
  // }, [])
  //
  // async function getParticipantStatus() {
  //   const hasParticipated = await getIsParticipantInCollectionId(collectionId);
  //   if (hasParticipated) {
  //     const claimed = await hasParticipantClaimedNFT(collectionId);
  //     console.log(claimed);
  //   }
  // }
  // switch (status) {
  //   case PARTICIPATION_STATUS.PARTICIPATED:
  //     return <Link to={`/auctions/${collectionId}`} className=" h-10 align-middle bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-0 px-4 rounded inline-flex items-center">
  //               <span className="content-center w-full"> View auction </span>
  //             </Link>
  //
  //   case PARTICIPATION_STATUS.NOT_PARTICIPATED:
  //     return <span className="content-center w-full"> Thanks for participating. </span>
  //   default:
  //     return null
  // }
  return <Link to={`/auctions/${collectionId}`} className=" h-10 align-middle bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-0 px-4 rounded inline-flex items-center">
    <span className="content-center w-full"> View auction </span>
  </Link>
}
export function AuctionsGrid() {
  const [collections, setCollections] = useState({});
  useEffect(() => {
    fetchCollections();
  }, [])
  async function fetchCollections() {
    const res = await getAllCollections();
    if (res !== null) {
      setCollections(res);
    }
    //Object.entries(res).map(([key, value]) => console.log("key", key, "value", value));
  }
  return <div className="grid grid-cols-2 gap-x-20 gap-y-20 m-10">

    {collections && Object.entries(collections).map(([key, value]) =>
      <ItemCard key={key} item={{ collection: value, collectionId: key, collectionName: value.name, currentPrice: `${getCurrentCollectionEntryPrice(value)} ZIL`, endTime: '' }} />)
    }
  </div>
}

export function AllAuctionsPage() {
  return <div>
    <AuctionsGrid />
  </div>
}