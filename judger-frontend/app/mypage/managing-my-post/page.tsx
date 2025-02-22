'use client';

import React, { useEffect, useState } from 'react';
import MyContestPostList from './components/contestPost/MyContestPostList';
import MyExamPostList from './components/examPost/MyExamPostList';
import MyPracticePostList from './components/practicePost/MyPracticePostList';
import MyNoticePostList from './components/noticePost/MyNoticePostList';
import { mypageTabNameStore } from '@/store/MypageTabName';
import { userInfoStore } from '@/store/UserInfo';
import { useRouter } from 'next/navigation';
import { OPERATOR_ROLES } from '@/constants/role';
import { ToastInfoStore } from '@/store/ToastInfo';

export default function ManagingMyPost() {
  const userInfo = userInfoStore((state: any) => state.userInfo);
  const updateTabName = mypageTabNameStore((state: any) => state.updateTabName);

  const addToast = ToastInfoStore((state) => state.addToast);

  const [category, setCategory] = useState('contest');

  const router = useRouter();

  const handleChangeCategory = (newCategory: string) => {
    if (category !== newCategory) {
      router.push(`/mypage/managing-my-post?page=1`);
      setCategory(newCategory);
    }
  };

  useEffect(() => {
    updateTabName('managing-my-post');
  }, [updateTabName]);

  // 비관리자 회원의 접근 시 로그인 페이지로 리다이렉트 수행
  if (!OPERATOR_ROLES.includes(userInfo.role)) {
    addToast('warning', '접근 권한이 없어요');
    router.push('/');
    return;
  }

  return (
    <div className="mb-20">
      <div className="flex border-b text-[0.925rem] leading-[1.375rem] pb-[1.5px]">
        <div>
          <button
            onClick={() => handleChangeCategory('contest')}
            className={`w-fit px-4 py-2 ${
              category !== 'contest' ? 'text-[#6b7684]' : 'font-semibold'
            } rounded-[7px] duration-200 hover:font-semibold`}
          >
            대회
          </button>
          {category === 'contest' && (
            <div className="relative top-[3px] h-[2px] rounded-full bg-[#1a1f27]" />
          )}
        </div>
        <div>
          <div>
            <button
              onClick={() => handleChangeCategory('exam')}
              className={`w-fit px-4 py-2 ${
                category !== 'exam' ? 'text-[#6b7684]' : 'font-semibold'
              } rounded-[7px] duration-200 hover:font-semibold`}
            >
              시험
            </button>
            {category === 'exam' && (
              <div className="relative top-[3px] h-[2px] rounded-full bg-[#1a1f27]" />
            )}
          </div>
        </div>
        <div>
          <div>
            <button
              onClick={() => handleChangeCategory('practice')}
              className={`w-fit px-4 py-2 ${
                category !== 'practice' ? 'text-[#6b7684]' : 'font-semibold'
              } rounded-[7px] duration-200 hover:font-semibold`}
            >
              연습문제
            </button>
            {category === 'practice' && (
              <div className="relative top-[3px] h-[2px] rounded-full bg-[#1a1f27]" />
            )}
          </div>
        </div>
        <div>
          <div>
            <button
              onClick={() => handleChangeCategory('notice')}
              className={`w-fit px-4 py-2 ${
                category !== 'notice' ? 'text-[#6b7684]' : 'font-semibold'
              } rounded-[7px] duration-200 hover:font-semibold`}
            >
              공지사항
            </button>
            {category === 'notice' && (
              <div className="relative top-[3px] h-[2px] rounded-full bg-[#1a1f27]" />
            )}
          </div>
        </div>
      </div>
      <div>
        {category === 'contest' ? (
          <section className="dark:bg-gray-900">
            <MyContestPostList />
          </section>
        ) : category === 'exam' ? (
          <section className="dark:bg-gray-900">
            <MyExamPostList />
          </section>
        ) : category === 'practice' ? (
          <section className="dark:bg-gray-900">
            <MyPracticePostList />
          </section>
        ) : (
          <section className="dark:bg-gray-900">
            <MyNoticePostList />
          </section>
        )}
      </div>
    </div>
  );
}
