'use client';

import { OPERATOR_ROLES } from '@/constants/role';
import Loading from '@/app/components/Loading';
import { userInfoStore } from '@/store/UserInfo';
import { CreateNoticeParams } from '@/types/notice';
import { UserInfo } from '@/types/user';
import axiosInstance from '@/utils/axiosInstance';
import { fetchCurrentUserInfo } from '@/utils/fetchCurrentUserInfo';
import { useMutation } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ToastInfoStore } from '@/store/ToastInfo';

// 공지사항 등록 API
const createNotice = (params: CreateNoticeParams) => {
  const { title, content } = params;
  const reqBody = {
    title,
    content,
  };

  return axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_VERSION}/notice`,
    reqBody,
  );
};

const CustomCKEditor = dynamic(() => import('@/components/CustomCKEditor'), {
  ssr: false,
});

export default function RegisterNotice() {
  const addToast = ToastInfoStore((state) => state.addToast);

  const createNoticeMutation = useMutation({
    mutationFn: createNotice,
    onSuccess: (data) => {
      const resData = data?.data;
      const httpStatusCode = resData.status;

      switch (httpStatusCode) {
        case 200:
          const nid = resData?.data._id;
          addToast('success', '공지사항이 등록되었어요.');
          router.push(`/notices/${nid}`);
          break;
        default:
          addToast('error', '등록 중에 에러가 발생했어요.');
      }
    },
  });

  const updateUserInfo = userInfoStore((state: any) => state.updateUserInfo);

  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // const [isCheckedUsingPwd, setIsCheckedUsingPwd] = useState(false);
  // const [noticePwd, setNoticePwd] = useState('');

  const [isNoticeNameValidFail, setIsNoticeNameValidFail] = useState(false);
  // const [isNoticePwdValidFail, setIsNoticePwdValidFail] = useState(false);

  const noticeNameRef = useRef<HTMLInputElement>(null);
  const noticePwdRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleNoticeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsNoticeNameValidFail(false);
  };

  // const handleNoticePwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setNoticePwd(e.target.value);
  //   setIsNoticePwdValidFail(false);
  // };

  const handleCancelNoticeRegister = () => {
    const userResponse = confirm('공지사항 등록을 취소하시겠습니까?');
    if (!userResponse) return;

    router.push('/notices');
  };

  const handleRegisterNotice = () => {
    if (!title) {
      addToast('warning', '제목을 입력해 주세요.');
      window.scrollTo(0, 0);
      noticeNameRef.current?.focus();
      setIsNoticeNameValidFail(true);
      return;
    }

    if (!content) {
      addToast('warning', '본문을 입력해 주세요.');
      window.scrollTo(0, 0);
      return;
    }

    // if (isCheckedUsingPwd && !noticePwd) {
    //   window.scrollTo(0, document.body.scrollHeight);
    //   noticePwdRef.current?.focus();
    //   setIsNoticePwdValidFail(true);
    //   return;
    // }

    createNoticeMutation.mutate({ title, content });
  };

  // (로그인 한) 사용자 정보 조회 및 관리자 권한 확인
  useEffect(() => {
    fetchCurrentUserInfo(updateUserInfo).then((userInfo: UserInfo) => {
      if (userInfo.isAuth && OPERATOR_ROLES.includes(userInfo.role)) {
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
        <p className="text-2xl font-semibold">공지사항 등록</p>

        <div className="flex gap-5 mt-5 mb-8">
          <div className="flex flex-col relative z-0 w-2/5 group">
            <input
              type="text"
              name="floating_first_name"
              className={`block pt-3 pb-[0.175rem] pl-0 pr-0 w-full font-normal text-gray-900 bg-transparent border-0 border-b border-gray-400 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-${
                isNoticeNameValidFail ? 'pink' : 'blue'
              }-500 focus:border-${
                isNoticeNameValidFail ? 'red' : 'blue'
              }-500 focus:outline-none focus:ring-0 peer`}
              placeholder=" "
              required
              value={title}
              ref={noticeNameRef}
              onChange={handleNoticeNameChange}
            />
            <label
              htmlFor="floating_first_name"
              className={`peer-focus:font-light absolute text-base left-[0.1rem] font-light text-${
                isNoticeNameValidFail ? 'red' : 'gray'
              }-500 dark:text-gray-400 duration-300 transform -translate-y-5 scale-75 top-3 origin-[0] peer-focus:left-[0.1rem] peer-focus:text-${
                isNoticeNameValidFail ? 'red' : 'blue'
              }-600 peer-focus:dark:text-${
                isNoticeNameValidFail ? 'red' : 'blue'
              }-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-[1.25rem] z-10`}
            >
              제목
            </label>
            <p
              className={`text-${
                isNoticeNameValidFail ? 'red' : 'gray'
              }-500 text-xs tracking-widest font-light mt-1`}
            >
              제목을 입력해 주세요
            </p>
          </div>
        </div>

        <div className="w-full mx-auto overflow-auto">
          <CustomCKEditor initEditorContent={''} onEditorChange={setContent} />
        </div>

        {/* <div className="flex flex-col mt-8">
          <div className="flex">
            <div className="flex items-center h-5">
              <input
                id="helper-checkbox"
                aria-describedby="helper-checkbox-text"
                type="checkbox"
                checked={isCheckedUsingPwd}
                onChange={() => setIsCheckedUsingPwd(!isCheckedUsingPwd)}
                className="w-4 h-4 text-blue-600 border-2 border-[#757575] rounded-[0.175rem] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div className="ml-2 text-sm">
              <label
                htmlFor="helper-checkbox"
                className="font-medium text-gray-900 dark:text-gray-300"
              >
                비밀번호 설정
              </label>

              <div className="flex mt-1">
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
                  비밀번호를 설정할 경우 게시글 열람 시 비밀번호 입력이
                  필요합니다.
                </p>
              </div>
            </div>
          </div>
          {isCheckedUsingPwd ? (
            <div className="flex flex-col relative z-0 w-1/2 group mt-7">
              <input
                type="text"
                name="floating_first_name"
                className={`block pt-3 pb-[0.175rem] pl-0 pr-0 w-full font-normal text-gray-900 bg-transparent border-0 border-b border-gray-400 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-${
                  isNoticePwdValidFail ? 'pink' : 'blue'
                }-500 focus:border-${
                  isNoticePwdValidFail ? 'red' : 'blue'
                }-500 focus:outline-none focus:ring-0 peer`}
                placeholder=" "
                required
                value={noticePwd}
                ref={noticePwdRef}
                onChange={handleNoticePwdChange}
              />
              <label
                htmlFor="floating_first_name"
                className={`peer-focus:font-light absolute text-base left-[0.1rem] font-light text-${
                  isNoticePwdValidFail ? 'red' : 'gray'
                }-500 dark:text-gray-400 duration-300 transform -translate-y-5 scale-75 top-3 origin-[0] peer-focus:left-[0.1rem] peer-focus:text-${
                  isNoticePwdValidFail ? 'red' : 'blue'
                }-600 peer-focus:dark:text-${
                  isNoticePwdValidFail ? 'red' : 'blue'
                }-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-[1.25rem] z-10`}
              >
                비밀번호
              </label>
            </div>
          ) : null}
        </div> */}

        <div className="mt-14 pb-2 flex justify-end gap-2">
          <button
            onClick={handleCancelNoticeRegister}
            className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-5 py-[0.5rem] rounded-[7px] font-medium focus:bg-[#d3d6da] hover:bg-[#d3d6da]"
          >
            취소
          </button>
          <button
            onClick={handleRegisterNotice}
            className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-white bg-[#3a8af9] px-5 py-[0.5rem] rounded-[7px] font-medium  hover:bg-[#1c6cdb]"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
