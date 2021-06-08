export function ImagePreview() {
    return <div className="col-span-3 col-start-2 mt-20">
        <div className="shadow-xl">
            <img
                src="https://play-lh.googleusercontent.com/IeNJWoKYx1waOhfWF6TiuSiWBLfqLb18lmZYXSgsH1fvb8v1IYiZr5aYWe0Gxu-pVZX3"/>
        </div>
    </div>
}

export function AuctionTimer() {
    return <div className="mt-10">
        <div className="flex flex-col">
            <span className="text-2xl text-gray-800"> ending in  </span>
            {' '}
            <span className="text-5xl text-gray-500"> 2 hours 3 minutes 30 seconds </span>
        </div>
    </div>
}

export function CurrentBidView() {
    return <div className="mt-20">
        <div>
            <span className="text-3xl text-gray-800"> Current Bid:  </span>
            {' '}
            <span className="text-3xl text-blue-800"> 100 ZIL </span>
        </div>
        <div>
            <span className="text-2xl text-gray-800"> by:  </span>
            {' '}
            <span className="text-2xl text-gray-600"> zil42n2af325325235325 </span>
        </div>
    </div>
}

export function PlaceBidView() {
    return <div className="mt-10 flex flex-row">
        <input
            className="text-xl bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"/>
        <button
            className="text-xl w-40 ml-5 flex-grow shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 roundedshadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"> Place
            bid
        </button>
    </div>
}

export function NFTInfo() {
    return <div className="col-span-4 col-start-6 mt-20 flex flex-col">
        <h1 className="font-bold text-8xl text-gray-600"> Instagram </h1>
        <CurrentBidView/>
        <AuctionTimer/>
        <PlaceBidView/>
    </div>
}


export function AuctionView() {
    return <div className="grid grid-cols-12">
        <ImagePreview/>
        <NFTInfo/>
    </div>
}

export function AuctionPage() {
    return <div>
        <AuctionView/>
    </div>
}