import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadService } from '@/components/utils/uploadService';
import { RegisterProblemParams, UploadedFileInfo } from '../../types/problem';
import * as XLSX from 'xlsx';

interface DropzoneProps {
  type: string;
  guideMsg: string;
  guideMsg2: string;
  setExcelFileName: React.Dispatch<React.SetStateAction<string>>;
  setIsFileUploaded: (isUploaded: boolean) => void;
  isFileUploaded: boolean;
  fileUrl?: string;
  setFileUrl: (url: string) => void;
  setUploadedProblemsInfo: React.Dispatch<
    React.SetStateAction<RegisterProblemParams[]>
  >;
}

function Dropzone(props: DropzoneProps) {
  const {
    type,
    guideMsg,
    guideMsg2,
    setExcelFileName,
    setIsFileUploaded,
    isFileUploaded,
    fileUrl,
    setFileUrl,
    setUploadedProblemsInfo,
  } = props;

  const [isDragEntered, setIsDragEntered] = useState(false);
  const [isDragAndDropped, setIsDragAndDropped] = useState(false);
  const [fileList, setFileList] = useState<UploadedFileInfo[]>([]);
  const [fileNameList, setFileNameList] = useState<string[]>([]);
  const [fileSizes, setFileSizes] = useState<string[]>([]); // 파일 크기를 저장하는 상태

  const [uploadService] = useState(new UploadService()); // UploadService 인스턴스 생성

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      if (acceptedFiles.some((file) => file.name.endsWith('.xlsx'))) {
        const file = acceptedFiles[0];

        // 첨부된 파일명을 설정
        setExcelFileName(file.name);

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
          }) as Array<{ A: string; B: number; C: number; D: number }>; // jsonData의 타입 선언

          // RegisterProblemParams 배열로 변환
          const formattedData: RegisterProblemParams[] = jsonData.map(
            (row) => ({
              title: row.A || '', // A 열의 값을 title로 매핑
              content: '', // content는 빈 문자열로 초기화
              published: null, // published는 null로 설정
              ioSet: [], // ioSet은 빈 배열로 초기화
              options: {
                maxRealTime: Number(row.B) || 0, // B 열을 maxRealTime으로 매핑
                maxMemory: Number(row.C) || 0, // C 열을 maxMemory으로 매핑
              },
              score: Number(row.D) || 0, // D 열을 score로 매핑
            }),
          );

          // 변환된 데이터 업데이트
          setUploadedProblemsInfo(formattedData);
        };

        reader.readAsArrayBuffer(file);
      }

      if (type === 'file') {
        acceptedFiles.forEach((file) => {
          uploadService
            .upload(file)
            .then((response) => {
              const newFile = response.data;
              setFileList((prevList) => [...prevList, newFile]); // 파일 리스트에 새 파일 추가

              // 파일 이름, URL, 크기 업데이트
              setFileUrl?.(newFile.url);
              setFileList([newFile]);
              setFileNameList([newFile.filename]);
              setFileSizes([
                ...fileSizes,
                (file.size / 1024).toFixed(2) + ' KB', // 파일 크기를 KB 단위로 변환
              ]);
              setIsFileUploaded(true);
            })
            .catch((error) => console.error('File upload error:', error));
        });
      }
    },
    [
      uploadService,
      setExcelFileName,
      type,
      setIsFileUploaded,
      setFileUrl,
      fileSizes,
      setUploadedProblemsInfo,
    ],
  );

  const { getRootProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragEntered(true),
    onDragLeave: () => setIsDragEntered(false),
    onDropRejected: () => setIsDragEntered(false),
    onDropAccepted: () => setIsDragAndDropped(true),
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
    }, // 파일 탐색기에서 .xlsx만 허용
    multiple: false, // 단일 파일만 허용
  });

  useEffect(() => {
    if (!isFileUploaded) setIsDragAndDropped(false);
  }, [isDragEntered, isFileUploaded, setIsDragAndDropped]);

  return (
    <div className="flex flex-col gap-2 items-center justify-center w-full">
      <label
        {...getRootProps()}
        htmlFor="dropzone-file"
        className={`flex flex-col items-center w-full h-36 border-2 ${
          isFileUploaded ? 'justify-start' : 'justify-center'
        } p-[0.65rem] bg-white border-none outline outline-1 outline-[#e6e8ea] hover:outline-2 hover:outline-[#a3c6fa] hover:outline-offset-[-1px] rounded-[7px] duration-100`}
      >
        {isFileUploaded && type === 'file' ? (
          <div className="w-full flex items-center gap-x-3 p-1 border border-[#e6e8ea] rounded-[6px]">
            <svg
              fill="none"
              height="40"
              width="40"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="border border-[#e6e8ea] rounded-[6px]"
            >
              <rect fill="#d1d6db" height="24" rx="3.15789" width="24"></rect>
              <rect
                fill="#fff"
                height="11.6242"
                rx="1.22701"
                width="10.5871"
                x="7.00647"
                y="5.96668"
              ></rect>
              <rect
                height="11.6242"
                rx="1.22701"
                stroke="#fff"
                strokeWidth=".821046"
                width="10.5871"
                x="7.00647"
                y="5.96668"
              ></rect>
              <path
                d="m14.2795 4.2793v4.46608c0 .55228.4478 1 1 1h4.4678"
                stroke="#d1d6db"
                strokeLinecap="square"
              ></path>
              <path d="m14.3 4.2793 4.8275 5.49868" stroke="#d1d6db"></path>
              <path
                d="m15.6084 5.58887h2.35449v4.3116h-2.35449z"
                fill="#d1d6db"
                transform="matrix(.7566939 -.65376933 .65376933 .7566939 .143787 11.564099)"
              ></path>
            </svg>

            <div className="flex flex-col gap-y-[0.2rem] text-xs">
              <span className="text-[#4e5968]">{fileNameList[0]}</span>
              <span className="text-[#c6cbd1] font-light">{fileSizes[0]}</span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-y-1 items-center justify-center pt-5 pb-6">
              {type === 'file' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M8.4 21.6c-1.9 0-3.9-.7-5.3-2.2-2.9-2.9-2.9-7.7 0-10.7l4.5-4.5c.4-.4 1.1-.4 1.6 0 .4.4.4 1.1 0 1.6l-4.5 4.5c-2.1 2.1-2.1 5.5 0 7.5 2.1 2.1 5.5 2.1 7.5 0L20 10c1.2-1.2 1.2-3.3 0-4.5-1.2-1.2-3.3-1.2-4.5 0l-7.1 7.1c-.4.4-.4 1.1 0 1.5.4.4 1.1.4 1.5 0l4.8-4.8c.4-.4 1.1-.4 1.6 0 .4.4.4 1.1 0 1.6l-4.8 4.8C10.1 17 8 17 6.8 15.7c-1.3-1.3-1.3-3.3 0-4.6L13.9 4c2.1-2.1 5.5-2.1 7.6 0 2.1 2.1 2.1 5.5 0 7.6l-7.8 7.8c-1.4 1.4-3.3 2.2-5.3 2.2z"
                    fill="#8b95a1"
                  ></path>
                </svg>
              ) : (
                <></>
              )}

              <span className="mt-1 text-[#333d4b] font-normal">
                {guideMsg}
              </span>
              <span className="text-[#8b95a1] text-xs font-extralight">
                {guideMsg2}
              </span>
              <p className="text-xs text-gray-500 "></p>
            </div>
          </>
        )}
      </label>
    </div>
  );
}

export default Dropzone;
