'use client';

import Link from 'next/link';
import UserPracticeSubmitList from './components/UserPracticeSubmitList';
import { useEffect, useState } from 'react';
import Loading from '@/app/loading';
import Image from 'next/image';
import codeImg from '@/public/images/code.png';
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { ProblemInfo } from '@/types/problem';
import { useRouter } from 'next/navigation';
import { fetchCurrentUserInfo } from '@/utils/fetchCurrentUserInfo';
import { UserInfo } from '@/types/user';
import { userInfoStore } from '@/store/UserInfo';
import { OPERATOR_ROLES } from '@/constants/role';

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

        alert('접근 권한이 없습니다.');
        router.back();
      }
    });
  }, [updateUserInfo, practiceInfo, router]);

  if (isLoading) return <Loading />;

  return (
    <div className="mt-2 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[60rem] mx-auto">
        <div className="flex flex-col mb-8">
          <p className="flex items-center text-2xl font-semibold tracking-tight">
            <Image
              src={codeImg}
              alt="code"
              width={70}
              height={0}
              quality={100}
              className="ml-[-1rem] fade-in-fast drop-shadow-lg"
            />
            <div className="lift-up">
              <span className="ml-4 text-3xl font-semibold tracking-wide">
                내 제출 현황
              </span>
              <Link
                href={`/practices/${pid}`}
                className="mt-1 ml-1 text-xl font-medium cursor-pointer hover:underline hover:text-[#0038a8] focus:underline focus:text-[#0038a8] text-[#1048b8]"
              >
                ({practiceInfo.title})
              </Link>
            </div>
          </p>
        </div>

        <section className="dark:bg-gray-900">
          <UserPracticeSubmitList pid={pid} />
        </section>
      </div>
    </div>
  );
}
