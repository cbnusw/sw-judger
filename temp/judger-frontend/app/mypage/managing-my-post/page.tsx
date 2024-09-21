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

export default function ManagingMyPost() {
  const [category, setCategory] = useState('contest');

  const router = useRouter();

  const userInfo = userInfoStore((state: any) => state.userInfo);
  const updateTabName = mypageTabNameStore((state: any) => state.updateTabName);

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
    alert('접근 권한이 없습니다.');
    router.back();
    return;
  }

  return (
    <div className="mb-20">
      <div className="flex border-b font-medium text-[0.925rem] leading-[1.375rem] pb-[1.5px]">
        <div>
          <button
            onClick={() => handleChangeCategory('contest')}
            className={`w-[4.75rem] py-2 tracking-wide ${
              category !== 'contest' ? 'text-[#505967]' : 'font-semibold'
            } hover:bg-[#f3f4f5] rounded-[7px]`}
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
              className={`w-[4.75rem] py-2 tracking-wide ${
                category !== 'exam' ? 'text-[#505967]' : 'font-semibold'
              } hover:bg-[#f3f4f5] rounded-[7px]`}
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
              className={`w-[4.75rem] py-2 tracking-wide ${
                category !== 'practice' ? 'text-[#505967]' : 'font-semibold'
              } hover:bg-[#f3f4f5] rounded-[7px]`}
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
              className={`w-[4.75rem] py-2 tracking-wide ${
                category !== 'notice' ? 'text-[#505967]' : 'font-semibold'
              } hover:bg-[#f3f4f5] rounded-[7px]`}
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
