import { PracticeSubmitInfo } from '@/types/practice';
import { formatDateToYYMMDDHHMM } from '@/utils/formatDate';
import {
  getCodeSubmitResultTypeColor,
  getCodeSubmitResultTypeDescription,
} from '@/utils/getCodeSubmitResultTypeDescription';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface PracticeSubmitListItemProps {
  personalUserPracticeSubmitInfo: PracticeSubmitInfo;
  pid: string;
  total: number;
  index: number;
}

export default function UserPracticeSubmitListItem({
  personalUserPracticeSubmitInfo,
  pid,
  total,
  index,
}: PracticeSubmitListItemProps) {
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
        personalUserPracticeSubmitInfo.result &&
          router.push(
            `/practices/${pid}/submits/${personalUserPracticeSubmitInfo._id}`,
          );
      }}
    >
      <th
        scope="row"
        className="px-2 py-2 font-normal text-[#4e5968] whitespace-nowrap dark:text-white"
      >
        {total - index}
      </th>
      {personalUserPracticeSubmitInfo.result ? (
        <>
          <td
            className={`px-2 ${getCodeSubmitResultTypeColor(
              personalUserPracticeSubmitInfo.result.type,
            )} font-semibold`}
          >
            {getCodeSubmitResultTypeDescription(
              personalUserPracticeSubmitInfo.result.type,
            )}
          </td>
          <td className="px-2">
            <span className="text-[#4e5968]">
              {(personalUserPracticeSubmitInfo.result.memory / 1048576).toFixed(
                2,
              )}{' '}
            </span>
            <span className="ml-[-1px] text-red-500">MB</span>
          </td>
          <td className="px-2">
            <span className="text-[#4e5968]">
              {personalUserPracticeSubmitInfo.result.time}{' '}
            </span>{' '}
            <span className="ml-[-1px] text-red-500">ms</span>
          </td>
        </>
      ) : (
        <>
          <td className="px-2 flex gap-[0.6rem] justify-center items-center w-[3.5rem] h-10 text-[#e67e22] font-semibold mx-auto">
            채점 중
            <span className="w-1 ml-[-0.6rem] text-[#e67e22]">
              {loadingDots}
            </span>
          </td>
          <td className="px-2 text-[#4e5968]">-</td>
          <td className="px-2 text-[#4e5968]">-</td>
        </>
      )}
      <td className="px-2 text-[#4e5968]">
        {personalUserPracticeSubmitInfo.language}
      </td>
      <td className="px-2 text-[#4e5968]">
        {formatDateToYYMMDDHHMM(personalUserPracticeSubmitInfo.createdAt)}
      </td>
    </tr>
  );
}
