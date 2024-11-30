import { ContestInfo } from '@/types/contest';
import { formatDateToYYMMDDHHMM, formatDateToYYMMDD } from '@/utils/formatDate';
import { useRouter } from 'next/navigation';
import React from 'react';

interface ContestListItemProps {
  contestInfo: ContestInfo;
  total: number;
  page: number;
  index: number;
}

export default function ContestListItem(props: ContestListItemProps) {
  const { contestInfo, total, page, index } = props;

  const router = useRouter();

  return (
    <tr
      className="border-b dark:border-gray-700 text-xs text-center cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
      onClick={(e) => {
        router.push(`contests/${contestInfo._id}`);
      }}
    >
      <th
        scope="row"
        className="px-4 py-3 font-normal text-gray-900 whitespace-nowrap dark:text-white"
      >
        {total - (page - 1) * 10 - index}
      </th>
      <td className="hover:underline focus:underline">{contestInfo.title}</td>
      <td className="font-medium">
        {contestInfo.applyingPeriod ? (
          <>~ {formatDateToYYMMDDHHMM(contestInfo.applyingPeriod.end)}</>
        ) : (
          <>~ {formatDateToYYMMDDHHMM(contestInfo.testPeriod.start)}</>
        )}
      </td>
      <td className="text-red-500 font-medium">
        {formatDateToYYMMDDHHMM(contestInfo.testPeriod?.start)} ~{' '}
        {formatDateToYYMMDDHHMM(contestInfo.testPeriod?.end)}
      </td>
      <td className="">{formatDateToYYMMDD(contestInfo.createdAt)}</td>
    </tr>
  );
}
