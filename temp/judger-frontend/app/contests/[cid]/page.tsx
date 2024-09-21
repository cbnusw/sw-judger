'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Loading from '@/app/loading';
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
  { ssr: false },
);

export default function ContestDetail(props: DefaultProps) {
  const cid = props.params.cid;
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
          alert('대회가 삭제되었습니다.');
          router.push('/contests');
          break;
        default:
          alert('정의되지 않은 http status code입니다');
      }
    },
    onError: (error: AxiosError) => {
      const resData: any = error.response?.data;
      switch (resData.status) {
        case 400:
          switch (resData.code) {
            case 'AFTER_TEST_START':
              alert('대회 시작 시간 이후에는 게시글을 삭제하실 수 없습니다.');
              break;
            default:
              alert('정의되지 않은 http code입니다.');
          }
          break;
        default:
          alert('정의되지 않은 http status code입니다');
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
          alert(
            '대회 참가 신청이 완료되었습니다.\n대회 시간을 확인한 후, 해당 시간에 참가해 주세요',
          );

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
          alert('정의되지 않은 http status code입니다');
      }
    },
    onError: (error: AxiosError) => {
      const resData: any = error.response?.data;
      switch (resData.status) {
        case 400:
          switch (resData.code) {
            case 'BEFORE_APPLYING_PERIOD':
              alert('대회 신청 기간이 아닙니다.');
              break;
            default:
              alert('정의되지 않은 http code입니다.');
          }
          break;
        default:
          alert('정의되지 않은 http status code입니다');
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
          alert('대회 참가 신청이 취소되었습니다.');
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
          alert('정의되지 않은 http status code입니다');
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
      '대회를 삭제하시겠습니까?\n삭제 후 내용을 되돌릴 수 없습니다.',
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
      '대회 참가 신청을 취소하시겠습니까?\n참가신청 기간 이후에는 다시 신청할 수 없습니다.',
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

  if (isPending) return <Loading />;

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
        <div>
          <div className="flex flex-col 3md:flex-row gap-2 justify-end">
            <button
              onClick={handleGoToContestRankList}
              className="flex justify-center items-center gap-[0.375rem] text-sm text-[#f9fafb] bg-[#0388ca] px-2 py-[0.45rem] rounded-[6px] font-medium focus:bg-[#007eb9] hover:bg-[#007eb9]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                viewBox="0 -960 960 960"
                width="20"
                fill="white"
              >
                <path d="M298-120v-60h152v-148q-54-11-96-46.5T296-463q-74-8-125-60t-51-125v-44q0-25 17.5-42.5T180-752h104v-88h392v88h104q25 0 42.5 17.5T840-692v44q0 73-51 125t-125 60q-16 53-58 88.5T510-328v148h152v60H298Zm-14-406v-166H180v44q0 45 29.5 78.5T284-526Zm392 0q45-10 74.5-43.5T780-648v-44H676v166Z" />
              </svg>
              대회 순위
            </button>
            {OPERATOR_ROLES.includes(userInfo.role) &&
              userInfo._id === contestInfo.writer._id && (
                <button
                  onClick={handleGoToUsersContestSubmits}
                  className="flex justify-center items-center gap-[0.375rem] text-[#f9fafb] bg-[#6860ff] px-2 py-[0.45rem] rounded-[6px] focus:bg-[#5951f0] hover:bg-[#5951f0]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 -960 960 960"
                    width="20"
                    fill="white"
                  >
                    <path d="M320-242 80-482l242-242 43 43-199 199 197 197-43 43Zm318 2-43-43 199-199-197-197 43-43 240 240-242 242Z" />
                  </svg>
                  코드 제출 목록
                </button>
              )}
            {shouldShowProblemsButton() && (
              <button
                onClick={handleGoToContestProblems}
                className="flex justify-center items-center gap-[0.375rem] text-[#f9fafb] bg-green-500 px-2 py-[0.45rem] rounded-[6px] focus:bg-[#3e9368] hover:bg-[#3e9368]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20"
                  viewBox="0 -960 960 960"
                  width="20"
                  fill="white"
                >
                  <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520h200L520-800v200Z" />
                </svg>
                문제 목록
              </button>
            )}
            {OPERATOR_ROLES.includes(userInfo.role) &&
              userInfo._id === contestInfo.writer._id && (
                <>
                  <button
                    onClick={handleEditContest}
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
                    onClick={handleDeleteContest}
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
                </>
              )}
          </div>
        </div>

        {!OPERATOR_ROLES.includes(userInfo.role) && (
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
                  명단 다운로드
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
