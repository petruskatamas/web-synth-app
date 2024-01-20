import React from 'react';

const ButtonStyles = {
  start:
    'text-white bg-lime-500 border border-gray-200  px-4 py-2 text-center font-bold text-xl rounded hover:bg-lime-600 hover:rounded transition duration-300',
  stop: 'text-white bg-red-500 border border-gray-200  px-4 py-2 text-center font-bold text-xl rounded hover:bg-red-800 hover:rounded transition duration-300',
  default:
    'bg-white border-slate-300 border-2 rounded p-2 shadow-2xl -bottom-6 text-sm font-semibold text-gray-500 hover:text-gray-600 hover:bg-gray-200 transition duration-300',
};

type buttonTypes = 'start' | 'stop' | 'default';

interface ButtonInterface {
  onClick: () => void;
  label: string;
  variant: buttonTypes;
  className?: string;
}

export const Button = ({
  onClick,
  label,
  variant,
  className,
}: ButtonInterface) => {
  return (
    <button
      className={`${ButtonStyles[variant]} ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
