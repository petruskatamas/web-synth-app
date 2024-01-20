import React from 'react';
import Image from 'next/image';

interface WaveformSelectInterface {
  id: string;
  value: string;
  label: string;
  fn: Function;
  img: string;
  checked?: boolean;
  width?: number;
  height?: number;
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
}: WaveformSelectInterface) => {
  return (
    <>
      <input
        onChange={(e) => fn(e.target.value as OscillatorType)}
        type='radio'
        id={id}
        name='wave'
        value={value}
        className='peer hidden'
        defaultChecked={checked}
      />
      <label
        htmlFor={id}
        className='flex w-full cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white p-4 text-gray-500 transition  duration-300 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:hover:text-gray-300'
      >
        <div className='flex flex-col gap-2'>
          <div className='w-full text-center text-lg font-semibold'>
            {label}
          </div>
          <Image
            className='mx-auto flex items-center justify-center'
            src={img}
            alt='waveform'
            width={width}
            height={height}
          />
        </div>
      </label>
    </>
  );
};
