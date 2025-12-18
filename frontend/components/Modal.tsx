import React from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  primaryAction: () => void;
  primaryLabel: string;
  secondaryAction: () => void;
  secondaryLabel: string;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  title, 
  description, 
  primaryAction, 
  primaryLabel, 
  secondaryAction, 
  secondaryLabel 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-[#101218] border border-[#2A2C32] rounded-xl p-8 max-w-sm w-full shadow-2xl">
        <h3 className="text-xl font-serif text-[#F5F5F2] mb-3 text-center">{title}</h3>
        {description && <p className="text-gray-400 text-center mb-8 font-sans text-sm leading-relaxed">{description}</p>}
        <div className="flex flex-col gap-3">
          <Button onClick={primaryAction} fullWidth>
            {primaryLabel}
          </Button>
          <Button onClick={secondaryAction} variant="ghost" fullWidth>
            {secondaryLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};