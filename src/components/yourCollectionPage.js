import {useState,useEffect} from 'react';
import { getTokensOwnedByUser } from '../utils/contract/readState';
import { CollectionImages } from '../components/auctionpage';
export function YourCollectionPage() {
  const [tokens, setTokens] = useState([]);
  useEffect(()=>{
    fetchTokens();
  },[])
  async function fetchTokens(){
    const data=await getTokensOwnedByUser();
    setTokens(data);
  }
  return <CollectionImages ipfsMetadataLinks={tokens} classname=" grid-cols-5 gap-10 m-20 " imagestyle="p-10 rounded-2xl shadow"/>
}