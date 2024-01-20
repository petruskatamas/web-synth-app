import React, { ReactNode } from 'react';

interface ModalInterface {
  children: ReactNode;
  title: string;
}

export const Modal = ({ children, title }: ModalInterface) => {
  return (
    <div className='flex h-fit w-[90%] flex-col gap-2 rounded border-2 border-slate-300 bg-white p-5 text-sm leading-loose text-gray-500 shadow-2xl md:w-1/3'>
      <h1 className='font-bold'>{title}</h1>
      {children}
    </div>
  );
};
