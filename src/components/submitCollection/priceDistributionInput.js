import {TextInputField} from "./textInputField";

export function PriceDistributionInput({deleteEntry, item}) {
    const onInputChange = (key, v) => {
        item[key] = v;
        console.log(item);
    }
    return <div className="mt-0">
        <div className="grid grid-cols-10 align-middle">
            <div className="col-span-4"><TextInputField placeHolder={"Units"} type="number"
                                                        onInputChange={(value) => onInputChange('units', value)}/></div>
            <div className="col-span-4"><TextInputField placeHolder={"Price"} type="number"
                                                        onInputChange={(value) => onInputChange('price', value)}/></div>
            <div className="col-span-2 mt-2">
                <button className="ml-5 rounded-full bg-gray-400 px-4 py-2 " onClick={deleteEntry}>
                    <span className="content-center w-full text-white font-bold "> x </span>
                </button>
            </div>
        </div>
    </div>
}