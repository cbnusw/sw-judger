import Image from 'next/image';
import React from 'react';
import notFoundGif from '@/public/gifs/not-found.gif';

interface NotFoundProps {
  message: string;
}

export default function NotFound({ message }: NotFoundProps) {
  return (
    <div className="flex flex-col gap-y-5 justify-center items-center h-[25rem]">
      <Image
        src={notFoundGif}
        alt="notFoundGif"
        width={70}
        quality={100}
        className="rounded-md object-cover"
      />
      <span className="font-light text-sm text-[#8b95a1]">{message}</span>
    </div>
  );
}
