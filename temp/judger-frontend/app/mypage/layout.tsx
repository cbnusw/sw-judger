'use client';

import { useRouter } from 'next/navigation';
import { mypageTabNameStore } from '@/store/MypageTabName';
import { userInfoStore } from '@/store/UserInfo';
import { useEffect, useState } from 'react';
import { fetchCurrentUserInfo } from '@/utils/fetchCurrentUserInfo';
import Loading from '../loading';
import { OPERATOR_ROLES } from '../../constants/role';

export default function MyPagelayout({
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

  if (isLoading) return <Loading />;

  return (
    <div className="mt-6 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[60rem] mx-auto">
        <div className="text-3xl font-semibold tracking-wide lift-up">
          마이페이지
        </div>
        <div className="flex gap-8 mt-10">
          <div className="w-52">
            <div className="flex flex-col items-start gap-[1.125rem] font-semibold tracking-wide">
              <button
                onClick={() => handleChangeTab(tabNames[0])}
                className={`${
                  mypageTabName === tabNames[0]
                    ? 'text-[#242424] font-bold'
                    : 'text-[#6e6e6e] hover:text-[#3a8af9]'
                } `}
              >
                프로필 정보
              </button>
              <button
                onClick={() => handleChangeTab(tabNames[1])}
                className={`${
                  mypageTabName === tabNames[1]
                    ? 'text-[#242424] font-bold'
                    : 'text-[#6e6e6e] hover:text-[#3a8af9]'
                } `}
              >
                참가 내역
              </button>
              {OPERATOR_ROLES.includes(userInfo.role) && (
                <button
                  onClick={() => handleChangeTab(tabNames[2])}
                  className={`${
                    mypageTabName === tabNames[2]
                      ? 'text-[#242424] font-bold'
                      : 'text-[#6e6e6e] hover:text-[#3a8af9]'
                  } `}
                >
                  작성글 관리
                </button>
              )}
            </div>
          </div>
          <div className="w-full mt-[-0.75rem]">{children}</div>
        </div>
      </div>
    </div>
  );
}
