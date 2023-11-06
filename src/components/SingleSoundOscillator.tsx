"use client"
import Image from "next/image";
import { useRef } from "react";

export default function SingleSoundOscillator() {
  var AudioContext = window.AudioContext || window.AudioContext;
  const context = new AudioContext();
  var oscillator : null | OscillatorNode = context.createOscillator()
  const masterVolume = context.createGain();
  masterVolume.connect(context.destination);
  masterVolume.gain.value = 0.3

  const isPlaying = useRef(false)

  const handleStart = () => {
    if(oscillator && isPlaying.current === false){
      isPlaying.current = true
      oscillator.frequency.setValueAtTime(220, 0);
      oscillator.connect(masterVolume);
      oscillator.start(0);
    }
  }

  const handleStop = () => {
    if(oscillator && isPlaying.current === true){
      isPlaying.current = false
      oscillator.stop(0)
      oscillator = null
      oscillator = context.createOscillator()
    }
  }
  const setOscType = (type:OscillatorType) => {
    oscillator ? oscillator.type = type : null 
  }

  return (
    <>
      <div className="bg-white w-2/3 rounded p-10 mx-auto shadow-2xl flex flex-col border-slate-300 border-2 gap-4">
          <div className="w-full flex flex-row justify-around items-center">
            <button
            onClick={handleStart}
            className=" bg-lime-600 rounded px-4 py-2 text-center font-bold text-xl text-white active:bg-lime-800 hover:shadow-xl transition duration-300"
            >START</button>
            <button
            onClick={handleStop}
            className=" bg-red-600 rounded px-4 py-2 text-center font-bold text-xl text-white active:bg-red-800 hover:shadow-xl transition duration-300"
            >STOP</button>
          </div>
          <div className="w-full flex flex-col gap-4 justify-center items-center">   
            <label className="text-lg text-gray-500 font-semibold">Volume</label>
            <input
            onChange={(e) => {masterVolume.gain.value = Number(e.target.value)}}
            className="w-full"
            type="range" min="0" max="1" step="0.05" defaultValue={0.3}/>
              <ul className="grid grid-cols-2 md:grid-cols-4 w-full gap-6 flex-row justify-between items-center">
                  <li>
                      <input 
                      onChange={(e)=> setOscType((e.target.value as OscillatorType))}
                      type="radio" id="sine-wave" name="wave" value="sine" className="hidden peer" defaultChecked/>
                      <label htmlFor="sine-wave" className="flex items-center justify-center w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
                          <div className="flex flex-col gap-2">
                            <div className="w-full text-lg font-semibold text-center">Sine</div>
                            <Image className="flex justify-center items-center mx-auto" priority src="/Simple_sine_wave.svg" alt="square-wave" width={60} height={50}/>
                          </div>
                      </label>
                  </li>
                  <li>
                      <input 
                      onChange={(e)=> setOscType((e.target.value as OscillatorType))}
                      type="radio" id="square-wave" name="wave" value="square" className="hidden peer"/>
                      <label htmlFor="square-wave" className="flex items-center justify-center w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
                          <div className="flex flex-col gap-2">
                            <div className="w-full text-lg font-semibold text-center">Square</div>
                            <Image className="flex justify-center items-center mx-auto" src="/Square_wave.svg" alt="square-wave" width={60} height={50}/>
                          </div>
                      </label>
                  </li>
                  <li>
                      <input 
                      onChange={(e)=> setOscType((e.target.value as OscillatorType))}
                      type="radio" id="triangle-wave" name="wave" value="triangle" className="hidden peer"/>
                      <label htmlFor="triangle-wave" className="flex items-center justify-center w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
                          <div className="flex flex-col gap-2">
                            <div className="w-full text-lg font-semibold text-center">Triangle</div>
                            <Image className="flex justify-center items-center mx-auto" src="/Triangle_wave.svg" alt="triangle-wave" width={60} height={50}/>
                          </div>
                      </label>
                  </li>
                  <li>
                      <input 
                      onChange={(e)=> setOscType((e.target.value as OscillatorType))}
                      type="radio" id="saw-wave" name="wave" value="sawtooth" className="hidden peer"/>
                      <label htmlFor="saw-wave" className="flex items-center justify-center w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
                          <div className="flex flex-col gap-2">
                            <div className="w-full text-lg font-semibold text-center">Sawtooth</div>
                            <Image className="flex justify-center items-center mx-auto" src="/Sawtooth_wave.svg" alt="sawtooth-wave" width={60} height={50}/>
                          </div>
                      </label>
                  </li>
              </ul>
          </div>
      </div>
    </>
  )
}
