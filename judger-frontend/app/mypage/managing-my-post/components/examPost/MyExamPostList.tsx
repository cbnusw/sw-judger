'use client';

import EmptyMyExamPostListItem from './EmptyMyExamPostListItem';
import MyExamPostListItem from './MyExamPostListItem';
import axiosInstance from '@/utils/axiosInstance';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ExamInfo } from '@/types/exam';
import { RenderPaginationButtons } from '@/app/components/RenderPaginationButtons';
import MyExamPostListLoadingSkeleton from './MyExamPostListLoadingSkeleton';

// 본인이 작성한 시험 게시글 목록 반환 API (10개 게시글 단위로)
const fetchMyExams = async ({ queryKey }: any) => {
  const page = queryKey[1];
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/assignment/me?page=${page}&limit=10&sort=-createdAt`,
  );
  return response.data;
};

export default function MyExamPostList() {
  const params = useSearchParams();

  const page = Number(params?.get('page')) || 1;

  const { isPending, data } = useQuery({
    queryKey: ['myExams', page],
    queryFn: fetchMyExams,
  });

  const router = useRouter();

  const resData = data?.data;
  const startItemNum = (resData?.page - 1) * 10 + 1;
  const endItemNum = startItemNum - 1 + resData?.documents.length;
  const totalPages = Math.ceil(resData?.total / 10);

  const handlePagination = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    router.push(`/mypage/managing-my-post?page=${newPage}`);
  };

  if (isPending) return <MyExamPostListLoadingSkeleton />;

  return (
    <div className="mx-auto mt-6 w-full">
      <div className="border relative overflow-hidden rounded-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100  text-center">
              <tr>
                <th scope="col" className="w-16 px-4 py-2">
                  번호
                </th>
                <th scope="col" className="px-4 py-2">
                  시험명
                </th>
                <th scope="col" className="px-4 py-2">
                  수업명
                </th>
                <th scope="col" className="px-4 py-2">
                  시험 시간
                </th>
                <th scope="col" className="w-24 px-4 py-2">
                  작성일
                </th>
              </tr>
            </thead>
            <tbody>
              {resData?.documents.length === 0 && <EmptyMyExamPostListItem />}
              {resData?.documents.map((examInfo: ExamInfo, index: number) => (
                <MyExamPostListItem
                  examInfo={examInfo}
                  total={resData.total}
                  page={page}
                  index={index}
                  key={index}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <nav
        className="flex flex-col md:flex-row text-xs justify-between items-start md:items-center space-y-3 md:space-y-0 pl-1 mt-3"
        aria-label="Table navigation"
      >
        <span className="text-gray-500 ">
          <span className="text-gray-500 dark:text-white">
            {startItemNum} - {endItemNum}
          </span>{' '}
          of{' '}
          <span className="text-gray-500 dark:text-white">{resData.total}</span>
        </span>
        <ul className="inline-flex items-stretch -space-x-px">
          <li>
            <button
              onClick={() => handlePagination(Number(page) - 1)}
              className="flex items-center justify-center h-full py-1.5 px-[0.3rem] ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700  dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Previous</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
          {RenderPaginationButtons(page, totalPages, handlePagination)}
          <li>
            <button
              onClick={() => handlePagination(Number(page) + 1)}
              className="flex items-center justify-center h-full py-1.5 px-[0.3rem] leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700  dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Next</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
