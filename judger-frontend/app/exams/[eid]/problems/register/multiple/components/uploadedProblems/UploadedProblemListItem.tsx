import { ExampleFile, IoSetItem, RegisterProblemParams } from '@/types/problem';
import { UploadService } from '@/components/utils/uploadService';
import { useState, useCallback } from 'react';
import { Accept, useDropzone } from 'react-dropzone';

interface ContestContestantListItemProps {
  problemInfo: RegisterProblemParams;
  setUploadedProblemsInfo: React.Dispatch<
    React.SetStateAction<RegisterProblemParams[]>
  >;
  total: number;
  index: number;
}

export default function UploadedProblemListItem(
  props: ContestContestantListItemProps,
) {
  const { problemInfo, setUploadedProblemsInfo, index } = props;

  const [uploadService] = useState(new UploadService());

  const getAcceptTypes = (type: string): Accept => {
    switch (type) {
      case 'pdf':
        return { 'application/pdf': ['.pdf'] };
      case 'in/out':
        return { 'text/plain': ['.in', '.out'] };
      case 'exampleFile':
        return {
          'application/temp': [
            '.c',
            '.cpp',
            '.java',
            '.js',
            '.py',
            '.kt',
            '.go',
          ],
        };
      default:
        return {};
    }
  };

  const isMultipleFileAllowed = (fileType: string): boolean => {
    const multipleFileTypes = ['in/out', 'exampleFile'];
    return multipleFileTypes.includes(fileType);
  };

  const openFileContent = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      const text = await response.text();

      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>${filename}</title>
            </head>
            <body>
              <pre>${text}</pre>
            </body>
          </html>
        `);
        newWindow.document.close();
      } else {
        console.warn(
          'Failed to open new window. Please check popup blocker settings.',
        );
      }
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  const openUrlsInNewTabs = (items: IoSetItem[] | ExampleFile[]) => {
    if (items.length === 0) {
      console.warn('No items to open');
      return;
    }

    if ('url' in items[0]) {
      (items as ExampleFile[]).forEach((file) => {
        if (file.url) {
          openFileContent(file.url, file.filename);
        } else {
          console.warn('File URL is missing', file);
        }
      });
    } else if ('inFile' in items[0] && 'outFile' in items[0]) {
      (items as IoSetItem[]).forEach((io) => {
        openFileContent(io.inFile.url, io.inFile.filename);
        openFileContent(io.outFile.url, io.outFile.filename);
      });
    } else {
      console.error('Invalid input: Expected ExampleFile or IoSetItem array');
    }
  };

  const handleDrop = useCallback(
    async (acceptedFiles: File[], fileType: string) => {
      if (acceptedFiles.length === 0) return;

      try {
        if (fileType === 'in/out') {
          const fileGroups: { [key: string]: File[] } = {};
          acceptedFiles.forEach((file) => {
            const baseName = file.name.replace(/\.(in|out)$/, '');
            if (!fileGroups[baseName]) {
              fileGroups[baseName] = [];
            }
            fileGroups[baseName].push(file);
          });

          const ioSetPromises = Object.entries(fileGroups)
            .filter(
              ([_, files]) =>
                files.some((f) => f.name.endsWith('.in')) &&
                files.some((f) => f.name.endsWith('.out')),
            )
            .map(async ([_, files]) => {
              const inFile = files.find((f) => f.name.endsWith('.in'));
              const outFile = files.find((f) => f.name.endsWith('.out'));

              if (!inFile || !outFile) return null;

              const inFileResponse = await uploadService.upload(inFile);
              const outFileResponse = await uploadService.upload(outFile);

              return {
                inFile: { ...inFileResponse.data, filename: inFile.name },
                outFile: { ...outFileResponse.data, filename: outFile.name },
              } as IoSetItem;
            });

          const validIoSets = (await Promise.all(ioSetPromises)).filter(
            Boolean,
          ) as IoSetItem[];

          setUploadedProblemsInfo((prev) => {
            const updatedProblems = [...prev];
            const updatedProblem = { ...updatedProblems[index] };
            updatedProblem.ioSet = [
              ...(updatedProblem.ioSet || []),
              ...validIoSets,
            ];
            updatedProblems[index] = updatedProblem;
            return updatedProblems;
          });
        } else if (fileType === 'pdf') {
          const file = acceptedFiles[0];
          const response = await uploadService.upload(file);

          setUploadedProblemsInfo((prev) => {
            const updatedProblems = [...prev];
            const updatedProblem = { ...updatedProblems[index] };

            updatedProblem.content = response.data.url;

            updatedProblems[index] = updatedProblem;
            return updatedProblems;
          });
        } else if (fileType === 'exampleFile') {
          const exampleFilePromises = acceptedFiles.map(async (file) => {
            const response = await uploadService.upload(file);

            return {
              ref: response.data.ref,
              _id: response.data._id,
              filename: file.name,
              url: response.data.url,
            } as ExampleFile;
          });

          const uploadedFiles = await Promise.all(exampleFilePromises);

          setUploadedProblemsInfo((prev) => {
            const updatedProblems = [...prev];
            const updatedProblem = { ...updatedProblems[index] };

            updatedProblem.exampleFiles = [
              ...(updatedProblem.exampleFiles || []),
              ...uploadedFiles,
            ];

            updatedProblems[index] = updatedProblem;
            return updatedProblems;
          });
        }
      } catch (error) {
        console.error(`${fileType} 파일 업로드 실패:`, error);
      }
    },
    [uploadService, setUploadedProblemsInfo, index],
  );

  // 미리 모든 파일 타입의 Dropzone 설정을 생성
  const dropzones = {
    pdf: useDropzone({
      onDrop: (acceptedFiles) => handleDrop(acceptedFiles, 'pdf'),
      accept: getAcceptTypes('pdf'),
      multiple: isMultipleFileAllowed('pdf'),
    }),
    inOut: useDropzone({
      onDrop: (acceptedFiles) => handleDrop(acceptedFiles, 'in/out'),
      accept: getAcceptTypes('in/out'),
      multiple: isMultipleFileAllowed('in/out'),
    }),
    exampleFile: useDropzone({
      onDrop: (acceptedFiles) => handleDrop(acceptedFiles, 'exampleFile'),
      accept: getAcceptTypes('exampleFile'),
      multiple: isMultipleFileAllowed('exampleFile'),
    }),
  };

  return (
    <tr className="h-[3rem] border-b-[1.25px] border-[#d1d6db] text-[15px] text-center">
      <th
        scope="row"
        className="px-4 py-2 font-normal text-[#4e5968] whitespace-nowrap dark:text-white"
      >
        {index + 1}
      </th>
      <td scope="row" className="text-[#4e5968]">
        {problemInfo.title}
      </td>
      <td className="text-[#4e5968]">{problemInfo.options.maxRealTime}</td>
      <td className="text-[#4e5968]">{problemInfo.options.maxMemory}</td>
      <td className="text-[#4e5968]">{problemInfo.score}</td>
      <td
        onClick={() => {
          ('pdf');
        }}
      >
        {problemInfo.content ? (
          <a
            target="_blank"
            href={problemInfo.content}
            className="inline-block text-[0.8rem] text-[#487fee] bg-[#e8f3ff] px-3 py-[0.4rem] rounded-[6px] font-medium cursor-pointer hover:bg-[#cee1fc]"
          >
            보기
          </a>
        ) : (
          <label
            {...dropzones.pdf.getRootProps()}
            className="inline-block text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-3 py-[0.4rem] rounded-[6px] font-medium hover:bg-[#d3d6da] cursor-pointer"
          >
            등록
          </label>
        )}
      </td>
      <td>
        {problemInfo.ioSet.length === 0 ? (
          <label
            {...dropzones.inOut.getRootProps()}
            className="inline-block text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-3 py-[0.4rem] rounded-[6px] font-medium hover:bg-[#d3d6da] cursor-pointer"
          >
            등록
          </label>
        ) : (
          <button
            onClick={() => openUrlsInNewTabs(problemInfo.ioSet)}
            className="inline-block text-[0.8rem] text-[#487fee] bg-[#e8f3ff] px-3 py-[0.4rem] rounded-[6px] font-medium cursor-pointer hover:bg-[#cee1fc]"
          >
            보기
          </button>
        )}
      </td>
      <td>
        {problemInfo.exampleFiles?.length ? (
          <button
            onClick={() => openUrlsInNewTabs(problemInfo.exampleFiles || [])}
            className="inline-block text-[0.8rem] text-[#487fee] bg-[#e8f3ff] px-3 py-[0.4rem] rounded-[6px] font-medium cursor-pointer hover:bg-[#cee1fc]"
          >
            보기
          </button>
        ) : (
          <label
            {...dropzones.exampleFile.getRootProps()}
            className="inline-block text-[0.8rem] text-[#4e5968] bg-[#f2f4f6] px-3 py-[0.4rem] rounded-[6px] font-medium hover:bg-[#d3d6da] cursor-pointer"
          >
            등록
          </label>
        )}
      </td>
    </tr>
  );
}
