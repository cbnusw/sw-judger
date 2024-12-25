'use client';

import axiosInstance from '@/utils/axiosInstance';
import React, { useEffect, useState } from 'react';
import ContestProblemList from './components/contestProblems/ContestProblemList';
import {
  ProblemInfo,
  ProblemsInfo,
  RegisterProblemParams,
} from '@/types/problem';
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import UploadContestProblemsModal from './components/UploadContestProblemsModal';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { UploadService } from '@/components/utils/uploadService';
import UploadedProblemList from './components/uploadedProblems/UploadedProblemList';
import { ToastInfoStore } from '@/store/ToastInfo';
import { useRouter } from 'next/navigation';
import UploadingContestProblemsModal from './components/UploadingContestProblemsModal';
import { fetchCurrentUserInfo } from '@/utils/fetchCurrentUserInfo';
import { UserInfo } from '@/types/user';
import { userInfoStore } from '@/store/UserInfo';
import { ContestInfo } from '@/types/contest';
import Loading from '@/app/components/Loading';

// 대회에 등록된 문제 목록 정보 조회 API
const fetchContestProblemsDetailInfo = ({ queryKey }: any) => {
  const cid = queryKey[1];
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/contest/${cid}/problems`,
  );
};

// 대회 게시글 정보 조회 API
const fetchContestDetailInfo = ({ queryKey }: any) => {
  const cid = queryKey[1];
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/contest/${cid}`,
  );
};

interface DefaultProps {
  params: {
    cid: string;
  };
}

export default function RegisterMultipleContestProblem(props: DefaultProps) {
  const cid = props.params.cid;

  const updateUserInfo = userInfoStore((state: any) => state.updateUserInfo);

  const addToast = ToastInfoStore((state) => state.addToast);

  const [isLoading, setIsLoading] = useState(true);
  const [excelFileName, setExcelFileName] = useState('');
  const [excelFileUrl, setExcelFileUrl] = useState('');
  const [isExcelFileUploadingValidFail, setIsExcelFileUploadingValidFail] =
    useState(false);
  const [uploadedProblemsInfo, setUploadedProblemsInfo] = useState<
    RegisterProblemParams[]
  >([]);
  const [problemsInfo, setProblemsInfo] = useState<ProblemInfo[]>([]);
  const [openUploadContestProblemsModal, setOpenUploadContestProblemsModal] =
    useState<string | undefined>();
  const [
    openUploadingContestProblemsModal,
    setOpenUploadingContestProblemsModal,
  ] = useState<string | undefined>();

  const [uploadService] = useState(new UploadService()); // UploadService 인스턴스 생성

  const router = useRouter();

  const queryClient = useQueryClient();

  const results = useQueries({
    queries: [
      { queryKey: ['contestDetailInfo', cid], queryFn: fetchContestDetailInfo },
      {
        queryKey: ['contestProblemsDetailInfo', cid],
        queryFn: fetchContestProblemsDetailInfo,
      },
    ],
  });

  const contestInfo: ContestInfo = results[0].data?.data.data;
  const contestProblemsInfo: ProblemsInfo = results[1].data?.data.data;

  const currentTime = new Date();
  const contestStartTime = new Date(contestProblemsInfo?.testPeriod.start);
  const contestEndTime = new Date(contestProblemsInfo?.testPeriod.end);

  useEffect(() => {
    if (contestProblemsInfo) {
      setProblemsInfo(contestProblemsInfo.problems);
    }
  }, [contestProblemsInfo]);

  const { getRootProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setExcelFileName(file.name);

      // 파일 업로드
      try {
        const response = await uploadService.upload(file);
        const newFile = response.data;
        setExcelFileUrl(newFile.url); // 업로드된 파일의 URL 설정
        setIsExcelFileUploadingValidFail(true);
      } catch (error) {
        console.error('File upload error:', error);
        setIsExcelFileUploadingValidFail(false);
      }

      // 엑셀 데이터 파싱
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // 첫 번째 시트 가져오기
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // 시트 데이터를 JSON으로 변환 (4행부터 시작, A–D 열만)
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: ['A', 'B', 'C', 'D'], // 열 이름 지정
          range: 3, // 4행부터 시작
        }) as Array<{ A: string; B: number; C: number; D: number }>;

        // RegisterProblemParams 배열로 변환
        const formattedData: RegisterProblemParams[] = jsonData.map((row) => ({
          title: row.A || '',
          content: '',
          published: null,
          ioSet: [],
          options: {
            maxRealTime: row.B || 0,
            maxMemory: row.C || 0,
          },
          score: row.D || 0,
        }));

        console.log('Formatted Data:', formattedData);

        // 변환된 데이터 업데이트
        setUploadedProblemsInfo(formattedData);
      };

      reader.readAsArrayBuffer(file);
    },
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
    },
    multiple: false,
  });

  const handleBulkRegister = async () => {
    let hasMissingData = false;

    // 데이터 검증
    uploadedProblemsInfo.forEach((problem) => {
      if (!problem.content || !problem.ioSet || problem.ioSet.length === 0) {
        hasMissingData = true;
      }
    });

    if (hasMissingData) {
      addToast(
        'warning',
        '문제 파일 또는 입/출력 파일 셋을 모두 등록해 주세요.',
      );
      return;
    }

    // 모달 창 표시
    setOpenUploadingContestProblemsModal('default');

    try {
      let successCount = 0;

      // 등록 요청을 순차적으로 처리
      for (const problem of uploadedProblemsInfo) {
        try {
          await axiosInstance.post(
            `${process.env.NEXT_PUBLIC_API_VERSION}/problem`,
            {
              ...problem,
              parentType: 'Contest', // 추가 필드
              parentId: cid, // 필요한 경우 동적으로 설정
            },
          );

          // 성공 시 성공 카운트 증가
          successCount++;
        } catch (error) {
          console.error(`문제 "${problem.title}" 등록 중 에러 발생:`, error);
          addToast('error', `문제 "${problem.title}" 등록 실패.`);
        }

        // 각 요청 간의 지연 추가 (500ms)
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // 모든 요청 완료 후
      setUploadedProblemsInfo([]); // 상태 초기화
      addToast('success', `문제 ${successCount}개를 등록했어요.`);

      queryClient.invalidateQueries({
        queryKey: ['contestProblemsDetailInfo'],
      });
    } catch (error) {
      console.error('문제 등록 중 전반적인 에러 발생:', error);
      addToast('error', '문제 등록 중 전반적인 에러가 발생했습니다.');
    } finally {
      // 모달 창 닫기
      setOpenUploadingContestProblemsModal(undefined);
    }
  };

  // (로그인 한) 사용자 정보 조회 및 관리자 권한 확인
  useEffect(() => {
    fetchCurrentUserInfo(updateUserInfo).then((userInfo: UserInfo) => {
      if (contestInfo) {
        const isWriter = contestInfo.writer._id === userInfo._id;

        if (currentTime >= contestStartTime) {
          addToast('warning', '대회 시작 후에는 등록할 수 없어요.');
          router.back();
          return;
        }

        if (isWriter) {
          setIsLoading(false);
          return;
        }

        addToast('warning', '접근 권한이 없어요.');
        router.push('/');
      }
    });
  }, [updateUserInfo, contestInfo, router, addToast]);

  if (isLoading) return <Loading />;

  return (
    <div className="mt-2 px-5 2lg:px-0 overflow-x-auto min-h-[40rem]">
      <div className="flex flex-col w-[21rem] xs:w-[90%] xl:w-[60rem] mx-auto">
        <button
          onClick={() => {
            router.push(`/contests/${cid}/problems`);
          }}
          className="flex items-center gap-x-1 p-2 pl-0 hover hover:text-black"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="18"
            viewBox="0 -960 960 960"
            width="18"
            fill="#656565"
          >
            <path d="M233-440h607q17 0 28.5-11.5T880-480q0-17-11.5-28.5T840-520H233l155-156q11-11 11.5-27.5T388-732q-11-11-28-11t-28 11L108-508q-6 6-8.5 13T97-480q0 8 2.5 15t8.5 13l224 224q11 11 27.5 11t28.5-11q12-12 12-28.5T388-285L233-440Z" />
          </svg>
          <span className="text-[#656565] text-xs font-light text-inherit">
            뒤로가기
          </span>
        </button>

        <div className="h-16 flex justify-between items-center text-[27px] font-semibold tracking-wide overflow-hidden">
          <span className="lift-up">문제 한 번에 등록</span>

          <div className="flex gap-2">
            {uploadedProblemsInfo.length !== 0 ? (
              <>
                <button
                  onClick={() => {
                    setOpenUploadContestProblemsModal('default');
                  }}
                  className="flex justify-center items-center gap-1 text-[0.8rem] bg-[#f2f4f6] px-3 py-[0.5rem] rounded-[7px] font-medium hover:bg-[#d3d6da]"
                >
                  <span
                    aria-hidden="false"
                    role="presentation"
                    style={{
                      height: '18px',
                      width: '18px',
                      minWidth: '18px',
                      padding: '0px',
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        fill="#8d95a0"
                        d="M12.766 6.604a1.108 1.108 0 00-1.198-.237 1.113 1.113 0 00-.358.237L5.504 12.31a1.1 1.1 0 001.555 1.556l3.829-3.83v11.345a1.1 1.1 0 002.2 0V10.038l3.829 3.829c.215.215.496.322.778.322a1.1 1.1 0 00.778-1.878l-5.707-5.707zM21.38 2.1H2.596a1.1 1.1 0 000 2.2h18.785a1.1 1.1 0 100-2.2"
                        fillRule="evenodd"
                      ></path>
                    </svg>
                  </span>
                  <span className="text-[#4e5968] whitespace-nowrap">
                    파일 다시 올리기
                  </span>
                </button>

                <button
                  onClick={handleBulkRegister}
                  className="flex justify-center items-center gap-1 text-[0.8rem] bg-[#3183f6] px-3 py-[0.5rem] rounded-[7px] font-medium hover:bg-[#1c6cdb]"
                >
                  <span className="text-white whitespace-nowrap">
                    {uploadedProblemsInfo.length}개 문제 등록하기
                  </span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    window.location.href =
                      '/template/SOJ_대회_문제등록_양식.xlsx';
                  }}
                  className="flex justify-center items-center gap-1 text-[0.8rem] bg-[#e8f3ff] px-3 py-[0.5rem] rounded-[7px] font-medium hover:bg-[#cee1fc]"
                >
                  <span
                    aria-hidden="false"
                    role="presentation"
                    style={{
                      height: '18px',
                      width: '18px',
                      minWidth: '18px',
                      padding: '0px',
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <g fill="#487fee">
                        <path d="M11.2 17.7c.1.1.2.2.4.2.3.1.6.1.8 0 .1-.1.3-.1.4-.2l5.7-5.7c.4-.4.4-1.1 0-1.6s-1.1-.4-1.6 0l-3.8 3.8V2.9c0-.6-.5-1.1-1.1-1.1s-1.1.5-1.1 1.1v11.3l-3.8-3.8c-.2-.2-.5-.3-.8-.3s-.6.1-.8.3c-.4.4-.4 1.1 0 1.6l5.7 5.7zM2.6 22.2h18.8c.6 0 1.1-.5 1.1-1.1S22 20 21.4 20H2.6c-.6 0-1.1.5-1.1 1.1s.5 1.1 1.1 1.1z"></path>
                      </g>
                    </svg>
                  </span>
                  <span className="text-[#1b64da] whitespace-nowrap">
                    문제 등록 양식 다운받기
                  </span>
                </button>

                <button
                  onClick={() => setOpenUploadContestProblemsModal('default')}
                  className="flex justify-center items-center gap-1 text-[0.8rem] bg-[#3183f6] px-3 py-[0.5rem] rounded-[7px] font-medium hover:bg-[#1c6cdb]"
                >
                  <span
                    aria-hidden="false"
                    role="presentation"
                    style={{
                      height: '18px',
                      width: '18px',
                      minWidth: '18px',
                      padding: '0px',
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        fill="white"
                        d="M12.766 6.604a1.108 1.108 0 00-1.198-.237 1.113 1.113 0 00-.358.237L5.504 12.31a1.1 1.1 0 001.555 1.556l3.829-3.83v11.345a1.1 1.1 0 002.2 0V10.038l3.829 3.829c.215.215.496.322.778.322a1.1 1.1 0 00.778-1.878l-5.707-5.707zM21.38 2.1H2.596a1.1 1.1 0 000 2.2h18.785a1.1 1.1 0 100-2.2"
                        fillRule="evenodd"
                      ></path>
                    </svg>
                  </span>
                  <span className="text-white whitespace-nowrap">
                    문제 한 번에 등록하기
                  </span>
                </button>
              </>
            )}
          </div>
        </div>

        {uploadedProblemsInfo.length !== 0 ? (
          <div>
            <div
              {...getRootProps()}
              className="mt-4 flex justify-between items-center pl-4 pr-2 py-[0.4rem] bg-white border-none outline outline-1 outline-[#e6e8ea] hover:outline-2 hover:outline-[#a3c6fa] hover:outline-offset-[-1px] rounded-[7px] duration-100"
            >
              <div className="flex items-center gap-x-2">
                <span
                  className="icon p-icon p-menu__item__addon"
                  aria-hidden="false"
                  role="presentation"
                >
                  <svg
                    height="20"
                    width="20"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                  >
                    <mask id="a" fill="#fff">
                      <path
                        d="m0 0h20v19.9996h-20z"
                        fill="#fff"
                        fillRule="evenodd"
                      ></path>
                    </mask>
                    <g
                      fill="#26a06b"
                      fillRule="evenodd"
                      transform="translate(2 2)"
                    >
                      <path d="m13 14.1719v5.828l7-7h-5.828c-.649 0-1.162.523-1.162 1.162"></path>
                      <path
                        d="m5.918 5.6036 1.971 2.893c.061.381-.228.489-.559.489h-.746c-.321-.016-.379-.033-.585-.4l-1.016-1.865-.013-.015-.013.015-1.016 1.865c-.206.367-.264.384-.585.4h-.746c-.331 0-.62-.108-.559-.489l1.971-2.893.001-.001-.038-.044-1.9-2.82c-.15-.217.122-.517.502-.517h.746c.331 0 .372.043.538.315l1.084 1.926.015.018.015-.018 1.084-1.926c.166-.272.207-.315.538-.315h.746c.38 0 .652.3.503.517l-1.901 2.82-.038.044zm12.9-5.604h-17.636c-.654 0-1.182.528-1.182 1.182v17.647c0 .654.528 1.171 1.172 1.171h10.005v-5.878c0-1.626 1.319-2.945 2.944-2.945h5.879v-9.995c0-.654-.528-1.182-1.182-1.182z"
                        mask="url(#a)"
                      ></path>
                    </g>
                  </svg>
                </span>

                <span className="text-[15px] text-[#4e5968]">
                  {excelFileName}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setUploadedProblemsInfo([]);
                }}
                className="flex justify-center items-center gap-[0.375rem] text-[13px] text-[#4e5968] bg-[#f2f4f6] px-3 py-1 rounded-[6px] font-light focus:bg-[#d3d6da] hover:bg-[#e6e8ea]"
              >
                삭제
              </button>
            </div>

            <div className="mt-10">
              <div className="flex items-center gap-x-[0.6rem] mb-3">
                <span className="font-semibold text-[19px] text-[#333d4b]">
                  등록될 문제
                </span>
                <span className="text-[#6d7683] text-[0.825rem] font-light">
                  {uploadedProblemsInfo.length}개
                </span>
              </div>

              <UploadedProblemList
                problemsInfo={uploadedProblemsInfo}
                setUploadedProblemsInfo={setUploadedProblemsInfo}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="py-2">
              <div className="flex mt-4 justify-between items-center">
                <span className="text-[#6d7683] text-[0.825rem] font-light">
                  총&nbsp;
                  <span className="text-[#6d7683]">{problemsInfo.length}</span>
                  개
                </span>
              </div>

              <ContestProblemList
                cid={cid}
                problemsInfo={problemsInfo}
                setProblemsInfo={setProblemsInfo}
              />
            </div>
          </>
        )}
      </div>

      {openUploadingContestProblemsModal && (
        <UploadingContestProblemsModal
          openUploadingContestProblemsModal={openUploadingContestProblemsModal}
          setOpenUploadingContestProblemsModal={
            setOpenUploadingContestProblemsModal
          }
        />
      )}

      {openUploadContestProblemsModal && (
        <UploadContestProblemsModal
          setExcelFileName={setExcelFileName}
          setUploadedProblemsInfo={setUploadedProblemsInfo}
          excelFileUrl={excelFileUrl}
          setExcelFileUrl={setExcelFileUrl}
          isExcelFileUploadingValidFail={isExcelFileUploadingValidFail}
          setIsExcelFileUploadingValidFail={setIsExcelFileUploadingValidFail}
          openUploadContestProblemsModal={openUploadContestProblemsModal}
          setOpenUploadContestProblemsModal={setOpenUploadContestProblemsModal}
        />
      )}
    </div>
  );
}
