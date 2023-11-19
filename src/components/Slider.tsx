import React from 'react'

interface SliderInterface {
    min : number
    max : number
    step : number
    defaultValue : number
    fn : Function 
}

export const Slider = ({min,max,step,defaultValue,fn} : SliderInterface) => {
  return (
    <>
         <input
        onChange={(e) => {
            fn(Number(e.target.value))
        }}
        className="w-full"
        type="range" 
        min={String(min)} 
        max={String(max)} 
        step={String(step)} 
        defaultValue={defaultValue}/>
    </>
  )
}
