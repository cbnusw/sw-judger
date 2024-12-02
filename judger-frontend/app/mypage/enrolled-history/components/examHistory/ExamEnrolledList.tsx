'use client';

import EmptyExamEnrolledListItem from './EmptyExamEnrolledListItem';
import ExamEnrolledListItem from './ExamEnrolledListItem';
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { ExamEnrolledInfo } from '@/types/exam';
import ExamEnrolledListLoadingSkeleton from './ExamEnrolledListLoadingSkeleton';

// 참가했던 시험 목록 반환 API
const fetchEnrolledExams = () => {
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/assignment/enroll/me`,
  );
};

export default function ExamEnrolledList() {
  const { isPending, data } = useQuery({
    queryKey: ['myEnrolledExams'],
    queryFn: fetchEnrolledExams,
  });

  const resData = data?.data.data;
  const numberOfItems = resData?.length;

  if (isPending) return <ExamEnrolledListLoadingSkeleton />;

  return (
    <div className="mx-auto mt-6 w-full">
      <div className="border relative overflow-hidden rounded-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100  text-center">
              <tr>
                <th scope="col" className="w-16 px-4 py-2">
                  번호
                </th>
                <th scope="col" className="px-4 py-2">
                  시험명
                </th>
                <th scope="col" className="px-4 py-2">
                  수업명
                </th>
              </tr>
            </thead>
            <tbody>
              {numberOfItems === 0 && <EmptyExamEnrolledListItem />}
              {resData?.map(
                (examEnrolledInfo: ExamEnrolledInfo, index: number) => (
                  <ExamEnrolledListItem
                    examEnrolledInfo={examEnrolledInfo}
                    total={numberOfItems}
                    index={index}
                    key={index}
                  />
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
