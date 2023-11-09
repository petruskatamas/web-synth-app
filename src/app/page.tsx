"use client"
import Image from "next/image";
import { MutableRefObject, useRef, useState } from "react";

export const AudioContext = window.AudioContext || window.AudioContext;

export interface NoteInterface {
    delayTime : number,
    delayAmount : number,
    feedback : number,
    volume : number,
    sustainLevel : number,
    attackTime: number,
    releaseTime: number,
    vibratoSpeed: number,
    vibratoAmount: number,
    oscillatorType: MutableRefObject<OscillatorType>,
}

export const playNote = ({
    delayTime,
    delayAmount,
    feedback,
    volume,
    sustainLevel,
    attackTime,
    releaseTime,
    vibratoSpeed,
    vibratoAmount,
    oscillatorType
    } : NoteInterface) => {
        const audioContext : AudioContext = new AudioContext()
        const oscillator : OscillatorNode = audioContext.createOscillator()
        const masterVol : GainNode = audioContext.createGain()
        const noteGain : GainNode = audioContext.createGain()
        const lfo : OscillatorNode = audioContext.createOscillator()
        const lfoGain : GainNode = audioContext.createGain()
        const delay : DelayNode = audioContext.createDelay()
        const delayFeedback : GainNode = audioContext.createGain()
        const delayGain : GainNode = audioContext.createGain()

        delayGain.connect(delay)
        delay.connect(delayFeedback)
        delayFeedback.connect(delay)
        delay.connect(masterVol)
        delay.delayTime.value = delayTime;
        delayGain.gain.value = delayAmount;
        delayFeedback.gain.value = feedback;
  
        masterVol.connect(audioContext.destination);
        masterVol.gain.value = volume
  
        noteGain.gain.setValueAtTime(0, 0);
        noteGain.gain.linearRampToValueAtTime(sustainLevel, audioContext.currentTime + attackTime);
        noteGain.gain.setValueAtTime(sustainLevel, audioContext.currentTime + 1 - releaseTime);
        noteGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
  
        lfo.frequency.setValueAtTime(vibratoSpeed, 0);
        lfo.connect(lfoGain);
        lfo.start(0);
        lfo.stop(audioContext.currentTime + 1);
        
        lfoGain.gain.setValueAtTime(vibratoAmount, 0)
        lfoGain.connect(oscillator.frequency)
  
        oscillator.type = oscillatorType.current as OscillatorType
        oscillator.frequency.setValueAtTime(220, 0);
        oscillator.start(0);
        oscillator.stop(audioContext.currentTime + 1);
        oscillator.connect(noteGain);
        noteGain.connect(masterVol)
        noteGain.connect(delay)
}

// TODO : make components (button, sliders, etc)

export default function Home() {
  const [visibility, setVisibility] = useState(false)
  
  const oscillatorType = useRef("sine" as OscillatorType)
  const [volume, setVolume] = useState(0.3)
  const [sustainLevel,setSustainLevel] = useState(0.8)
  const [attackTime, setAttackTime] = useState(0.3)
  const [releaseTime, setReleaseTime] = useState(0.3)
  const [vibratoAmount, setVibratoAmount] = useState(0.3)
  const [vibratoSpeed, setVibratoSpeed] = useState(10) 
  const [delayTime, setDelayTime] = useState(0)
  const [feedback, setFeedback] = useState(0)
  const [delayAmount, setDelayAmount] = useState(0)
  
  return (
    <>
      <div className=" flex flex-col min-h-screen h-fit w-full p-8 justify-start md:flex-row md:justify-center items-center gap-12">
        <div className="bg-white h-fit w-[90%] lg:w-2/4 rounded p-5 pb-8 shadow-2xl flex flex-col border-slate-300 border-2 gap-4 relative">
            <div className="w-full flex items-center justify-center">
              <button
              onClick={()=>{
                playNote({
                  delayTime,
                  delayAmount,
                  feedback,
                  volume,
                  sustainLevel,
                  attackTime,
                  releaseTime,
                  vibratoSpeed,
                  vibratoAmount,
                  oscillatorType
                })
              }}
              className="w-fit text-white bg-lime-500 border border-gray-200  px-4 py-2 text-center font-bold text-xl rounded hover:bg-lime-600 hover:rounded transition duration-300"
              >PLAY NOTE</button>
            </div>
            <div className="w-full flex flex-col gap-4 justify-center items-center">
              <div className="w-full flex flex-col gap-2 items-center">
                <div className="w-2/3 flex flex-col gap-2 items-center">
                  <div>
                    <label className="text-md text-gray-500 font-semibold">Volume </label>
                    <span className="text-md text-blue-600 font-semibold">{volume*100}%</span>
                  </div>
                  <input
                  onChange={(e) => {
                    setVolume((Number(e.target.value)))
                  }}
                  className="w-full"
                  type="range" min="0" max="1" step="0.1" defaultValue={0.3}/>
                </div>
                <div className="w-full flex flex-row gap-2 items-center">
                  <div className="w-1/3 flex flex-col gap-2 items-center">
                    <div>
                      <label className="text-md text-gray-500 font-semibold">Attack </label>
                      <span className="text-md text-blue-600 font-semibold">{Math.floor(attackTime*200)}</span>
                    </div>
                    <input
                    onChange={(e) => {
                      setAttackTime((Number(e.target.value)))
                    }}
                    className="w-full"
                    type="range" min="0" max="0.5" step="0.05" defaultValue={0.3}/>
                  </div>
                  <div className="w-1/3 flex flex-col gap-2 items-center">
                    <div>
                      <label className="text-md text-gray-500 font-semibold">Sustain </label>
                      <span className="text-md text-blue-600 font-semibold">{sustainLevel*100}</span>
                    </div>
                    <input
                    onChange={(e) => {
                      setSustainLevel((Number(e.target.value)))
                    }}
                    className="w-full"
                    type="range" min="0" max="1" step="0.1" defaultValue={0.8}/>
                  </div>
                  <div className="w-1/3 flex flex-col gap-2 items-center">
                    <div>
                      <label className="text-md text-gray-500 font-semibold">Release </label>
                      <span className="text-md text-blue-600 font-semibold">{Math.floor(releaseTime*200)}</span>
                    </div>
                    <input
                    onChange={(e) => {
                      setReleaseTime((Number(e.target.value)))
                    }}
                    className="w-full"
                    type="range" min="0" max="0.5" step="0.05" defaultValue={0.3}/>
                  </div>
                </div>
                <div className="w-full flex flex-row gap-2 items-center justify-center">
                  <div className="w-1/3 flex flex-col gap-2 items-center">
                    <div>
                      <label className="text-md text-gray-500 font-semibold">Vibrato Amount </label>
                      <span className="text-md text-blue-600 font-semibold">{Math.floor(vibratoAmount*100)}</span>
                    </div>
                    <input
                    onChange={(e) => {
                      setVibratoAmount((Number(e.target.value)))
                    }}
                    className="w-full"
                    type="range" min="0" max="1" step="0.05" defaultValue={0.3}/>
                  </div>
                  <div className="w-1/3 flex flex-col gap-2 items-center">
                    <div>
                      <label className="text-md text-gray-500 font-semibold">Vibrato Speed </label>
                      <span className="text-md text-blue-600 font-semibold">{vibratoSpeed*2}</span>
                    </div>
                    <input
                    onChange={(e) => {
                      setVibratoSpeed((Number(e.target.value)))
                    }}
                    className="w-full"
                    type="range" min="1" max="50" step="2.5" defaultValue={10}/>
                  </div>
                </div>
                <div className="w-full flex flex-row gap-2 items-center">
                  <div className="w-1/3 flex flex-col gap-2 items-center">
                    <div>
                      <label className="text-md text-gray-500 font-semibold">Delay Time </label>
                      <span className="text-md text-blue-600 font-semibold ">{delayTime} s</span>
                    </div>
                    <input
                    onChange={(e) => {
                      setDelayTime((Number(e.target.value)))
                    }}
                    className="w-full"
                    type="range" min="0" max="1" step="0.05" defaultValue={0}/>
                  </div>
                  <div className="w-1/3 flex flex-col gap-2 items-center">
                    <div>
                      <label className="text-md text-gray-500 font-semibold">Delay Feedback </label>
                      <span className="text-md text-blue-600 font-semibold">{Math.floor(feedback*100)}</span>
                    </div>
                    <input
                    onChange={(e) => {
                      setFeedback((Number(e.target.value)))
                    }}
                    className="w-full"
                    type="range" min="0" max=".9" step="0.05" defaultValue={0}/>
                  </div>
                  <div className="w-1/3 flex flex-col gap-2 items-center">
                    <div>
                      <label className="text-md text-gray-500 font-semibold">Delay Amount </label>
                      <span className="text-md text-blue-600 font-semibold">{Math.floor(delayAmount*100)}</span>
                    </div>
                    <input
                    onChange={(e) => {
                      setDelayAmount((Number(e.target.value)))
                    }}
                    className="w-full"
                    type="range" min="0" max=".9" step="0.05" defaultValue={0}/>
                  </div>
                </div>
              </div>
                <ul className="grid grid-cols-4 w-full gap-6 flex-row justify-between items-center">
                    <li>
                        <input 
                        onChange={(e)=> oscillatorType.current = e.target.value as OscillatorType}
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
                        onChange={(e)=> oscillatorType.current = e.target.value as OscillatorType}
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
                        onChange={(e)=> oscillatorType.current = e.target.value as OscillatorType}
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
                        onChange={(e)=> oscillatorType.current = e.target.value as OscillatorType}
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

