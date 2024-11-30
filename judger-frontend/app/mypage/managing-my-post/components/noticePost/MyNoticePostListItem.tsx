import { NoticeInfo } from '@/types/notice';
import { formatDateToYYMMDD } from '@/utils/formatDate';
import { useRouter } from 'next/navigation';
import React from 'react';

interface MyNoticePostListItemProps {
  noticeInfo: NoticeInfo;
  total: number;
  page: number;
  index: number;
}

export default function MyNoticePostListItem(props: MyNoticePostListItemProps) {
  const { noticeInfo, total, page, index } = props;

  const router = useRouter();

  return (
    <tr
      className="border-b dark:border-gray-700 text-xs text-center cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
      onClick={(e) => {
        router.push(`/notices/${noticeInfo._id}`);
      }}
    >
      <th
        scope="row"
        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {total - (page - 1) * 10 - index}
      </th>
      <td className="">{noticeInfo.title}</td>
      <td className="">{formatDateToYYMMDD(noticeInfo.createdAt)}</td>
    </tr>
  );
}
