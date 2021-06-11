import {useEffect, useState} from "react";
import {PriceDistributionInput} from "./priceDistributionInput";

export function PriceDistribution({onDistributionChange}) {
    const [itemCounter, setItemCounter] = useState(0);
    const [items, setItems] = useState([]);
    const addItem = () => {
        const newItems = [...items, {
            'key': itemCounter,
            'units': 0,
            'price': 0
        }]
        setItemCounter(itemCounter + 1);
        setItems(newItems);
    }

    const deleteItem = (key) => {
        const newItems = items.filter((i) => i.key !== key);
        setItems(newItems);
    }

    useEffect(() => {
        onDistributionChange(items)
    }, [items]);

    return <div className="mt-4">
        <div className="flex-row mb-5">
            <span className="text-md font-bold ml-4 ">PRICE DISTRIBUTION</span>
            <button
                className="ml-5 rounded-full bg-gray-400 px-3 py-1"
                onClick={addItem}>
                <span className="content-center w-full text-white font-bold h-1"> + </span>
            </button>
        </div>
        {items.map((i) => <PriceDistributionInput key={i.key} item={i} deleteEntry={() => deleteItem(i.key)}/>)}
    </div>
}