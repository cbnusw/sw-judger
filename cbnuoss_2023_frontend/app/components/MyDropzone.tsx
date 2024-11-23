import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useDropzone } from 'react-dropzone';
import dynamic from 'next/dynamic';
import { UploadService } from '@/components/utils/uploadService';
import { ExampleFile, IoSetItem, UploadedFileInfo } from '../../types/problem';
import Loading from './Loading';

interface MyDropzoneProps {
  type: string;
  guideMsg: string;
  setIsFileUploaded: (isUploaded: boolean) => void;
  isFileUploaded: boolean;
  initUrl?: string;
  initExampleFiles?: ExampleFile[];
  initInAndOutFiles?: IoSetItem[];
  setUploadedFileUrl?: (url: string) => void;
  setExampleFiles?: Dispatch<SetStateAction<ExampleFile[]>>;
  setIoSetData?: (
    ioSetData: IoSetItem[] | ((prevIoSetData: IoSetItem[]) => IoSetItem[]),
  ) => void;
}

const PDFViewer = dynamic(() => import('@/app/components/PDFViewer'), {
  ssr: false,
  loading: () => <Loading />,
});

function MyDropzone(props: MyDropzoneProps) {
  const {
    type,
    guideMsg,
    setIsFileUploaded,
    isFileUploaded,
    initUrl,
    initExampleFiles,
    initInAndOutFiles,
    setUploadedFileUrl,
    setExampleFiles,
    setIoSetData,
  } = props;

  const [isDragEntered, setIsDragEntered] = useState(false);
  const [isDragAndDropped, setIsDragAndDropped] = useState(false);
  const [fileList, setFileList] = useState<UploadedFileInfo[]>([]);
  const [fileNameList, setFileNameList] = useState<string[]>([]);
  const [pdfScale, setPdfScale] = useState(0);

  const [uploadService] = useState(new UploadService()); // UploadService 인스턴스 생성

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (type === 'inOut') {
        // inOut 파일 처리 로직 유지
        const inFiles = acceptedFiles.filter((file) =>
          file.name.endsWith('.in'),
        );
        const outFiles = acceptedFiles.filter((file) =>
          file.name.endsWith('.out'),
        );
        const pairs = inFiles.flatMap((inFile) => {
          const baseName = inFile.name.replace('.in', '');
          const outFile = outFiles.find(
            (outFile) => outFile.name === `${baseName}.out`,
          );
          return outFile ? [[inFile, outFile]] : [];
        });

        pairs.forEach(([inFile, outFile]) => {
          Promise.all([
            uploadService.upload(inFile),
            uploadService.upload(outFile),
          ])
            .then(([inResponse, outResponse]) => {
              const newIoSetItem: IoSetItem = {
                inFile: { ...inResponse.data, filename: inFile.name },
                outFile: { ...outResponse.data, filename: outFile.name },
              };
              setIoSetData?.((prevIoSetData) => [
                ...prevIoSetData,
                newIoSetItem,
              ]);
              setFileList((prevList) => [
                ...prevList,
                { ...inResponse.data, filename: inFile.name },
                { ...outResponse.data, filename: outFile.name },
              ]);
            })
            .catch((error) => console.error('File upload error:', error));
        });
      } else {
        // pdf, code, exampleFile 타입의 파일 처리 로직 수정
        acceptedFiles.forEach((file) => {
          uploadService
            .upload(file)
            .then((response) => {
              const newFile = response.data;
              setFileList((prevList) => [...prevList, newFile]); // 파일 리스트에 새 파일 추가

              // pdf나 code 타입일 경우 단일 파일 URL 설정
              if (type === 'pdf' || type === 'code') {
                setUploadedFileUrl?.(newFile.url);
                setFileList([newFile]);
                setFileNameList([newFile.filename]);
                setIsFileUploaded(true);
              }

              // exampleFile 타입의 경우 URL 배열 업데이트
              if (type === 'exampleFile' && setExampleFiles) {
                const newExampleFile: ExampleFile = {
                  ref: newFile.ref ?? '',
                  _id: newFile._id,
                  filename: newFile.filename,
                  url: newFile.url ?? '', // url 필드를 추가하여 기본값 할당
                };
                setExampleFiles((prevExampleFiles: ExampleFile[]) => [
                  ...prevExampleFiles,
                  newExampleFile,
                ]);
              }

              setFileNameList((prevList) => [...prevList, newFile.filename]);
              setIsFileUploaded(true);
            })
            .catch((error) => console.error('File upload error:', error));
        });
      }
    },
    [
      uploadService,
      type,
      setIsFileUploaded,
      setIoSetData,
      setUploadedFileUrl,
      setExampleFiles,
    ],
  );

  useEffect(() => {
    if (type === 'inOut') {
      const hasValidPair = checkForValidPairs(fileList);
      setIsFileUploaded(hasValidPair);
    }
  }, [type, fileList, setIsFileUploaded]);

  const checkForValidPairs = (fileObjects: UploadedFileInfo[]) => {
    const inFiles = fileObjects.filter((file) => file.filename.endsWith('.in'));
    const outFiles = fileObjects.filter((file) =>
      file.filename.endsWith('.out'),
    );

    return inFiles.some((inFile) => {
      const outFileName = inFile.filename.replace('.in', '.out');
      return outFiles.some((outFile) => outFile.filename === outFileName);
    });
  };

  const getInAndOutFilePairs = (fileList: UploadedFileInfo[]): IoSetItem[] => {
    const inFiles = fileList.filter((file) => file.filename.endsWith('.in'));
    const outFiles = fileList.filter((file) => file.filename.endsWith('.out'));

    return inFiles
      .map((inFile) => {
        const outFileName = inFile.filename.replace('.in', '.out');
        const outFile = outFiles.find((file) => file.filename === outFileName);
        if (outFile) {
          return { inFile, outFile }; // IoSetItem 타입 반환
        }
        return null;
      })
      .filter((item): item is IoSetItem => item !== null); // null이 아닌 항목만 필터링
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragEntered(true),
    onDragLeave: () => setIsDragEntered(false),
    onDropRejected: () => setIsDragEntered(false),
    onDropAccepted: () => setIsDragAndDropped(true),
    accept: type === 'pdf' ? { 'application/pdf': [] } : undefined,
    multiple: type === 'pdf' ? false : true,
  });

  const handleDeletePair = (
    e: React.MouseEvent<HTMLButtonElement>,
    pair: IoSetItem,
  ) => {
    e.preventDefault();
    // fileList에서 선택된 파일 쌍 제거
    const updatedFileList = fileList.filter(
      (file) => file.url !== pair.inFile.url && file.url !== pair.outFile.url,
    );

    setFileList(updatedFileList);

    // fileNameList와 fileURLList도 업데이트
    const updatedFileNameList = updatedFileList.map((file) => file.filename);

    setFileNameList(updatedFileNameList);

    // setIoSetData를 사용하여 상위 컴포넌트의 IoSetItem[] 상태도 업데이트
    if (setIoSetData) {
      // 새로운 IoSetItem[] 배열 생성
      const newIoSetData = getInAndOutFilePairs(updatedFileList); // 수정된 fileList를 기반으로 새 IoSetItem[] 생성
      setIoSetData(newIoSetData);
    }
  };

  // 예제 파일 삭제 핸들러 함수 수정
  const handleDeleteExampleFile = (
    e: React.MouseEvent<HTMLButtonElement>,
    file: UploadedFileInfo,
  ) => {
    e.preventDefault();

    // `fileList`와 `fileNameList` 업데이트
    const updatedFileList = fileList.filter(
      (existingFile) => existingFile._id !== file._id,
    );
    setFileList(updatedFileList);
    setFileNameList(updatedFileList.map((file) => file.filename));

    // `setExampleFiles` 상태를 업데이트
    setExampleFiles?.((prevExampleFiles: ExampleFile[]) => {
      // 삭제할 파일을 제외한 새로운 배열 생성
      const newExampleFiles = prevExampleFiles.filter(
        (prevExampleFileInfo) => prevExampleFileInfo._id !== file._id,
      );
      return newExampleFiles;
    });

    // 파일이 모두 삭제되었는지 확인 후 UI 업데이트
    setIsFileUploaded(updatedFileList.length > 0);
  };

  // Dropzone 테두리 활성화/비활성화 로직
  useEffect(() => {
    if (isDragAndDropped) setIsDragEntered(false);
  }, [isDragAndDropped, fileList.length, setIsFileUploaded]);

  useEffect(() => {
    if (!isFileUploaded) setIsDragAndDropped(false);
  }, [isDragEntered, isFileUploaded, setIsDragAndDropped]);

  useEffect(() => {
    // pdf 초기화 로직
    if (type === 'pdf' && initUrl && fileList.length === 0) {
      const newFile = {
        ref: null,
        refModel: null,
        _id: '',
        url: initUrl,
        filename: 'problem.pdf', // 기본값
        mimetype: 'application/pdf',
        size: 0,
        uploader: '',
        uploadedAt: '',
        __v: 0,
      };
      setFileList([newFile]);
      setFileNameList([newFile.filename]);
      setIsFileUploaded(true);
    }
    // inOut 초기화 로직
    else if (
      type === 'inOut' &&
      initInAndOutFiles &&
      initInAndOutFiles.length > 0 &&
      fileList.length === 0
    ) {
      const files: UploadedFileInfo[] = initInAndOutFiles.reduce(
        (acc: UploadedFileInfo[], ioSetItem: IoSetItem) => {
          acc.push(ioSetItem.inFile, ioSetItem.outFile);
          return acc;
        },
        [],
      );
      setFileList(files);
      setFileNameList(files.map((file) => file.filename));
      setIsFileUploaded(true);
    }
    // exampleFile 초기화 로직
    else if (
      type === 'exampleFile' &&
      initExampleFiles &&
      initExampleFiles.length > 0 &&
      fileList.length === 0
    ) {
      const initialFiles = initExampleFiles.map((initExampleFile) => ({
        ref: initExampleFile.ref,
        refModel: null,
        _id: initExampleFile._id,
        url: '',
        filename: initExampleFile.filename,
        mimetype: '',
        size: 0,
        uploader: '',
        uploadedAt: '',
        __v: 0,
      }));
      setFileList(initialFiles);
      setFileNameList(initialFiles.map((file) => file.filename));
      setIsFileUploaded(true);
    }
  }, [type, initUrl, initInAndOutFiles, initExampleFiles, setIsFileUploaded]); // fileList를 의존성 배열에서 제거

  return (
    <div className="flex flex-col gap-2 items-center justify-center w-full">
      <label
        {...getRootProps()}
        htmlFor="dropzone-file"
        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-gray-${
          isDragEntered ? '500' : isFileUploaded ? '500' : '300'
        } border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {type === 'pdf' ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="40"
              viewBox="0 -960 960 960"
              width="40"
              fill="#6b7280"
            >
              <path d="M340.666-440.666h38v-82H424q16.149 0 27.074-10.925t10.925-27.075V-606q0-16.15-10.925-27.075T424-644h-83.334v203.334Zm38-120V-606H424v45.334h-45.334Zm126 120h82.667q15.667 0 26.833-10.925 11.167-10.925 11.167-27.075V-606q0-16.15-11.167-27.075Q603-644 587.333-644h-82.667v203.334Zm38-38V-606h44.667v127.334h-44.667Zm128.667 38h38v-82H756v-38h-46.667V-606H756v-38h-84.667v203.334ZM279.999-213.333q-27 0-46.833-19.833t-19.833-46.833v-533.335q0-27 19.833-46.833T279.999-880h533.335q27 0 46.833 19.833T880-813.334v533.335q0 27-19.833 46.833t-46.833 19.833H279.999Zm0-66.666h533.335v-533.335H279.999v533.335ZM146.666-80q-27 0-46.833-19.833T80-146.666v-600.001h66.666v600.001h600.001V-80H146.666Zm133.333-733.334v533.335-533.335Z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="45"
              viewBox="0 -960 960 960"
              width="45"
              fill="#6b7280"
              className="relative top-1"
            >
              <path d="M450.001-402.003v147.387q0 12.768 8.615 21.384 8.615 8.615 21.384 8.615t21.384-8.615q8.615-8.616 8.615-21.384v-147.387l52.925 52.925q4.461 4.461 10.038 6.692t11.153 1.923q5.577-.308 11.039-2.538 5.461-2.231 9.922-6.693 8.693-9.307 9-21.076.308-11.769-9-21.076l-99.769-99.769q-5.615-5.616-11.846-7.923-6.23-2.308-13.461-2.308t-13.461 2.308q-6.231 2.307-11.846 7.923l-99.769 99.769q-8.923 8.922-8.808 20.884.115 11.961 9.423 21.268 9.307 8.693 21.076 9 11.769.308 21.077-9l52.309-52.309ZM252.309-100.001q-30.308 0-51.308-21t-21-51.308v-615.382q0-30.308 21-51.308t51.308-21h287.769q14.461 0 27.807 5.616 13.346 5.615 23.193 15.461l167.844 167.844q9.846 9.847 15.461 23.193 5.616 13.346 5.616 27.807v447.769q0 30.308-21 51.308t-51.308 21H252.309Zm287.692-556.154V-800H252.309q-4.616 0-8.463 3.846-3.846 3.847-3.846 8.463v615.382q0 4.616 3.846 8.463 3.847 3.846 8.463 3.846h455.382q4.616 0 8.463-3.846 3.846-3.847 3.846-8.463v-447.692H576.155q-15.461 0-25.807-10.347-10.347-10.346-10.347-25.807ZM240-800v179.999V-800v640V-800Z" />
            </svg>
          )}

          <p className="mt-5 mb-1 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-500">{guideMsg}</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {fileNameList[0] && (type === 'pdf' || type === 'code') ? (
              <p className="text-gray-500 flex">
                선택된 파일:
                <pre className="text-blue-500 font-bold">
                  {' '}
                  {fileNameList[0]}
                </pre>
              </p>
            ) : null}
          </p>
        </div>
        <input
          {...getInputProps()}
          id="dropzone-file"
          type="file"
          accept={type}
          className="hidden"
        />
      </label>

      {isFileUploaded ? (
        type === 'pdf' ? (
          <PDFViewer pdfFileURL={fileList[0]?.url} pdfScale={pdfScale} />
        ) : type === 'inOut' ? (
          getInAndOutFilePairs(fileList).map((pair, index) => (
            <div
              key={index}
              className="flex justify-between border border-gray-400 rounded-[0.25rem] w-full px-2 py-2"
            >
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="25"
                  viewBox="0 -960 960 960"
                  width="25"
                  fill="#6b7280"
                >
                  <path d="M226.666-80q-27 0-46.833-19.833T160-146.666v-666.668q0-27 19.833-46.833T226.666-880H574l226 226v507.334q0 27-19.833 46.833T733.334-80H226.666Zm314.001-542.667v-190.667H226.666v666.668h506.668v-476.001H540.667ZM226.666-813.334v190.667-190.667 666.668-666.668Z" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-gray-600">{pair.inFile.filename}</span>
                  <span className="text-gray-600">{pair.outFile.filename}</span>
                </div>
              </div>
              <button
                className="mr-1"
                onClick={(e) => handleDeletePair(e, pair)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="30"
                  viewBox="0 -960 960 960"
                  width="30"
                  fill="#6b7280"
                >
                  <path d="M480-444.616 270.307-234.924q-7.23 7.231-17.499 7.423-10.269.193-17.884-7.423-7.616-7.615-7.616-17.691 0-10.077 7.616-17.692L444.616-480 234.924-689.693q-7.231-7.23-7.423-17.499-.193-10.269 7.423-17.884 7.615-7.616 17.691-7.616 10.077 0 17.692 7.616L480-515.384l209.693-209.692q7.23-7.231 17.499-7.423 10.269-.193 17.884 7.423 7.616 7.615 7.616 17.691 0 10.077-7.616 17.692L515.384-480l209.692 209.693q7.231 7.23 7.423 17.499.193 10.269-7.423 17.884-7.615 7.616-17.691 7.616-10.077 0-17.692-7.616L480-444.616Z" />
                </svg>
              </button>
            </div>
          ))
        ) : (
          fileList.map((file, index) => (
            <div
              key={index}
              className="flex justify-between border border-gray-400 rounded-[0.25rem] w-full px-2 py-2"
            >
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="25"
                  viewBox="0 -960 960 960"
                  width="25"
                  fill="#6b7280"
                >
                  <path d="M226.666-80q-27 0-46.833-19.833T160-146.666v-666.668q0-27 19.833-46.833T226.666-880H574l226 226v507.334q0 27-19.833 46.833T733.334-80H226.666Zm314.001-542.667v-190.667H226.666v666.668h506.668v-476.001H540.667ZM226.666-813.334v190.667-190.667 666.668-666.668Z" />
                </svg>
                <span className="text-gray-600">{file.filename}</span>
              </div>
              <button
                className="mr-1"
                onClick={(e) => handleDeleteExampleFile(e, file)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="30"
                  viewBox="0 -960 960 960"
                  width="30"
                  fill="#6b7280"
                >
                  <path d="M480-444.616 270.307-234.924q-7.23 7.231-17.499 7.423-10.269.193-17.884-7.423-7.616-7.615-7.616-17.691 0-10.077 7.616-17.692L444.616-480 234.924-689.693q-7.231-7.23-7.423-17.499-.193-10.269 7.423-17.884 7.615-7.616 17.691-7.616 10.077 0 17.692 7.616L480-515.384l209.693-209.692q7.23-7.231 17.499-7.423 10.269-.193 17.884 7.423 7.616 7.615 7.616 17.691 0 10.077-7.616 17.692L515.384-480l209.692 209.693q7.231 7.23 7.423 17.499.193 10.269-7.423 17.884-7.615 7.616-17.691 7.616-10.077 0-17.692-7.616L480-444.616Z" />
                </svg>
              </button>
            </div>
          ))
        )
      ) : null}
    </div>
  );
}

export default MyDropzone;
