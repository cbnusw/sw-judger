'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import notFoundImg from '@/public/images/notFound.png';
import warningImg from '@/public/images/warning.png';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-y-5 justify-center items-center my-[7.5%] mx-auto text-center select-none">
      <h1 className="flex items-center gap-x-3 text-[54px] font-semibold text-[#454f5d]">
        404 Error
        <Image
          src={warningImg}
          alt="warning"
          width={47.5}
          height={0}
          quality={100}
        />
      </h1>
      <div className="font-light">
        요청하신 페이지를 찾을 수 없습니다. <br />
        입력하신 주소가 정확한지 다시 한번 확인해주세요.
      </div>
      <button
        onClick={() => router.back()}
        className="font-light text-[#4594fc]"
      >
        이전 페이지로 돌아가기
      </button>
      <Image
        src={notFoundImg}
        alt="notFound"
        width={220}
        height={0}
        quality={100}
      />
    </div>
  );
}
