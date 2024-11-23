'use client';

import { userInfoStore } from '@/store/UserInfo';
import { ExampleFile, ProblemInfo } from '@/types/problem';
import { UserInfo } from '@/types/user';
import axiosInstance from '@/utils/axiosInstance';
import { fetchCurrentUserInfo } from '@/utils/fetchCurrentUserInfo';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import ContestProblemDetailPageLoadingSkeleton from './components/skeleton/ContestProblemDetailPageLoadingSkeleton';
import ContestProblemDetailPdfLoadingSkeleton from './components/skeleton/ContestProblemDetailPdfLoadingSkeleton';

// 대회 문제 열람 비밀번호 확인 API
const confirmContestPassword = ({
  cid,
  password,
}: {
  cid: string;
  password: string;
}) => {
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/contest/confirm/${cid}?password=${password}`,
  );
};

// 문제 정보 조회 API
const fetchContestProblemDetailInfo = ({ queryKey }: any) => {
  const problemId = queryKey[1];
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/problem/${problemId}`,
  );
};

// 대회 문제 삭제 API
const deleteContestProblem = (problemId: string) => {
  return axiosInstance.delete(
    `${process.env.NEXT_PUBLIC_API_VERSION}/problem/${problemId}`,
  );
};

interface DefaultProps {
  params: {
    cid: string;
    problemId: string;
  };
}

const PDFViewer = dynamic(() => import('@/app/components/PDFViewer'), {
  ssr: false,
  loading: () => <ContestProblemDetailPdfLoadingSkeleton />,
});

export default function ContestProblemDetail(props: DefaultProps) {
  const cid = props.params.cid;
  const problemId = props.params.problemId;

  const confirmContestPasswordMutation = useMutation({
    mutationFn: confirmContestPassword,
    onError: (error: AxiosError) => {
      const resData: any = error.response?.data;
      switch (resData.status) {
        case 400:
          switch (resData.code) {
            case 'CONTEST_PASSWORD_NOT_MATCH':
              alert('비밀번호가 일치하지 않습니다.');
              deleteCookie(cid);
              router.back();
              break;
            default:
              alert('정의되지 않은 http code입니다.');
          }
          break;
        default:
          alert('정의되지 않은 http status code입니다');
      }
    },
    onSuccess: (data) => {
      const resData = data.data;
      const httpStatusCode = resData.status;

      switch (httpStatusCode) {
        case 200:
          setCookie(cid, password, { maxAge: 60 * 60 * 24 });
          setIsPasswordChecked(true);
          break;
        default:
          alert('정의되지 않은 http status code입니다');
      }
    },
  });

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['contestProblemDetailInfo', problemId],
    queryFn: fetchContestProblemDetailInfo,
    retry: 0,
  });

  const deleteContestMutation = useMutation({
    mutationFn: deleteContestProblem,
    onSuccess: (data) => {
      const resData = data.data;
      const httpStatusCode = resData.status;

      switch (httpStatusCode) {
        case 200:
          alert('문제가 삭제되었습니다.');
          router.push(`/contests/${cid}/problems`);
          break;
        default:
          alert('정의되지 않은 http status code입니다');
      }
    },
  });

  const resData = data?.data.data;
  const contestProblemInfo: ProblemInfo = resData;

  const userInfo = userInfoStore((state: any) => state.userInfo);
  const updateUserInfo = userInfoStore((state: any) => state.updateUserInfo);

  const [isLoading, setIsLoading] = useState(true);
  const [isEnrollContest, setIsEnrollContest] = useState(false);
  const [pdfScale, setPdfScale] = useState(0);

  const currentTime = new Date();
  const contestStartTime = new Date(
    contestProblemInfo?.parentId.testPeriod.start,
  );
  const contestEndTime = new Date(contestProblemInfo?.parentId.testPeriod.end);

  const router = useRouter();

  const downloadExampleFile = (problemId: string, fileId: string) => {
    // 정확한 다운로드 URL 형식 생성
    const downloadUrl = `https://swjudgeapi.cbnu.ac.kr/v1/problem/${problemId}/example-files/${fileId}`;

    // 브라우저에서 URL로 이동하여 파일 다운로드
    window.location.href = downloadUrl;
  };

  const handleGoToContestProblems = () => {
    router.push(`/contests/${cid}/problems`);
  };

  const handleGoToUserContestSubmits = () => {
    router.push(`/contests/${cid}/problems/${problemId}/submits`);
  };

  const handleGoToSubmitContestProblemCode = () => {
    router.push(`/contests/${cid}/problems/${problemId}/submit`);
  };

  const handleEditProblem = () => {
    router.push(`/contests/${cid}/problems/${problemId}/edit`);
  };

  const handleDeleteProblem = () => {
    const userResponse = confirm('문제를 삭제하시겠습니까?');
    if (!userResponse) return;

    deleteContestMutation.mutate(problemId);
  };

  // 대회 신청 여부 확인
  const isUserContestant = useCallback(() => {
    return contestProblemInfo.parentId.contestants.some(
      (contestant_id) => contestant_id === userInfo._id,
    );
  }, [contestProblemInfo, userInfo]);

  useEffect(() => {
    if (
      contestProblemInfo &&
      contestProblemInfo.parentId.contestants &&
      userInfo
    )
      setIsEnrollContest(isUserContestant());
  }, [contestProblemInfo, userInfo, isUserContestant]);

  const [password, setPassword] = useState('');
  const [isPasswordChecked, setIsPasswordChecked] = useState(false);

  useEffect(() => {
    // (로그인 한) 사용자 정보 조회 및 관리자 권한 확인, 그리고 게시글 작성자인지 확인
    fetchCurrentUserInfo(updateUserInfo).then((userInfo: UserInfo) => {
      if (contestProblemInfo) {
        const isWriter = contestProblemInfo.writer._id === userInfo._id;
        const isContestant = contestProblemInfo.parentId.contestants.some(
          (contestant_id) => contestant_id === userInfo._id,
        );

        if (
          isContestant &&
          contestStartTime <= currentTime &&
          currentTime < contestEndTime
        ) {
          setIsLoading(false);
          const contestPasswordCookie = getCookie(cid);
          if (contestPasswordCookie) {
            setPassword(contestPasswordCookie);
            confirmContestPasswordMutation.mutate({
              cid,
              password: contestPasswordCookie,
            });
            return;
          }

          const inputPassword = prompt('비밀번호를 입력해 주세요');
          if (inputPassword !== null && inputPassword.trim() !== '') {
            setPassword(inputPassword);
            confirmContestPasswordMutation.mutate({
              cid,
              password: inputPassword,
            });
            return;
          }

          router.back();
          return;
        }

        if (isWriter) {
          setIsLoading(false);
          setIsPasswordChecked(true);
          return;
        }

        alert('접근 권한이 없습니다.');
        router.back();
      }
    });
  }, [updateUserInfo, contestProblemInfo, cid, router]);

  if (isLoading || !isPasswordChecked)
    return <ContestProblemDetailPageLoadingSkeleton />;

  return (
    <div className="mt-6 mb-24 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[21rem] xs:w-[90%] xl:w-[72.5%] mx-auto">
        <div className="flex flex-col gap-8">
          <p className="text-2xl font-bold tracking-tight">
            {contestProblemInfo.title}
          </p>
          <div className="flex flex-col 3md:flex-row 3md:justify-between gap-1 3md:gap-3 pb-3 border-b border-gray-300">
            <div className="flex flex-col 3md:flex-row gap-1 3md:gap-3">
              <span className="font-semibold">
                <span className="3md:hidden text-gray-500">• </span>
                점수:
                <span className="font-mono font-light">
                  {' '}
                  <span className="font-mono font-semibold text-blue-600">
                    {contestProblemInfo.score}
                  </span>
                  점
                </span>
              </span>
              <span className='hidden relative bottom-[0.055rem] font-thin before:content-["|"] 3md:block' />
              <span className="font-semibold">
                <span className="3md:hidden text-gray-500">• </span>
                시간 제한:
                <span className="font-mono font-light">
                  {' '}
                  <span>{contestProblemInfo.options.maxRealTime / 1000}</span>초
                </span>
              </span>
              <span className='hidden relative bottom-[0.055rem] font-thin before:content-["|"] 3md:block' />
              <span className="font-semibold">
                <span className="3md:hidden text-gray-500">• </span>
                메모리 제한:
                <span className="font-mono font-light">
                  {' '}
                  <span className="mr-1">
                    {contestProblemInfo.options.maxMemory}
                  </span>
                  MB
                </span>
              </span>
            </div>
            <div className="flex gap-3">
              <span className="font-semibold">
                <span className="3md:hidden text-gray-500">• </span>
                대회:{' '}
                <span className="font-light">
                  {contestProblemInfo.parentId.title}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="3md:flex justify-between">
          <div className="flex flex-col 3md:flex-row gap-2 justify-end mt-4 h-fit 3md:order-last">
            <button
              onClick={handleGoToContestProblems}
              className="flex justify-center items-center gap-[0.375rem] text-sm text-[#f9fafb] bg-green-500 px-2 py-[0.45rem] rounded-[6px] font-medium focus:bg-[#3e9368] hover:bg-[#3e9368]"
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
            {isEnrollContest && userInfo.role !== 'staff' && (
              <>
                <button
                  onClick={handleGoToUserContestSubmits}
                  className="flex justify-center items-center gap-[0.375rem] text-sm text-[#f9fafb] bg-[#6860ff] px-2 py-[0.45rem] rounded-[6px] font-medium focus:bg-[#5951f0] hover:bg-[#5951f0]"
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
                  내 제출 현황
                </button>
                <button
                  onClick={handleGoToSubmitContestProblemCode}
                  className="flex justify-center items-center gap-[0.375rem] text-sm text-[#f9fafb] bg-[#3a8af9] px-3 py-[0.45rem] rounded-[6px] font-medium focus:bg-[#1c6cdb] hover:bg-[#1c6cdb]"
                >
                  제출하기
                </button>
              </>
            )}

            {currentTime < contestEndTime &&
              userInfo._id === contestProblemInfo.writer._id && (
                <>
                  <button
                    onClick={handleEditProblem}
                    className="flex justify-center items-center gap-[0.375rem] text-sm text-[#f9fafb] bg-[#eba338] px-2 py-[0.45rem] rounded-[6px] font-medium focus:bg-[#dc9429] hover:bg-[#dc9429]"
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
                    문제 수정
                  </button>
                  <button
                    onClick={handleDeleteProblem}
                    className="flex justify-center items-center gap-[0.375rem] text-sm text-[#f9fafb] bg-red-500 px-2 py-[0.45rem] rounded-[6px] font-medium focus:bg-[#e14343] hover:bg-[#e14343]"
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
                    문제 삭제
                  </button>
                </>
              )}
          </div>

          <div className="mt-7 3md:order-first">
            {contestProblemInfo.exampleFiles.length > 0 && (
              <>
                <h4 className="text-base font-semibold">예제 파일 다운로드</h4>
                <div className="mt-3 grid grid-cols-1 3xs:grid-cols-2 lg:grid-cols-3 gap-3">
                  {contestProblemInfo.exampleFiles.map(
                    (exampleFile: ExampleFile, index: number) => (
                      <button
                        key={index}
                        onClick={() =>
                          downloadExampleFile(exampleFile.ref, exampleFile._id)
                        }
                        className="flex gap-[0.375rem] download-exmaple-file-btn rounded-[0.375rem] py-[0.6rem] px-[1rem] group"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="22.5px"
                          viewBox="0 -960 960 960"
                          width="22.5px"
                          fill="#5f6368"
                          className="group-hover:fill-[#0056b3]"
                        >
                          <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
                        </svg>
                        <span className="text-[#4e5968] group-hover:text-[#0056b3] font-semibold">
                          {exampleFile.filename}
                        </span>
                      </button>
                    ),
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="gap-5 border-b my-4 pb-5">
          <PDFViewer
            pdfFileURL={contestProblemInfo.content}
            pdfScale={pdfScale}
          />
        </div>
      </div>

      <div className="fixed right-7 bottom-7 z-10 flex flex-col gap-y-2">
        <button
          onClick={() => {
            setPdfScale((prev) => prev + 0.1);
          }}
          className="zoom-btn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="30px"
            viewBox="0 -960 960 960"
            width="30px"
            fill="#434343"
          >
            <path d="M450-450H250q-12.75 0-21.37-8.63-8.63-8.63-8.63-21.38 0-12.76 8.63-21.37Q237.25-510 250-510h200v-200q0-12.75 8.63-21.37 8.63-8.63 21.38-8.63 12.76 0 21.37 8.63Q510-722.75 510-710v200h200q12.75 0 21.37 8.63 8.63 8.63 8.63 21.38 0 12.76-8.63 21.37Q722.75-450 710-450H510v200q0 12.75-8.63 21.37-8.63 8.63-21.38 8.63-12.76 0-21.37-8.63Q450-237.25 450-250v-200Z" />
          </svg>
        </button>
        <button
          onClick={() => {
            setPdfScale((prev) => prev - 0.1);
          }}
          className="zoom-btn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="30px"
            viewBox="0 -960 960 960"
            width="30px"
            fill="#434343"
          >
            <path d="M250-450q-12.75 0-21.37-8.63-8.63-8.63-8.63-21.38 0-12.76 8.63-21.37Q237.25-510 250-510h460q12.75 0 21.37 8.63 8.63 8.63 8.63 21.38 0 12.76-8.63 21.37Q722.75-450 710-450H250Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
