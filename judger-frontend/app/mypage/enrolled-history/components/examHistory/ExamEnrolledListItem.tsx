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
      className="h-[2.5rem] border-b-[1.25px] border-[#d1d6db] text-xs text-center cursor-pointer hover:bg-[#e8f3ff]"
      onClick={(e) => {
        router.push(`/exams/${examEnrolledInfo._id}`);
      }}
    >
      <th
        scope="row"
        className="px-2 py-2 font-normal text-[#4e5968] whitespace-nowrap dark:text-white"
      >
        {total - index}
      </th>
      <td className="px-2 font-semibold text-start text-[#4e5968]">
        {examEnrolledInfo.title}
      </td>
      <td className="px-2 font-semibold text-start text-[#4e5968]">
        {examEnrolledInfo.course}
      </td>
    </tr>
  );
}
