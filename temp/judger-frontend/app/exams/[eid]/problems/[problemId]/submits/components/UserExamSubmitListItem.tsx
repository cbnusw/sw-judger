import { ExamSubmitInfo } from '@/types/exam';
import { formatDateToYYMMDDHHMM } from '@/utils/formatDate';
import {
  getCodeSubmitResultTypeColor,
  getCodeSubmitResultTypeDescription,
} from '@/utils/getCodeSubmitResultTypeDescription';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface ExamSubmitListItemProps {
  personalUserExamSubmitInfo: ExamSubmitInfo;
  eid: string;
  problemId: string;
  total: number;
  index: number;
}

export default function UserExamSubmitListItem({
  personalUserExamSubmitInfo,
  eid,
  problemId,
  total,
  index,
}: ExamSubmitListItemProps) {
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
        personalUserExamSubmitInfo.result &&
          router.push(
            `/exams/${eid}/problems/${problemId}/submits/${personalUserExamSubmitInfo._id}`,
          );
      }}
    >
      <th
        scope="row"
        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {total - index}
      </th>
      <td className="">{personalUserExamSubmitInfo.problem.title}</td>
      {personalUserExamSubmitInfo.result ? (
        <>
          <td
            className={`${getCodeSubmitResultTypeColor(
              personalUserExamSubmitInfo.result.type,
            )} font-semibold`}
          >
            {getCodeSubmitResultTypeDescription(
              personalUserExamSubmitInfo.result.type,
            )}
          </td>
          <td>
            <span>
              {(personalUserExamSubmitInfo.result.memory / 1048576).toFixed(2)}{' '}
            </span>
            <span className="ml-[-1px] text-red-500">MB</span>
          </td>
          <td className="">
            <span>{personalUserExamSubmitInfo.result.time} </span>{' '}
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
      <td className="">{personalUserExamSubmitInfo.language}</td>
      <td className="">
        {formatDateToYYMMDDHHMM(personalUserExamSubmitInfo.createdAt)}
      </td>
    </tr>
  );
}
