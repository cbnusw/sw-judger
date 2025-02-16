'use client';

import { OPERATOR_ROLES } from '@/constants/role';
import { userInfoStore } from '@/store/UserInfo';
import { NoticeInfo } from '@/types/notice';
import axiosInstance from '@/utils/axiosInstance';
import { formatDateToYYMMDDWithDot } from '@/utils/formatDate';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import NoticeDetailLoadingSkeleton from './components/NoticeDetailLoadingSkeleton';
import { ToastInfoStore } from '@/store/ToastInfo';

// 공지사항 게시글 정보 조회 API
const fetchNoticeDetailInfo = ({ queryKey }: any) => {
  const nid = queryKey[1];
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/notice/${nid}`,
  );
};

// 공지사항 삭제 API
const deleteNotice = (nid: string) => {
  return axiosInstance.delete(
    `${process.env.NEXT_PUBLIC_API_VERSION}/notice/${nid}`,
  );
};

interface DefaultProps {
  params: {
    nid: string;
  };
}

const MarkdownPreview = dynamic(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  { ssr: false },
);

export default function NoticeDetail(props: DefaultProps) {
  const nid = props.params.nid;

  const addToast = ToastInfoStore((state) => state.addToast);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['noticeDetailInfo', nid],
    queryFn: fetchNoticeDetailInfo,
  });

  const deleteNoticeMutation = useMutation({
    mutationFn: deleteNotice,
    onSuccess: (data) => {
      const resData = data.data;
      const httpStatusCode = resData.status;

      switch (httpStatusCode) {
        case 200:
          addToast('success', '공지사항이 삭제되었어요.');
          router.push('/notices');
          break;
        default:
          addToast('error', '삭제 중에 에러가 발생했어요.');
      }
    },
    onError: (error: AxiosError) => {
      const resData: any = error.response?.data;
      switch (resData.status) {
        default:
          addToast('error', '삭제 중에 에러가 발생했어요.');
      }
    },
  });

  const userInfo = userInfoStore((state: any) => state.userInfo);

  const resData = data?.data.data;
  const noticeInfo: NoticeInfo = resData;

  const router = useRouter();

  const handleEditNotice = () => {
    router.push(`/notices/${nid}/edit`);
  };

  const handleDeleteNotice = () => {
    const userResponse = confirm(
      '현재 공지사항 게시글을 삭제하시겠습니까?\n삭제 후 내용을 되돌릴 수 없습니다.',
    );
    if (!userResponse) return;

    deleteNoticeMutation.mutate(nid);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        addToast('success', '링크가 복사됐어요');
      })
      .catch(() => {
        alert('복사에 실패했습니다.');
      });
  };

  if (isPending) return <NoticeDetailLoadingSkeleton />;

  return (
    <div className="mt-10 mb-24 px-1 pb-1 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[21rem] xs:w-[90%] xl:w-[60rem] mx-auto">
        <div className="flex flex-col gap-2">
          <p className="h-16 flex items-center text-[42px] font-bold tracking-wide">
            <span className="lift-up">공지사항</span>
          </p>

          <p className="mt-7 font-bold text-[#4e5968] text-[24px] leading-[2rem]">
            {noticeInfo.title}
          </p>

          <div className="flex flex-col 3md:items-center 3md:flex-row pb-6 gap-1 3md:gap-3 border-b border-[#e5e8eb]">
            <span className="font-semibold">
              <td className="text-[#8b95a1] text-[14px] font-extralight">
                {formatDateToYYMMDDWithDot(noticeInfo.createdAt)}
              </td>
            </span>
          </div>
        </div>

        <div className="border-b border-[#e5e8eb] mt-9 mb-4 pb-10">
          <MarkdownPreview
            className="markdown-preview"
            source={noticeInfo.content}
          />
        </div>

        <div className="flex justify-between flex-col 3md:flex-row gap-2">
          <div className="flex gap-2 flex-col 3md:flex-row">
            <button
              onClick={() => {
                copyToClipboard(window.location.href);
              }}
              className="flex justify-center items-center gap-x-[0.375rem] bg-[#f2f4f6] 3md:bg-white hover:bg-[#dbe0e5] rounded-[7px] px-3 py-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
              >
                <g fill="#8d95a0" fillRule="evenodd">
                  <path d="M21.316 2.684a6.098 6.098 0 00-8.614 0l-2.053 2.052a1.101 1.101 0 001.556 1.556l2.053-2.052a3.895 3.895 0 015.502 0 3.865 3.865 0 011.14 2.751 3.864 3.864 0 01-1.14 2.751l-3.601 3.601c-1.469 1.47-4.032 1.47-5.502 0a3.894 3.894 0 01-.625-.814 1.1 1.1 0 00-1.908 1.096c.267.463.595.892.977 1.274a6.054 6.054 0 004.307 1.784 6.052 6.052 0 004.307-1.784l3.601-3.6A6.054 6.054 0 0023.1 6.99a6.052 6.052 0 00-1.784-4.307"></path>
                  <path d="M11.795 17.708l-2.053 2.053a3.897 3.897 0 01-5.502 0A3.87 3.87 0 013.1 17.01c0-1.039.405-2.016 1.14-2.75l3.601-3.602a3.895 3.895 0 016.127.814 1.1 1.1 0 101.908-1.096 6.099 6.099 0 00-9.591-1.274l-3.601 3.601A6.054 6.054 0 00.9 17.01c0 1.627.634 3.157 1.784 4.307a6.066 6.066 0 004.307 1.781c1.56 0 3.119-.594 4.307-1.78l2.053-2.053a1.101 1.101 0 00-1.556-1.556"></path>
                </g>
              </svg>
              <span className="text-[#4e5968] font-medium">공유</span>
            </button>
          </div>

          <div className="flex gap-2 flex-col 3md:flex-row">
            {OPERATOR_ROLES.includes(userInfo.role) &&
              userInfo._id === noticeInfo.writer._id && (
                <>
                  <button
                    onClick={handleEditNotice}
                    className="3md:ml-4 3md:mt-0 ml-0 mt-4 flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-4 py-[0.5rem] rounded-[7px] font-semibold  hover:bg-[#d3d6da]"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDeleteNotice}
                    className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#de5257] bg-[#fcefee] px-4 py-[0.5rem] rounded-[7px] font-semibold hover:bg-[#f8d6d7]"
                  >
                    삭제
                  </button>
                </>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
