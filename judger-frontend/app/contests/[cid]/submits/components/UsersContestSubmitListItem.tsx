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
      className="h-[2.5rem] border-b-[1.25px] border-[#d1d6db] text-xs text-center cursor-pointer hover:bg-[#e8f3ff]"
      onClick={(e) => {
        contestSubmitInfo.result &&
          router.push(`/contests/${cid}/submits/${contestSubmitInfo._id}`);
      }}
    >
      <th
        scope="row"
        className="px-4 py-2 font-normal text-[#4e5968] whitespace-nowrap dark:text-white"
      >
        {total - (page - 1) * 10 - index}
      </th>
      <td className="px-2 text-[#4e5968]">
        {contestSubmitInfo.user.university}
      </td>
      <td className="px-2 text-[#4e5968]">
        {contestSubmitInfo.user.department}
      </td>
      <td className="px-2 text-[#4e5968]">{contestSubmitInfo.user.no}</td>
      <td className="px-2 text-[#4e5968]">{contestSubmitInfo.user.name}</td>
      <td className="px-2 font-semibold text-[#4e5968]">
        {contestSubmitInfo.problem.title}
      </td>
      {contestSubmitInfo.result ? (
        <>
          <td
            className={`px-2 ${getCodeSubmitResultTypeColor(
              contestSubmitInfo.result.type,
            )} font-semibold`}
          >
            {getCodeSubmitResultTypeDescription(contestSubmitInfo.result.type)}
          </td>
          <td className="px-2">
            <span className="text-[#4e5968]">
              {(contestSubmitInfo.result.memory / 1048576).toFixed(2)}&nbsp;
            </span>
            <span className="ml-[-1px] text-red-500">MB</span>
          </td>
          <td className="px-2">
            <span className="text-[#4e5968]">
              {contestSubmitInfo.result.time}&nbsp;
            </span>
            &nbsp;
            <span className="ml-[-1px] text-red-500">ms</span>
          </td>
        </>
      ) : (
        <>
          <td className="px-2 flex gap-[0.6rem] justify-center items-center h-10 text-[#e67e22] font-semibold mx-auto">
            채점 중
            <span className="w-1 ml-[-0.6rem] text-[#e67e22]">
              {loadingDots}
            </span>
          </td>
          <td className="px-2">-</td>
          <td className="px-2">-</td>
        </>
      )}
      <td className="px-2 text-[#4e5968]">{contestSubmitInfo.language}</td>
      <td className="px-2 text-[#4e5968]">
        {formatDateToYYMMDDHHMM(contestSubmitInfo.createdAt)}
      </td>
    </tr>
  );
}
