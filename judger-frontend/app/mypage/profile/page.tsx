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
      <p className="text-2xl font-semibold">회원정보</p>
      <div className="border-t-[3px] mt-4 border-black" />
      <div className="flex flex-col mt-4 tracking-tight text-xs">
        <div className="flex items-center pb-3 border-b ">
          <span className="w-44 text-sm">학번</span>
          <span className="w-80 font-bold">{userInfo.no}</span>
        </div>
        <div className="flex items-center py-3 border-b">
          <div className="w-44 text-sm">비밀번호</div>
          <div className="w-80 font-bold">********</div>
          <a
            href="https://sw7up.cbnu.ac.kr/my-page/password"
            target="_blank"
            className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-4 py-[0.5rem] rounded-[7px] font-medium  hover:bg-[#d3d6da]"
          >
            비밀번호 변경
          </a>
        </div>
        <div className="flex items-center py-3 border-b">
          <div className="w-44 text-sm">이름(실명)</div>
          <div className="w-80 font-bold">{userInfo.name}</div>
          <a
            href="https://sw7up.cbnu.ac.kr/my-page/info"
            target="_blank"
            className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-4 py-[0.5rem] rounded-[7px] font-medium  hover:bg-[#d3d6da]"
          >
            개인정보 변경
          </a>
        </div>
        <div className="flex items-center py-3 border-b">
          <div className="w-44 text-sm">이메일</div>
          <div className="w-80 font-bold">{userInfo.email}</div>
        </div>
        <div className="flex items-center py-3 border-b">
          <div className="w-44 text-sm">대학</div>
          <div className="w-80 font-bold">{userInfo.university}</div>
        </div>
        <div className="flex items-center py-3 border-b">
          <div className="w-44 text-sm">학부(과)</div>
          <div className="w-80 font-bold">{userInfo.department}</div>
        </div>
        <div className="flex items-center py-3 border-b">
          <div className="w-44 text-sm">휴대전화</div>
          <div className="w-80 font-bold">{userInfo.phone}</div>
        </div>
      </div>
    </div>
  );
}
