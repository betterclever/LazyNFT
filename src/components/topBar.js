import { AccountSection } from "./accountSection";
import { Link } from 'react-router-dom'

export function TopBarNavItem({ label, path }) {
  return <Link 
            to={path} 
            className="text-2xl mt-4 mb-4 mr-4 bg-gray-100 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
    <span> {label} </span>
  </Link>
}

export function TopBar() {
  return <div className="grid grid-cols-12 h-20">
    <div className="cursor-pointer col-start-1 col-span-10 ml-10 flex">
      <TopBarNavItem label="Ongoing Auctions" path="/" />
      <TopBarNavItem label="Submit your own" path="/mintYourOwn" />
    </div>
    <div className="col-start-11 col-span-2">
      <AccountSection />
    </div>
  </div>
}