'use client';

import Link from 'next/link';
import UserContestSubmitList from './components/UserContestSubmitList';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import paperImg from '@/public/images/paper.png';
import axiosInstance from '@/utils/axiosInstance';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { fetchCurrentUserInfo } from '@/utils/fetchCurrentUserInfo';
import { userInfoStore } from '@/store/UserInfo';
import { UserInfo } from '@/types/user';
import { ProblemInfo } from '@/types/problem';
import { OPERATOR_ROLES } from '@/constants/role';
import UserContestSubmitListPageLoadingSkeleton from './components/UserContestSubmitListPageLoadingSkeleton';
import { ToastInfoStore } from '@/store/ToastInfo';

// 대회 문제 열람 비밀번호 확인 API
const confirmContestPassword = ({
  cid,
  password,
}: {
  cid: string;
  password: string;
}) => {
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/contest/confirm/${cid}?password=${password}`,
  );
};

// 문제 정보 조회 API
const fetchContestProblemDetailInfo = ({ queryKey }: any) => {
  const problemId = queryKey[1];
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/problem/${problemId}`,
  );
};

interface DefaultProps {
  params: {
    cid: string;
    problemId: string;
  };
}

export default function UserContestSubmits(props: DefaultProps) {
  const cid = props.params.cid;
  const problemId = props.params.problemId;

  const addToast = ToastInfoStore((state) => state.addToast);

  const confirmContestPasswordMutation = useMutation({
    mutationFn: confirmContestPassword,
    onError: (error: AxiosError) => {
      const resData: any = error.response?.data;
      switch (resData.status) {
        case 400:
          switch (resData.code) {
            case 'CONTEST_PASSWORD_NOT_MATCH':
              addToast('warning', '비밀번호가 일치하지 않아요.');
              deleteCookie(cid);
              router.back();
              break;
            default:
              addToast('error', '비밀번호 확인 중에 에러가 발생했어요.');
          }
          break;
        default:
          addToast('error', '비밀번호 확인 중에 에러가 발생했어요.');
      }
    },
    onSuccess: (data) => {
      const resData = data.data;
      const httpStatusCode = resData.status;

      switch (httpStatusCode) {
        case 200:
          setCookie(cid, password, { maxAge: 60 * 60 * 24 });
          setIsPasswordChecked(true);
          break;
        default:
          addToast('error', '비밀번호 확인 중에 에러가 발생했어요.');
      }
    },
  });

  const [password, setPassword] = useState('');
  const [isPasswordChecked, setIsPasswordChecked] = useState(false);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['contestProblemDetailInfo', problemId],
    queryFn: fetchContestProblemDetailInfo,
  });

  const resData = data?.data.data;
  const contestProblemInfo: ProblemInfo = resData;

  const updateUserInfo = userInfoStore((state: any) => state.updateUserInfo);

  const [isLoading, setIsLoading] = useState(true);

  const currentTime = new Date();
  const contestStartTime = new Date(
    contestProblemInfo?.parentId.testPeriod.start,
  );
  const contestEndTime = new Date(contestProblemInfo?.parentId.testPeriod.end);

  const router = useRouter();

  useEffect(() => {
    // (로그인 한) 사용자 정보 조회 및 관리자 권한 확인, 그리고 게시글 작성자인지 확인
    fetchCurrentUserInfo(updateUserInfo).then((userInfo: UserInfo) => {
      if (contestProblemInfo) {
        const isContestant = contestProblemInfo.parentId.contestants.some(
          (contestant_id) => contestant_id === userInfo._id,
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
          const contestPasswordCookie = getCookie(cid);
          if (contestPasswordCookie) {
            setPassword(contestPasswordCookie);
            confirmContestPasswordMutation.mutate({
              cid,
              password: contestPasswordCookie,
            });
            return;
          }

          const inputPassword = prompt('비밀번호를 입력해 주세요');
          if (inputPassword !== null && inputPassword.trim() !== '') {
            setPassword(inputPassword);
            confirmContestPasswordMutation.mutate({
              cid,
              password: inputPassword,
            });
            return;
          }

          router.back();
          return;
        }

        addToast('warning', '접근 권한이 없어요.');
        router.push('/');
      }
    });
  }, [updateUserInfo, contestProblemInfo, cid, router, addToast]);

  const handleGoToContestProblem = () => {
    router.push(`/contests/${cid}/problems/${problemId}`);
  };

  const handleGoToSubmitContestProblemCode = () => {
    router.push(`/contests/${cid}/problems/${problemId}/submit`);
  };

  const handleGoToContestProblems = () => {
    router.push(`/contests/${cid}/problems`);
  };

  if (isLoading || !isPasswordChecked)
    return <UserContestSubmitListPageLoadingSkeleton />;

  return (
    <div className="mt-5 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[21rem] xs:w-[90%] xl:w-[60rem] mx-auto">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col 3md:flex-row items-start 3md:items-center gap-x-2">
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
              href={`/contests/${cid}/problems/${problemId}`}
              className="mt-4 3md:mt-0 lift-up w-fit flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#487fee] bg-[#e8f3ff] px-3 py-1 rounded-full font-semibold hover:bg-[#cee1fc]"
            >
              {contestProblemInfo.title}
            </Link>
          </div>

          <div className="flex flex-col 3md:flex-row justify-between items-start 3md:items-center gap-x-4 mb-4 3md:mb-3 border-gray-300">
            <button
              onClick={handleGoToContestProblem}
              className="flex items-center gap-x-1 p-2 pl-0 hover hover:text-black"
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
              <span className="text-[#656565] text-xs font-light text-inherit">
                문제로 돌아가기
              </span>
            </button>

            <div className="w-full 3md:w-fit flex flex-col 3md:flex-row mt-2 3md:mt-0 items-start 3md:items-center gap-x-3">
              <div className="flex gap-2">
                <span className="w-fit flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-3 py-1 rounded-full font-semibold">
                  {contestProblemInfo.parentId.title}
                </span>
              </div>

              <div className="mt-4 3md:mt-0 w-full 3md:w-fit flex flex-col 3md:flex-row items-start 3md:items-center gap-2">
                <button
                  onClick={handleGoToSubmitContestProblemCode}
                  className="w-full 3md:w-fit flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-white bg-[#3a8af9] px-4 py-[0.5rem] rounded-[7px] font-medium  hover:bg-[#1c6cdb]"
                >
                  제출하기
                </button>

                <button
                  onClick={handleGoToContestProblems}
                  className="w-full 3md:w-fit flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-4 py-[0.5rem] rounded-[7px] font-medium  hover:bg-[#d3d6da]"
                >
                  문제 목록
                </button>
              </div>
            </div>
          </div>
        </div>

        <section className="dark:bg-gray-900">
          <UserContestSubmitList cid={cid} problemId={problemId} />
        </section>
      </div>
    </div>
  );
}
