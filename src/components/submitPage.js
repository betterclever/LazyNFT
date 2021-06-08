import {ItemCard} from "./allAuctionsPage";
import {TopBar} from "./topBar";

function ImagePreview() {
    return <div className="col-span-1">
        <img className="rounded-xl" src="https://play-lh.googleusercontent.com/IeNJWoKYx1waOhfWF6TiuSiWBLfqLb18lmZYXSgsH1fvb8v1IYiZr5aYWe0Gxu-pVZX3"/>
    </div>
}

export function PreviewSection() {
    return <div className="grid grid-cols-4 gap-6 col-start-6 col-span-6 mt-20">
        <ImagePreview/>
        <ImagePreview/>
        <ImagePreview/>
        <ImagePreview/>
        <ImagePreview/>
    </div>
}

export function TextInputField({fieldLabel, placeHolder = ""}) {
    return <div className="w-full px-3 mb-6 md:mb-0">
        <label className="block uppercase tracking-wide text-gray-700 text-s font-bold mb-2"
               htmlFor="grid-first-name">
            {fieldLabel}
        </label>
        <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            id="grid-first-name" type="text" placeholder={placeHolder}/>
        {/*<p className="text-red-500 text-xs italic">Please fill out this field.</p>*/}
    </div>
}

export function FileUploadButton() {
    return <label
        className="ml-3 mt-6 w-64 flex flex-col items-center px-2 py-3 bg-white text-blue-600 rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-300 hover:text-white">
        <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path
                d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z"/>
        </svg>
        <span className="mt-1 text-base leading-normal">Select files</span>
        <input type='file' accept="image/*" multiple="multiple" className="hidden"/>
    </label>
}

export function FormSection() {
    return <div className="grid grid-cols-12">
        <div className="col-span-4 flex flex-col mt-20 ml-10">
            <TextInputField fieldLabel="Collection Name"/>
            <TextInputField fieldLabel="Auction duration" placeHolder={"10:00"}/>
            <label className="inline-flex items-center mt-3 pl-4 pb-6"  >
                <input type="checkbox" className="form-checkbox h-5 w-5 text-red-600" checked/>
                    <span className="ml-2 text-gray-700"> Enable AirDrops to buyers </span>
            </label>
            <TextInputField fieldLabel="Airdrop after selling" placeHolder={"40%"}/>
            <TextInputField fieldLabel="Airdrop percentage" placeHolder={"10%"}/>
            <TextInputField fieldLabel="Bonding curve factor" placeHolder={"1.5"}/>
            <FileUploadButton/>
            <button
                className="mt-6 mx-4 align-middle bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                <span className="content-center w-full"> MINT YOUR COLLECTION </span>
            </button>
        </div>
        <PreviewSection/>
    </div>
}

export function SubmitPage() {
    return <div>
        <FormSection/>
    </div>
}