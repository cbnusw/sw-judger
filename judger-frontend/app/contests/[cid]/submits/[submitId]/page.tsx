'use client';

import { userInfoStore } from '@/store/UserInfo';
import { SubmitInfo } from '@/types/submit';
import { UserInfo } from '@/types/user';
import axiosInstance from '@/utils/axiosInstance';
import { fetchCurrentUserInfo } from '@/utils/fetchCurrentUserInfo';
import { formatDateToYYMMDDHHMMSS } from '@/utils/formatDate';
import { getCodeSubmitResultTypeDescription } from '@/utils/getCodeSubmitResultTypeDescription';
import { getLanguageCode } from '@/utils/getLanguageCode';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import UsersContestSubmitDetailPageLoadingSkeleton from './components/UsersContestSubmitDetailPageLoadingSkeleton';
import { ToastInfoStore } from '@/store/ToastInfo';

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
    submitId: string;
  };
}

const MarkdownPreview = dynamic(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  { ssr: false, loading: () => <div className="skeleton h-[15rem]" /> },
);

export default function UsersContestSubmitDetail(props: DefaultProps) {
  const cid = props.params.cid;
  const submitId = props.params.submitId;

  const addToast = ToastInfoStore((state) => state.addToast);

  const { isPending, data } = useQuery({
    queryKey: ['submitInfo', submitId],
    queryFn: fetchSubmitInfo,
  });

  const updateUserInfo = userInfoStore((state: any) => state.updateUserInfo);

  const resData = data?.data.data;
  const submitInfo: SubmitInfo = resData;

  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const handleGoToContestSubmits = () => {
    router.push(`/contests/${cid}/submits`);
  };

  // 페이지 접근 권한 설정
  useEffect(() => {
    fetchCurrentUserInfo(updateUserInfo).then((userInfo: UserInfo) => {
      if (submitInfo) {
        const isWriter = submitInfo.parentId.writer._id === userInfo._id;
        const isContestant = submitInfo.parentId.contestants.some(
          (contestant_id) => contestant_id === userInfo._id,
        );

        if (isWriter || isContestant) {
          setIsLoading(false);
          return;
        }

        addToast('warning', '접근 권한이 없어요.');
        router.push('/');
      }
    });
  }, [updateUserInfo, submitInfo, router, addToast]);

  if (isLoading || isPending)
    return <UsersContestSubmitDetailPageLoadingSkeleton />;

  return (
    <div className="mt-6 mb-24 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[60rem] mx-auto">
        <div className="flex justify-between items-center pb-3">
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
                    대회명
                  </th>
                  <th scope="col" className="px-4 py-2">
                    문제명
                  </th>
                  <th scope="col" className="px-4 py-2">
                    이름
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
                  <td className="">{submitInfo.problem.title}</td>
                  <td className="">{submitInfo.user.name}</td>
                  <td
                    className={`${
                      submitInfo.result.type === 'done'
                        ? 'text-[#0076C0]'
                        : 'text-red-500'
                    } font-semibold`}
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
