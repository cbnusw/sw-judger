'use client';

import MyDropzone from '@/app/components/MyDropzone';
import { OPERATOR_ROLES } from '@/constants/role';
import Loading from '@/app/components/Loading';
import { userInfoStore } from '@/store/UserInfo';
import { ExampleFile, IoSetItem, RegisterProblemParams } from '@/types/problem';
import { UserInfo } from '@/types/user';
import axiosInstance from '@/utils/axiosInstance';
import { fetchCurrentUserInfo } from '@/utils/fetchCurrentUserInfo';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import SearchedProblemList from './components/searchedProblem/SearchedProblemList';
import useDebounce from '@/hooks/useDebounce';
import { ToastInfoStore } from '@/store/ToastInfo';

// 연습문제 등록 API
const registerPractice = (params: RegisterProblemParams) => {
  return axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_VERSION}/practice`,
    params,
  );
};

export default function RegisterPractice() {
  const registerPracticeMutation = useMutation({
    mutationFn: registerPractice,
    onSuccess: (data) => {
      const resData = data?.data;
      const httpStatusCode = resData.status;

      switch (httpStatusCode) {
        case 200:
          const pid = resData?.data._id;
          addToast('success', '연습문제가 등록되었어요.');
          router.push(`/practices/${pid}`);
          break;
        default:
          addToast('error', '등록 중에 에러가 발생했어요.');
      }
    },
  });

  const updateUserInfo = userInfoStore((state: any) => state.updateUserInfo);

  const addToast = ToastInfoStore((state) => state.addToast);

  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [maxExeTime, setMaxExeTime] = useState<number>(0);
  const [maxMemCap, setMaxMemCap] = useState<number>(0);
  const [score, setScore] = useState<number>(1);
  const [uploadedProblemPdfFileUrl, setUploadedProblemPdfFileUrl] =
    useState('');
  const [ioSetData, setIoSetData] = useState<IoSetItem[]>([]);
  const [exampleFiles, setExampleFiles] = useState<ExampleFile[]>([]);

  const [isTitleValidFail, setIsTitleValidFail] = useState(false);
  const [isMaxExeTimeValidFail, setIsMaxExeTimeValidFail] = useState(false);
  const [isMaxMemCapValidFail, setIsMaxMemCapValidFail] = useState(false);
  const [isScoreValidFail, setIsScoreValidFail] = useState(false);
  const [isPdfFileUploadingValidFail, setIsPdfFileUploadingValidFail] =
    useState(false);
  const [
    isInAndOutFileUploadingValidFail,
    setIsInAndOutFileUploadingValidFail,
  ] = useState(false);
  const [isExampleFileUploadingValidFail, setIsExampleFileUploadingValidFail] =
    useState(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isOpenSearchedResultList, setIsOpenSearchedResultList] =
    useState<boolean>(false);
  const [isSuccessSearchResult, setIsSuccessSearchResult] =
    useState<boolean>(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  useState<boolean>(false);

  const practiceNameRef = useRef<HTMLInputElement>(null);
  const maxExeTimeRef = useRef<HTMLInputElement>(null);
  const maxMemCapRef = useRef<HTMLInputElement>(null);
  const scoreRef = useRef<HTMLInputElement>(null);

  const searchedResultListRef = useRef<HTMLInputElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const handlePracticeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsTitleValidFail(false);
  };

  const handleMaxExeTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxExeTime(parseInt(e.target.value));
    setIsMaxExeTimeValidFail(false);
  };

  const handleMaxMemCapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxMemCap(parseInt(e.target.value));
    setIsMaxMemCapValidFail(false);
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScore(parseInt(e.target.value));
    setIsMaxMemCapValidFail(false);
  };

  const handleCancelPracticeRegister = () => {
    const userResponse = confirm('연습문제 등록을 취소하시겠습니까?');
    if (!userResponse) return;

    router.push('/practices');
  };

  const handleRegisterPractice = () => {
    if (!title) {
      addToast('warning', '문제명을 입력해 주세요.');
      window.scrollTo(0, 0);
      practiceNameRef.current?.focus();
      setIsTitleValidFail(true);
      return;
    }

    if (!maxExeTime || maxExeTime <= 0) {
      addToast('warning', '최대 실행 시간을 올바르게 입력해 주세요.');
      window.scrollTo(0, 0);
      maxExeTimeRef.current?.focus();
      setIsMaxExeTimeValidFail(true);
      return;
    }

    if (!maxMemCap || maxMemCap <= 0) {
      addToast('warning', '최대 메모리 사용량을 올바르게 입력해 주세요.');
      window.scrollTo(0, 0);
      maxMemCapRef.current?.focus();
      setIsMaxMemCapValidFail(true);
      return;
    }

    if (!score || score <= 0) {
      addToast('warning', '난이도를 올바르게 입력해 주세요.');
      window.scrollTo(0, 0);
      scoreRef.current?.focus();
      setIsScoreValidFail(true);
      return;
    }

    if (!uploadedProblemPdfFileUrl) {
      addToast('warning', '문제 파일(PDF)을 업로드해 주세요.');
      window.scrollTo(0, 0);
      return;
    }

    if (ioSetData.length === 0) {
      addToast('warning', '입/출력 파일 셋(in/out)을 업로드해 주세요.');
      return;
    }

    const practiceData = {
      title,
      content: uploadedProblemPdfFileUrl,
      published: null,
      ioSet: ioSetData,
      exampleFiles,
      options: {
        maxRealTime: maxExeTime,
        maxMemory: maxMemCap,
      },
      score,
    };

    registerPracticeMutation.mutate(practiceData);
  };

  useEffect(() => {
    if (searchQuery) setIsOpenSearchedResultList(true);
  }, [searchQuery]);

  const handleInputSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery: string = e.target.value;
    setSearchQuery(searchQuery);
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      searchedResultListRef.current &&
      !searchedResultListRef.current.contains(event.target as Node)
    ) {
      setIsOpenSearchedResultList(false);
    }
  }, []);

  const handleEscKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpenSearchedResultList(false);
    }
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpenSearchedResultList) return;

      const activeElement = document.activeElement;
      const itemList = document.querySelectorAll('.search-result-item');
      let currentIndex = Array.prototype.indexOf.call(itemList, activeElement);

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % itemList.length;
        (itemList[nextIndex] as HTMLElement).focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        const prevIndex =
          currentIndex === -1
            ? itemList.length - 1 // 처음에 ArrowUp 키를 누를 경우 가장 마지막 항목으로 이동
            : (currentIndex - 1 + itemList.length) % itemList.length;
        (itemList[prevIndex] as HTMLElement).focus();
      }
    },
    [isOpenSearchedResultList],
  );

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscKeyPress);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscKeyPress);
    };
  }, [handleClickOutside, handleEscKeyPress]);

  useEffect(() => {
    if (isOpenSearchedResultList) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpenSearchedResultList, handleKeyDown]);

  // (로그인 한) 사용자 정보 조회 및 관리자 권한 확인
  useEffect(() => {
    fetchCurrentUserInfo(updateUserInfo).then((userInfo: UserInfo) => {
      const isOperator = OPERATOR_ROLES.includes(userInfo.role);

      if (isOperator) {
        setIsLoading(false);
        return;
      }

      addToast('warning', '접근 권한이 없어요.');
      router.push('/');
    });
  }, [updateUserInfo, router, addToast]);

  if (isLoading) return <Loading />;

  return (
    <div className="mt-2 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[60rem] mx-auto">
        <p className="text-2xl font-semibold">연습문제 등록</p>

        <div className="flex flex-col gap-5">
          <div className="relative w-2/3 mt-5">
            <div className="h-[2.625rem] flex items-center pl-3 pr-1 outline outline-1 outline-[#e6e8ea] rounded-lg hover:outline-[#93bcfa] hover:outline-2 focus-within:outline-[#93bcfa] focus-within:outline-2">
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
                  ref={searchedResultListRef}
                  onFocus={() => {
                    setIsOpenSearchedResultList(true);
                  }}
                  onClick={() => {
                    setIsOpenSearchedResultList(true);
                  }}
                  onChange={handleInputSearchQuery}
                  className="w-full h-[2.625rem] pl-[0.625rem] pr-[0.25rem] outline-none placeholder-[#888e96] text-[0.825rem] font-extralight"
                  placeholder="등록된 문제를 검색해 보세요"
                />
              </div>
              {searchQuery && (
                <button
                  onClick={(e) => {
                    setSearchQuery('');
                    setIsOpenSearchedResultList(false);
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

            {isOpenSearchedResultList && (
              <div className="z-10 absolute top-[3.05rem] bg-white w-full flex flex-col p-[0.4rem] rounded-md text-[#4e5968] window">
                <SearchedProblemList
                  searchQuery={searchQuery}
                  debouncedSearchQuery={debouncedSearchQuery}
                  setTitle={setTitle}
                  setMaxExeTime={setMaxExeTime}
                  setMaxMemCap={setMaxMemCap}
                  setUploadedProblemPdfFileUrl={setUploadedProblemPdfFileUrl}
                  setIoSetData={setIoSetData}
                  setExampleFiles={setExampleFiles}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5 mb-8">
            <div className="flex flex-col relative z-0 w-1/2 group">
              <input
                type="text"
                name="floating_first_name"
                className={`block pt-3 pb-[0.175rem] pl-0 pr-0 w-full font-normal text-gray-900 bg-transparent border-0 border-b border-gray-400 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-${
                  isTitleValidFail ? 'pink' : 'blue'
                }-500 focus:border-${
                  isTitleValidFail ? 'red' : 'blue'
                }-500 focus:outline-none focus:ring-0 peer`}
                placeholder=" "
                required
                value={title}
                ref={practiceNameRef}
                onChange={handlePracticeNameChange}
              />
              <label
                htmlFor="floating_first_name"
                className={`peer-focus:font-light absolute text-base left-[0.1rem] font-light text-${
                  isTitleValidFail ? 'red' : 'gray'
                }-500  duration-300 transform -translate-y-5 scale-75 top-3 origin-[0] peer-focus:left-[0.1rem] peer-focus:text-${
                  isTitleValidFail ? 'red' : 'blue'
                }-600 peer-focus:dark:text-${
                  isTitleValidFail ? 'red' : 'blue'
                }-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-[1.25rem] z-10`}
              >
                문제명
              </label>
              <p
                className={`text-${
                  isTitleValidFail ? 'red' : 'gray'
                }-500 text-xs font-light mt-1`}
              >
                문제명을 입력해 주세요
              </p>
            </div>

            <div className="flex gap-5">
              <div className="flex flex-col relative z-0 w-1/3 group">
                <input
                  type="number"
                  name="floating_first_name"
                  className={`block pt-3 pb-[0.175rem] pl-0 pr-0 w-full font-normal text-gray-900 bg-transparent border-0 border-b border-gray-400 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-${
                    isMaxExeTimeValidFail ? 'pink' : 'blue'
                  }-500 focus:border-${
                    isMaxExeTimeValidFail ? 'red' : 'blue'
                  }-500 focus:outline-none focus:ring-0 peer`}
                  placeholder=" "
                  required
                  value={maxExeTime}
                  ref={maxExeTimeRef}
                  onChange={handleMaxExeTimeChange}
                />
                <label
                  htmlFor="floating_first_name"
                  className={`peer-focus:font-light absolute text-base left-[0.1rem] font-light text-${
                    isMaxExeTimeValidFail ? 'red' : 'gray'
                  }-500  duration-300 transform -translate-y-5 scale-75 top-3 origin-[0] peer-focus:left-[0.1rem] peer-focus:text-${
                    isMaxExeTimeValidFail ? 'red' : 'blue'
                  }-600 peer-focus:dark:text-${
                    isMaxExeTimeValidFail ? 'red' : 'blue'
                  }-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-[1.25rem] z-10`}
                >
                  최대 실행 시간
                </label>
                <p
                  className={`text-${
                    isMaxExeTimeValidFail ? 'red' : 'gray'
                  }-500 text-xs font-light mt-1`}
                >
                  테스트 당 최대 수행 시간을 ms 단위로 입력해 주세요
                </p>
              </div>

              <div className="flex flex-col relative z-0 w-1/3 group">
                <input
                  type="number"
                  name="floating_first_name"
                  className={`block pt-3 pb-[0.175rem] pl-0 pr-0 w-full font-normal text-gray-900 bg-transparent border-0 border-b border-gray-400 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-${
                    isMaxMemCapValidFail ? 'pink' : 'blue'
                  }-500 focus:border-${
                    isMaxMemCapValidFail ? 'red' : 'blue'
                  }-500 focus:outline-none focus:ring-0 peer`}
                  placeholder=" "
                  required
                  value={maxMemCap}
                  ref={maxMemCapRef}
                  onChange={handleMaxMemCapChange}
                />
                <label
                  htmlFor="floating_first_name"
                  className={`peer-focus:font-light absolute text-base left-[0.1rem] font-light text-${
                    isMaxMemCapValidFail ? 'red' : 'gray'
                  }-500  duration-300 transform -translate-y-5 scale-75 top-3 origin-[0] peer-focus:left-[0.1rem] peer-focus:text-${
                    isMaxMemCapValidFail ? 'red' : 'blue'
                  }-600 peer-focus:dark:text-${
                    isMaxMemCapValidFail ? 'red' : 'blue'
                  }-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-[1.25rem] z-10`}
                >
                  최대 메모리 사용량
                </label>
                <p
                  className={`text-${
                    isMaxMemCapValidFail ? 'red' : 'gray'
                  }-500 text-xs font-light mt-1`}
                >
                  테스트 당 최대 사용 메모리를 MB 단위로 입력해 주세요
                </p>
              </div>

              <div className="flex flex-col relative z-0 w-1/3 group">
                <input
                  type="number"
                  name="floating_first_name"
                  className={`block pt-3 pb-[0.175rem] pl-0 pr-0 w-full font-normal text-gray-900 bg-transparent border-0 border-b border-gray-400 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-${
                    isScoreValidFail ? 'pink' : 'blue'
                  }-500 focus:border-${
                    isScoreValidFail ? 'red' : 'blue'
                  }-500 focus:outline-none focus:ring-0 peer`}
                  placeholder=" "
                  required
                  value={score}
                  ref={scoreRef}
                  onChange={handleScoreChange}
                />
                <label
                  htmlFor="floating_first_name"
                  className={`peer-focus:font-light absolute text-base left-[0.1rem] font-light text-${
                    isScoreValidFail ? 'red' : 'gray'
                  }-500  duration-300 transform -translate-y-5 scale-75 top-3 origin-[0] peer-focus:left-[0.1rem] peer-focus:text-${
                    isScoreValidFail ? 'red' : 'blue'
                  }-600 peer-focus:dark:text-${
                    isScoreValidFail ? 'red' : 'blue'
                  }-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-[1.25rem] z-10`}
                >
                  난이도
                </label>
                <p
                  className={`text-${
                    isScoreValidFail ? 'red' : 'gray'
                  }-500 text-xs font-light mt-1`}
                >
                  문제의 점수를 입력해 주세요.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-lg">문제 파일</p>
            <MyDropzone
              key={uploadedProblemPdfFileUrl}
              type="pdf"
              guideMsg="문제 파일(PDF)을 이곳에 업로드해 주세요"
              setIsFileUploaded={setIsPdfFileUploadingValidFail}
              isFileUploaded={isPdfFileUploadingValidFail}
              initUrl={uploadedProblemPdfFileUrl}
              setUploadedFileUrl={setUploadedProblemPdfFileUrl}
            />
          </div>

          <div className="flex flex-col gap-1 mt-9">
            <p className="text-lg">입/출력 파일 셋</p>
            <div>
              <div className="flex mt-2 mb-4 ml-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="15"
                  viewBox="0 -960 960 960"
                  width="15"
                  fill="#5762b3"
                  className="relative left-[-1.375rem] top-[0.1rem]"
                >
                  <path d="M440.667-269.333h83.999V-520h-83.999v250.667Zm39.204-337.333q17.796 0 29.962-11.833Q522-630.332 522-647.824q0-18.809-12.021-30.825-12.021-12.017-29.792-12.017-18.52 0-30.354 11.841Q438-666.984 438-648.508q0 17.908 12.038 29.875 12.038 11.967 29.833 11.967Zm.001 547.999q-87.157 0-163.841-33.353-76.684-33.354-133.671-90.34-56.986-56.987-90.34-133.808-33.353-76.821-33.353-164.165 0-87.359 33.412-164.193 33.413-76.834 90.624-134.057 57.211-57.224 133.757-89.987t163.578-32.763q87.394 0 164.429 32.763 77.034 32.763 134.117 90 57.082 57.237 89.916 134.292 32.833 77.056 32.833 164.49 0 87.433-32.763 163.67-32.763 76.236-89.987 133.308-57.223 57.073-134.261 90.608-77.037 33.535-164.45 33.535Zm.461-83.999q140.18 0 238.59-98.744 98.411-98.744 98.411-238.923 0-140.18-98.286-238.59Q620.763-817.334 480-817.334q-139.846 0-238.59 98.286Q142.666-620.763 142.666-480q0 139.846 98.744 238.59t238.923 98.744ZM480-480Z" />
                </svg>
                <p
                  id="helper-checkbox-text"
                  className="relative left-[-0.8rem] text-xs font-normal text-[#5762b3] dark:text-gray-300"
                >
                  입력/출력 파일의 확장자는 서로 다르며, 파일명이 같은 것끼리
                  하나의 입/출력 세트로 묶입니다.
                </p>
              </div>
              <MyDropzone
                key={JSON.stringify(ioSetData)}
                type="inOut"
                guideMsg="입/출력 파일(in, out)들을 이곳에 업로드해 주세요"
                setIsFileUploaded={setIsInAndOutFileUploadingValidFail}
                isFileUploaded={isInAndOutFileUploadingValidFail}
                initInAndOutFiles={ioSetData}
                setIoSetData={setIoSetData}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 mt-9">
            <p className="text-lg">
              예제 파일<span className="text-[0.825rem]">(선택)</span>
            </p>
            <MyDropzone
              key={JSON.stringify(exampleFiles)}
              type="exampleFile"
              guideMsg="소스코드 파일(c, cpp, java, py)을 업로드해 주세요"
              setIsFileUploaded={setIsExampleFileUploadingValidFail}
              isFileUploaded={isExampleFileUploadingValidFail}
              initExampleFiles={exampleFiles}
              setExampleFiles={setExampleFiles}
            />
          </div>
        </div>

        <div className="mt-14 pb-2 flex justify-end gap-2">
          <button
            onClick={handleCancelPracticeRegister}
            className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-5 py-[0.5rem] rounded-[7px] font-medium  hover:bg-[#d3d6da]"
          >
            취소
          </button>
          <button
            onClick={handleRegisterPractice}
            className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-white bg-[#3a8af9] px-5 py-[0.5rem] rounded-[7px] font-medium  hover:bg-[#1c6cdb]"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
