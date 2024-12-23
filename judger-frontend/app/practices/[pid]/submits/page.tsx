'use client';

import Link from 'next/link';
import UserPracticeSubmitList from './components/UserPracticeSubmitList';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import paperImg from '@/public/images/paper.png';
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { ProblemInfo } from '@/types/problem';
import { useRouter } from 'next/navigation';
import { fetchCurrentUserInfo } from '@/utils/fetchCurrentUserInfo';
import { UserInfo } from '@/types/user';
import { userInfoStore } from '@/store/UserInfo';
import { OPERATOR_ROLES } from '@/constants/role';
import UserPracticeSubmitPageLoadingSkeleton from './components/UserPracticeSubmitPageLoadingSkeleton';
import { ToastInfoStore } from '@/store/ToastInfo';

// 연습문제 게시글 정보 조회 API
const fetchPracticeDetailInfo = ({ queryKey }: any) => {
  const pid = queryKey[1];
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/practice/${pid}`,
  );
};

interface DefaultProps {
  params: {
    pid: string;
  };
}

export default function UserPracticeSubmits(props: DefaultProps) {
  const pid = props.params.pid;

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['practiceDetailInfo', pid],
    queryFn: fetchPracticeDetailInfo,
    retry: 0,
  });

  const updateUserInfo = userInfoStore((state: any) => state.updateUserInfo);

  const addToast = ToastInfoStore((state) => state.addToast);

  const resData = data?.data.data;
  const practiceInfo: ProblemInfo = resData;

  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  useEffect(() => {
    // (로그인 한) 사용자 정보 조회 및 관리자 권한 확인, 그리고 게시글 작성자인지 확인
    fetchCurrentUserInfo(updateUserInfo).then((userInfo: UserInfo) => {
      if (practiceInfo) {
        const isNormalUser =
          !OPERATOR_ROLES.includes(userInfo.role) && userInfo.role !== 'staff';

        if (isNormalUser) {
          setIsLoading(false);
          return;
        }

        addToast('warning', '접근 권한이 없어요.');
        router.push('/');
      }
    });
  }, [updateUserInfo, practiceInfo, router, addToast]);

  const handleGoToPracticeProblem = () => {
    router.push(`/practices/${pid}/`);
  };

  const handleGoToSubmitPracticeProblemCode = () => {
    router.push(`/practices/${pid}/submit`);
  };

  const handleGoToPracticeProblems = () => {
    router.push(`/practices`);
  };

  if (isLoading) return <UserPracticeSubmitPageLoadingSkeleton />;

  return (
    <div className="mt-5 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[60rem] mx-auto">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center text-2xl font-semibold tracking-tight">
              <Image
                src={paperImg}
                alt="paper"
                width={42.5}
                height={0}
                quality={100}
                className="fade-in-fast"
              />

              <div className="lift-up">
                <span className="ml-5 text-2xl font-semibold tracking-wide">
                  내 제출 현황
                </span>
              </div>
            </div>
            <Link
              href={`/practices/${pid}`}
              className="lift-up w-fit flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#487fee] bg-[#e8f3ff] px-3 py-1 rounded-full font-semibold hover:bg-[#cee1fc]"
            >
              {practiceInfo.title}
            </Link>
          </div>

          <div className="flex justify-between items-center gap-x-4 pb-3 border-gray-300">
            <button
              onClick={handleGoToPracticeProblem}
              className="flex items-center gap-x-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="18"
                viewBox="0 -960 960 960"
                width="18"
                fill="#656565"
              >
                <path d="M233-440h607q17 0 28.5-11.5T880-480q0-17-11.5-28.5T840-520H233l155-156q11-11 11.5-27.5T388-732q-11-11-28-11t-28 11L108-508q-6 6-8.5 13T97-480q0 8 2.5 15t8.5 13l224 224q11 11 27.5 11t28.5-11q12-12 12-28.5T388-285L233-440Z" />
              </svg>
              <span className="text-[#656565] text-xs font-light hover:text-black">
                문제로 돌아가기
              </span>
            </button>

            <div className="flex items-center gap-x-3">
              <div className="flex gap-2">
                <button
                  onClick={handleGoToSubmitPracticeProblemCode}
                  className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-white bg-[#3a8af9] px-4 py-[0.5rem] rounded-[7px] font-medium  hover:bg-[#1c6cdb]"
                >
                  제출하기
                </button>

                <button
                  onClick={handleGoToPracticeProblems}
                  className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-4 py-[0.5rem] rounded-[7px] font-medium  hover:bg-[#d3d6da]"
                >
                  문제 목록
                </button>
              </div>
            </div>
          </div>
        </div>

        <section className="dark:bg-gray-900">
          <UserPracticeSubmitList pid={pid} />
        </section>
      </div>
    </div>
  );
}
