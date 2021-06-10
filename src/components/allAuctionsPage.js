import {TopBar} from "./topBar";
import Countdown from 'react-countdown';
export function ItemCard({item}) {
    const {collectionName, currentPrice,collectionId, endTime}=item;
    function getColorById(){
      let h = collectionId % 360;
      return 'hsl(' + h + ', ' + 90 + '%, ' + 90 + '%)';
    }
    return <div className="col-span-1 shadow-lg hover:shadow-xl rounded-xl" style={{backgroundColor:getColorById()}}>
        {/* <div className="">
            <img className="rounded-t-xl" src="https://play-lh.googleusercontent.com/IeNJWoKYx1waOhfWF6TiuSiWBLfqLb18lmZYXSgsH1fvb8v1IYiZr5aYWe0Gxu-pVZX3"/>
        </div> */}
            <div className="flex flex-row justify-between m-2" style={{justifyContent:'center'}}>
                <div className="flex flex-col">
                    <span className="text-xl"> {collectionName} </span>
                    <span className="text-xl">  </span>
                    <div className="mt-20">
                        <span className="text-gray-800"> Current Price:  </span>
                        <span className="text-blue-800 mt-10"> {currentPrice} </span>
                        <div className="flex ">
                          <span className="text-md text-gray-800 mr-2"> ending in  </span>
                          <Countdown date={Date.now() + 100000} 
                          daysInHours={true}/>
                        </div>
                    <div> 
                </div>
            </div>
        </div>
    </div>
    </div>
}

export function AuctionsGrid() {
    return <div className="grid grid-cols-5 gap-20 ml-20 mr-20 mt-20">
        <ItemCard item={{collectionId:'563236',collectionName:'Instagram NFTed', currentPrice:'100 ZIL', endTime:''}}/>
        <ItemCard item={{collectionId:'5674536',collectionName:'Instagram NFTed', currentPrice:'100 ZIL', endTime:''}}/>
        <ItemCard item={{collectionId:'5644336',collectionName:'Instagram NFTed', currentPrice:'100 ZIL', endTime:''}}/>
        <ItemCard item={{collectionId:'53236',collectionName:'Instagram NFTed', currentPrice:'100 ZIL', endTime:''}}/>
        <ItemCard item={{collectionId:'563243',collectionName:'Instagram NFTed', currentPrice:'100 ZIL', endTime:''}}/>
        <ItemCard item={{collectionId:'43236',collectionName:'Instagram NFTed', currentPrice:'100 ZIL', endTime:''}}/>
        <ItemCard item={{collectionId:'52366',collectionName:'Instagram NFTed', currentPrice:'100 ZIL', endTime:''}}/>
        <ItemCard item={{collectionId:'25236',collectionName:'Instagram NFTed', currentPrice:'100 ZIL', endTime:''}}/>
    </div>
}

export function AllAuctionsPage() {
    return <div>
        <AuctionsGrid/>
    </div>
}