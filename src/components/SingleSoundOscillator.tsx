'use client';
import { MutableRefObject, useRef, useState } from 'react';
import { Modal } from '@/components/Modal';
import { WaveformSelect } from '@/components/WaveformSelect';
import { Button } from '@/components/Button';

const AudioContext = window.AudioContext || window.AudioContext;

export default function SingleSoundOscillator() {
  const [visibility, setVisibility] = useState(false);

  const audioContext: MutableRefObject<AudioContext | null> = useRef(null);
  const isPlaying: MutableRefObject<boolean> = useRef(false);
  const oscType: MutableRefObject<OscillatorType> = useRef(
    'sine' as OscillatorType
  );
  const oscillator: MutableRefObject<OscillatorNode | null> = useRef(null);
  const masterVol: MutableRefObject<GainNode | null> = useRef(null);
  const [volumeNum, setVolumeNum] = useState(0.3);

  const handleStart = () => {
    if (isPlaying.current === false) {
      isPlaying.current = true;
      (audioContext as MutableRefObject<AudioContext>).current =
        new AudioContext();
      (oscillator as MutableRefObject<OscillatorNode | undefined>).current =
        audioContext.current?.createOscillator();
      (masterVol as MutableRefObject<GainNode | undefined>).current =
        audioContext.current?.createGain();
      (oscillator.current as OscillatorNode).type = oscType.current;
      (masterVol.current as GainNode).connect(
        audioContext.current?.destination as AudioDestinationNode
      );
      (masterVol.current as GainNode).gain.value = volumeNum;
      (oscillator.current as OscillatorNode).frequency.setValueAtTime(220, 0);
      (oscillator.current as OscillatorNode).connect(
        masterVol.current as GainNode
      );
      (oscillator.current as OscillatorNode).start(0);
    }
  };

  const handleStop = () => {
    if (isPlaying.current === true) {
      isPlaying.current = false;
      (oscillator.current as OscillatorNode).stop(0);
      (masterVol as MutableRefObject<GainNode | null>).current = null;
      (oscillator as MutableRefObject<OscillatorNode | null>).current = null;
      (audioContext as MutableRefObject<AudioContext | null>).current = null;
    }
  };

  const setOscType = (type: OscillatorType) => {
    oscType.current = type;
    oscillator.current
      ? ((oscillator.current as OscillatorNode).type = oscType.current)
      : null;
  };

  return (
    <>
      <div className=' flex h-fit min-h-screen w-full flex-col items-center justify-start gap-12 p-8 md:flex-row md:justify-center'>
        <div className='relative flex h-fit w-[90%] flex-col gap-4 rounded border-2 border-slate-300 bg-white p-5 pb-8 shadow-2xl lg:w-2/4'>
          <div className='grid w-full grid-cols-2 gap-6'>
            <Button
              onClick={handleStart}
              label={'START'}
              variant={'start'}
              className={'w-full'}
            />
            <Button
              onClick={handleStop}
              label={'STOP'}
              variant={'stop'}
              className={'w-full'}
            />
          </div>
          <div className='flex w-full flex-col items-center justify-center gap-4'>
            <div className='flex w-full flex-col gap-2'>
              <div>
                <label className='text-lg font-semibold text-gray-500'>
                  Volume:{' '}
                </label>
                <span className='text-lg font-semibold text-gray-500'>
                  {volumeNum * 100}%
                </span>
              </div>
              <input
                onChange={(e) => {
                  setVolumeNum(Number(e.target.value));
                  masterVol.current
                    ? ((masterVol.current as GainNode).gain.value = Number(
                        e.target.value
                      ))
                    : null;
                }}
                className='w-full'
                type='range'
                min='0'
                max='1'
                step='0.1'
                defaultValue={0.3}
              />
            </div>
            <ul className='grid w-full grid-cols-4 flex-row items-center justify-between gap-6'>
              <li>
                <WaveformSelect
                  id={'sine-wave'}
                  value={'sine'}
                  label={'Sine'}
                  fn={setOscType}
                  img={'/Simple_sine_wave.svg'}
                  checked={true}
                />
              </li>
              <li>
                <WaveformSelect
                  id={'square-wave'}
                  value={'square'}
                  label={'Square'}
                  fn={setOscType}
                  img={'/Square_wave.svg'}
                />
              </li>
              <li>
                <WaveformSelect
                  id={'triangle-wave'}
                  value={'triangle'}
                  label={'Triangle'}
                  fn={setOscType}
                  img={'/Triangle_wave.svg'}
                />
              </li>
              <li>
                <WaveformSelect
                  id={'saw-wave'}
                  value={'sawtooth'}
                  label={'Sawtooth'}
                  fn={setOscType}
                  img={'/Sawtooth_wave.svg'}
                />
              </li>
            </ul>
            <Button
              onClick={() => setVisibility(!visibility)}
              variant='default'
              label={visibility ? 'Hide description' : 'Show description'}
            />
          </div>
        </div>
        {visibility && (
          <Modal title='Single Sound Oscillator'>
            <p>
              This module makes use of the Audio Web API to produce a singlie
              sound.
            </p>
            <p>How to recreate this?</p>
            <p>
              We initalize an{' '}
              <code className='rounded-lg bg-slate-300 px-[5px] py-[3px] text-sm text-black'>
                AudioContext
              </code>{' '}
              as our audio source in the browser. We create an{' '}
              <code className='rounded-lg bg-slate-300 px-[5px] py-[3px] text-sm text-black'>
                oscilator
              </code>{' '}
              from our context with a{' '}
              <code className='rounded-lg bg-slate-300 px-[5px] py-[3px] text-sm text-black'>
                type
              </code>{' '}
              property and connect it to the{' '}
              <code className='rounded-lg bg-slate-300 px-[5px] py-[3px] text-sm text-black'>
                masterVolume
              </code>{' '}
              - created from the same context.
            </p>
            <p>By definition, we have created the simplest synthesizer!</p>
            <p>
              Learn more:{' '}
              <a
                className='text-cyan-700 underline'
                href='https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API'
              >
                Web Aduio API docs
              </a>
            </p>
          </Modal>
        )}
      </div>
    </>
  );
}
