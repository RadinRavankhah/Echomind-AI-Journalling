import React from 'react';

export const EchoCircle: React.FC = () => {
  return (
    // <div className="relative w-64 h-64 flex items-center justify-center pointer-events-none select-none">
    //   {/* Outer faint ring */}
    //   <div className="absolute w-64 h-64 rounded-full border border-[#2A2C32] opacity-20 animate-pulse-ring" style={{ animationDelay: '0s' }}></div>
    //   {/* Inner faint ring */}
    //   <div className="absolute w-48 h-48 rounded-full border border-[#2A2C32] opacity-30 animate-pulse-ring" style={{ animationDelay: '2s' }}></div>
    //   {/* Core breathing circle */}
    //   <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#1E1F23] to-[#2A2C32] animate-breathe blur-sm"></div>
    // </div>
    <div className="relative w-64 h-64 flex items-center justify-center pointer-events-none select-none">
      {/* Outer faint ring */}
      <div className="absolute w-64 h-64 rounded-full border border-[#ffffff] opacity-20 animate-pulse-ring" style={{ animationDelay: '0s' }}></div>
      {/* Inner faint ring */}
      <div className="absolute w-48 h-48 rounded-full border border-[#ffffff] opacity-30 animate-pulse-ring" style={{ animationDelay: '2s' }}></div>
      {/* Core breathing circle */}
      <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#f0f0f0] to-[#2A2C32] animate-breathe blur-sm"></div>
    </div>
  );
};