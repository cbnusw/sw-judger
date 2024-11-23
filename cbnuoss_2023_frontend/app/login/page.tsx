'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import logoImg from '@/public/images/logo.png';
import axiosInstance from '@/utils/axiosInstance';
import { userInfoStore } from '@/store/UserInfo';
import { AxiosError } from 'axios';
import PrivacyPolicyModal from '../components/PrivacyPolicyModal';

interface UserLoginInfoType {
  id: string;
  pwd: string;
}

// 로그인 API
const login = (userAccountInfo: UserLoginInfoType) => {
  const { id, pwd } = userAccountInfo;
  const reqBody = {
    no: id,
    password: pwd,
  };
  return axiosInstance.post('/auth/login', reqBody);
};

// (로그인 한) 사용자 정보 조회 API
const fetchCurrentUserInfo = () => {
  return axiosInstance.get('/auth/me');
};

export default function Login() {
  const STR_RIGHT_CASE_INPUT_ELEMENT_STYLE_CLASSNAME =
    'block px-2.5 pb-3.5 pt-3.5 w-full text-sm text-gray-900 bg-transparent rounded-[0.2rem] border-1 border-[#d8d9dc] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 focus:border-2 peer';
  const STR_WRONG_CASE_INPUT_ELEMENT_STYLE_CLASSNAME =
    'block px-2.5 pb-3.5 pt-3.5 w-full text-sm text-gray-900 bg-transparent rounded-[0.2rem] border-1 border-[#d8d9dc] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#c84031] focus:outline-none focus:ring-0 focus:border-[#c84031] focus:border-2 peer';
  const STR_RIGHT_CASE_LABEL_ELEMENT_STYLE_CLASSNAME =
    'absolute text-sm text-gray-500 dark:text-gray-400 duration-150 transform -translate-y-[1.07rem] scale-75 top-2 origin-[0] bg-white dark:bg-gray-900 px-1 peer-focus:px-1 peer-focus:text-blue-500 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2';
  const STR_WRONG_CASE_LABEL_ELEMENT_STYLE_CLASSNAME =
    'absolute text-sm text-gray-500 dark:text-gray-400 duration-150 transform -translate-y-[1.07rem] scale-75 top-2 origin-[0] bg-white dark:bg-gray-900 px-1 peer-focus:px-1 peer-focus:text-[#c84031] peer-focus:dark:text-[#c84031] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2';

  const loginMutation = useMutation({
    mutationFn: login,
    onMutate: () => {
      setIsAdjustOpacity(true);
    },
    onError: (error: AxiosError) => {
      const resData: any = error.response?.data;
      switch (resData.status) {
        case 400:
          switch (resData.code) {
            case 'REG_NUMBER_REQUIRED':
              alert('Bad Request(400)...');
              break;
            case 'INVALID_PASSWORD':
              pwdInputRef.current?.focus();
              setPwdInputAnnouceMsg('잘못된 비밀번호입니다.');
              setPwdInputElementStyle(
                STR_WRONG_CASE_INPUT_ELEMENT_STYLE_CLASSNAME,
              );
              setPwdLabelElementStyle(
                STR_WRONG_CASE_LABEL_ELEMENT_STYLE_CLASSNAME,
              );
              break;
            default:
              alert('정의되지 않은 http code입니다.');
          }
          break;
        case 404:
          idInputRef.current?.focus();
          setIdInputAnnouceMsg('등록되지 않은 사용자입니다.');
          setIdInputElementStyle(STR_WRONG_CASE_INPUT_ELEMENT_STYLE_CLASSNAME);
          setIdLabelElementStyle(STR_WRONG_CASE_LABEL_ELEMENT_STYLE_CLASSNAME);
          break;
        default:
          alert('정의되지 않은 http status code입니다');
      }
    },
    onSuccess: (data) => {
      const resData = data.data.data;
      const { accessToken, refreshToken } = resData;

      localStorage.setItem('access-token', accessToken);
      localStorage.setItem('refresh-token', refreshToken);
      localStorage.setItem('activeAuthorization', 'true');

      // 로그인 후 사용자 정보 조회
      getCurrentUserInfoMutation.mutate();

      router.push('/');
    },
    onSettled: () => {
      setIsAdjustOpacity(false);
    },
  });

  const getCurrentUserInfoMutation = useMutation({
    mutationFn: fetchCurrentUserInfo,
    onSuccess: (data) => {
      const resData = data.data.data;
      const { _id, no, name, email, university, department, phone, role } =
        resData;
      updateUserInfo({
        _id,
        no,
        name,
        email,
        university,
        department,
        phone,
        role,
        isAuth: true,
      });
    },
  });

  const updateUserInfo = userInfoStore((state: any) => state.updateUserInfo);

  const [userAccountInfo, setUserAccountInfo] = useState({
    id: '',
    pwd: '',
  });
  const [idInputAnnounceMsg, setIdInputAnnouceMsg] = useState('');
  const [pwdInputAnnounceMsg, setPwdInputAnnouceMsg] = useState('');
  const [idInputElementStyle, setIdInputElementStyle] = useState(
    STR_RIGHT_CASE_INPUT_ELEMENT_STYLE_CLASSNAME,
  );
  const [idLabelElementStyle, setIdLabelElementStyle] = useState(
    STR_RIGHT_CASE_LABEL_ELEMENT_STYLE_CLASSNAME,
  );
  const [pwdInputElementStyle, setPwdInputElementStyle] = useState(
    STR_RIGHT_CASE_INPUT_ELEMENT_STYLE_CLASSNAME,
  );
  const [pwdLabelElementStyle, setPwdLabelElementStyle] = useState(
    STR_RIGHT_CASE_LABEL_ELEMENT_STYLE_CLASSNAME,
  );
  const [isAdjustOpacity, setIsAdjustOpacity] = useState(false);

  const [openPrivacyPolicyModal, setOpenPrivacyPolicyModal] = useState<
    string | undefined
  >();

  const idInputRef = useRef<HTMLInputElement>(null);
  const pwdInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIdInputAnnouceMsg('');
    setPwdInputAnnouceMsg('');
    setIdInputElementStyle(STR_RIGHT_CASE_INPUT_ELEMENT_STYLE_CLASSNAME);
    setIdLabelElementStyle(STR_RIGHT_CASE_LABEL_ELEMENT_STYLE_CLASSNAME);
    setPwdLabelElementStyle(STR_RIGHT_CASE_INPUT_ELEMENT_STYLE_CLASSNAME);
    setPwdLabelElementStyle(STR_RIGHT_CASE_LABEL_ELEMENT_STYLE_CLASSNAME);

    if (!userAccountInfo.id) {
      idInputRef.current?.focus();
      setIdInputAnnouceMsg('학번 또는 교번을 입력하세요.');
      setIdInputElementStyle(STR_WRONG_CASE_INPUT_ELEMENT_STYLE_CLASSNAME);
      setIdLabelElementStyle(STR_WRONG_CASE_LABEL_ELEMENT_STYLE_CLASSNAME);
      return;
    }

    if (!userAccountInfo.pwd) {
      pwdInputRef.current?.focus();
      setPwdInputAnnouceMsg('비밀번호를 입력하세요.');
      setPwdInputElementStyle(STR_WRONG_CASE_INPUT_ELEMENT_STYLE_CLASSNAME);
      setPwdLabelElementStyle(STR_WRONG_CASE_LABEL_ELEMENT_STYLE_CLASSNAME);
      return;
    }

    loginMutation.mutate(userAccountInfo);
  };

  return (
    <div className="mt-4 h-[39rem]">
      <div
        className={`w-fit 2md:w-96 p-4 mx-auto ${
          isAdjustOpacity && 'opacity-60'
        }`}
      >
        <div className="flex flex-col text-center border p-8 rounded-md border-[#d8d9dc] bg-[#fefefe] shadow-lg">
          <div className="flex flex-col gap-2 text-xl my-2">
            <Image
              src={logoImg}
              alt="list"
              width={35}
              height={0}
              quality={100}
              className="mx-auto mb-1"
            />
            <p>로그인</p>
            <p className="text-sm">사업단 계정 사용</p>
          </div>

          <form>
            <div className="flex flex-col w-full mx-auto mt-6">
              <div className="relative h-12">
                <input
                  type="text"
                  id="floating_outlined"
                  className={idInputElementStyle}
                  value={userAccountInfo.id}
                  ref={idInputRef}
                  onChange={(e) =>
                    setUserAccountInfo({
                      ...userAccountInfo,
                      id: e.target.value,
                    })
                  }
                  placeholder=" "
                />
                <label
                  htmlFor="floating_outlined"
                  className={idLabelElementStyle}
                >
                  학번 또는 교번
                </label>
              </div>
              {idInputAnnounceMsg && (
                <div className="flex mt-[0.3rem]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="15"
                    viewBox="0 -960 960 960"
                    width="15"
                    fill="#c84031"
                    className="relative left-[0.1rem] top-[0.1rem]"
                  >
                    <path d="M479.928-274.022q16.463 0 27.398-10.743 10.935-10.743 10.935-27.206 0-16.464-10.863-27.518-10.862-11.055-27.326-11.055-16.463 0-27.398 11.037-10.935 11.037-10.935 27.501 0 16.463 10.863 27.224 10.862 10.76 27.326 10.76Zm-30.993-158.739h68.13v-257.065h-68.13v257.065Zm31.364 358.74q-84.202 0-158.041-31.879t-129.159-87.199q-55.32-55.32-87.199-129.201-31.878-73.88-31.878-158.167t31.878-158.2q31.879-73.914 87.161-128.747 55.283-54.832 129.181-86.818 73.899-31.986 158.205-31.986 84.307 0 158.249 31.968 73.942 31.967 128.756 86.768 54.815 54.801 86.79 128.883 31.976 74.083 31.976 158.333 0 84.235-31.986 158.07t-86.818 128.942q-54.833 55.107-128.873 87.169-74.04 32.063-158.242 32.063Z" />
                  </svg>
                  <p
                    id="helper-checkbox-text"
                    className="relative pr-2 left-[0.5rem] w-full text-left text-xs font-normal text-[#c84031] dark:text-gray-300"
                  >
                    {idInputAnnounceMsg}
                  </p>
                </div>
              )}

              <div className="relative h-12 mt-5">
                <input
                  type="password"
                  id="floating_outlined"
                  className={pwdInputElementStyle}
                  value={userAccountInfo.pwd}
                  ref={pwdInputRef}
                  onChange={(e) => {
                    setUserAccountInfo({
                      ...userAccountInfo,
                      pwd: e.target.value,
                    });
                  }}
                  placeholder=" "
                />
                <label
                  htmlFor="floating_outlined"
                  className={pwdLabelElementStyle}
                >
                  비밀번호 입력
                </label>
              </div>
              {pwdInputAnnounceMsg && (
                <div className="flex mt-[0.3rem] mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="15"
                    viewBox="0 -960 960 960"
                    width="15"
                    fill="#c84031"
                    className="relative left-[0.1rem] top-[0.1rem]"
                  >
                    <path d="M479.928-274.022q16.463 0 27.398-10.743 10.935-10.743 10.935-27.206 0-16.464-10.863-27.518-10.862-11.055-27.326-11.055-16.463 0-27.398 11.037-10.935 11.037-10.935 27.501 0 16.463 10.863 27.224 10.862 10.76 27.326 10.76Zm-30.993-158.739h68.13v-257.065h-68.13v257.065Zm31.364 358.74q-84.202 0-158.041-31.879t-129.159-87.199q-55.32-55.32-87.199-129.201-31.878-73.88-31.878-158.167t31.878-158.2q31.879-73.914 87.161-128.747 55.283-54.832 129.181-86.818 73.899-31.986 158.205-31.986 84.307 0 158.249 31.968 73.942 31.967 128.756 86.768 54.815 54.801 86.79 128.883 31.976 74.083 31.976 158.333 0 84.235-31.986 158.07t-86.818 128.942q-54.833 55.107-128.873 87.169-74.04 32.063-158.242 32.063Z" />
                  </svg>
                  <p
                    id="helper-checkbox-text"
                    className="relative pr-2 left-[0.5rem] w-full text-left text-xs font-normal text-[#c84031] dark:text-gray-300"
                  >
                    {pwdInputAnnounceMsg}
                  </p>
                </div>
              )}
            </div>
            <div className="h-36 flex flex-col mt-[0.625rem] justify-between text-left mb-6">
              <a
                href="https://sw7up.cbnu.ac.kr/account/password"
                target="_blank"
                className="text-[#437ae1] text-[0.8rem] font-semibold w-fit"
              >
                비밀번호를 잊으셨나요?
              </a>
              <div className="text-[0.8rem] text-gray-600">
                내 컴퓨터가 아닌가요? 시크릿 모드를 사용하여 비공개로
                로그인하세요.
              </div>
              <div className="flex justify-between items-center">
                <a
                  href="https://sw7up.cbnu.ac.kr/account/password"
                  target="_blank"
                  className="text-[#437ae1] translate-x-[-0.5rem] text-[0.8rem] font-normal px-2 py-1 hover:bg-[#f3f4f5] rounded-[0rem] focus:bg-[#f3f4f5]"
                >
                  계정 만들기
                </a>
                <button
                  type="submit"
                  onClick={handleSignIn}
                  className="text-[#f9fafb] bg-[#3a8af9] px-4 py-[0.5rem] rounded-[6px] focus:bg-[#1c6cdb] hover:bg-[#1c6cdb]"
                >
                  로그인
                </button>
              </div>
            </div>
          </form>
          <div>
            <div date-rangepicker="true" className="flex items-center">
              <div className="relative"></div>
            </div>
          </div>
        </div>
        <div className="flex mt-3 text-[0.6rem] text-gray-700 justify-end">
          <button
            onClick={() => setOpenPrivacyPolicyModal('default')}
            className="text-[#b0b8c1]"
          >
            개인정보 처리방침
          </button>
          {openPrivacyPolicyModal && (
            <PrivacyPolicyModal
              openPrivacyPolicyModal={openPrivacyPolicyModal}
              setOpenPrivacyPolicyModal={setOpenPrivacyPolicyModal}
            />
          )}
        </div>
      </div>
    </div>
  );
}
