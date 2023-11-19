import React from 'react'
import Image from "next/image";

interface WaveformSelectInterface {
    id : string
    value : string
    label : string
    fn : Function
    img : string
    checked? : boolean
    width? : number
    height? : number
}

export const WaveformSelect = ({
id,
value,
label,
fn,
img,
checked = false,
width = 60,
height = 50,
} : WaveformSelectInterface) => {
return (
    <>
        <input 
        onChange={(e)=> fn(e.target.value as OscillatorType)}
        type="radio" id={id} name="wave" value={value} className="hidden peer" defaultChecked={checked}/>
        <label htmlFor={id} className="flex items-center justify-center w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300  peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 transition duration-300">                           
            <div className="flex flex-col gap-2">
                <div className="w-full text-lg font-semibold text-center">{label}</div>
                <Image className="flex justify-center items-center mx-auto" src={img} alt="waveform" width={width} height={height}/>
            </div>
        </label>
    </>
)
}
