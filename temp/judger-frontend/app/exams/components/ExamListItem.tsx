import { ExamInfo } from '@/types/exam';
import { formatDateToYYMMDDHHMM } from '@/utils/formatDate';
import { useRouter } from 'next/navigation';

interface ExamListItemProps {
  examInfo: ExamInfo;
  total: number;
  page: number;
  index: number;
}

export default function ExamListItem(props: ExamListItemProps) {
  const { examInfo, total, page, index } = props;

  const router = useRouter();

  return (
    <tr
      className="border-b dark:border-gray-700 text-xs text-center cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
      onClick={() => router.push(`exams/${examInfo._id}`)}
    >
      <th
        scope="row"
        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {total - (page - 1) * 10 - index}
      </th>
      <td className="hover:underline focus:underline">{examInfo.title}</td>
      <td className="font-medium">{examInfo.course}</td>
      <td className="font-medium">{examInfo.writer.name}</td>
      <td className="font-medium">
        <span className="text-red-500 ">
          {formatDateToYYMMDDHHMM(examInfo.testPeriod?.start)} ~{' '}
          {formatDateToYYMMDDHHMM(examInfo.testPeriod?.end)}
        </span>
      </td>
    </tr>
  );
}
