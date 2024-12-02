'use client';

import { userInfoStore } from '@/store/UserInfo';
import { SubmitInfo } from '@/types/submit';
import { UserInfo } from '@/types/user';
import axiosInstance from '@/utils/axiosInstance';
import { fetchCurrentUserInfo } from '@/utils/fetchCurrentUserInfo';
import { formatDateToYYMMDDHHMMSS } from '@/utils/formatDate';
import {
  getCodeSubmitResultTypeColor,
  getCodeSubmitResultTypeDescription,
} from '@/utils/getCodeSubmitResultTypeDescription';
import { getLanguageCode } from '@/utils/getLanguageCode';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import UserContestSubmitDetailPageLoadingSkeleton from './components/skeleton/UserContestSubmitDetailPageLoadingSkeleton';
import UserContestSubmitDetailCodeLoadingSkeleton from './components/skeleton/UserContestSubmitDetailCodeLoadingSkeleton';
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

// 코드 제출 정보 조회 API
const fetchSubmitInfo = ({ queryKey }: any) => {
  const submitId = queryKey[1];
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/submit/${submitId}`,
  );
};

interface DefaultProps {
  params: {
    cid: string;
    problemId: string;
    submitId: string;
  };
}

const MarkdownPreview = dynamic(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <UserContestSubmitDetailCodeLoadingSkeleton />,
  },
);

export default function UserContestSubmitDetail(props: DefaultProps) {
  const cid = props.params.cid;
  const problemId = props.params.problemId;
  const submitId = props.params.submitId;

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

  const { isPending, data } = useQuery({
    queryKey: ['submitInfo', submitId],
    queryFn: fetchSubmitInfo,
  });

  const updateUserInfo = userInfoStore((state: any) => state.updateUserInfo);

  const resData = data?.data.data;
  const submitInfo: SubmitInfo = resData;

  const [isLoading, setIsLoading] = useState(true);

  const currentTime = new Date();
  const contestStartTime = new Date(submitInfo?.parentId.testPeriod.start);
  const contestEndTime = new Date(submitInfo?.parentId.testPeriod.end);

  const router = useRouter();

  const handleGoToContestProblem = () => {
    router.push(`/contests/${cid}/problems/${problemId}`);
  };

  const handleGoToContestSubmits = () => {
    router.push(`/contests/${cid}/problems/${problemId}/submits`);
  };

  useEffect(() => {
    // (로그인 한) 사용자 정보 조회 및 관리자 권한 확인, 그리고 게시글 작성자인지 확인
    fetchCurrentUserInfo(updateUserInfo).then((userInfo: UserInfo) => {
      if (submitInfo) {
        const isSubmitOwner = userInfo._id === submitInfo.user._id;

        if (
          isSubmitOwner &&
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
  }, [updateUserInfo, submitInfo, cid, router, addToast]);

  const handleGoToContestProblems = () => {
    router.push(`/contests/${cid}/problems`);
  };

  if (isLoading || !isPasswordChecked)
    return <UserContestSubmitDetailPageLoadingSkeleton />;

  return (
    <div className="mt-6 mb-24 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[60rem] mx-auto">
        <div className="flex justify-between items-center gap-x-2 pb-3">
          <button
            onClick={handleGoToContestSubmits}
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
            <span className="text-[#656565] text-xs font-light hover:text-black py-[0.5rem]">
              뒤로가기
            </span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleGoToContestProblems}
              className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-4 py-[0.5rem] rounded-[7px] font-medium focus:bg-[#d3d6da] hover:bg-[#d3d6da]"
            >
              문제 목록
            </button>
          </div>
        </div>
        <div className="border-y border-[#e4e4e4] border-t-2 border-t-gray-400">
          <MarkdownPreview
            className="markdown-preview"
            source={`
\`\`\`${getLanguageCode(submitInfo.language)}
${submitInfo.code}`}
          />
        </div>

        <div className="relative mt-10 overflow-hidden rounded-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 ">
              <thead className="border-y-[1.25px] border-[#d1d6db] text-xs uppercase bg-[#f2f4f6] text-center">
                <tr className="h-[2rem]">
                  <th
                    scope="col"
                    className="font-medium text-[#333d4b] px-4 py-2"
                  >
                    대회명
                  </th>
                  <th
                    scope="col"
                    className="font-medium text-[#333d4b] px-4 py-2"
                  >
                    문제명
                  </th>
                  <th
                    scope="col"
                    className="font-medium text-[#333d4b] px-4 py-2"
                  >
                    결과
                  </th>
                  <th
                    scope="col"
                    className="font-medium text-[#333d4b] px-4 py-2"
                  >
                    메모리
                  </th>
                  <th
                    scope="col"
                    className="font-medium text-[#333d4b] px-4 py-2"
                  >
                    시간
                  </th>
                  <th
                    scope="col"
                    className="font-medium text-[#333d4b] px-4 py-2"
                  >
                    언어
                  </th>
                  <th
                    scope="col"
                    className="font-medium text-[#333d4b] px-4 py-2"
                  >
                    제출 시간
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="h-[2.5rem] border-b-[1.25px] border-[#d1d6db] text-xs text-center">
                  <th
                    scope="row"
                    className="py-2 font-normal text-[#4e5968] whitespace-nowrap dark:text-white"
                  >
                    {submitInfo.parentId.title}
                  </th>
                  <td className="font-semibold text-[#4e5968]">
                    {submitInfo.problem.title}
                  </td>
                  <td
                    className={`${getCodeSubmitResultTypeColor(
                      submitInfo.result.type,
                    )} font-semibold`}
                  >
                    {getCodeSubmitResultTypeDescription(submitInfo.result.type)}
                  </td>
                  <td>
                    <span className="text-[#4e5968]">
                      {(submitInfo.result.memory / 1048576).toFixed(2)}{' '}
                    </span>
                    <span className="ml-[-1px] text-red-500">MB</span>
                  </td>
                  <td>
                    <span className="text-[#4e5968]">
                      {submitInfo.result.time}{' '}
                    </span>{' '}
                    <span className="ml-[-1px] text-red-500">ms</span>
                  </td>
                  <td className="text-[#4e5968]">{submitInfo.language}</td>
                  <td className="text-[#4e5968]">
                    {formatDateToYYMMDDHHMMSS(submitInfo.createdAt)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
