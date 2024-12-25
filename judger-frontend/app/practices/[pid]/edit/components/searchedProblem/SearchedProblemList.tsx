'use client';

import React, { useRef, createRef } from 'react';
import SearchTagListItem from './SearchedProblemListItem';
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { ExampleFile, IoSetItem, ProblemInfo } from '@/types/problem';
import EmptySearchedProblemListItem from './EmptySearchedProblemListItem';

// 연관 검색 문제 정보 목록 조회 API
const fetchRelatedSearchedProblemInfos = async ({ queryKey }: any) => {
  const searchQuery = encodeURIComponent(queryKey[1]);
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/search?title=${searchQuery}`,
  );

  // 'parentTitle'이 null이 아닌 데이터만 필터링
  const filteredDocuments = response.data.data.documents.filter(
    (doc: ProblemInfo) =>
      doc.parentTitle !== null || doc.parentType === 'Practice',
  );

  return {
    ...response.data,
    data: { ...response.data.data, documents: filteredDocuments },
  };
};

interface SearchedProblemListProps {
  searchQuery: string;
  debouncedSearchQuery: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setMaxExeTime: React.Dispatch<React.SetStateAction<number>>;
  setMaxMemCap: React.Dispatch<React.SetStateAction<number>>;
  setUploadedProblemPdfFileUrl: React.Dispatch<React.SetStateAction<string>>;
  setIoSetData: React.Dispatch<React.SetStateAction<IoSetItem[]>>;
  setExampleFiles: React.Dispatch<React.SetStateAction<ExampleFile[]>>;
}

export default function SearchedProblemList(props: SearchedProblemListProps) {
  const {
    searchQuery,
    debouncedSearchQuery,
    setTitle,
    setMaxExeTime,
    setMaxMemCap,
    setUploadedProblemPdfFileUrl,
    setIoSetData,
    setExampleFiles,
  } = props;

  const { isPending, data } = useQuery({
    queryKey: [
      'relatedSearchTagInfosInPracticeProblemEdit',
      debouncedSearchQuery,
    ],
    queryFn: fetchRelatedSearchedProblemInfos,
    enabled: !!debouncedSearchQuery, // searchQuery 있을 때만 쿼리 활성화
  });

  const relatedSearchedProblemInfos: ProblemInfo[] = data?.data.documents;

  // 빈 배열로 초기화하여 안전하게 useRef 사용
  const itemRefs = useRef<React.RefObject<HTMLButtonElement>[]>(
    relatedSearchedProblemInfos?.map(() => createRef<HTMLButtonElement>()) ||
      [],
  );

  if (!searchQuery)
    return (
      <div className="w-full bg-white px-2 py-[0.4rem] rounded-md">
        <span className="text-[#b0b6bc] text-[0.825rem] font-extralight">
          문제명을 입력해 주세요
        </span>
      </div>
    );

  if (isPending || searchQuery !== debouncedSearchQuery)
    return (
      <div className="w-full bg-white hover:bg-[#f2f4f6] px-2 py-[0.4rem] rounded-md">
        <span className="text-[#888e96] text-[0.825rem] font-extralight">
          불러오고 있습니다...
        </span>
      </div>
    );

  if (
    !relatedSearchedProblemInfos ||
    !Array.isArray(relatedSearchedProblemInfos)
  ) {
    return <EmptySearchedProblemListItem />;
  }

  return (
    <div className="max-h-[26.25rem] overflow-y-auto">
      {relatedSearchedProblemInfos.length === 0 ? (
        <EmptySearchedProblemListItem />
      ) : (
        <>
          {relatedSearchedProblemInfos.map(
            (problemInfo: ProblemInfo, index: number) => (
              <SearchTagListItem
                problemInfo={problemInfo}
                key={index}
                ref={itemRefs.current[index]} // ref 전달
                setTitle={setTitle}
                setMaxExeTime={setMaxExeTime}
                setMaxMemCap={setMaxMemCap}
                setUploadedProblemPdfFileUrl={setUploadedProblemPdfFileUrl}
                setIoSetData={setIoSetData}
                setExampleFiles={setExampleFiles}
                className="search-result-item"
              />
            ),
          )}
        </>
      )}
    </div>
  );
}
