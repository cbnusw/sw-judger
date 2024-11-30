'use client';

import { OPERATOR_ROLES } from '@/constants/role';
import { userInfoStore } from '@/store/UserInfo';
import { NoticeInfo } from '@/types/notice';
import axiosInstance from '@/utils/axiosInstance';
import { formatDateToYYMMDDHHMM } from '@/utils/formatDate';
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
    retry: 0,
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

  if (isPending) return <NoticeDetailLoadingSkeleton />;

  return (
    <div className="mt-6 mb-24 px-1 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[21rem] xs:w-[90%] xl:w-[72.5%] mx-auto">
        <div className="flex flex-col gap-8">
          <p className="text-2xl font-bold tracking-tight">
            {noticeInfo.title}
          </p>
          <div className="flex justify-between pb-3 border-b border-gray-300">
            <div className="flex gap-3">
              <span className="font-semibold">
                작성일:{' '}
                <span className="font-light">
                  {formatDateToYYMMDDHHMM(noticeInfo.createdAt)}
                </span>
              </span>
            </div>
            <div className="flex gap-3">
              <span className="font-semibold">
                작성자:{' '}
                <span className="font-light">{noticeInfo.writer.name}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="border-b mt-8 mb-4 pb-5">
          <MarkdownPreview
            className="markdown-preview"
            source={noticeInfo.content}
          />
        </div>

        <div className="flex flex-col 3md:flex-row gap-2 justify-end">
          {OPERATOR_ROLES.includes(userInfo.role) &&
            userInfo._id === noticeInfo.writer._id && (
              <>
                <button
                  onClick={handleEditNotice}
                  className="3md:ml-4 3md:mt-0 ml-0 mt-4 flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-4 py-[0.5rem] rounded-[7px] font-medium focus:bg-[#d3d6da] hover:bg-[#d3d6da]"
                >
                  수정
                </button>
                <button
                  onClick={handleDeleteNotice}
                  className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#de5257] bg-[#fcefee] px-4 py-[0.5rem] rounded-[7px] font-medium hover:bg-[#f8d6d7]"
                >
                  삭제
                </button>
              </>
            )}
        </div>
      </div>
    </div>
  );
}
