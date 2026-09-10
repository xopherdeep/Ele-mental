import React from 'react';

export const SheetHandle: React.FC = () => {
  return (
    <div className="flex justify-center py-2 cursor-grab active:cursor-grabbing select-none">
      <div className="w-10 h-1 rounded-full bg-[#3c445c]" />
    </div>
  );
};
