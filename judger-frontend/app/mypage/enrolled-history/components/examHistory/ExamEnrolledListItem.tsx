import { ExamEnrolledInfo } from '@/types/exam';
import { useRouter } from 'next/navigation';
import React from 'react';

interface ExamEnrolledListItemProps {
  examEnrolledInfo: ExamEnrolledInfo;
  total: number;
  index: number;
}

export default function ExamEnrolledListItem(props: ExamEnrolledListItemProps) {
  const router = useRouter();

  const { examEnrolledInfo, total, index } = props;

  return (
    <tr
      className="border-b dark:border-gray-700 text-xs text-center cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
      onClick={(e) => {
        router.push(`/exams/${examEnrolledInfo._id}`);
      }}
    >
      <th
        scope="row"
        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {total - index}
      </th>
      <td className="">{examEnrolledInfo.title}</td>
      <td className="">{examEnrolledInfo.course}</td>
    </tr>
  );
}
