import { NoticeInfo } from '@/types/notice';
import { formatDateToYYMMDD } from '@/utils/formatDate';
import { useRouter } from 'next/navigation';
import React from 'react';

interface NoticeListItemProps {
  noticeInfo: NoticeInfo;
  total: number;
  page: number;
  index: number;
}

export default function NoticeListItem(props: NoticeListItemProps) {
  const { noticeInfo, total, page, index } = props;

  const router = useRouter();

  return (
    <tr
      className="h-[2.5rem] border-b-[1.25px] border-[#d1d6db] text-xs text-center cursor-pointer hover:bg-[#e8f3ff]"
      onClick={(e) => {
        router.push(`/notices/${noticeInfo._id}`);
      }}
    >
      <th
        scope="row"
        className="px-4 py-2 font-normal text-[#4e5968] whitespace-nowrap dark:text-white"
      >
        {total - (page - 1) * 10 - index}
      </th>
      <td className="font-semibold text-[#4e5968]">{noticeInfo.title}</td>
      <td className="text-[#4e5968]">{noticeInfo.writer.name}</td>
      <td className="text-[#4e5968]">
        {formatDateToYYMMDD(noticeInfo.createdAt)}
      </td>
    </tr>
  );
}
