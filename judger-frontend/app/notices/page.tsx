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
    <div className="mt-10 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[21rem] xs:w-[90%] xl:w-[60rem] mx-auto">
        <p className="h-16 flex items-center text-[42px] font-bold tracking-wide">
          <span className="lift-up">공지사항</span>
        </p>

        <div className="mt-6">
          <div className="flex flex-col 3md:flex-row justify-end gap-2 items-start">
            {OPERATOR_ROLES.includes(userInfo.role) && (
              <div className="w-full 3md:w-fit mt-2 3md:mt-0 flex gap-2">
                <Link
                  href="notices/register"
                  className="w-full flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-white bg-[#3a8af9] px-4 py-[0.5rem] rounded-[7px] font-semibold  hover:bg-[#1c6cdb]"
                >
                  등록하기
                </Link>
              </div>
            )}
          </div>
        </div>

        {isInitialized && (
          <section className="dark:bg-gray-900">
            <NoticeList searchQuery={searchQuery} />
          </section>
        )}
      </div>
    </div>
  );
}
