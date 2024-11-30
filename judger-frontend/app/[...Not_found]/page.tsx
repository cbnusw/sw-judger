'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import network_browser_icon from '@/public/images/network_browser_icon.png';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-5 justify-center items-center my-[7.5%] mx-auto text-center">
      <Image
        src={network_browser_icon}
        alt="network_browser_icon"
        width={65}
        height={0}
        quality={100}
      />
      <h1 className="mt-4 text-black text-[1.6rem] leading-[2.25rem] font-semibold">
        페이지를 찾을 수<br />
        없습니다
      </h1>
      <p className="mb-4 text-center text-[0.8rem] leading-[1.25rem] text-gray-500">
        페이지의 주소가 잘못 입력되었거나,
        <br /> 변경 혹은 삭제되어 요청하신 페이지를 찾을 수 없습니다.
        <br />
        입력하신 페이지 주소를 다시 한번 확인해 주세요.
      </p>
      <div className="flex flex-col gap-3">
        <Link
          href="/"
          className="mb-2 px-10 py-[0.7rem] text-sm font-semibold text-white bg-black"
        >
          메인 홈
        </Link>
        <button
          onClick={() => router.back()}
          className="text-xs text-gray-500 bg-transparent font-bold"
        >
          이전 페이지
        </button>
      </div>
    </div>
  );
}
