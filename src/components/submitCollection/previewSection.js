import {ImagePreview} from "./imagePreview";

export function PreviewSection({files}) {
    const fl = Array.from(files);
    return <div className="col-start-6 col-span-6 mt-20">
        <span> Preview </span>
        <div className="grid grid-cols-4 gap-6">
            {fl.map(file => {
                return <ImagePreview key={file.name} file={file}/>
            })}
        </div>
    </div>
}