import React, { ReactNode } from 'react'

interface ModalInterface {
    children : ReactNode
    title : string
}

export const Modal = ({children,title} : ModalInterface) => {
  return (
    <div className="bg-white h-fit w-[90%] md:w-1/3 rounded p-5 shadow-2xl flex flex-col border-slate-300 border-2 gap-2 text-gray-500 text-sm leading-loose">
        <h1 className="font-bold">{title}</h1>
        {children}
    </div>
  )
}
