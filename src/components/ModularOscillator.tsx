"use client"
import { MutableRefObject, useRef, useState } from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { Slider } from "@/components/Slider";
import { WaveformSelect } from "@/components/WaveformSelect";

const AudioContext = window.AudioContext || window.AudioContext;

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

  const setOscType = (parameter : OscillatorType) => {
    oscillatorType.current = parameter
  }
  
  return (
    <>
      <div className=" flex flex-col min-h-screen h-fit w-full p-8 justify-start md:flex-row md:justify-center items-center gap-12">
        <div className="bg-white h-fit w-[90%] lg:w-2/4 rounded p-5 pb-8 shadow-2xl flex flex-col border-slate-300 border-2 gap-4 relative">
            <div className="w-full flex items-center justify-center">
              <Button 
                onClick={() => playNote({
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
                  })}
                label={"PLAY NOTE"}
                variant={"start"}
                className={"w-fit"}
              />
            </div>
            <div className="w-full flex flex-col gap-4 justify-center items-center">
              <div className="w-full flex flex-col gap-2 items-center">
                <div className="w-2/3 flex flex-col gap-2 items-center">
                  <div>
                    <label className="text-md text-gray-500 font-semibold">Volume </label>
                    <span className="text-md text-blue-600 font-semibold">{volume*100}%</span>
                  </div>
                  <Slider 
                    min={0}
                    max={1}
                    step={0.1}
                    defaultValue={0.3}
                    fn={setVolume}
                  />
                </div>
                <div className="w-full flex flex-row gap-2 items-center">
                  <div className="w-1/3 flex flex-col gap-2 items-center">
                    <div>
                      <label className="text-md text-gray-500 font-semibold">Attack </label>
                      <span className="text-md text-blue-600 font-semibold">{Math.floor(attackTime*200)}</span>
                    </div>
                    <Slider 
                      min={0}
                      max={0.5}
                      step={0.05}
                      defaultValue={0.3}
                      fn={setAttackTime}
                    />
                  </div>
                  <div className="w-1/3 flex flex-col gap-2 items-center">
                    <div>
                      <label className="text-md text-gray-500 font-semibold">Sustain </label>
                      <span className="text-md text-blue-600 font-semibold">{sustainLevel*100}</span>
                    </div>
                    <Slider 
                      min={0}
                      max={1}
                      step={0.1}
                      defaultValue={0.8}
                      fn={setSustainLevel}
                    />
                  </div>
                  <div className="w-1/3 flex flex-col gap-2 items-center">
                    <div>
                      <label className="text-md text-gray-500 font-semibold">Release </label>
                      <span className="text-md text-blue-600 font-semibold">{Math.floor(releaseTime*200)}</span>
                    </div>
                    <Slider 
                      min={0}
                      max={0.5}
                      step={0.05}
                      defaultValue={0.3}
                      fn={setReleaseTime}
                    />
                  </div>
                </div>
                <div className="w-full flex flex-row gap-2 items-center justify-center">
                  <div className="w-1/3 flex flex-col gap-2 items-center">
                    <div>
                      <label className="text-md text-gray-500 font-semibold">Vibrato Amount </label>
                      <span className="text-md text-blue-600 font-semibold">{Math.floor(vibratoAmount*100)}</span>
                    </div>
                    <Slider 
                      min={0}
                      max={1}
                      step={0.05}
                      defaultValue={0.3}
                      fn={setVibratoAmount}
                    />
                  </div>
                  <div className="w-1/3 flex flex-col gap-2 items-center">
                    <div>
                      <label className="text-md text-gray-500 font-semibold">Vibrato Speed </label>
                      <span className="text-md text-blue-600 font-semibold">{vibratoSpeed*2}</span>
                    </div>
                    <Slider 
                      min={1}
                      max={50}
                      step={2.5}
                      defaultValue={10}
                      fn={setVibratoSpeed}
                    />
                  </div>
                </div>
                <div className="w-full flex flex-row gap-2 items-center">
                  <div className="w-1/3 flex flex-col gap-2 items-center">
                    <div>
                      <label className="text-md text-gray-500 font-semibold">Delay Time </label>
                      <span className="text-md text-blue-600 font-semibold ">{delayTime} s</span>
                    </div>
                    <Slider 
                      min={0}
                      max={1}
                      step={0.05}
                      defaultValue={0}
                      fn={setDelayTime}
                    />
                  </div>
                  <div className="w-1/3 flex flex-col gap-2 items-center">
                    <div>
                      <label className="text-md text-gray-500 font-semibold">Delay Feedback </label>
                      <span className="text-md text-blue-600 font-semibold">{Math.floor(feedback*100)}</span>
                    </div>
                    <Slider 
                      min={0}
                      max={.9}
                      step={0.05}
                      defaultValue={0}
                      fn={setFeedback}
                    />
                  </div>
                  <div className="w-1/3 flex flex-col gap-2 items-center">
                    <div>
                      <label className="text-md text-gray-500 font-semibold">Delay Amount </label>
                      <span className="text-md text-blue-600 font-semibold">{Math.floor(delayAmount*100)}</span>
                    </div>
                    <Slider 
                      min={0}
                      max={.9}
                      step={0.05}
                      defaultValue={0}
                      fn={setDelayAmount}
                    />
                  </div>
                </div>
              </div>
                <ul className="grid grid-cols-4 w-full gap-6 flex-row justify-between items-center">
                    <li>
                        <WaveformSelect 
                          id={"sine-wave"}
                          value={"sine"}
                          label={"Sine"}
                          fn={setOscType}
                          img={"/Simple_sine_wave.svg"}
                          checked={true}
                        />
                    </li>
                    <li>
                        <WaveformSelect 
                          id={"square-wave"}
                          value={"square"}
                          label={"Square"}
                          fn={setOscType}
                          img={"/Square_wave.svg"}
                        />
                    </li>
                    <li>
                        <WaveformSelect 
                          id={"triangle-wave"}
                          value={"triangle"}
                          label={"Triangle"}
                          fn={setOscType}
                          img={"/Triangle_wave.svg"}
                        />
                    </li>
                    <li>
                        <WaveformSelect 
                          id={"saw-wave"}
                          value={"sawtooth"}
                          label={"Sawtooth"}
                          fn={setOscType}
                          img={"/Sawtooth_wave.svg"}
                        />
                    </li>
                </ul>
                <Button 
                  onClick={()=>setVisibility(!visibility)}
                  variant="default"
                  label={visibility ? "Hide description" : "Show description"}
                />
            </div>
        </div>
        {visibility &&
          <Modal title="Adding Effects to an Oscillator">
            <p> 
              Before, we were producing a single sound continously with the <code className="bg-slate-300 text-black py-[3px] px-[5px] rounded-lg text-sm">Web Audio API</code> and
              a simple <code className="bg-slate-300 text-black py-[3px] px-[5px] rounded-lg text-sm">oscillator</code> with a 
              given <code className="bg-slate-300 text-black py-[3px] px-[5px] rounded-lg text-sm">waveform</code> .
            </p>
            <p>
              Now, we are adding some effects with some extra layers of <code className="bg-slate-300 text-black py-[3px] px-[5px] rounded-lg text-sm">AudioContexts</code>, for 
              example an ADSR (Attack,Decay,Sustain,Release) module to manipulate the notes that are played individually.
              We are using a <code className="bg-slate-300 text-black py-[3px] px-[5px] rounded-lg text-sm">GainNode</code> to change the volume of the note over time.
              To tap into the clock of said note we are using the <code className="bg-slate-300 text-black py-[3px] px-[5px] rounded-lg text-sm">context.currentTime</code> method
              where context is our <code className="bg-slate-300 text-black py-[3px] px-[5px] rounded-lg text-sm">AudioContext</code> which from the oscillator was created and currently producing a sound.
            </p>
            <p>
              Controlling the clock of a given oscilator or any audio source is the basis of modularity.
            </p>
            <p>
              Learn more about modularity here: <a className="text-cyan-700 underline" href="https://en.wikipedia.org/wiki/Modular_synthesizer#Typical_modules">Modularity</a>
            </p>
            <p>
              At this point we have created a synth with effects that can play a single note.
              Our next step is either to create a piano to play more notes freely, or to create a sequencer to play a given order of 
              notes at a given speed...
            </p>
            <p>
              How about we create both?!
            </p>
          </Modal> 
        }
      </div>
    </>
  )
}

