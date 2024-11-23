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
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import UserExamSubmitDetailPageLoadingSkeleton from './components/skeleton/UserExamSubmitDetailPageLoadingSkeleton';
import UserExamSubmitDetailCodeLoadingSkeleton from './components/skeleton/UserExamSubmitDetailCodeLoadingSkeleton';

// 코드 제출 정보 조회 API
const fetchSubmitInfo = ({ queryKey }: any) => {
  const submitId = queryKey[1];
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/submit/${submitId}`,
  );
};

interface DefaultProps {
  params: {
    eid: string;
    problemId: string;
    submitId: string;
  };
}

const MarkdownPreview = dynamic(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  { ssr: false, loading: () => <UserExamSubmitDetailCodeLoadingSkeleton /> },
);

export default function UserExamSubmitDetail(props: DefaultProps) {
  const eid = props.params.eid;
  const problemId = props.params.problemId;
  const submitId = props.params.submitId;

  const { isPending, data } = useQuery({
    queryKey: ['submitInfo', submitId],
    queryFn: fetchSubmitInfo,
    retry: 0,
  });

  const updateUserInfo = userInfoStore((state: any) => state.updateUserInfo);

  const resData = data?.data.data;
  const submitInfo: SubmitInfo = resData;

  const [isLoading, setIsLoading] = useState(true);

  const currentTime = new Date();
  const examStartTime = new Date(submitInfo?.parentId.testPeriod.start);
  const examEndTime = new Date(submitInfo?.parentId.testPeriod.end);

  const router = useRouter();

  const handleGoToExamSubmits = () => {
    router.push(`/exams/${eid}/problems/${problemId}/submits`);
  };

  useEffect(() => {
    // (로그인 한) 사용자 정보 조회 및 관리자 권한 확인, 그리고 게시글 작성자인지 확인
    fetchCurrentUserInfo(updateUserInfo).then((userInfo: UserInfo) => {
      if (submitInfo) {
        const isSubmitOwner = userInfo._id === submitInfo.user._id;

        if (
          isSubmitOwner &&
          examStartTime <= currentTime &&
          currentTime < examEndTime
        ) {
          setIsLoading(false);
          return;
        }

        alert('접근 권한이 없습니다.');
        router.back();
      }
    });
  }, [updateUserInfo, submitInfo, eid, router]);

  const handleGoToExamProblems = () => {
    router.push(`/exams/${eid}/problems`);
  };

  if (isLoading) return <UserExamSubmitDetailPageLoadingSkeleton />;

  return (
    <div className="mt-6 mb-24 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[60rem] mx-auto">
        <div className="flex justify-end items-center gap-x-2 pb-3">
          <button
            onClick={handleGoToExamSubmits}
            className="flex justify-center items-center gap-[0.375rem] text-[#f9fafb] bg-[#717171] px-2 py-[0.45rem] rounded-[6px] focus:bg-[#686868] hover:bg-[#686868]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="17.5"
              viewBox="0 -960 960 960"
              width="17.5"
              fill="white"
            >
              <path d="m313-440 196 196q12 12 11.5 28T508-188q-12 11-28 11.5T452-188L188-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l264-264q11-11 27.5-11t28.5 11q12 12 12 28.5T508-715L313-520h447q17 0 28.5 11.5T800-480q0 17-11.5 28.5T760-440H313Z" />
            </svg>
            뒤로가기
          </button>

          <button
            onClick={handleGoToExamProblems}
            className="flex justify-center items-center gap-[0.375rem] text-sm text-[#f9fafb] bg-green-500 px-2 py-[0.45rem] rounded-[6px] font-medium focus:bg-[#3e9368] hover:bg-[#3e9368]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 -960 960 960"
              width="20"
              fill="white"
            >
              <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520h200L520-800v200Z" />
            </svg>
            문제 목록
          </button>
        </div>
        <div className="border-y border-[#e4e4e4] border-t-2 border-t-gray-400">
          <MarkdownPreview
            className="markdown-preview"
            source={`
\`\`\`${getLanguageCode(submitInfo.language)}
${submitInfo.code}`}
          />
        </div>

        <div className="relative mt-10 dark:bg-gray-800 overflow-hidden rounded-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase dark:text-gray-400 text-center">
                <tr>
                  <th scope="col" className="px-4 py-2">
                    시험명
                  </th>
                  <th scope="col" className="px-4 py-2">
                    수업명
                  </th>
                  <th scope="col" className="px-4 py-2">
                    문제명
                  </th>
                  <th scope="col" className="px-4 py-2">
                    결과
                  </th>
                  <th scope="col" className="px-4 py-2">
                    메모리
                  </th>
                  <th scope="col" className="px-4 py-2">
                    시간
                  </th>
                  <th scope="col" className="px-4 py-2">
                    언어
                  </th>
                  <th scope="col" className="px-4 py-2">
                    제출 시간
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t dark:border-gray-700 text-xs text-center bg-[#f9f9f9]">
                  <th
                    scope="row"
                    className="py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {submitInfo.parentId.title}
                  </th>
                  <td className="">{submitInfo.parentId.course}</td>
                  <td className="">{submitInfo.problem.title}</td>
                  <td
                    className={`${getCodeSubmitResultTypeColor(
                      submitInfo.result.type,
                    )} font-semibold`}
                  >
                    {getCodeSubmitResultTypeDescription(submitInfo.result.type)}
                  </td>
                  <td>
                    <span>
                      {(submitInfo.result.memory / 1048576).toFixed(2)}{' '}
                    </span>
                    <span className="ml-[-1px] text-red-500">MB</span>
                  </td>
                  <td className="">
                    <span>{submitInfo.result.time} </span>{' '}
                    <span className="ml-[-1px] text-red-500">ms</span>
                  </td>
                  <td className="">{submitInfo.language}</td>
                  <td className="">
                    {formatDateToYYMMDDHHMMSS(submitInfo.createdAt)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="flex gap-3 justify-end"></div>
        </div>
      </div>
    </div>
  );
}
