import React, { forwardRef } from 'react';
import { ExampleFile, IoSetItem, ProblemInfo } from '@/types/problem';
import axiosInstance from '@/utils/axiosInstance';
import { UploadService } from '@/components/utils/uploadService';
import { ToastInfoStore } from '@/store/ToastInfo';

interface SearchedProblemListItemProps {
  problemInfo: ProblemInfo;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setMaxExeTime: React.Dispatch<React.SetStateAction<number>>;
  setMaxMemCap: React.Dispatch<React.SetStateAction<number>>;
  setUploadedProblemPdfFileUrl: React.Dispatch<React.SetStateAction<string>>;
  setIoSetData: React.Dispatch<React.SetStateAction<IoSetItem[]>>;
  setExampleFiles: React.Dispatch<React.SetStateAction<ExampleFile[]>>;
  className: string;
}

// forwardRef 사용
const SearchedProblemListItem = forwardRef<
  HTMLButtonElement,
  SearchedProblemListItemProps
>((props, ref) => {
  const {
    problemInfo,
    setTitle,
    setMaxExeTime,
    setMaxMemCap,
    setUploadedProblemPdfFileUrl,
    setIoSetData,
    setExampleFiles,
    className,
  } = props;

  const uploadService = new UploadService();

  const addToast = ToastInfoStore((state) => state.addToast);

  const handleClick = async () => {
    setTitle(problemInfo.title);
    setMaxExeTime(problemInfo.options.maxRealTime);
    setMaxMemCap(problemInfo.options.maxMemory);

    try {
      // PDF 파일 업로드
      const pdfResponse = await uploadService.upload(
        new File(
          [await fetch(problemInfo.content).then((res) => res.blob())],
          'problem.pdf',
        ),
      );
      setUploadedProblemPdfFileUrl(pdfResponse.data.url);

      // IO Set 파일들 업로드
      const ioSetDataPromises = problemInfo.ioSet.map(
        async (ioSetItem, index) => {
          const inFilename = `${index + 1}.in`;
          const outFilename = `${index + 1}.out`;

          const inFileBlob = await fetch(ioSetItem.inFile.url).then((res) =>
            res.blob(),
          );
          const outFileBlob = await fetch(ioSetItem.outFile.url).then((res) =>
            res.blob(),
          );

          const inFileResponse = await uploadService.upload(
            new File([inFileBlob], inFilename),
          );
          const outFileResponse = await uploadService.upload(
            new File([outFileBlob], outFilename),
          );

          return {
            inFile: {
              ...inFileResponse.data,
              filename: inFilename,
            },
            outFile: {
              ...outFileResponse.data,
              filename: outFilename,
            },
          };
        },
      );

      const newIoSetData = await Promise.all(ioSetDataPromises);
      setIoSetData(newIoSetData);

      // Example 파일들 업로드
      const exampleFileDataPromises = problemInfo.exampleFiles.map(
        async (exampleFile) => {
          if (exampleFile.url) {
            // url이 null이 아닌 경우에만 처리
            const exampleFileBlob = await fetch(exampleFile.url).then((res) =>
              res.blob(),
            );
            const exampleFileResponse = await uploadService.upload(
              new File([exampleFileBlob], exampleFile.filename),
            );
            return {
              ...exampleFileResponse.data,
              filename: exampleFile.filename,
              ref: exampleFileResponse.data.ref || '', // ref가 null이면 빈 문자열로 처리
              refModel: exampleFileResponse.data.refModel || '', // refModel도 마찬가지로 처리
            };
          } else {
            console.warn(
              `File URL for example file '${exampleFile.filename}' is null.`,
            );
            return {
              ref: '', // ref가 null인 경우 빈 문자열로 처리
              _id: exampleFile._id,
              filename: exampleFile.filename,
              url: null,
            };
          }
        },
      );

      const newExampleFiles = await Promise.all(exampleFileDataPromises);
      setExampleFiles(newExampleFiles);
    } catch (error) {
      console.error('File upload error:', error);
      addToast('error', '파일 업로드 중에 오류가 발생했어요.');
    }
  };

  return (
    <button
      ref={ref} // forwardRef로 받은 ref를 DOM 요소에 전달
      onClick={handleClick}
      className={`w-full flex justify-between items-center gap-x-3 bg-white hover:bg-[#f2f4f6] focus:bg-[#f2f4f6] focus:outline-none p-[0.4rem] rounded-md ${className}`}
    >
      <div className="flex items-center gap-x-3">
        <svg
          fill="none"
          width="32.5"
          height="32.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="p-[0.325rem] rounded-full"
          style={{ background: 'rgba(2, 32, 71, 0.05' }}
        >
          <path
            d="m19.59 18.41-3.205-3.203c1.0712-1.3712 1.579-3.0994 1.4197-4.832-.1593-1.73274-.9735-3.3394-2.2767-4.49233s-2.9972-1.76527-4.7364-1.71212c-1.73913.05315-3.39252.76779-4.62288 1.99815s-1.945 2.88375-1.99815 4.6229c-.05316 1.7392.55918 3.4332 1.71211 4.7364s2.7596 2.1174 4.49232 2.2767c1.7327.1592 3.4608-.3485 4.832-1.4197l3.204 3.204c.1567.1541.3678.24.5876.2391.2197-.0009.4302-.0886.5856-.2439.1554-.1554.243-.3659.2439-.5856.001-.2198-.085-.431-.2391-.5876zm-4.886-3.808c-.0183.0156-.036.032-.053.049-.042.044-.042.044-.08.092-.91.886-2.197 1.424-3.571 1.424-1.19232.0001-2.348-.4121-3.27107-1.1668s-1.55672-1.8055-1.79352-2.974c-.2368-1.1686-.06217-2.38311.49428-3.43762s1.46047-1.88413 2.55878-2.34819c1.09833-.46405 2.32333-.53398 3.46733-.19793s2.1365 1.0574 2.8094 2.04174c.6728.98434.9845 2.1711.8822 3.359-.1022 1.1879-.6122 2.3039-1.4434 3.1588z"
            fill="#8994a2"
          ></path>
        </svg>

        <span className="text-inherit font-medium">{problemInfo.title}</span>
      </div>

      <div className="flex items-center gap-x-2">
        {problemInfo.parentType !== 'Practice' && (
          <span className="text-[#8994a2]">{problemInfo.parentTitle}</span>
        )}

        <span className="text-xs bg-[#e8f3ff] text-[#1b64da] rounded-full px-2 py-1">
          {problemInfo.parentType === 'Practice'
            ? '연습문제'
            : problemInfo.parentType === 'Contest'
            ? '대회'
            : '시험'}
        </span>
      </div>
    </button>
  );
});

// displayName 설정
SearchedProblemListItem.displayName = 'SearchedProblemListItem';

export default SearchedProblemListItem;
