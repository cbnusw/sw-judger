import Dropzone from '@/app/components/Dropzone';
import MyDropzone from '@/app/components/MyDropzone';
import { IoSetItem, ProblemInfo, RegisterProblemParams } from '@/types/problem';
import { Modal } from 'flowbite-react';
import React, { useEffect, useState } from 'react';

interface UploadContestProblemsModalProps {
  setExcelFileName: React.Dispatch<React.SetStateAction<string>>;
  setUploadedProblemsInfo: React.Dispatch<
    React.SetStateAction<RegisterProblemParams[]>
  >;
  excelFileUrl: string;
  setExcelFileUrl: React.Dispatch<React.SetStateAction<string>>;
  isExcelFileUploadingValidFail: boolean;
  setIsExcelFileUploadingValidFail: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  openUploadContestProblemsModal: string | undefined;
  setOpenUploadContestProblemsModal: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
}

export default function UploadContestProblemsModal({
  setExcelFileName,
  setUploadedProblemsInfo,
  excelFileUrl,
  setExcelFileUrl,
  isExcelFileUploadingValidFail,
  setIsExcelFileUploadingValidFail,
  openUploadContestProblemsModal,
  setOpenUploadContestProblemsModal,
}: UploadContestProblemsModalProps) {
  const [tempUploadedProblemsInfo, setTempUploadedProblemsInfo] = useState<
    RegisterProblemParams[]
  >([]);

  useEffect(() => {
    setIsExcelFileUploadingValidFail(false);
  }, [setIsExcelFileUploadingValidFail]);

  return (
    <Modal
      show={openUploadContestProblemsModal === 'default'}
      onClose={() => setOpenUploadContestProblemsModal(undefined)}
      className="modal"
      size="xl"
    >
      <Modal.Body className="flex flex-col gap-y-1 items-start pt-7 pb-0 px-5">
        <span className="text-[20px] font-semibold">문제 한 번에 등록하기</span>

        <span className="text-[17px] text-[#4e5968] font-medium">
          엑셀 양식에 문제 정보를 모두 써준 뒤 파일을 올리면 문제를 한 번에
          등록할 수 있어요.
        </span>

        <button
          onClick={() => {
            window.location.href = '/template/SOJ_대회_문제등록_양식.xlsx';
          }}
          className="text-[17px] text-[#007bff] hover:text-[#002fa6] font-medium underline hover:no-underline"
        >
          문제 등록 양식 다운받기
        </button>

        <div className="w-full mt-2 mb-1">
          <Dropzone
            type="file"
            guideMsg="파일을 선택하거나 올려 주세요"
            guideMsg2="10MB 이하"
            setExcelFileName={setExcelFileName}
            setIsFileUploaded={setIsExcelFileUploadingValidFail}
            isFileUploaded={isExcelFileUploadingValidFail}
            fileUrl={excelFileUrl}
            setFileUrl={setExcelFileUrl}
            setUploadedProblemsInfo={setTempUploadedProblemsInfo}
          />
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-between border-none pt-4">
        <button
          onClick={() => setOpenUploadContestProblemsModal(undefined)}
          className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-3 py-[0.5rem] rounded-[7px] font-medium focus:bg-[#d3d6da] hover:bg-[#d3d6da]"
        >
          닫기
        </button>

        <button
          onClick={() => {
            setUploadedProblemsInfo(tempUploadedProblemsInfo);
            setOpenUploadContestProblemsModal(undefined);
          }}
          className="flex justify-center items-center gap-[0.375rem] text-[0.8rem] text-white bg-[#3a8af9] px-3 py-[0.5rem] rounded-[6px] font-medium  hover:bg-[#1c6cdb]"
        >
          등록하기
        </button>
      </Modal.Footer>
    </Modal>
  );
}
