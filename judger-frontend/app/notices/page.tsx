'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import NoticeList from './components/NoticeList';
import Image from 'next/image';
import bellImg from '@/public/images/bell.png';
import { userInfoStore } from '@/store/UserInfo';
import { OPERATOR_ROLES } from '../../constants/role';
import { useSearchParams } from 'next/navigation';

export default function Notices() {
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
      <div className="flex flex-col w-[60rem] mx-auto">
        <p className="h-16 flex items-center text-3xl font-semibold tracking-wide">
          <Image
            src={bellImg}
            alt="bell"
            width={67.5}
            height={0}
            quality={100}
            className="ml-[-1rem] fade-in-fast drop-shadow-lg"
          />
          <span className="ml-3 lift-up">공지사항</span>
        </p>
        <form className="mt-5 mb-4">
          <div className="flex">
            <div className="flex flex-col relative z-0 w-1/2 group">
              <input
                type="text"
                name="floating_first_name"
                className="block pl-7 pt-3 pb-[0.175rem] pr-0 w-full font-normal text-gray-900 bg-transparent border-0 border-b border-gray-400 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute pt-[0.9rem] left-[-0.9rem] flex items-center pl-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="21"
                  viewBox="0 -960 960 960"
                  width="21"
                  fill="#464646"
                >
                  <path d="M785.269-141.629 530.501-396.501q-29.502 26.199-69.036 40.003-39.533 13.805-80.64 13.805-100.978 0-170.677-69.711-69.698-69.71-69.698-169.473 0-99.764 69.423-169.558 69.423-69.795 169.62-69.795 100.198 0 169.974 69.757 69.776 69.756 69.776 169.593 0 41.752-14.411 81.136-14.41 39.385-40.064 70.298L820.05-176.667l-34.781 35.038ZM380.256-390.577q79.907 0 135.505-55.536t55.598-135.91q0-80.375-55.598-135.849-55.598-55.475-135.767-55.475-80.511 0-136.086 55.537-55.575 55.536-55.575 135.91 0 80.375 55.619 135.849 55.618 55.474 136.304 55.474Z" />
                </svg>
              </div>
              <label
                htmlFor="floating_first_name"
                className="peer-focus:font-light absolute text-base font-light text-gray-500  duration-300 transform -translate-x-[-1.75rem] -translate-y-5 scale-75 top-3 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-[1.25rem] z-10"
              >
                검색
              </label>
              <p className="text-gray-500 text-xs tracking-widest font-light mt-1">
                제목, 작성자명으로 검색
              </p>
            </div>
            {OPERATOR_ROLES.includes(userInfo.role) && (
              <div className="relative ml-auto mt-auto bottom-[-0.75rem]">
                <div className="flex justify-end mb-2">
                  <div className="flex">
                    <Link
                      href="notices/register"
                      className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-white bg-[#3a8af9] px-4 py-[0.5rem] rounded-[7px] font-medium  hover:bg-[#1c6cdb]"
                    >
                      등록하기
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>

        {isInitialized && (
          <section className="dark:bg-gray-900">
            <NoticeList searchQuery={searchQuery} />
          </section>
        )}
      </div>
    </div>
  );
}
