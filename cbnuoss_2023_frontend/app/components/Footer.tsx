'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import Image from 'next/image';
import circleLogoImg from '@/public/images/circle-logo.png';
import circleCbnuLogoImg from '@/public/images/circle-cbnu-logo.png';

export default function Footer() {
  // 현재 년도를 가져오기
  const currentYear = new Date().getFullYear();

  const [openPrivacyPolicyModal, setOpenPrivacyPolicyModal] = useState<
    string | undefined
  >();

  return (
    <div className="w-full flex justify-start mt-auto font-light text-[10px] pt-5 pb-10 px-3 leading-[1.175rem] bg-[#191f28]">
      <div className="flex flex-col gap-y-2 mx-auto w-[47.5rem] py-10">
        <div className="flex justify-between w-full">
          <div className="flex gap-x-20">
            <div className="flex flex-col gap-[0.7rem] text-[0.825rem] leading-[1.25]">
              <span className="text-[#b0b8c1] font-semibold">서비스</span>
              <Link
                href="/contests"
                className="mt-2 text-[#6b7684] hover:underline"
              >
                대회
              </Link>
              <Link href="/exams" className="text-[#6b7684] hover:underline">
                시험
              </Link>
              <Link
                href="/practices"
                className="text-[#6b7684] hover:underline"
              >
                연습문제
              </Link>
              <Link href="/notices" className="text-[#6b7684] hover:underline">
                공지사항
              </Link>
            </div>

            <div className="flex flex-col gap-[0.7rem] text-[0.825rem] leading-[1.25]">
              <span className="text-[#b0b8c1] font-semibold">관련 사이트</span>
              <a
                target="_blank"
                href="https://sw7up.cbnu.ac.kr/home"
                className="mt-2 text-[#6b7684] hover:underline"
              >
                SW중심대학사업단
              </a>
              <a
                target="_blank"
                href="https://sw7up.cbnu.ac.kr/project/dashboard"
                className="text-[#6b7684] hover:underline"
              >
                코딩이력관리시스템
              </a>
              <a
                target="_blank"
                href="https://www.chungbuk.ac.kr/www/index.do"
                className="text-[#6b7684] hover:underline"
              >
                충북대학교
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 text-xs grid grid-cols-1 gap-y-5">
          <span className="text-[0.77rem] leading-[1.25] text-[#b0b8c1] font-semibold">
            SW중심대학사업단
          </span>
          <p className="flex flex-col gap-y-[0.1rem] tracking-tight text-[0.5rem]">
            <span className=" text-[#8b95a1]">
              28644 충청북도 청주시 서원구 충대로1(개신동)
              학연산공동기술연구원(E9동)
            </span>
            <span className="text-[#8b95a1]">
              © {currentYear} 충북대학교 SW중심대학사업단. All rights reserved.
            </span>
          </p>
          <p className="flex gap-5 text-[0.5rem]">
            <button
              onClick={() => setOpenPrivacyPolicyModal('default')}
              className="text-[#b0b8c1] hover:underline"
            >
              개인정보 처리방침
            </button>
            {openPrivacyPolicyModal && (
              <PrivacyPolicyModal
                openPrivacyPolicyModal={openPrivacyPolicyModal}
                setOpenPrivacyPolicyModal={setOpenPrivacyPolicyModal}
              />
            )}
          </p>
        </div>

        <div className="mt-4 text-xs flex gap-x-3">
          <a target="_blank" href="https://sw7up.cbnu.ac.kr/home">
            <Image
              src={circleLogoImg}
              alt="circleLogo"
              width={35}
              height={0}
              quality={100}
              className="hover:brightness-125"
            />
          </a>
          <a target="_blank" href="https://www.chungbuk.ac.kr/www/index.do">
            <Image
              src={circleCbnuLogoImg}
              alt="circleCbnuLogo"
              width={35}
              height={0}
              quality={100}
              className="hover:brightness-125"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
