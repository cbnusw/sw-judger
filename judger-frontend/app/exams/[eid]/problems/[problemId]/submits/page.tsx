'use client';

import Link from 'next/link';
import UserExamSubmitList from './components/UserExamSubmitList';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import codeImg from '@/public/images/code.png';
import axiosInstance from '@/utils/axiosInstance';
import { ProblemInfo } from '@/types/problem';
import { userInfoStore } from '@/store/UserInfo';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchCurrentUserInfo } from '@/utils/fetchCurrentUserInfo';
import { UserInfo } from '@/types/user';
import { OPERATOR_ROLES } from '@/constants/role';
import UserExamSubmitPageLoadingSkeleton from './components/UserExamSubmitPageLoadingSkeleton';
import { ToastInfoStore } from '@/store/ToastInfo';

// 문제 정보 조회 API
const fetchExamProblemDetailInfo = ({ queryKey }: any) => {
  const problemId = queryKey[1];
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/problem/${problemId}`,
  );
};

interface DefaultProps {
  params: {
    eid: string;
    problemId: string;
  };
}

export default function UserExamSubmits(props: DefaultProps) {
  const eid = props.params.eid;
  const problemId = props.params.problemId;

  const addToast = ToastInfoStore((state) => state.addToast);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['examProblemDetailInfo', problemId],
    queryFn: fetchExamProblemDetailInfo,
    retry: 0,
  });

  const resData = data?.data.data;
  const examProblemInfo: ProblemInfo = resData;

  const updateUserInfo = userInfoStore((state: any) => state.updateUserInfo);

  const [isLoading, setIsLoading] = useState(true);

  const currentTime = new Date();
  const contestStartTime = new Date(examProblemInfo?.parentId.testPeriod.start);
  const contestEndTime = new Date(examProblemInfo?.parentId.testPeriod.end);

  const router = useRouter();

  useEffect(() => {
    // (로그인 한) 사용자 정보 조회 및 관리자 권한 확인, 그리고 게시글 작성자인지 확인
    fetchCurrentUserInfo(updateUserInfo).then((userInfo: UserInfo) => {
      if (examProblemInfo) {
        const isContestant = examProblemInfo.parentId.students.some(
          (student_id) => student_id === userInfo._id,
        );
        const isNormalUser =
          !OPERATOR_ROLES.includes(userInfo.role) && userInfo.role !== 'staff';

        if (
          isContestant &&
          isNormalUser &&
          contestStartTime <= currentTime &&
          currentTime < contestEndTime
        ) {
          setIsLoading(false);
          return;
        }

        addToast('warning', '접근 권한이 없어요.');
        router.push('/');
      }
    });
  }, [updateUserInfo, examProblemInfo, eid, router, addToast]);

  const handleGoToExamProblem = () => {
    router.push(`/exams/${eid}/problems/${problemId}`);
  };

  const handleGoToSubmitExamProblemCode = () => {
    router.push(`/exams/${eid}/problems/${problemId}/submit`);
  };

  const handleGoToExamProblems = () => {
    router.push(`/exams/${eid}/problems`);
  };

  if (isLoading) return <UserExamSubmitPageLoadingSkeleton />;

  return (
    <div className="mt-2 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[60rem] mx-auto">
        <div className="flex flex-col gap-8">
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
                href={`/exams/${eid}/problems/${problemId}`}
                className="mt-1 ml-1 text-xl font-medium cursor-pointer hover:underline hover:text-[#0038a8] focus:underline focus:text-[#0038a8] text-[#1048b8]"
              >
                ({examProblemInfo.title})
              </Link>
            </div>
          </p>

          <div className="flex justify-between items-center gap-x-4 pb-3 border-gray-300">
            <button
              onClick={handleGoToExamProblem}
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
              <div className="flex gap-3">
                <span className="font-semibold">
                  시험명:{' '}
                  <span className="font-light">
                    {examProblemInfo.parentId.title}
                  </span>
                </span>
                <span className='relative bottom-[0.055rem] font-thin before:content-["|"]' />
                <span className="font-semibold">
                  수업명:{' '}
                  <span className="font-light">
                    {examProblemInfo.parentId.course}
                  </span>
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleGoToSubmitExamProblemCode}
                  className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-white bg-[#3a8af9] px-4 py-[0.5rem] rounded-[7px] font-medium  hover:bg-[#1c6cdb]"
                >
                  제출하기
                </button>

                <button
                  onClick={handleGoToExamProblems}
                  className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-4 py-[0.5rem] rounded-[7px] font-medium focus:bg-[#d3d6da] hover:bg-[#d3d6da]"
                >
                  문제 목록
                </button>
              </div>
            </div>
          </div>
        </div>

        <section className="dark:bg-gray-900">
          <UserExamSubmitList eid={eid} problemId={problemId} />
        </section>
      </div>
    </div>
  );
}
