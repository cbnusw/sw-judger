import React from 'react';

export default function ContestDetailContentLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-y-2 pb-5">
      <div className="flex gap-x-2">
        <div className="skeleton w-[5rem] h-[1rem]" />
        <div className="skeleton w-[10rem] h-[1rem]" />
        <div className="skeleton w-[7.5rem] h-[1rem]" />
      </div>
      <div className="ml-4 flex gap-x-2">
        <div className="skeleton w-[10rem] h-[1rem]" />
        <div className="skeleton w-[12.5rem] h-[1rem]" />
      </div>
      <div className="ml-4 flex gap-x-2">
        <div className="skeleton w-[6rem] h-[1rem]" />
        <div className="skeleton w-[10rem] h-[1rem]" />
      </div>

      <div className="mt-4 flex gap-x-2">
        <div className="skeleton w-[5rem] h-[1rem]" />
        <div className="skeleton w-[12.5rem] h-[1rem]" />
        <div className="skeleton w-[7.5rem] h-[1rem]" />
      </div>
      <div className="ml-4 flex gap-x-2">
        <div className="skeleton w-[12.5rem] h-[1rem]" />
        <div className="skeleton w-[5rem] h-[1rem]" />
        <div className="skeleton w-[10rem] h-[1rem]" />
      </div>
      <div className="flex gap-x-2">
        <div className="skeleton w-[10rem] h-[1rem]" />
        <div className="skeleton w-[12.5rem] h-[1rem]" />
      </div>
      <div className="flex gap-x-2">
        <div className="skeleton w-[6rem] h-[1rem]" />
        <div className="skeleton w-[10rem] h-[1rem]" />
      </div>

      <div className="mt-4 flex gap-x-2">
        <div className="skeleton w-[10rem] h-[1rem]" />
      </div>
      <div className="ml-4 flex gap-x-2">
        <div className="skeleton w-[3rem] h-[1rem]" />
        <div className="skeleton w-[12.5rem] h-[1rem]" />
      </div>
      <div className="ml-4 flex gap-x-2">
        <div className="skeleton w-[10rem] h-[1rem]" />
        <div className="skeleton w-[5rem] h-[1rem]" />
      </div>

      <div className="mt-4 flex gap-x-2">
        <div className="skeleton w-[7.5rem] h-[1rem]" />
        <div className="skeleton w-[12.5rem] h-[1rem]" />
      </div>
    </div>
  );
}
