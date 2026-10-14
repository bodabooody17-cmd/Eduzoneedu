import React from 'react';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  return (
    <div className="w-full min-h-0 bg-slate-950 text-slate-100 flex flex-col overflow-x-hidden">
      {children}
    </div>
  );
};
