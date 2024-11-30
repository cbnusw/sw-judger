import { ContestEnrolledInfo } from '@/types/contest';
import { useRouter } from 'next/navigation';
import React from 'react';

interface ContestEnrolledListItemProps {
  contestEnrolledInfo: ContestEnrolledInfo;
  total: number;
  index: number;
}

export default function ContestEnrolledListItem(
  props: ContestEnrolledListItemProps,
) {
  const router = useRouter();

  const { contestEnrolledInfo, total, index } = props;

  return (
    <tr
      className="border-b dark:border-gray-700 text-xs text-center cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
      onClick={(e) => {
        router.push(`/contests/${contestEnrolledInfo._id}`);
      }}
    >
      <th
        scope="row"
        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {total - index}
      </th>
      <td className="">{contestEnrolledInfo.title}</td>
    </tr>
  );
}
