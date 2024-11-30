'use client';

import Link from 'next/link';
import UsersContestSubmitList from './components/UsersContestSubmitList';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import codeImg from '@/public/images/code.png';
import { userInfoStore } from '@/store/UserInfo';
import { fetchCurrentUserInfo } from '@/utils/fetchCurrentUserInfo';
import { UserInfo } from '@/types/user';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosInstance from '@/utils/axiosInstance';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ContestInfo, ContestSubmitInfo } from '@/types/contest';
import * as XLSX from 'xlsx';
import { getCodeSubmitResultTypeDescription } from '@/utils/getCodeSubmitResultTypeDescription';
import UsersContestSubmitPageLoadingSkeleton from './components/UsersContestSubmitPageLoadingSkeleton';
import { ToastInfoStore } from '@/store/ToastInfo';

// 대회 게시글 정보 조회 API
const fetchContestDetailInfo = ({ queryKey }: any) => {
  const cid = queryKey[1];
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/contest/${cid}`,
  );
};

// 대회 참가자 코드 제출 목록 정보 조회 API
const fetchContestantSubmitsInfo = (cid: string) => {
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/submit/contest/${cid}`,
  );
};

interface DefaultProps {
  params: {
    cid: string;
  };
}

export default function UsersContestSubmits(props: DefaultProps) {
  const cid = props.params.cid;

  const addToast = ToastInfoStore((state) => state.addToast);

  const { isPending, data } = useQuery({
    queryKey: ['contestDetailInfo', cid],
    queryFn: fetchContestDetailInfo,
  });

  const fetchContestantSubmitsInfoMutation = useMutation({
    mutationFn: () => fetchContestantSubmitsInfo(cid),
    onSuccess: (data) => {
      const resData = data?.data.data;
      const contestantSubmitsInfo: ContestSubmitInfo[] = resData.documents;
      downloadSubmitsInfoListAsExcel(contestantSubmitsInfo, contestInfo.title);
    },
  });

  const updateUserInfo = userInfoStore((state: any) => state.updateUserInfo);

  const resData = data?.data.data;
  const contestInfo: ContestInfo = resData;

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const params = useSearchParams();

  const titleQuery = decodeURIComponent(params?.get('q') || '');

  useEffect(() => {
    if (titleQuery) setSearchQuery(titleQuery);
  }, [titleQuery]);

  const router = useRouter();

  // (로그인 한) 사용자 정보 조회 및 관리자 권한 확인, 그리고 게시글 작성자인지 확인
  useEffect(() => {
    fetchCurrentUserInfo(updateUserInfo).then((userInfo: UserInfo) => {
      if (contestInfo) {
        const isWriter = contestInfo.writer._id === userInfo._id;

        if (isWriter) {
          setIsLoading(false);
          return;
        }

        addToast('warning', '접근 권한이 없어요.');
        router.push('/');
      }
    });
  }, [updateUserInfo, contestInfo, router, addToast]);

  const downloadSubmitsInfoListAsExcel = (
    contestantSubmitsInfo: ContestSubmitInfo[],
    contestTitle: string,
  ) => {
    // 엑셀 파일에 쓸 데이터 생성
    const data = contestantSubmitsInfo.map((submitInfo, index) => ({
      '#': index + 1,
      대학: submitInfo.user.university,
      '학부(과)': submitInfo.user.department,
      학번: submitInfo.user.no,
      이름: submitInfo.user.name,
      문제명: submitInfo.problem.title,
      결과: getCodeSubmitResultTypeDescription(submitInfo.result.type), // 결과 처리 로직 필요
      메모리: `${(submitInfo.result.memory / 1048576).toFixed(2)} MB`, // 메모리 단위 변환
      시간: `${submitInfo.result.time} ms`,
      언어: submitInfo.language,
      '제출 시간': new Date(submitInfo.createdAt).toLocaleString(), // 날짜 형식 변환
    }));

    // 워크시트 생성
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 칼럼 너비 설정
    worksheet['!cols'] = [
      { wch: 7.5 }, // 번호
      { wch: 15 }, // 대학
      { wch: 20 }, // 학부(과)
      { wch: 12.5 }, // 학번
      { wch: 10 }, // 이름
      { wch: 20 }, // 문제명
      { wch: 12.5 }, // 결과
      { wch: 10 }, // 메모리
      { wch: 10 }, // 시간
      { wch: 10 }, // 언어
      { wch: 20 }, // 제출 시간
    ];

    worksheet['!autofilter'] = {
      ref: `A1:K${contestantSubmitsInfo.length + 1}`,
    };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '대회 제출 목록');

    // 엑셀 파일 생성 및 다운로드
    const fileName = `${contestTitle}_제출목록.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const handleDownloadSubmitsInfoList = () => {
    // 대회 참가자 정보와 대회명을 인자로 전달
    const userResponse = confirm('명단을 다운로드 하시겠습니까?');
    if (!userResponse) return;

    fetchContestantSubmitsInfoMutation.mutate();
  };

  if (isLoading || isPending) return <UsersContestSubmitPageLoadingSkeleton />;

  return (
    <div className="mt-2 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[60rem] mx-auto">
        <p className="flex items-center text-2xl font-semibold tracking-tight">
          <Image
            src={codeImg}
            alt="trophy"
            width={70}
            height={0}
            quality={100}
            className="ml-[-1rem] fade-in-fast drop-shadow-lg"
          />

          <div className="lift-up">
            <span className="ml-4 text-3xl font-semibold tracking-wide">
              코드 제출 목록
            </span>
            <Link
              href={`/contests/${cid}`}
              className="mt-1 ml-1 text-xl font-medium cursor-pointer hover:underline hover:text-[#0038a8] focus:underline focus:text-[#0038a8] text-[#1048b8]"
            >
              (대회: {contestInfo.title})
            </Link>
          </div>
        </p>
        <div className="flex mt-5 mb-4">
          <div className="flex flex-col relative z-0 w-1/2 group">
            <input
              type="text"
              name="floating_first_name"
              className="block pl-7 pt-3 pb-[0.175rem] pr-0 w-full font-normal text-gray-900 bg-transparent border-0 border-b border-gray-400 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
            <div className="absolute pt-[0.9rem] left-[-0.9rem] flex items-center pl-3 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="21"
                viewBox="0 -960 960 960"
                width="21"
                fill="#464646"
                className="scale-x-[-1]"
              >
                <path d="M785.269-141.629 530.501-396.501q-29.502 26.199-69.036 40.003-39.533 13.805-80.64 13.805-100.978 0-170.677-69.711-69.698-69.71-69.698-169.473 0-99.764 69.423-169.558 69.423-69.795 169.62-69.795 100.198 0 169.974 69.757 69.776 69.756 69.776 169.593 0 41.752-14.411 81.136-14.41 39.385-40.064 70.298L820.05-176.667l-34.781 35.038ZM380.256-390.577q79.907 0 135.505-55.536t55.598-135.91q0-80.375-55.598-135.849-55.598-55.475-135.767-55.475-80.511 0-136.086 55.537-55.575 55.536-55.575 135.91 0 80.375 55.619 135.849 55.618 55.474 136.304 55.474Z" />
              </svg>
            </div>
            <label
              htmlFor="floating_first_name"
              className="peer-focus:font-light absolute text-base font-light text-gray-500 dark:text-gray-400 duration-300 transform -translate-x-[-1.75rem] -translate-y-5 scale-75 top-3 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-[1.25rem] z-10"
            >
              검색
            </label>
            <p className="text-gray-500 text-xs tracking-widest font-light mt-1">
              이름, 학번, 언어로 검색
            </p>
          </div>
          <div className="relative ml-auto mt-auto bottom-[-0.75rem]">
            <div className="flex justify-end mb-2">
              <button
                onClick={handleDownloadSubmitsInfoList}
                className="flex justify-center items-center gap-2 text-[0.8rem] bg-[#e8f3ff] px-3 py-[0.5rem] rounded-[7px] font-medium hover:bg-[#cee1fc]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                >
                  <g fill="#487fee">
                    <path d="M11.21 15.4c.21.21.5.32.78.32s.56-.11.78-.32L18 10.16c.43-.43.43-1.13 0-1.56s-1.13-.43-1.56 0l-3.35 3.35V2.78c0-.61-.49-1.1-1.1-1.1s-1.1.49-1.1 1.1v9.18L7.53 8.61c-.43-.43-1.13-.43-1.56 0s-.43 1.13 0 1.56l5.24 5.23z"></path>
                    <path d="M21.38 13.09c-.61 0-1.1.49-1.1 1.1v4.21c0 .72-.58 1.3-1.3 1.3H5c-.72 0-1.3-.58-1.3-1.3v-4.21c0-.61-.49-1.1-1.1-1.1s-1.1.49-1.1 1.1v4.21c0 1.93 1.57 3.5 3.5 3.5h13.98c1.93 0 3.5-1.57 3.5-3.5v-4.21c0-.61-.49-1.1-1.1-1.1z"></path>
                  </g>
                </svg>
                <span className="text-[#487fee] whitespace-nowrap">
                  제출 목록 다운로드
                </span>
              </button>
            </div>
          </div>
        </div>

        <section className="dark:bg-gray-900">
          <UsersContestSubmitList cid={cid} searchQuery={searchQuery} />
        </section>
      </div>
    </div>
  );
}
