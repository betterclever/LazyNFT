export function ImagePreview() {
    return  <div className="col-span-1 shadow">
              <img src="https://play-lh.googleusercontent.com/IeNJWoKYx1waOhfWF6TiuSiWBLfqLb18lmZYXSgsH1fvb8v1IYiZr5aYWe0Gxu-pVZX3"/>
            </div>
}
export function CollectionImages(){
  return <div className="grid grid-cols-5 gap-5 col-start-7 col-span-4 mt-20">
              <ImagePreview/>
              <ImagePreview/>
              <ImagePreview/>
              <ImagePreview/>
              <ImagePreview/>
              <ImagePreview/>
              <ImagePreview/>
              <ImagePreview/>
              <ImagePreview/>
              <ImagePreview/>
              <ImagePreview/>
              <ImagePreview/>
              <ImagePreview/>
              <ImagePreview/>
              <ImagePreview/>
              <ImagePreview/>
              <ImagePreview/>
              <ImagePreview/>
              <ImagePreview/>
              <ImagePreview/>
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

export function CurrentBidView() {
    return <div className="mt-20">
        <div>
            <span className="text-3xl text-gray-800"> Current Price:  </span>
            {' '}
            <span className="text-3xl text-blue-800"> 100 ZIL </span>
        </div>
        <div className="mt-5">
            <span className="text-3xl text-gray-800"> Currently Claimed:  </span>
            {' '}
            <span className="text-3xl text-blue-800"> 20/100 </span>
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
  return  <div className="mt-10 ">
            <span className="text-2xl text-gray-800 col-span-2"> Price Distribution Curve </span>
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
export function NFTInfo() {
    return <div className="col-span-4 col-start-2 mt-20 flex flex-col">
        <h1 className="font-bold text-6xl text-gray-600"> Instagram </h1>
        <CurrentBidView/>
        <BondingCurve/>
        <AuctionTimer/>
        <PlaceBidView/>
        
    </div>
}


export function AuctionView() {
    return <div className="grid grid-cols-12">
        <NFTInfo/>
        <CollectionImages/>
    </div>
}

export function AuctionPage() {
    return <div>
        <AuctionView/>
    </div>
}