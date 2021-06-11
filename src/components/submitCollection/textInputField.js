export function TextInputField({fieldLabel, placeHolder = "", onInputChange,...props}) {
    return <div className="w-full px-3 mb-6 md:mb-0">
        <label className="block uppercase tracking-wide text-gray-700 text-s font-bold mb-2"
               htmlFor="grid-first-name">
            {fieldLabel}
        </label>
        <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            id="grid-first-name" {...props} placeholder={placeHolder} onChange={(e) => {
            if (onInputChange) {
                onInputChange(e.target.value)
            }
        }}/>
        {/*<p className="text-red-500 text-xs italic">Please fill out this field.</p>*/}
    </div>
}