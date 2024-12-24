'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { userInfoStore } from '@/store/UserInfo';
import axiosInstance from '@/utils/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import { fetchCurrentUserInfo } from '@/utils/fetchCurrentUserInfo';
import { usePathname } from 'next/navigation';
import logoImg from '@/public/images/cube-logo.png';
import Image from 'next/image';

// 로그아웃 API
const logout = () => {
  return axiosInstance.get(`${process.env.NEXT_PUBLIC_AUTH_URL}/logout`);
};

export default function Navbar() {
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      localStorage.removeItem('access-token');
      localStorage.removeItem('refresh-token');
      localStorage.removeItem('activeAuthorization');
      if (typeof window !== 'undefined') window.location.href = '/login';
      removeUserInfo.mutate();
    },
  });

  const userInfo = userInfoStore((state: any) => state.userInfo);
  const updateUserInfo = userInfoStore((state: any) => state.updateUserInfo);
  const removeUserInfo = userInfoStore((state: any) => state.removeUserInfo);

  const [rightPos, setRightPos] = useState('-right-full');

  const pathname = usePathname();
  const currentPathKeyword = pathname.split('/')[1];

  useEffect(() => {
    // (로그인 한) 사용자 정보 조회
    const activeAuthorization = localStorage.getItem('activeAuthorization');
    if (activeAuthorization) fetchCurrentUserInfo(updateUserInfo);
  }, [updateUserInfo]);

  return (
    <nav
      className={`w-screen h-[3.25rem] flex items-center z-20 2lg:p-0 p-2 pl-4 fixed top-0 border-b border-[#e6e8ea] whitespace-nowrap bg-white`}
    >
      <div className="2lg:w-[61rem] w-full flex justify-between items-center mx-auto">
        <div className="py-2 2md:py-0">
          <Link href="/">
            <div className="flex items-center gap-x-[0.175rem]">
              <Image src={logoImg} alt="logo" width={30} quality={100} />
              <span className="tracking-tighter text-sm font-bold text-[#333]">
                SW Online Judge
              </span>
            </div>
          </Link>
        </div>

        <div className="hidden 2md:flex gap-x-14">
          <div className="w-fit hidden ml-16 2md:block">
            <div className="flex gap-4 text-[0.825rem] text-[#4e5968] mx-auto">
              <Link
                href="/contests"
                className={`${
                  currentPathKeyword === 'contests' && 'font-semibold'
                } px-3 py-2 rounded-md hover:bg-[#f3f4f5] hover:text-[#0057b3]`}
              >
                대회
              </Link>
              <Link
                href="/exams"
                className={`${
                  currentPathKeyword === 'exams' && 'font-semibold'
                } px-3 py-2 rounded-md hover:bg-[#f3f4f5] hover:text-[#0057b3]`}
              >
                시험
              </Link>
              <Link
                href="/practices"
                className={`${
                  currentPathKeyword === 'practices' && 'font-semibold'
                } px-3 py-2 rounded-md hover:bg-[#f3f4f5] hover:text-[#0057b3]`}
              >
                연습문제
              </Link>
              <Link
                href="/notices"
                className={`${
                  currentPathKeyword === 'notices' && 'font-semibold'
                } px-3 py-2 rounded-md hover:bg-[#f3f4f5] hover:text-[#0057b3]`}
              >
                공지사항
              </Link>
            </div>
          </div>

          <div className="flex justify-end gap-3 w-[10rem] text-[0.825rem] text-[#4e5968]">
            {userInfo.isAuth ? (
              <>
                <Link
                  href="/mypage/profile"
                  className={`${
                    currentPathKeyword === 'mypage' && 'font-semibold'
                  } px-3 py-2 rounded-md hover:bg-[#f3f4f5]`}
                >
                  <span className="font-semibold">{userInfo.name}</span> 님
                </Link>
                <button
                  className="px-3 py-2 rounded-md hover:bg-[#f3f4f5] hover:text-[#0057b3]"
                  onClick={() => logoutMutation.mutate()}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-2 rounded-md hover:bg-[#f3f4f5] hover:text-[#0057b3]"
                >
                  로그인
                </Link>
                <a
                  href="https://sw7up.cbnu.ac.kr/account/join"
                  target="_blank"
                  className="px-3 py-2 rounded-md hover:bg-[#f3f4f5] hover:text-[#0057b3]"
                >
                  회원가입
                </a>
              </>
            )}
          </div>
        </div>
        <div
          onClick={(e) => {
            setRightPos('right-0');
          }}
          className={`block 2md:hidden px-[0.6rem] py-3 ml-auto mr-[0.1rem] rounded-full focus:outline-none text-center`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            className="line-icon"
          >
            <path
              fill="#B0B8C1"
              d="M4.118 6.2h16a1.2 1.2 0 100-2.4h-16a1.2 1.2 0 100 2.4m16 4.6h-16a1.2 1.2 0 100 2.4h16a1.2 1.2 0 100-2.4m0 7h-16a1.2 1.2 0 100 2.4h16a1.2 1.2 0 100-2.4"
              fill-rule="evenodd"
            ></path>
          </svg>
          <div
            className={`absolute top-0 ${rightPos} h-screen w-full bg-white border opacity-95 transition-all duration-300 cursor-default`}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                setRightPos('-right-full');
              }}
              className="w-fit ml-auto mt-[0.575rem] mr-[0.825rem] p-1 rounded-full cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
              >
                <path
                  fill="#4c545d"
                  fill-rule="evenodd"
                  d="M13.815 12l5.651-5.651a1.2 1.2 0 00-1.697-1.698l-5.651 5.652-5.652-5.652a1.201 1.201 0 00-1.697 1.698L10.421 12l-5.652 5.651a1.202 1.202 0 00.849 2.049c.307 0 .614-.117.848-.351l5.652-5.652 5.651 5.652a1.198 1.198 0 001.697 0 1.2 1.2 0 000-1.698L13.815 12z"
                ></path>
              </svg>
            </div>
            <ul className="flex flex-col items-center w-full text-base cursor-pointer pt-4">
              <div className="flex flex-col w-full border-b-[0.75rem] text-sm">
                {userInfo.isAuth ? (
                  <>
                    <Link
                      href="/mypage/profile"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRightPos('-right-full');
                      }}
                      className="hover:bg-gray-200  py-4 px-6 w-full"
                    >
                      <span className="font-semibold">{userInfo.name}</span> 님
                    </Link>
                    <button
                      className="hover:bg-gray-200  py-4 px-6 w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRightPos('-right-full');
                        logoutMutation.mutate();
                      }}
                    >
                      로그아웃
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRightPos('-right-full');
                      }}
                      className="hover:bg-gray-200  py-4 px-6 w-full"
                    >
                      로그인
                    </Link>
                    <a
                      href="https://sw7up.cbnu.ac.kr/account/join"
                      target="_blank"
                      className="hover:bg-gray-200  py-4 px-6 w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      회원가입
                    </a>
                  </>
                )}
              </div>
              <Link
                href="/contests"
                onClick={(e) => {
                  e.stopPropagation();
                  setRightPos('-right-full');
                }}
                className="hover:bg-gray-200  py-4 px-6 w-full font-medium"
              >
                대회
              </Link>
              <Link
                href="/exams"
                onClick={(e) => {
                  e.stopPropagation();
                  setRightPos('-right-full');
                }}
                className="hover:bg-gray-200  py-4 px-6 w-full font-medium"
              >
                시험
              </Link>
              <Link
                href="/practices"
                onClick={(e) => {
                  e.stopPropagation();
                  setRightPos('-right-full');
                }}
                className="hover:bg-gray-200  py-4 px-6 w-full font-medium"
              >
                연습문제
              </Link>
              <Link
                href="/notices"
                onClick={(e) => {
                  e.stopPropagation();
                  setRightPos('-right-full');
                }}
                className="hover:bg-gray-200  py-4 px-6 w-full font-medium"
              >
                공지사항
              </Link>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
