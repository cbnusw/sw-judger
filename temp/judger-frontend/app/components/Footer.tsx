import React from 'react';

export default function Footer() {
  // 현재 년도를 가져오기
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full flex justify-start mt-auto font-light text-[10px] py-5 px-3 leading-[1.175rem] bg-[#505050]">
      <div className="flex flex-col 3xs:flex-row gap-10 justify-between mx-auto w-[60rem]">
        <div>
          <div className="mb-5 mx-auto">
            <a
              href="https://sw7up.cbnu.ac.kr/policy/privacy"
              target="_blank"
              className="text-[#eee] text-[10px]"
            >
              개인정보처리방침
            </a>
          </div>
          <div className="flex">
            <span className="mt-3 mr-2 text-[#eee]">
              충청북도 청주시 서원구 충대로1(개신동) 학연산공동기술연구원(E9동)
            </span>
            {/* <span className="before:content-['|'] mx-2 font-thin text-[#eee]"></span> */}
            {/* <a
            href="mailto:developersung13@gmail.com?subject=[Contact] &body=Name : %0D%0A%0D%0ATel : %0D%0A%0D%0AContent : %0D%0A"
            className="flex ml-2 text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 -960 960 960"
              width="20"
              className="mr-1"
            >
              <path
                fill="white"
                d="M180.309-212.001q-27.008 0-45.658-18.662-18.65-18.662-18.65-45.686v-407.626q0-27.024 18.65-45.524t45.658-18.5h599.382q27.008 0 45.658 18.662 18.65 18.662 18.65 45.686v407.626q0 27.024-18.65 45.524t-45.658 18.5H180.309ZM480-449.694 168-633.309v357q0 5.385 3.462 8.847 3.462 3.462 8.847 3.462h599.382q5.385 0 8.847-3.462 3.462-3.462 3.462-8.847v-357L480-449.694ZM480-517l305.846-179H174.154L480-517ZM168-633.309V-696-276.309q0 5.385 3.462 8.847 3.462 3.462 8.847 3.462H168v-369.309Z"
              />
            </svg>
            developersung13@gmail.com
          </a> */}
          </div>
          <div className="mt-2 text-[#ccc]">
            © {currentYear} 충북대학교 SW중심대학사업단. All rights reserved.
          </div>
        </div>
        <div className="flex gap-5 mt-auto mr-2">
          <a
            href="https://sw7up.cbnu.ac.kr/home"
            target="_blank"
            className="relative left-[-5px]"
          >
            <img
              src="/images/sw7_logo.png"
              alt="cbnu_logo"
              className="w-[7rem] 3xs:w-[8rem]"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
