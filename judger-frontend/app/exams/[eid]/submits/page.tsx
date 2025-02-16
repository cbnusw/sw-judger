'use client';

import Link from 'next/link';
import UsersExamSubmitList from './components/UsersExamSubmitList';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import paperImg from '@/public/images/paper.png';
import { fetchCurrentUserInfo } from '@/utils/fetchCurrentUserInfo';
import { UserInfo } from '@/types/user';
import { userInfoStore } from '@/store/UserInfo';
import { useRouter, useSearchParams } from 'next/navigation';
import { OPERATOR_ROLES } from '@/constants/role';
import axiosInstance from '@/utils/axiosInstance';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ExamInfo, ExamSubmitInfo } from '@/types/exam';
import * as XLSX from 'xlsx';
import { getCodeSubmitResultTypeDescription } from '@/utils/getCodeSubmitResultTypeDescription';
import UsersExamSubmitPageLoadingSkeleton from './components/UsersExamSubmitPageLoadingSkeleton';
import { ToastInfoStore } from '@/store/ToastInfo';

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

  const addToast = ToastInfoStore((state) => state.addToast);

  const { isPending, data } = useQuery({
    queryKey: ['examDetailInfoInUsersSubmits', eid],
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

  const params = useSearchParams();

  const titleQuery = decodeURIComponent(params?.get('q') || '');

  useEffect(() => {
    if (titleQuery) setSearchQuery(titleQuery);
  }, [titleQuery]);

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

        addToast('warning', '접근 권한이 없어요.');
        router.push('/');
      }
    });
  }, [updateUserInfo, examInfo, router, addToast]);

  const downloadSubmitsInfoListAsExcel = (
    contestantSubmitsInfo: ExamSubmitInfo[],
    contestTitle: string,
  ) => {
    // 엑셀 파일에 쓸 데이터 생성
    const data = contestantSubmitsInfo.map((submitInfo, index) => ({
      '#': index + 1,
      학번: submitInfo.user.no,
      이름: submitInfo.user.name,
      문제명: submitInfo.problem?.title,
      결과: getCodeSubmitResultTypeDescription(submitInfo.result.type), // 결과 처리 로직 필요
      메모리: `${(submitInfo.result.memory / 1048576).toFixed(2)} MB`, // 메모리 단위 변환
      시간: `${submitInfo.result.time} ms`,
      언어: submitInfo.language,
      '제출 시간': new Date(submitInfo.createdAt).toLocaleString(), // 날짜 형식 변환
      '수동 채점': '',
    }));

    // 워크시트 생성
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 칼럼 너비 설정
    worksheet['!cols'] = [
      { wch: 7.5 }, // 번호
      { wch: 12.5 }, // 학번
      { wch: 10 }, // 이름
      { wch: 20 }, // 문제명
      { wch: 12.5 }, // 결과
      { wch: 10 }, // 메모리
      { wch: 10 }, // 시간
      { wch: 10 }, // 언어
      { wch: 20 }, // 제출 시간
      { wch: 55 }, // 제출 시간
    ];

    worksheet['!autofilter'] = {
      ref: `A1:J${contestantSubmitsInfo.length + 1}`,
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
    <div className="mt-5 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[21rem] xs:w-[90%] xl:w-[60rem] mx-auto">
        <div className="flex flex-col 3md:flex-row items-start 3md:items-center gap-x-2">
          <div className="flex items-center text-2xl font-semibold tracking-tight">
            <Image
              src={paperImg}
              alt="paper"
              width={42.5}
              height={0}
              quality={100}
              className="fade-in-fast"
            />

            <div className="lift-up">
              <span className="ml-5 text-2xl font-semibold tracking-wide">
                코드 제출 목록
              </span>
            </div>
          </div>
          <Link
            href={`/exams/${eid}`}
            className="mt-4 3md:mt-0 lift-up w-fit flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#487fee] bg-[#e8f3ff] px-3 py-1 rounded-full font-semibold hover:bg-[#cee1fc]"
          >
            {examInfo.title}
          </Link>
        </div>

        <div className="flex flex-col 3md:flex-row justify-between gap-2 mt-9 mb-4">
          <div className="w-full 3md:w-1/2 h-[2.3rem] flex items-center pl-3 pr-1 outline outline-1 outline-[#e6e8ea] rounded-lg hover:outline-[#93bcfa] hover:outline-2 focus-within:outline-[#93bcfa] focus-within:outline-2">
            <svg
              fill="none"
              width="21"
              height="21"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m19.59 18.41-3.205-3.203c1.0712-1.3712 1.579-3.0994 1.4197-4.832-.1593-1.73274-.9735-3.3394-2.2767-4.49233s-2.9972-1.76527-4.7364-1.71212c-1.73913.05315-3.39252.76779-4.62288 1.99815s-1.945 2.88375-1.99815 4.6229c-.05316 1.7392.55918 3.4332 1.71211 4.7364s2.7596 2.1174 4.49232 2.2767c1.7327.1592 3.4608-.3485 4.832-1.4197l3.204 3.204c.1567.1541.3678.24.5876.2391.2197-.0009.4302-.0886.5856-.2439.1554-.1554.243-.3659.2439-.5856.001-.2198-.085-.431-.2391-.5876zm-4.886-3.808c-.0183.0156-.036.032-.053.049-.042.044-.042.044-.08.092-.91.886-2.197 1.424-3.571 1.424-1.19232.0001-2.348-.4121-3.27107-1.1668s-1.55672-1.8055-1.79352-2.974c-.2368-1.1686-.06217-2.38311.49428-3.43762s1.46047-1.88413 2.55878-2.34819c1.09833-.46405 2.32333-.53398 3.46733-.19793s2.1365 1.0574 2.8094 2.04174c.6728.98434.9845 2.1711.8822 3.359-.1022 1.1879-.6122 2.3039-1.4434 3.1588z"
                fill="#8994a2"
              ></path>
            </svg>
            <div className="w-full">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[2.3rem] pl-[0.625rem] pr-[0.25rem] outline-none placeholder-[#888e96] text-[0.825rem]"
                placeholder="이름, 학번으로 검색"
              />
            </div>
            {searchQuery && (
              <button
                onClick={(e) => {
                  setSearchQuery('');
                }}
                className="p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="25"
                  viewBox="0 -960 960 960"
                  width="25"
                  fill="#a2a4a9"
                >
                  <path d="M480-437.847 277.076-234.924q-8.307 8.308-20.884 8.5-12.576.193-21.268-8.5-8.693-8.692-8.693-21.076t8.693-21.076L437.847-480 234.924-682.924q-8.308-8.307-8.5-20.884-.193-12.576 8.5-21.268 8.692-8.693 21.076-8.693t21.076 8.693L480-522.153l202.924-202.923q8.307-8.308 20.884-8.5 12.576-.193 21.268 8.5 8.693 8.692 8.693 21.076t-8.693 21.076L522.153-480l202.923 202.924q8.308 8.307 8.5 20.884.193 12.576-8.5 21.268-8.692 8.693-21.076 8.693t-21.076-8.693L480-437.847Z"></path>
                </svg>
              </button>
            )}
          </div>

          <div className="w-full 3md:w-fit mt-2 3md:mt-0 flex gap-2">
            <button
              onClick={handleDownloadSubmitsInfoList}
              className="w-full 3md:w-fit flex justify-center items-center gap-2 text-[0.8rem] bg-[#e8f3ff] px-3 py-[0.5rem] rounded-[7px] font-semibold hover:bg-[#cee1fc]"
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

        <section className="dark:bg-gray-900">
          <UsersExamSubmitList eid={eid} searchQuery={searchQuery} />
        </section>
      </div>
    </div>
  );
}
