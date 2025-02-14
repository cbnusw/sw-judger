'use client';

import { mypageTabNameStore } from '@/store/MypageTabName';
import { userInfoStore } from '@/store/UserInfo';
import React, { useEffect } from 'react';

export default function Profile() {
  const userInfo = userInfoStore((state: any) => state.userInfo);
  const updateTabName = mypageTabNameStore((state: any) => state.updateTabName);

  useEffect(() => {
    updateTabName('profile');
  }, [updateTabName]);

  return (
    <div className="mb-20">
      <p className="text-2xl font-bold">회원정보</p>
      <div className="border-t-[3px] mt-4 border-black" />
      <div className="flex flex-col mt-4 tracking-tight text-xs font-medium">
        <div className="flex items-center pb-3 border-b ">
          <span className="w-[6rem] 3md:w-[11rem] text-sm">학번</span>
          <span className="w-fit font-bold">{userInfo.no}</span>
        </div>
        <div className="flex flex-col 3md:flex-row items-start 3md:items-center gap-3 3md:gap-0 py-3 border-b">
          <div className="flex items-center">
            <div className="w-[6rem] 3md:w-[11rem] text-sm">비밀번호</div>
            <div className="w-fit 2lg:w-80 font-bold">********</div>
          </div>
          <a
            href="https://sw7up.cbnu.ac.kr/my-page/password"
            target="_blank"
            className="w-full ml-auto 2lg:ml-0 3md:w-fit flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-4 py-[0.5rem] rounded-[7px] font-medium  hover:bg-[#d3d6da]"
          >
            비밀번호 변경
          </a>
        </div>
        <div className="flex flex-col 3md:flex-row items-start 3md:items-center gap-3 3md:gap-0 py-3 border-b">
          <div className="flex items-center">
            <div className="w-[6rem] 3md:w-[11rem] text-sm">이름(실명)</div>
            <div className="w-fit 2lg:w-80 font-bold">{userInfo.name}</div>
          </div>
          <a
            href="https://sw7up.cbnu.ac.kr/my-page/info"
            target="_blank"
            className="w-full ml-auto 2lg:ml-0 3md:w-fit flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-4 py-[0.5rem] rounded-[7px] font-medium  hover:bg-[#d3d6da]"
          >
            개인정보 변경
          </a>
        </div>
        <div className="flex items-center py-3 border-b">
          <div className="w-[6rem] 3md:w-[11rem] text-sm">이메일</div>
          <div className="w-fit font-bold">{userInfo.email}</div>
        </div>
        <div className="flex items-center py-3 border-b">
          <div className="w-[6rem] 3md:w-[11rem] text-sm">대학</div>
          <div className="w-fit font-bold">{userInfo.university}</div>
        </div>
        <div className="flex items-center py-3 border-b">
          <div className="w-[6rem] 3md:w-[11rem] text-sm">학부(과)</div>
          <div className="w-fit font-bold">{userInfo.department}</div>
        </div>
        <div className="flex items-center py-3 border-b">
          <div className="w-[6rem] 3md:w-[11rem] text-sm">휴대전화</div>
          <div className="w-fit font-bold">{userInfo.phone}</div>
        </div>
      </div>
    </div>
  );
}
