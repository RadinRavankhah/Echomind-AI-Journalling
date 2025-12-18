import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#2A2C32] py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex justify-between items-center w-full text-left focus:outline-none group"
      >
        <span className="text-sm font-sans tracking-wide text-gray-400 group-hover:text-[#F5F5F2] transition-colors uppercase">
          {title}
        </span>
        {isOpen ? (
          <ChevronUp size={16} className="text-gray-500 group-hover:text-[#F5F5F2]" />
        ) : (
          <ChevronDown size={16} className="text-gray-500 group-hover:text-[#F5F5F2]" />
        )}
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
      >
        <div className="text-[#F5F5F2] font-serif leading-relaxed text-lg">
          {children}
        </div>
      </div>
    </div>
  );
};