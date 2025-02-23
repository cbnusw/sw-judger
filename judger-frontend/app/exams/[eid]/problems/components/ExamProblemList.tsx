'use client';

import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
  DroppableProps,
} from 'react-beautiful-dnd';
import { useRouter } from 'next/navigation';
import EmptyExamProblemListItem from './EmptyExamProblemListItem';
import { ProblemInfo } from '@/types/problem';

interface ExamProblemListProps {
  eid: string;
  isChagingExamProblemOrderActivate: boolean;
  problemsInfo: ProblemInfo[];
  setProblemsInfo: (problemsInfo: ProblemInfo[]) => void;
}

// Droppable을 감싸는 커스텀 컴포넌트
const CustomDroppable: React.FC<DroppableProps> = ({
  children,
  droppableId = 'defaultDroppableId',
  ...props
}) => {
  return (
    <Droppable droppableId={droppableId} {...props}>
      {(provided, snapshot) => (
        <>
          {children(provided, snapshot)}
          {provided.placeholder}
        </>
      )}
    </Droppable>
  );
};

export default function ExamProblemList({
  eid,
  isChagingExamProblemOrderActivate,
  problemsInfo,
  setProblemsInfo,
}: ExamProblemListProps) {
  const router = useRouter();

  const handleChange = (result: DropResult) => {
    if (!result.destination) return;
    const items = [...problemsInfo];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setProblemsInfo(items);
  };

  const handleGoToExamProblem = (id: string) => {
    router.push(`/exams/${eid}/problems/${id}`);
  };

  if (problemsInfo.length === 0) return <EmptyExamProblemListItem />;

  return (
    <div className="mb-14">
      {/* 드래그 영역 */}
      <DragDropContext onDragEnd={handleChange}>
        {/* 드래그 놓을 수 있는 영역 */}
        <CustomDroppable droppableId="DropLand">
          {/* 드래그 Div 생성 */}
          {(provided, snapshot) => (
            // CCS가 적용된 Div
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-col gap-4"
            >
              {problemsInfo.map((problem, idx) => (
                <div key={problem._id} className="flex items-center gap-3">
                  <div className="w-full">
                    <Draggable draggableId={problem._id} index={idx}>
                      {(provided, snapshot) => (
                        <div
                          ref={
                            isChagingExamProblemOrderActivate
                              ? provided.innerRef
                              : null
                          }
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div
                            onClick={() => handleGoToExamProblem(problem._id)}
                            className="flex items-center gap-2 w-full px-3 py-[0.6rem] cursor-pointer bg-[#f2f4f6] hover:bg-[#d3d6da] rounded-[7px]"
                          >
                            {!isChagingExamProblemOrderActivate ? (
                              <span className="flex justify-center items-center font-semibold bg-[#8c95a0] text-[14px] text-white w-5 h-5 rounded-[7px]">
                                {String.fromCharCode('A'.charCodeAt(0) + idx)}
                              </span>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="20"
                                viewBox="0 -960 960 960"
                                width="20"
                                fill="#94989d"
                              >
                                <path d="M356-188.769q-22.308 0-36.769-15.462-14.462-15.461-14.462-35.769 0-22.308 14.462-36.769 14.461-14.462 36.769-14.462t36.769 14.462q14.462 14.461 14.462 36.769 0 20.308-14.462 35.769-14.461 15.462-36.769 15.462Zm248 0q-22.308 0-36.769-15.462-14.462-15.461-14.462-35.769 0-22.308 14.462-36.769 14.461-14.462 36.769-14.462t36.769 14.462q14.462 14.461 14.462 36.769 0 20.308-14.462 35.769-14.461 15.462-36.769 15.462Zm-248-240q-22.308 0-36.769-14.462-14.462-14.461-14.462-36.769t14.462-36.769q14.461-14.462 36.769-14.462t36.769 14.462q14.462 14.461 14.462 36.769t-14.462 36.769Q378.308-428.769 356-428.769Zm248 0q-22.308 0-36.769-14.462-14.462-14.461-14.462-36.769t14.462-36.769q14.461-14.462 36.769-14.462t36.769 14.462q14.462 14.461 14.462 36.769t-14.462 36.769Q626.308-428.769 604-428.769Zm-248-240q-22.308 0-36.769-14.462-14.462-14.461-14.462-36.769t14.462-36.769q14.461-14.462 36.769-14.462t36.769 14.462q14.462 14.461 14.462 36.769t-14.462 36.769Q378.308-668.769 356-668.769Zm248 0q-22.308 0-36.769-14.462-14.462-14.461-14.462-36.769t14.462-36.769q14.461-14.462 36.769-14.462t36.769 14.462q14.462 14.461 14.462 36.769t-14.462 36.769Q626.308-668.769 604-668.769Z" />
                              </svg>
                            )}
                            <span className="ml-1 font-bold">
                              {problem.title}
                            </span>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CustomDroppable>
      </DragDropContext>
    </div>
  );
}
