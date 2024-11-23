'use client';

import Link from 'next/link';
import UsersExamSubmitList from './components/UsersExamSubmitList';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import codeImg from '@/public/images/code.png';
import { fetchCurrentUserInfo } from '@/utils/fetchCurrentUserInfo';
import { UserInfo } from '@/types/user';
import { userInfoStore } from '@/store/UserInfo';
import { useRouter } from 'next/navigation';
import { OPERATOR_ROLES } from '@/constants/role';
import axiosInstance from '@/utils/axiosInstance';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ExamInfo, ExamSubmitInfo } from '@/types/exam';
import * as XLSX from 'xlsx';
import { getCodeSubmitResultTypeDescription } from '@/utils/getCodeSubmitResultTypeDescription';
import UsersExamSubmitPageLoadingSkeleton from './components/UsersExamSubmitPageLoadingSkeleton';

// 시험 게시글 정보 조회 API
const fetchExamDetailInfo = ({ queryKey }: any) => {
  const eid = queryKey[1];
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/assignment/${eid}`,
  );
};

// 시험 참가자 코드 제출 목록 정보 조회 API
const fetchContestantSubmitsInfo = (eid: string) => {
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/submit/assignment/${eid}`,
  );
};

interface DefaultProps {
  params: {
    eid: string;
  };
}

export default function UsersExamSubmits(props: DefaultProps) {
  const eid = props.params.eid;

  const { isPending, data } = useQuery({
    queryKey: ['examDetailInfo', eid],
    queryFn: fetchExamDetailInfo,
  });

  const fetchContestantSubmitsInfoMutation = useMutation({
    mutationFn: () => fetchContestantSubmitsInfo(eid),
    onSuccess: (data) => {
      const resData = data?.data.data;
      const contestantSubmitsInfo: ExamSubmitInfo[] = resData.documents;
      downloadSubmitsInfoListAsExcel(contestantSubmitsInfo, examInfo.title);
    },
  });

  const updateUserInfo = userInfoStore((state: any) => state.updateUserInfo);

  const resData = data?.data.data;
  const examInfo: ExamInfo = resData;

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const router = useRouter();

  const currentTime = new Date();
  const examEndTime = new Date(examInfo?.testPeriod.end);

  // (로그인 한) 사용자 정보 조회 및 관리자 권한 확인
  useEffect(() => {
    fetchCurrentUserInfo(updateUserInfo).then((userInfo: UserInfo) => {
      if (examInfo) {
        const isWriter = examInfo.writer._id === userInfo._id;
        const isOperator = OPERATOR_ROLES.includes(userInfo.role);

        if (isWriter) {
          setIsLoading(false);
          return;
        }

        if (isOperator && currentTime > examEndTime) {
          setIsLoading(false);
          return;
        }

        alert('접근 권한이 없습니다.');
        router.back();
      }
    });
  }, [updateUserInfo, examInfo, router]);

  const downloadSubmitsInfoListAsExcel = (
    contestantSubmitsInfo: ExamSubmitInfo[],
    contestTitle: string,
  ) => {
    // 엑셀 파일에 쓸 데이터 생성
    const data = contestantSubmitsInfo.map((submitInfo, index) => ({
      번호: index + 1,
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
      { wch: 12.5 }, // 학번
      { wch: 10 }, // 이름
      { wch: 55 }, // 문제명
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
    XLSX.utils.book_append_sheet(workbook, worksheet, '시험 제출 목록');

    // 엑셀 파일 생성 및 다운로드
    const fileName = `${contestTitle}_제출목록.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const handleDownloadSubmitsInfoList = () => {
    // 시험 참가자 정보와 시험명을 인자로 전달
    const userResponse = confirm('명단을 다운로드 하시겠습니까?');
    if (!userResponse) return;

    fetchContestantSubmitsInfoMutation.mutate();
  };

  if (isLoading) return <UsersExamSubmitPageLoadingSkeleton />;

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
              href={`/exams/${eid}`}
              className="mt-1 ml-1 text-xl font-medium cursor-pointer hover:underline hover:text-[#0038a8] focus:underline focus:text-[#0038a8] text-[#1048b8]"
            >
              (시험: {examInfo.title})
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
              className="peer-focus:font-light absolute text-base font-light text-gray-500 dark:text-gray-400 duration-300 transform -translate-x-[-1.75rem] -translate-y-5 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-[1.25rem] z-10"
            >
              검색
            </label>
            <p className="text-gray-500 text-xs tracking-widest font-light mt-1">
              이름, 학번으로 검색
            </p>
          </div>
          <div className="relative ml-auto mt-auto bottom-[-0.75rem]">
            <div className="flex justify-end mb-2">
              <button
                onClick={handleDownloadSubmitsInfoList}
                className="flex justify-center items-center gap-[0.375rem] text-[#f9fafb] bg-[#4fa16a] px-2 py-[0.45rem] rounded-[6px] focus:bg-[#3b8d56] hover:bg-[#3b8d56]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 50 50"
                  width="18"
                  height="18"
                  fill="white"
                >
                  <path d="M 28.8125 0.03125 L 0.8125 5.34375 C 0.339844 5.433594 0 5.863281 0 6.34375 L 0 43.65625 C 0 44.136719 0.339844 44.566406 0.8125 44.65625 L 28.8125 49.96875 C 28.875 49.980469 28.9375 50 29 50 C 29.230469 50 29.445313 49.929688 29.625 49.78125 C 29.855469 49.589844 30 49.296875 30 49 L 30 1 C 30 0.703125 29.855469 0.410156 29.625 0.21875 C 29.394531 0.0273438 29.105469 -0.0234375 28.8125 0.03125 Z M 32 6 L 32 13 L 34 13 L 34 15 L 32 15 L 32 20 L 34 20 L 34 22 L 32 22 L 32 27 L 34 27 L 34 29 L 32 29 L 32 35 L 34 35 L 34 37 L 32 37 L 32 44 L 47 44 C 48.101563 44 49 43.101563 49 42 L 49 8 C 49 6.898438 48.101563 6 47 6 Z M 36 13 L 44 13 L 44 15 L 36 15 Z M 6.6875 15.6875 L 11.8125 15.6875 L 14.5 21.28125 C 14.710938 21.722656 14.898438 22.265625 15.0625 22.875 L 15.09375 22.875 C 15.199219 22.511719 15.402344 21.941406 15.6875 21.21875 L 18.65625 15.6875 L 23.34375 15.6875 L 17.75 24.9375 L 23.5 34.375 L 18.53125 34.375 L 15.28125 28.28125 C 15.160156 28.054688 15.035156 27.636719 14.90625 27.03125 L 14.875 27.03125 C 14.8125 27.316406 14.664063 27.761719 14.4375 28.34375 L 11.1875 34.375 L 6.1875 34.375 L 12.15625 25.03125 Z M 36 20 L 44 20 L 44 22 L 36 22 Z M 36 27 L 44 27 L 44 29 L 36 29 Z M 36 35 L 44 35 L 44 37 L 36 37 Z" />
                </svg>
                제출 목록 다운로드
              </button>
            </div>
          </div>
        </div>

        <section className="dark:bg-gray-900">
          <UsersExamSubmitList eid={eid} searchQuery={searchQuery} />
        </section>
      </div>
    </div>
  );
}
