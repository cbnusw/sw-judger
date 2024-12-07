import Dropzone from '@/app/components/Dropzone';
import MyDropzone from '@/app/components/MyDropzone';
import { IoSetItem, ProblemInfo, RegisterProblemParams } from '@/types/problem';
import { Modal } from 'flowbite-react';
import React, { useEffect, useState } from 'react';

interface UploadingPracticeProblemsModalProps {
  openUploadingPracticeProblemsModal: string | undefined;
  setOpenUploadingPracticeProblemsModal: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
}

export default function UploadingPracticeProblemsModal({
  openUploadingPracticeProblemsModal,
  setOpenUploadingPracticeProblemsModal,
}: UploadingPracticeProblemsModalProps) {
  const [tempUploadedProblemsInfo, setTempUploadedProblemsInfo] = useState<
    RegisterProblemParams[]
  >([]);

  return (
    <Modal
      show={openUploadingPracticeProblemsModal === 'default'}
      onClose={() => setOpenUploadingPracticeProblemsModal(undefined)}
      className="modal"
      size="xl"
    >
      <Modal.Body className="flex flex-col gap-y-1 items-start pt-7 pb-0 px-5 overflow-hidden">
        <span className="text-[20px] font-semibold">
          문제를 등록하는 중이에요
        </span>

        <span className="text-[17px] text-[#4e5968] font-medium">
          문제 등록이 완료될 때까지 화면을 닫지 말아주세요.
        </span>

        <svg
          viewBox="0 0 100 100"
          width="110"
          height="110"
          className="svg-loading-animation mx-auto h-[10rem]"
        >
          <circle
            fill="none"
            stroke="#d8d8dc"
            strokeWidth="9"
            strokeMiterlimit="10"
            strokeLinecap="butt"
            strokeLinejoin="miter"
            cx="50"
            cy="50"
            r="28"
          ></circle>
          <circle
            fill="none"
            stroke="#477eed"
            strokeWidth="9"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="miter"
            cx="50"
            cy="50"
            r="28"
            strokeDasharray="226.2"
            strokeDashoffset="190"
            className="circle-dash-animation"
          ></circle>
        </svg>
      </Modal.Body>
    </Modal>
  );
}
