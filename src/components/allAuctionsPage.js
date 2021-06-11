import {useEffect} from 'react';
import {TopBar} from "./topBar";
import Countdown from 'react-countdown';
import { Link } from 'react-router-dom'
import {getAllCollections,getIsParticipantInCollectionId,getCurrentCollectionEntryPrice,hasParticipantClaimedNFT,getAllTokenUris} from '../utils/contract/readState';
import { useState } from 'react/cjs/react.development';
import {CollectionImages} from '../components/auctionpage';
const PARTICIPATION_STATUS = {
  NOT_PARTICIPATED: "NOT_PARTICIPATED",
  PARTICIPATED: "PARTICIPATED",
  CLAIMED: "CLAIMED",
}
export function ItemCard({item}) {
    const[status,setStatus]=useState(PARTICIPATION_STATUS.NOT_PARTICIPATED);
    const [collectionTokenMetadataLinks, setCollectionTokenMetadataLinks] = useState([]);
    const {collection,collectionName, currentPrice,collectionId, endTime}=item;

    useEffect(()=>{
      getParticipantStatus();
      getCollectionImages();
    },[])
    
    async function getParticipantStatus(){
      const hasParticipated= await getIsParticipantInCollectionId(collectionId);
      if(hasParticipated){
        const claimed= await hasParticipantClaimedNFT(collectionId);
        console.log(claimed);
      }
    }
    function getColorById(){
      let h = collectionId % 360;
      return 'hsl(' + h + ', ' + 90 + '%, ' + 90 + '%)';
    }
    async function getCollectionImages(){
      const allTokenUris = await getAllTokenUris();
      const collectionTokenIds = collection.tokenIds;
      const metadataUrls = collectionTokenIds.map((tokenId) => allTokenUris[tokenId]);
      setCollectionTokenMetadataLinks(metadataUrls.slice(0,6));
    }

    return <Link to={`/claim/${collectionId}`} className="col-span-1 shadow-lg hover:shadow-xl rounded-xl" style={{backgroundColor:getColorById()}} >
        {/* <div className="">
            <img className="rounded-t-xl" src="https://play-lh.googleusercontent.com/IeNJWoKYx1waOhfWF6TiuSiWBLfqLb18lmZYXSgsH1fvb8v1IYiZr5aYWe0Gxu-pVZX3"/>
        </div> */}
            <div className="flex flex-row justify-between m-2 ml-20 mt-20 " >
                <div className="flex flex-col">
                    <span className="text-4xl"> {collectionName} </span>
                    <div className="mt-2">
                        <span className="text-gray-800"> Current Price:  </span>
                        <span className="text-blue-800 mt-1"> {currentPrice} </span>
                        <div className="flex ">
                          <span className="text-md text-gray-800 mr-2"> ending in  </span>
                          <Countdown date={Date.now() + 100000} 
                          daysInHours={true}/>
                        </div>
                    <div> 
                    <CollectionImages ipfsMetadataLinks={collectionTokenMetadataLinks}/>
                    {/* {status!=='' && <div className=" mt-2" style={{flexDirection:'row',textAlign:'center'}}>
                                        <span className="text-green-800 mt-10"> {status} </span>
                                    </div>} */}
                </div>
            </div>
        </div>
    </div>
    </Link>
}

export function AuctionsGrid() {
    const [collections,setCollections]=useState({});
    useEffect(()=>{
      fetchCollections();
    },[])
    async function fetchCollections(){
      const res = await getAllCollections();
      setCollections(res);
      Object.entries(res).map(([key, value]) => console.log("key",key,"value",value));
    }
    return <div className="">
        {Object.entries(collections).map(([key, value])=>
        <ItemCard item={{collection:value,collectionId:key,collectionName:value.name, currentPrice:`${getCurrentCollectionEntryPrice(value)} ZIL`, endTime:''}} />)}
    </div>
}

export function AllAuctionsPage() {
    return <div>
              <AuctionsGrid/>
            </div>
}