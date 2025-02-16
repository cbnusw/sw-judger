import { NoticeInfo } from '@/types/notice';
import { formatDateToYYMMDDWithDot } from '@/utils/formatDate';
import Link from 'next/link';

interface NoticeListItemProps {
  noticeInfo: NoticeInfo;
  total: number;
  page: number;
  index: number;
}

export default function NoticeListItem(props: NoticeListItemProps) {
  const { noticeInfo, total, page, index } = props;

  const lastPage = Math.ceil(total / 10);

  return (
    <Link
      href={`/notices/${noticeInfo._id}`}
      className={`flex flex-col items-start gap-y-1 py-5 ${
        ((lastPage > page && index + 1 !== 10) ||
          (lastPage === page && index + 1 !== total % 10)) &&
        'border-b-[0.5px] border-[#ededef]'
      } text-center cursor-pointer`}
    >
      <span className="font-semibold text-[#4e5968] text-[18px]">
        {noticeInfo.title}
      </span>
      <span className="text-[#8b95a1] text-[14px] font-extralight">
        {formatDateToYYMMDDWithDot(noticeInfo.createdAt)}
      </span>
    </Link>
  );
}
