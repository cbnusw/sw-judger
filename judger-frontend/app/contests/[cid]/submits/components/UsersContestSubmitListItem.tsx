import { ContestSubmitInfo } from '@/types/contest';
import { formatDateToYYMMDDHHMM } from '@/utils/formatDate';
import {
  getCodeSubmitResultTypeColor,
  getCodeSubmitResultTypeDescription,
} from '@/utils/getCodeSubmitResultTypeDescription';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface UsersContestSubmitListItemProps {
  contestSubmitInfo: ContestSubmitInfo;
  cid: string;
  total: number;
  page: number;
  index: number;
}

export default function UsersContestSubmitListItem({
  contestSubmitInfo,
  cid,
  total,
  page,
  index,
}: UsersContestSubmitListItemProps) {
  const [loadingDots, setLoadingDots] = useState('');

  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingDots((prev) => (prev.length < 3 ? prev + '.' : ''));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <tr
      className="border-b dark:border-gray-700 text-xs text-center cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
      onClick={(e) => {
        contestSubmitInfo.result &&
          router.push(`/contests/${cid}/submits/${contestSubmitInfo._id}`);
      }}
    >
      <th
        scope="row"
        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {total - (page - 1) * 10 - index}
      </th>
      <td className="">{contestSubmitInfo.user.university}</td>
      <td className="">{contestSubmitInfo.user.department}</td>
      <td className="">{contestSubmitInfo.user.no}</td>
      <td className="">{contestSubmitInfo.user.name}</td>
      <td className="">{contestSubmitInfo.problem.title}</td>
      {contestSubmitInfo.result ? (
        <>
          <td
            className={`${getCodeSubmitResultTypeColor(
              contestSubmitInfo.result.type,
            )} font-semibold`}
          >
            {getCodeSubmitResultTypeDescription(contestSubmitInfo.result.type)}
          </td>
          <td>
            <span>
              {(contestSubmitInfo.result.memory / 1048576).toFixed(2)}{' '}
            </span>
            <span className="ml-[-1px] text-red-500">MB</span>
          </td>
          <td className="">
            <span>{contestSubmitInfo.result.time} </span>{' '}
            <span className="ml-[-1px] text-red-500">ms</span>
          </td>
        </>
      ) : (
        <>
          <td className="flex gap-[0.6rem] justify-center items-center w-[3.5rem] h-10 text-[#e67e22] font-semibold mx-auto">
            채점 중
            <span className="w-1 ml-[-0.6rem] text-[#e67e22]">
              {loadingDots}
            </span>
          </td>
          <td>-</td>
          <td>-</td>
        </>
      )}
      <td className="">{contestSubmitInfo.language}</td>
      <td className="">
        {formatDateToYYMMDDHHMM(contestSubmitInfo.createdAt)}
      </td>
    </tr>
  );
}
