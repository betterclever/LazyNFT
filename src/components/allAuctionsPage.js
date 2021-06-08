import {TopBar} from "./topBar";

export function ItemCard() {
    return <div className="col-span-1 shadow-lg hover:shadow-xl rounded-xl">
        <div className="">
            <img className="rounded-t-xl" src="https://play-lh.googleusercontent.com/IeNJWoKYx1waOhfWF6TiuSiWBLfqLb18lmZYXSgsH1fvb8v1IYiZr5aYWe0Gxu-pVZX3"/>
        </div>
        <div className="flex flex-row justify-between m-2">
            <div className="flex flex-col">
                <span className="text-xl"> Instagram NFTed </span>
                <div className="">
                    <span className="text-gray-800"> Current Bid:  </span>
                    { ' ' }
                    <span className="text-blue-800"> 100 ZIL </span>
                </div>
            </div>
            <div>
                <div className="flex flex-col">
                    <span className="text-xs text-gray-800"> ending in  </span>
                    { ' ' }
                    <span className="text-lg text-gray-500"> 2:30:10 </span>
                </div>
            </div>
        </div>
    </div>
}

export function AuctionsGrid() {
    return <div className="grid grid-cols-5 gap-20 ml-20 mr-20 mt-20">
        <ItemCard/>
        <ItemCard/>
        <ItemCard/>
        <ItemCard/>
        <ItemCard/>
        <ItemCard/>
        <ItemCard/>
        <ItemCard/>
        <ItemCard/>
        <ItemCard/>
        <ItemCard/>
        <ItemCard/>
        <ItemCard/>
        <ItemCard/>
        <ItemCard/>
        <ItemCard/>
    </div>
}

export function AllAuctionsPage() {
    return <div>
        <AuctionsGrid/>
    </div>
}