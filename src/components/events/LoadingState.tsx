import React from 'react';

export function LoadingState() {
  return (
    <div className="space-y-3 my-6 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="h-20 bg-[#101020] border border-[#203050] rounded-[3px] flex items-center justify-between px-6"
        >
          <div className="space-y-2 w-1/3">
            <div className="h-3 bg-[#203050] rounded w-1/4"></div>
            <div className="h-4 bg-[#203050] rounded w-3/4"></div>
          </div>
          <div className="h-3 bg-[#203050] rounded w-1/6 hidden sm:block"></div>
          <div className="h-3 bg-[#203050] rounded w-1/6 hidden sm:block"></div>
          <div className="h-8 bg-[#203050] rounded w-20"></div>
        </div>
      ))}
    </div>
  );
}
