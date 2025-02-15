'use client';

import { useRouter } from 'next/navigation';
import { mypageTabNameStore } from '@/store/MypageTabName';
import { userInfoStore } from '@/store/UserInfo';
import { useEffect, useState } from 'react';
import { fetchCurrentUserInfo } from '@/utils/fetchCurrentUserInfo';
import { OPERATOR_ROLES } from '../../constants/role';
import MyPagelayoutLoadingSkeleton from './components/MyPagelayoutLoadingSkeleton';

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userInfo = userInfoStore((state: any) => state.userInfo);
  const updateUserInfo = userInfoStore((state: any) => state.updateUserInfo);
  const mypageTabName = mypageTabNameStore((state: any) => state.tabName);
  const updateTabName = mypageTabNameStore((state: any) => state.updateTabName);

  const [isLoading, setIsLoading] = useState(true);

  const tabNames = ['profile', 'enrolled-history', 'managing-my-post'];

  const router = useRouter();

  const handleChangeTab = (tabName: string) => {
    updateTabName(tabName);
    router.push(`/mypage/${tabName}`);
  };

  // (로그인 한) 사용자 정보 조회
  useEffect(() => {
    fetchCurrentUserInfo(updateUserInfo).then((userInfo) => {
      if (userInfo.isAuth) setIsLoading(false);
    });
  }, [updateUserInfo]);

  if (isLoading) return <MyPagelayoutLoadingSkeleton />;

  return (
    <div className="mt-6 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[21rem] xs:w-[90%] xl:w-[60rem] mx-auto">
        <div className="text-2xl font-bold tracking-wide lift-up">
          마이페이지
        </div>
        <div className="flex flex-col 3md:flex-row gap-10 3md:gap-12 mt-10">
          <div className="w-full 3md:w-52 flex flex-col text-[#4e5968] text-[15px] items-start gap-y-2 font-medium tracking-wide">
            <button
              onClick={() => handleChangeTab(tabNames[0])}
              className={`text-inherit px-4 py-[0.7rem] rounded-[8px] w-full text-start font-semibold ${
                mypageTabName === tabNames[0] && 'bg-[#022047] bg-opacity-5'
              }`}
            >
              프로필 정보
            </button>
            <button
              onClick={() => handleChangeTab(tabNames[1])}
              className={`text-inherit px-4 py-[0.8rem] rounded-[8px] w-full text-start font-semibold ${
                mypageTabName === tabNames[1] && 'bg-[#022047] bg-opacity-5'
              }`}
            >
              참가 내역
            </button>
            {OPERATOR_ROLES.includes(userInfo.role) && (
              <button
                onClick={() => handleChangeTab(tabNames[2])}
                className={`text-inherit px-4 py-[0.8rem] rounded-[8px] w-full text-start font-semibold ${
                  mypageTabName === tabNames[2] && 'bg-[#022047] bg-opacity-5'
                }`}
              >
                작성글 관리
              </button>
            )}
          </div>
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
