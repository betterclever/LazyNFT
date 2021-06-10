import {useAccount} from "../utils/accountHook";

export function AccountSection() {
    const [account, connectWallet] = useAccount();
    console.log('ACCOUNT ID', account)
    return <div className="float-right mr-10">
        {account ?
            <div
                className="text-2xl ml-2 mt-4 mb-4 bg-gray-700 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                <span> {account.base16} </span>
            </div> :
            <button
                className="text-2xl ml-2 mt-4 mb-4 bg-gray-700 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                onClick={() => {
                    connectWallet();
                }}>
                <span> Connect Wallet </span>
            </button>
        }
    </div>
}