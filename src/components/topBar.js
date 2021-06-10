import {AccountSection} from "./accountSection";
import {getMinterAccess} from "../utils/contractOps";

export function TopBarNavItem({label, onClick}) {
    return <div onClick={onClick}
        className="text-2xl mt-4 mb-4 mr-4 bg-gray-100 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
        <span> {label} </span>
    </div>
}

export function TopBar({onPageChange}) {
    return <div className="grid grid-cols-12 h-20">
        <div className="cursor-pointer col-start-1 col-span-10 ml-10 flex">
            <TopBarNavItem label="Explore" onClick={() => onPageChange(0)}/>
            <TopBarNavItem label="Ongoing Auctions" onClick={() => onPageChange(1)}/>
            <TopBarNavItem label="Your Collection" onClick={() => onPageChange(2)}/>
            <TopBarNavItem label="Submit your own" onClick={() => onPageChange(3)}/>
            <TopBarNavItem label="Testing" onClick={() => getMinterAccess()}/>
        </div>
        <div className="col-start-11 col-span-2">
            <AccountSection/>
        </div>
    </div>
}