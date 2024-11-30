'use client';

import React, { useEffect } from 'react';
import ContestEnrolledList from './components/contestHistory/ContestEnrolledList';
import { mypageTabNameStore } from '@/store/MypageTabName';
import ExamEnrolledList from './components/examHistory/ExamEnrolledList';

export default function EnrolledHistory() {
  const updateTabName = mypageTabNameStore((state: any) => state.updateTabName);

  useEffect(() => {
    updateTabName('enrolled-history');
  }, [updateTabName]);

  return (
    <div className="flex flex-col gap-16 mb-20">
      <div>
        <p className="text-2xl font-semibold">대회 참가 내역</p>
        <div className="border-t-[3px] mt-4 border-black" />
        <section className="dark:bg-gray-900">
          <ContestEnrolledList />
        </section>
      </div>

      <div>
        <p className="text-2xl font-semibold">시험 참가 내역</p>
        <div className="border-t-[3px] mt-4 border-black" />
        <section className="dark:bg-gray-900">
          <ExamEnrolledList />
        </section>
      </div>
    </div>
  );
}
