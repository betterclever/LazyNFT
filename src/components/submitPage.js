import { data } from 'autoprefixer';
import { createRef, useEffect, useState } from 'react';
import { ItemCard } from "./allAuctionsPage";
import { TopBar } from "./topBar";
import { NFTStorage, File } from 'nft.storage';
import Base64Binary from 'base64-arraybuffer';
const client = new NFTStorage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDg4NjUwNjA2NTAxZjA0Mjk4NTU3OTNlOThiMTJCRmI1M0E5Mjg3M2YiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyMzIzNjYzOTYwOCwibmFtZSI6InppbG5mdEtleSJ9.j6ZrhwB1ZuxOzI32Ya-lV0tKtfI6vzsMCLizQrhXmkM'})

window.xclient = client;

function ImagePreview({ file }) {
  const [fileSource, setFileSource] = useState(null);
  useEffect(() => {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.addEventListener('load', (event) => {
      setFileSource(event.target.result)
    });
  }, [file]);
  

  return <div className="col-span-1 shadow-md">
    { fileSource !== null && <img className="rounded-xl" src={fileSource}/> }
  </div>
}

export function PreviewSection({ files }) {
  const fl = [];
  for (const f of files) {
    console.log('f', f)
    fl.push(f)
  }
  console.log(fl)
  return <div className="grid grid-cols-4 gap-6 col-start-6 col-span-6 mt-20">
    {fl.map(file => {
      return <ImagePreview key={file.name} file={file} />
    })}
  </div>
}

export function TextInputField({ fieldLabel, placeHolder = "", type="text", onInputChange }) {
  return <div className="w-full px-3 mb-6 md:mb-0">
    <label className="block uppercase tracking-wide text-gray-700 text-s font-bold mb-2"
      htmlFor="grid-first-name">
      {fieldLabel}
    </label>
    <input
      className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
      id="grid-first-name" type={type} placeholder={placeHolder} onChange={(e)=>{if(onInputChange){onInputChange(e.target.value)}}}/>
    {/*<p className="text-red-500 text-xs italic">Please fill out this field.</p>*/}
  </div>
}

export function FileUploadButton({ setFiles }) {
  const onInputChange = (e) => {
    setFiles(e.target.files);
  }
  return <label
    className="ml-3 mt-6 w-64 flex flex-col items-center px-2 py-3 bg-white text-blue-600 rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-300 hover:text-white">
    <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path
        d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
    </svg>
    <span className="mt-1 text-base leading-normal">Select files</span>
    <input type='file' accept="image/*" multiple="multiple" className="hidden" onInputCapture={onInputChange} />
  </label>
}
export function PriceDistribution(){
    const [itemCounter, setItemCounter] = useState(0);
    const [items, setItems] = useState([]);
    const addItem = () => {
      const newItems = [...items, {
        'key': itemCounter,
        'units': 0,
        'price': 0
      }]
      setItemCounter(itemCounter+1);
      setItems(newItems);
    }

    const deleteItem = (key) => {
      const newItems = items.filter((i) => i.key !== key);
      setItems(newItems);
    }

    return  <div className="mt-4">
                <div className="flex-row mb-5">
                  <span className="text-md font-bold ml-4 ">PRICE DISTRIBUTION</span>
                  <button
                    className="ml-5 rounded-full bg-gray-400 px-3 py-1"
                    onClick={addItem}>
                    <span className="content-center w-full text-white font-bold h-1"> + </span>
                  </button>
                </div>
                {items.map((i)=><PriceDistributionInput key={i.key} item={i} deleteEntry={()=>deleteItem(i.key)}/>)}
            </div>
}
export function PriceDistributionInput({deleteEntry, item}){
  const onInputChange=(key,v)=>{
    item[key]=v;
    console.log(item);
  }
  return  <div className="mt-0">
              <div className="grid grid-cols-10 align-middle" >
                <div className="col-span-4"><TextInputField  placeHolder={"Units"} type="number" onInputChange={(value)=>onInputChange('units',value)}/></div>
                <div className="col-span-4"><TextInputField  placeHolder={"Price"} type="number" onInputChange={(value)=>onInputChange('price',value)}/></div>
                <div className="col-span-2 mt-2">
                  <button className="ml-5 rounded-full bg-gray-400 px-4 py-2 " onClick={deleteEntry}>
                    <span className="content-center w-full text-white font-bold "> x </span>
                  </button>
                </div>
              </div>
          </div>
}
export function FormSection() {
  const [files, setFiles] = useState([]);
  function postImage(file) {
    return client.store({
      name: 'Test 2',
      description: 'Test image 2',
      image: file
    });
  }
  async function mintCollection() {
    try {
      const promises= Array.from(files).map(async(file)=> postImage(file));
      Promise.all(promises).then((values)=>console.log(values));
    } catch (error) {
      console.log(error)
    }
  }
  return <div className="grid grid-cols-12">
    <div className="col-span-4 flex flex-col mt-20 ml-10">
      <TextInputField fieldLabel="Collection Name" />
      <span className="text-md font-bold ml-4 ">AUCTION DURATION</span>
      <div className="grid grid-cols-2 align-middle" >
                <div className="col-span-1"><TextInputField  placeHolder={"in hrs"} type="number"/></div>
                
      </div>
      
      <PriceDistribution/>
      <FileUploadButton setFiles={setFiles} />
      <button
        className="mt-6 mx-4 align-middle bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 rounded inline-flex items-center"
        onClick={mintCollection}>
        <span className="content-center w-full"> MINT YOUR COLLECTION </span>
      </button>
    </div>
    <PreviewSection files={files} />
  </div>
}

export function SubmitPage() {
  return <div>
    <FormSection />
  </div>
}