'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ExamList from './components/ExamList';
import Image from 'next/image';
import examImg from '@/public/images/exam.png';
import { userInfoStore } from '@/store/UserInfo';
import { OPERATOR_ROLES } from '../../constants/role';
import { useSearchParams } from 'next/navigation';

export default function Exams() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  const userInfo = userInfoStore((state: any) => state.userInfo);

  const params = useSearchParams();

  const titleQuery = decodeURIComponent(params?.get('title') || '');

  useEffect(() => {
    if (!isInitialized) {
      setSearchQuery(titleQuery);
      setIsInitialized(true);
    }
  }, [titleQuery, isInitialized]);

  return (
    <div className="mt-2 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[21rem] xs:w-[90%] xl:w-[60rem] mx-auto">
        <p className="h-16 flex items-center text-[32px] font-semibold tracking-wide">
          <span className="lift-up">시험 목록</span>
        </p>

        <div className="mt-5 mb-4">
          <div className="flex flex-col 3md:flex-row justify-between gap-2 items-start">
            <div className="w-full 3md:w-1/2 h-[2.3rem] flex items-center pl-3 pr-1 outline outline-1 outline-[#e6e8ea] rounded-md hover:outline-[#93bcfa] hover:outline-2 focus-within:outline-[#93bcfa] focus-within:outline-2">
              <svg
                fill="none"
                width="21"
                height="21"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m19.59 18.41-3.205-3.203c1.0712-1.3712 1.579-3.0994 1.4197-4.832-.1593-1.73274-.9735-3.3394-2.2767-4.49233s-2.9972-1.76527-4.7364-1.71212c-1.73913.05315-3.39252.76779-4.62288 1.99815s-1.945 2.88375-1.99815 4.6229c-.05316 1.7392.55918 3.4332 1.71211 4.7364s2.7596 2.1174 4.49232 2.2767c1.7327.1592 3.4608-.3485 4.832-1.4197l3.204 3.204c.1567.1541.3678.24.5876.2391.2197-.0009.4302-.0886.5856-.2439.1554-.1554.243-.3659.2439-.5856.001-.2198-.085-.431-.2391-.5876zm-4.886-3.808c-.0183.0156-.036.032-.053.049-.042.044-.042.044-.08.092-.91.886-2.197 1.424-3.571 1.424-1.19232.0001-2.348-.4121-3.27107-1.1668s-1.55672-1.8055-1.79352-2.974c-.2368-1.1686-.06217-2.38311.49428-3.43762s1.46047-1.88413 2.55878-2.34819c1.09833-.46405 2.32333-.53398 3.46733-.19793s2.1365 1.0574 2.8094 2.04174c.6728.98434.9845 2.1711.8822 3.359-.1022 1.1879-.6122 2.3039-1.4434 3.1588z"
                  fill="#8994a2"
                ></path>
              </svg>
              <div className="w-full">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-[2.3rem] pl-[0.625rem] pr-[0.25rem] outline-none placeholder-[#888e96] text-[0.825rem] font-extralight"
                  placeholder="시험명, 수업명, 작성자명으로 검색"
                />
              </div>
              {searchQuery && (
                <button
                  onClick={(e) => {
                    setSearchQuery('');
                  }}
                  className="p-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="25"
                    viewBox="0 -960 960 960"
                    width="25"
                    fill="#a2a4a9"
                  >
                    <path d="M480-437.847 277.076-234.924q-8.307 8.308-20.884 8.5-12.576.193-21.268-8.5-8.693-8.692-8.693-21.076t8.693-21.076L437.847-480 234.924-682.924q-8.308-8.307-8.5-20.884-.193-12.576 8.5-21.268 8.692-8.693 21.076-8.693t21.076 8.693L480-522.153l202.924-202.923q8.307-8.308 20.884-8.5 12.576-.193 21.268 8.5 8.693 8.692 8.693 21.076t-8.693 21.076L522.153-480l202.923 202.924q8.308 8.307 8.5 20.884.193 12.576-8.5 21.268-8.692 8.693-21.076 8.693t-21.076-8.693L480-437.847Z"></path>
                  </svg>
                </button>
              )}
            </div>

            {OPERATOR_ROLES.includes(userInfo.role) && (
              <div className="w-full 3md:w-fit mt-2 3md:mt-0 flex gap-2">
                <Link
                  href="exams/register"
                  className="w-full flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-white bg-[#3a8af9] px-4 py-[0.5rem] rounded-[7px] font-medium  hover:bg-[#1c6cdb]"
                >
                  등록하기
                </Link>
              </div>
            )}
          </div>
        </div>

        {isInitialized && (
          <section className="dark:bg-gray-900">
            <ExamList searchQuery={searchQuery} />
          </section>
        )}
      </div>
    </div>
  );
}
