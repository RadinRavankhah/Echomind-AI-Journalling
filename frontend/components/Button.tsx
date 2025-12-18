import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "py-4 px-6 rounded-lg font-sans text-sm tracking-wide transition-all duration-300 flex items-center justify-center";
  
  const variants = {
    primary: "bg-[#F5F5F2] text-[#050608] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed",
    secondary: "border border-[#2A2C32] text-[#F5F5F2] hover:bg-[#1E1F23] disabled:opacity-30",
    ghost: "text-[#888] hover:text-[#F5F5F2] bg-transparent",
    danger: "text-red-400 hover:text-red-300 bg-transparent border border-red-900/30 hover:bg-red-900/10"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};