'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ContestInfo } from '@/types/contest';
import { formatDateToYYMMDDHHMM } from '@/utils/formatDate';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';
import { userInfoStore } from '@/store/UserInfo';
import ContestContestContestantList from './components/ContestContestContestantList';
import { OPERATOR_ROLES } from '@/constants/role';
import * as XLSX from 'xlsx';
import { AxiosError } from 'axios';
import ContestDetailPageLoadingSkeleton from './components/skeleton/ContestDetailPageLoadingSkeleton';
import ContestDetailContentLoadingSkeleton from './components/skeleton/ContestDetailContentLoadingSkeleton';
import { ToastInfoStore } from '@/store/ToastInfo';

// 대회 게시글 정보 조회 API
const fetchContestDetailInfo = ({ queryKey }: any) => {
  const cid = queryKey[1];
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/contest/${cid}`,
  );
};

// 대회 삭제 API
const deleteContest = (cid: string) => {
  return axiosInstance.delete(
    `${process.env.NEXT_PUBLIC_API_VERSION}/contest/${cid}`,
  );
};

// 대회 참가 신청 API
const enrollContest = (cid: string) => {
  return axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_VERSION}/contest/${cid}/enroll`,
  );
};

// 대회 참가 신청 취소 API
const unEnrollContest = (cid: string) => {
  return axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_VERSION}/contest/${cid}/unenroll`,
  );
};

interface DefaultProps {
  params: {
    cid: string;
  };
}

const MarkdownPreview = dynamic(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <ContestDetailContentLoadingSkeleton />,
  },
);

export default function ContestDetail(props: DefaultProps) {
  const cid = props.params.cid;

  const addToast = ToastInfoStore((state) => state.addToast);
  const queryClient = useQueryClient();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['contestDetailInfo', cid],
    queryFn: fetchContestDetailInfo,
    retry: 0,
  });

  const deleteContestMutation = useMutation({
    mutationFn: deleteContest,
    onSuccess: (data) => {
      const resData = data.data;
      const httpStatusCode = resData.status;

      switch (httpStatusCode) {
        case 200:
          addToast('success', '대회가 삭제되었어요.');
          router.push('/contests');
          break;
        default:
          addToast('error', '삭제 중에 에러가 발생했어요.');
      }
    },
    onError: (error: AxiosError) => {
      const resData: any = error.response?.data;
      switch (resData.status) {
        case 400:
          switch (resData.code) {
            case 'AFTER_TEST_START':
              addToast('warning', '대회 시작 후에는 삭제할 수 없어요.');
              break;
            default:
              addToast('error', '삭제 중에 에러가 발생했어요.');
          }
          break;
        default:
          addToast('error', '삭제 중에 에러가 발생했어요.');
      }
    },
  });

  const enrollContestMutation = useMutation({
    mutationFn: enrollContest,
    onSuccess: (data) => {
      const resData = data.data;
      const httpStatusCode = resData.status;

      switch (httpStatusCode) {
        case 200:
          setIsEnrollContest(true);
          addToast('success', '신청이 완료되었어요.');

          // 쿼리 데이터 업데이트
          const updatedContestants = [...contestInfo.contestants, userInfo];
          queryClient.setQueryData(['contestDetailInfo', cid], {
            ...data,
            data: {
              ...data?.data,
              data: {
                ...contestInfo,
                contestants: updatedContestants,
              },
            },
          });
          break;
        default:
          addToast('error', '신청 중에 에러가 발생했어요.');
      }
    },
    onError: (error: AxiosError) => {
      const resData: any = error.response?.data;
      switch (resData.status) {
        case 400:
          switch (resData.code) {
            case 'BEFORE_APPLYING_PERIOD':
              addToast('warning', '대회 신청 기간이 아니에요.');
              break;
            default:
              addToast('error', '신청 중에 에러가 발생했어요.');
          }
          break;
        default:
          addToast('error', '신청 중에 에러가 발생했어요.');
      }
    },
  });

  const unErollContestMutation = useMutation({
    mutationFn: unEnrollContest,
    onSuccess: (data) => {
      const resData = data.data;
      const httpStatusCode = resData.status;

      switch (httpStatusCode) {
        case 200:
          setIsEnrollContest(false);
          addToast('success', '신청이 취소되었어요.');
          const updatedContestants = contestInfo.contestants.filter(
            (contestant) => contestant._id !== userInfo._id,
          );

          // 쿼리 데이터 업데이트
          queryClient.setQueryData(['contestDetailInfo', cid], {
            ...data,
            data: {
              ...data?.data,
              data: {
                ...contestInfo,
                contestants: updatedContestants,
              },
            },
          });
          break;
        default:
          addToast('error', '취소 중에 에러가 발생했어요.');
      }
    },
  });

  const userInfo = userInfoStore((state: any) => state.userInfo);

  const resData = data?.data.data;
  const contestInfo: ContestInfo = resData;

  const [isEnrollContest, setIsEnrollContest] = useState(false);
  const [loadingDots, setLoadingDots] = useState('');

  const timeUntilStart = useCountdownTimer(contestInfo?.testPeriod.start);
  const timeUntilEnd = useCountdownTimer(contestInfo?.testPeriod.end);
  const currentTime = new Date();
  const contestStartTime = new Date(contestInfo?.testPeriod.start);
  const contestEndTime = new Date(contestInfo?.testPeriod.end);

  const router = useRouter();

  // 대회 시간 표시에 사용할 클래스를 결정하는 함수
  const getTimeDisplayClass = () => {
    if (currentTime < contestStartTime) {
      // 대회 시작 전
      return 'text-blue-500';
    } else if (
      currentTime >= contestStartTime &&
      currentTime < contestEndTime
    ) {
      // 대회 진행 중
      return 'text-red-500';
    }
  };

  // 대회 시작까지 남은 시간 또는 대회 종료까지 남은 시간을 표시하는 함수
  const renderRemainingTime = () => {
    if (currentTime < contestStartTime) {
      // 대회 시작 전: 대회 시작까지 남은 시간 표시
      return (
        <span className={`font-semibold ${getTimeDisplayClass()}`}>
          {timeUntilStart.days > 0 &&
            `(${timeUntilStart.days}일 ${timeUntilStart.hours}시간 남음)`}
          {timeUntilStart.days === 0 &&
            timeUntilStart.hours > 0 &&
            `(${timeUntilStart.hours}시간 ${timeUntilStart.minutes}분 남음)`}
          {timeUntilStart.days === 0 &&
            timeUntilStart.hours === 0 &&
            timeUntilStart.minutes > 0 &&
            `(${timeUntilStart.minutes}분 ${timeUntilStart.seconds}초 남음)`}
          {timeUntilStart.days === 0 &&
            timeUntilStart.hours === 0 &&
            timeUntilStart.minutes === 0 &&
            `(${timeUntilStart.seconds}초 남음)`}
        </span>
      );
    } else if (
      currentTime >= contestStartTime &&
      currentTime < contestEndTime
    ) {
      // 대회 진행 중: 대회 종료까지 남은 시간 표시
      return (
        <span className={`font-semibold ${getTimeDisplayClass()}`}>
          {timeUntilEnd.days > 0 &&
            `(${timeUntilEnd.days}일 ${timeUntilEnd.hours}시간 남음)`}
          {timeUntilEnd.days === 0 &&
            timeUntilEnd.hours > 0 &&
            `(${timeUntilEnd.hours}시간 ${timeUntilEnd.minutes}분 남음)`}
          {timeUntilEnd.days === 0 &&
            timeUntilEnd.hours === 0 &&
            timeUntilEnd.minutes > 0 &&
            `(${timeUntilEnd.minutes}분 ${timeUntilEnd.seconds}초 남음)`}
          {timeUntilEnd.days === 0 &&
            timeUntilEnd.hours === 0 &&
            timeUntilEnd.minutes === 0 &&
            `(${timeUntilEnd.seconds}초 남음)`}
        </span>
      );
    }
  };

  const handleGoToContestRankList = () => {
    router.push(`/contests/${cid}/ranklist`);
  };

  const handleGoToUsersContestSubmits = () => {
    router.push(`/contests/${cid}/submits`);
  };

  // "문제 목록" 버튼의 렌더링 조건을 설정
  const shouldShowProblemsButton = () => {
    // 대회 게시글 작성자인 경우, 언제든지 버튼 보임
    if (userInfo._id === contestInfo.writer._id) {
      return true;
    }

    // 대회 신청자인 경우, 대회 시간 중에만 버튼 보임
    if (
      isEnrollContest &&
      currentTime >= contestStartTime &&
      currentTime < contestEndTime
    ) {
      return true;
    }

    return false;
  };

  const handleGoToContestProblems = () => {
    router.push(`/contests/${cid}/problems`);
  };

  const handleEditContest = () => {
    router.push(`/contests/${cid}/edit`);
  };

  const handleDeleteContest = () => {
    const userResponse = confirm(
      '대회를 삭제하시겠습니까?\n삭제 후 내용을 되돌릴 수 없어요.',
    );
    if (!userResponse) return;

    deleteContestMutation.mutate(cid);
  };

  // 대회 신청 여부 확인
  const isUserContestant = useCallback(() => {
    return contestInfo.contestants.some(
      (contestant) => contestant._id === userInfo._id,
    );
  }, [contestInfo, userInfo]);

  useEffect(() => {
    if (contestInfo && contestInfo.contestants && userInfo)
      setIsEnrollContest(isUserContestant());
  }, [contestInfo, userInfo, isUserContestant]);

  const handleEnrollContest = () => {
    const userResponse = confirm('대회 참가 신청을 하시겠습니까?');
    if (!userResponse) return;

    enrollContestMutation.mutate(cid);
  };

  const handleUnEnrollContest = () => {
    const userResponse = confirm(
      '대회 참가 신청을 취소하시겠습니까?\n참가신청 기간 이후에는 다시 신청할 수 없어요.',
    );
    if (!userResponse) return;

    unErollContestMutation.mutate(cid);
  };

  // 대회 상태에 따른 버튼 렌더링
  const renderContestActionButton = () => {
    if (currentTime < contestStartTime) {
      // 대회 시작 전
      if (isEnrollContest) {
        // 사용자가 대회에 이미 참가했다면 '대회 참가 취소하기' 버튼을 보여줍니다.
        return (
          <button
            onClick={handleUnEnrollContest}
            className="flex gap-[0.6rem] items-center w-fit h-11 text-[#3870e0] text-lg font-medium border-[1.5px] border-[#3870e0] px-4 py-[0.5rem] rounded-[3rem] box-shadow transition duration-75"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="25"
              viewBox="0 -960 960 960"
              width="25"
              fill="#3870e0"
            >
              <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
            </svg>
            대회 참가 취소하기
          </button>
        );
      } else {
        // 사용자가 대회에 참가하지 않았다면 '대회 참가 신청하기' 버튼을 보여줍니다.
        return (
          <button
            onClick={handleEnrollContest}
            className="flex gap-[0.6rem] items-center w-fit h-11 text-white text-lg font-medium bg-[#3870e0] px-4 py-[0.5rem] rounded-[3rem] focus:bg-[#3464c2] hover:bg-[#3464c2] transition duration-75"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="25"
              viewBox="0 -960 960 960"
              width="25"
              fill="white"
            >
              <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z" />
            </svg>
            대회 참가 신청하기
          </button>
        );
      }
    } else if (
      currentTime >= contestStartTime &&
      currentTime < contestEndTime
    ) {
      // 대회 진행 중
      return (
        <div className="flex gap-[0.6rem] justify-center items-center w-[9rem] h-11 text-[#3870e0] text-lg font-medium border-[1.5px] border-[#3870e0] py-[0.5rem] rounded-[3rem]">
          대회 진행 중
          <span className="w-1 ml-[-0.6rem] text-[#3870e0]">{loadingDots}</span>
        </div>
      );
    } else {
      // 대회 종료
      return (
        <div className="flex gap-[0.6rem] items-center w-fit h-11 text-red-500 text-lg font-medium border-[1.5px] border-red-500 px-4 py-[0.5rem] rounded-[3rem]">
          대회 종료
        </div>
      );
    }
  };

  const downloadContestantListAsExcel = (
    contestants: ContestInfo['contestants'],
    contestTitle: string,
  ) => {
    // 엑셀 파일에 쓸 데이터 생성
    const data = contestants.map((contestant, index) => ({
      번호: index + 1,
      학번: contestant.no,
      이름: contestant.name,
      대학교: contestant.university,
      '학부(과)': contestant.department,
      이메일: contestant.email,
      전화번호: contestant.phone,
    }));

    // 워크시트 생성
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 칼럼 너비 설정
    worksheet['!cols'] = [
      { wch: 7.5 }, // 번호 칼럼 너비
      { wch: 12.5 }, // 학번 칼럼 너비
      { wch: 10 }, // 이름 칼럼 너비
      { wch: 15 }, // 대학교 칼럼 너비
      { wch: 20 }, // 학부(과) 칼럼 너비
      { wch: 25 }, // 이메일 칼럼 너비
      { wch: 12.5 }, // 전화번호 칼럼 너비
    ];

    worksheet['!autofilter'] = {
      ref: `A1:G${contestants.length + 1}`,
    };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '대회 참가자');

    // 엑셀 파일 생성 및 다운로드
    const fileName = `${contestTitle}_참가자.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const handleDownloadContestantList = () => {
    // 대회 참가자 정보와 대회명을 인자로 전달
    downloadContestantListAsExcel(contestInfo.contestants, contestInfo.title);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingDots((prev) => (prev.length < 3 ? prev + '.' : ''));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  if (isPending) return <ContestDetailPageLoadingSkeleton />;

  return (
    <div className="mt-6 mb-24 px-1 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[21rem] xs:w-[90%] xl:w-[72.5%] mx-auto">
        <div className="flex flex-col gap-8">
          <p className="text-2xl font-bold tracking-tight">
            {contestInfo.title}
          </p>
          <div className="flex flex-col 3md:flex-row pb-3 gap-1 3md:gap-3 border-b border-gray-300">
            <span className="font-semibold">
              <span className="3md:hidden text-gray-500">• </span>
              참가신청 기간:{' '}
              <span className="font-light">
                {contestInfo.applyingPeriod ? (
                  <>
                    {formatDateToYYMMDDHHMM(contestInfo.applyingPeriod.start)} ~{' '}
                    {formatDateToYYMMDDHHMM(contestInfo.applyingPeriod.end)}
                  </>
                ) : (
                  <>~ {formatDateToYYMMDDHHMM(contestInfo.testPeriod.start)}</>
                )}
              </span>
            </span>
            <span className='hidden relative bottom-[0.055rem] font-thin before:content-["|"] 3md:block' />
            <span className="font-semibold">
              <span className="3md:hidden text-gray-500">• </span>
              대회 시간:{' '}
              <span className="font-light">
                {formatDateToYYMMDDHHMM(contestInfo.testPeriod.start)} ~{' '}
                {formatDateToYYMMDDHHMM(contestInfo.testPeriod.end)}{' '}
                {timeUntilEnd?.isPast ? (
                  <span className="text-red-500 font-bold">(종료)</span>
                ) : (
                  renderRemainingTime()
                )}
              </span>
            </span>
            <span className="ml-0 font-semibold 3md:ml-auto">
              <span className="3md:hidden text-gray-500">• </span>
              작성자:{' '}
              <span className="font-light">{contestInfo.writer.name}</span>
            </span>
          </div>
        </div>

        <div className="border-b mt-8 mb-4 pb-5">
          <MarkdownPreview
            className="markdown-preview"
            source={contestInfo.content}
          />
        </div>

        <div className="flex flex-col 3md:flex-row gap-2 justify-end">
          <button
            onClick={handleGoToContestRankList}
            className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#487fee] bg-[#e8f3ff] px-4 py-[0.5rem] rounded-[7px] font-medium focus:bg-[#cee1fc] hover:bg-[#cee1fc]"
          >
            대회 순위
          </button>
          {OPERATOR_ROLES.includes(userInfo.role) &&
            userInfo._id === contestInfo.writer._id && (
              <button
                onClick={handleGoToUsersContestSubmits}
                className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-4 py-[0.5rem] rounded-[7px] font-medium focus:bg-[#d3d6da] hover:bg-[#d3d6da]"
              >
                코드 제출 목록
              </button>
            )}
          {shouldShowProblemsButton() && (
            <button
              onClick={handleGoToContestProblems}
              className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-4 py-[0.5rem] rounded-[7px] font-medium focus:bg-[#d3d6da] hover:bg-[#d3d6da]"
            >
              문제 목록
            </button>
          )}
          {OPERATOR_ROLES.includes(userInfo.role) &&
            userInfo._id === contestInfo.writer._id && (
              <>
                <button
                  onClick={handleEditContest}
                  className="3md:ml-4 3md:mt-0 ml-0 mt-4 flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-4 py-[0.5rem] rounded-[7px] font-medium focus:bg-[#d3d6da] hover:bg-[#d3d6da]"
                >
                  수정
                </button>
                <button
                  onClick={handleDeleteContest}
                  className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#de5257] bg-[#fcefee] px-4 py-[0.5rem] rounded-[7px] font-medium hover:bg-[#f8d6d7]"
                >
                  삭제
                </button>
              </>
            )}
        </div>

        {userInfo.role === 'student' && (
          <div className="mt-4">
            <p className="text-2xl font-semibold mt-10 ">참여 방법</p>
            <div className="flex flex-col items-center gap-4 mt-4 mx-auto bg-[#fafafa] w-full py-[1.75rem] border border-[#e4e4e4] border-t-2 border-t-gray-400">
              {renderContestActionButton()}
              {isEnrollContest ? (
                <div className="flex flex-col gap-1 text-center">
                  <div className="text-[#777] text-xs">
                    대회 시작 전까지만{' '}
                    <span className="text-red-500">신청 취소가 가능</span>
                    합니다.
                  </div>
                  <div className="px-5 text-[#777] text-xs">
                    비정상적인 이력이 확인될 경우, 서비스 이용이 제한됩니다.
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-1 text-center">
                  <div className="text-[#777] text-xs">
                    대회 시작 후에는{' '}
                    <span className="text-red-500">신청이 불가능</span>
                    합니다.
                  </div>
                  <div className="px-5 text-[#777] text-xs">
                    참가 신청 이전에 반드시 대회 내용을 자세히 읽어주시기
                    바랍니다.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 py-2">
          <p className="text-2xl font-semibold">참가자</p>
          <div className="flex mt-4 justify-between items-center">
            <span>
              신청자 수:{' '}
              <span className="text-red-500">
                {contestInfo.contestants.length}
              </span>
              명
            </span>
            <div className="flex gap-3">
              {OPERATOR_ROLES.includes(userInfo.role) && (
                <button
                  onClick={handleDownloadContestantList}
                  className="flex justify-center items-center gap-2 text-[0.8rem] bg-[#e8f3ff] px-3 py-[0.5rem] rounded-[7px] font-medium focus:bg-[#cee1fc] hover:bg-[#cee1fc]"
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
                    명단 다운로드
                  </span>
                </button>
              )}
            </div>
          </div>

          <ContestContestContestantList
            contestContestants={contestInfo.contestants}
          />
        </div>
      </div>
    </div>
  );
}
