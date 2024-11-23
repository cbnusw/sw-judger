import { ExamInfo } from '@/types/exam';
import { formatDateToYYMMDD, formatDateToYYMMDDHHMM } from '@/utils/formatDate';
import { useRouter } from 'next/navigation';
import React from 'react';

interface MyExamPostListItemProps {
  examInfo: ExamInfo;
  total: number;
  page: number;
  index: number;
}

export default function MyExamPostListItem(props: MyExamPostListItemProps) {
  const { examInfo, total, page, index } = props;

  const router = useRouter();

  return (
    <tr
      className="border-b dark:border-gray-700 text-xs text-center cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
      onClick={(e) => {
        router.push(`/exams/${examInfo._id}`);
      }}
    >
      <th
        scope="row"
        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {total - (page - 1) * 10 - index}
      </th>
      <td className="">{examInfo.title}</td>
      <td className="">{examInfo.course}</td>
      <td className="">
        {formatDateToYYMMDDHHMM(examInfo.testPeriod.start)} ~{' '}
        {formatDateToYYMMDDHHMM(examInfo.testPeriod.end)}
      </td>
      <td className="">{formatDateToYYMMDD(examInfo.createdAt)}</td>
    </tr>
  );
}
