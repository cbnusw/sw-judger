'use client';

import { OPERATOR_ROLES } from '@/constants/role';
import Loading from '@/app/loading';
import { userInfoStore } from '@/store/UserInfo';
import { NoticeInfo } from '@/types/notice';
import axiosInstance from '@/utils/axiosInstance';
import { formatDateToYYMMDDHHMM } from '@/utils/formatDate';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
          alert('공지사항이 삭제되었습니다.');
          router.push('/notices');
          break;
        default:
          alert('정의되지 않은 http status code입니다');
      }
    },
    onError: (error: AxiosError) => {
      const resData: any = error.response?.data;
      switch (resData.status) {
        default:
          alert('정의되지 않은 http status code입니다');
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

  if (isPending) return <Loading />;

  return (
    <div className="mt-6 mb-24 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[60rem] mx-auto">
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

        {OPERATOR_ROLES.includes(userInfo.role) &&
          userInfo._id === noticeInfo.writer._id && (
            <div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleEditNotice}
                  className="flex justify-center items-center gap-[0.375rem] text-[#f9fafb] bg-[#eba338] px-2 py-[0.45rem] rounded-[6px] focus:bg-[#dc9429] hover:bg-[#dc9429]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 -960 960 960"
                    width="20"
                    fill="white"
                  >
                    <path d="M794-666 666-794l42-42q17-17 42.5-16.5T793-835l43 43q17 17 17 42t-17 42l-42 42Zm-42 42L248-120H120v-128l504-504 128 128Z" />
                  </svg>
                  게시글 수정
                </button>
                <button
                  onClick={handleDeleteNotice}
                  className="flex justify-center items-center gap-[0.375rem] text-[#f9fafb] bg-red-500 px-2 py-[0.45rem] rounded-[6px] focus:bg-[#e14343] hover:bg-[#e14343]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 -960 960 960"
                    width="20"
                    fill="white"
                  >
                    <path d="m361-299 119-121 120 121 47-48-119-121 119-121-47-48-120 121-119-121-48 48 120 121-120 121 48 48ZM261-120q-24 0-42-18t-18-42v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Z" />
                  </svg>
                  게시글 삭제
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
