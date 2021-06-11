import {useEffect, useState} from "react";

export function ImagePreview({file}) {
    const [fileSource, setFileSource] = useState(null);
    useEffect(() => {
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.addEventListener('load', (event) => {
            setFileSource(event.target.result)
        });
    }, [file]);


    return <div className="col-span-1 shadow-md">
        {fileSource !== null && <img className="rounded-xl" src={fileSource}/>}
    </div>
}