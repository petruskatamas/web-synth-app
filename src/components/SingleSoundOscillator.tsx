"use client"
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function SingleSoundOscillator() {
  
  const [visibility, setVisibility] = useState(true)
  
  var AudioContext = window.AudioContext || window.AudioContext;
  
  const isPlaying = useRef(false)
  const oscType = useRef("sine" as OscillatorType)
  const [volumeNum,setVolumeNum] = useState(0.3)
  const [audioContext,setAudioContext] = useState(null as unknown as AudioContext)
  const [oscillator,setOscillator] = useState(null as unknown as OscillatorNode)
  const [masterVol,setMasterVol] = useState(null as unknown as GainNode)

  useEffect(()=>{
    if(audioContext && !oscillator){
      setOscillator(audioContext.createOscillator())
    }else if(audioContext && oscillator && !masterVol){
      setMasterVol(audioContext.createGain())
      oscillator.type = oscType.current
    }else if(audioContext && oscillator && masterVol){
        masterVol.connect(audioContext.destination);
        masterVol.gain.value = volumeNum
        if(isPlaying.current === false){
          isPlaying.current = true
          oscillator.frequency.setValueAtTime(220, 0);
          oscillator.connect(masterVol);
          oscillator.start(0);
      }
    }
  },[audioContext,oscillator,masterVol])
  
  
  const handleStart = () => {
    if(isPlaying.current === false){
      isPlaying.current = false
      setAudioContext(new AudioContext())
    }
  }
  
  const handleStop = () => {
    if(isPlaying.current === true){
      isPlaying.current = false
      oscillator.stop(0)
      setMasterVol(null as unknown as GainNode)
      setOscillator(null as unknown as OscillatorNode)
      setAudioContext(null as unknown as AudioContext)
    }
  }

  const setOscType = (type:OscillatorType) => {
    oscType.current = type
    oscillator ? oscillator.type = oscType.current : null 
  }
  
  return (
    <>
      <div className=" flex flex-col min-h-screen h-fit w-full p-8 justify-start md:flex-row md:justify-center items-center gap-12">
        <div className="bg-white h-fit w-[90%] lg:w-2/4 rounded p-5 pb-8 shadow-2xl flex flex-col border-slate-300 border-2 gap-4 relative">
            <div className="w-full grid grid-cols-2 gap-6">
              <button
              onClick={handleStart}
              className="w-full text-white bg-lime-500 border border-gray-200  px-4 py-2 text-center font-bold text-xl rounded hover:bg-lime-800 hover:rounded transition duration-300"
              >START</button>
              <button
              onClick={handleStop}
              className="w-full text-white bg-red-500 border border-gray-200  px-4 py-2 text-center font-bold text-xl rounded hover:bg-red-800 hover:rounded transition duration-300"
              >STOP</button>
            </div>
            <div className="w-full flex flex-col gap-4 justify-center items-center">
              <div className="w-full flex flex-col gap-2">
                <div>
                  <label className="text-lg text-gray-500 font-semibold">Volume: </label>
                  <span className="text-lg text-gray-500 font-semibold">{volumeNum*100}%</span>
                </div>
                <input
                onChange={(e) => {
                  setVolumeNum((Number(e.target.value)))
                  masterVol ? masterVol.gain.value = Number(e.target.value) : null
                }}
                className="w-full"
                type="range" min="0" max="1" step="0.1" defaultValue={0.3}/>
              </div>
                <ul className="grid grid-cols-2 w-full gap-6 flex-row justify-between items-center">
                    <li>
                        <input 
                        onChange={(e)=> setOscType((e.target.value as OscillatorType))}
                        type="radio" id="sine-wave" name="wave" value="sine" className="hidden peer" defaultChecked/>
                        <label htmlFor="sine-wave" className="flex items-center justify-center w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300  peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 transition duration-300">                           
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
                        <label htmlFor="square-wave" className="flex items-center justify-center w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300  peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 transition duration-300">                           
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
                        <label htmlFor="triangle-wave" className="flex items-center justify-center w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300  peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 transition duration-300">                           
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
                        <label htmlFor="saw-wave" className="flex items-center justify-center w-full p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300  peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 transition duration-300">                           
                            <div className="flex flex-col gap-2">
                              <div className="w-full text-lg font-semibold text-center">Sawtooth</div>
                              <Image className="flex justify-center items-center mx-auto" src="/Sawtooth_wave.svg" alt="sawtooth-wave" width={60} height={50}/>
                            </div>
                        </label>
                    </li>
                </ul>
              <button 
              onClick={()=>setVisibility(!visibility)}
              className="absolute bg-white border-slate-300 border-2 rounded p-2 shadow-2xl -bottom-6 text-sm font-semibold text-gray-500 hover:text-gray-600 hover:bg-gray-200 transition duration-300">
                {visibility ? "Hide description" : "Show description"}
              </button>
            </div>
        </div>
        {visibility && 
          <div className="bg-white h-fit w-[90%] md:w-1/3 rounded p-5 shadow-2xl flex flex-col border-slate-300 border-2 gap-2 text-gray-500 text-sm">
            <h1 className="font-bold">Single Sound Oscillator</h1>
            <p>This module makes use of the Audio Web API to produce a singlie sound.</p>
            <p>How to recreate this?</p>
            <p> 
              We initalize an <code className="bg-slate-300 text-black py-[3px] px-[5px] rounded-lg text-sm">AudioContext</code> as our audio source in the browser.
              We create an <code className="bg-slate-300 text-black py-[3px] px-[5px] rounded-lg text-sm">oscilator</code> from our context
              with a <code className="bg-slate-300 text-black py-[3px] px-[5px] rounded-lg text-sm">type</code> property 
              and connect it to the <code className="bg-slate-300 text-black py-[3px] px-[5px] rounded-lg text-sm">masterVolume</code> - created from the same context.
            </p>
            <p>By definition, we have created the simplest synthesizer!</p>
            <p>Learn more: <a className="text-cyan-700 underline" href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API">Web Aduio API docs</a></p>
          </div>
        }
      </div>
    </>
  )
}
