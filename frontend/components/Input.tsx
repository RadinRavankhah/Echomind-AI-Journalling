import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const TextInput: React.FC<InputProps> = ({ label, className = '', ...props }) => (
  <div className="flex flex-col gap-2 w-full">
    {label && <label className="text-xs uppercase tracking-widest text-gray-500 font-sans">{label}</label>}
    <input
      className={`bg-transparent border-b border-[#2A2C32] py-3 text-[#F5F5F2] placeholder-gray-700 focus:outline-none focus:border-[#F5F5F2] transition-colors duration-300 font-sans text-lg ${className}`}
      {...props}
    />
  </div>
);

export const TextArea: React.FC<TextAreaProps> = ({ label, className = '', ...props }) => (
  <div className="flex flex-col gap-2 w-full h-full">
    {label && <label className="text-xs uppercase tracking-widest text-gray-500 font-sans">{label}</label>}
    <textarea
      className={`bg-transparent border border-[#2A2C32] rounded-xl p-4 text-[#F5F5F2] placeholder-gray-700 focus:outline-none focus:border-gray-500 transition-colors duration-300 font-serif text-xl leading-relaxed resize-none w-full h-full ${className}`}
      {...props}
    />
  </div>
);