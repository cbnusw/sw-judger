'use client';

import EmptyContestProblemListItem from './EmptyContestProblemListItem';
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from 'react-beautiful-dnd';
import { useRouter } from 'next/navigation';
import { ProblemInfo } from '@/types/problem';

interface ContestProblemListProps {
  cid: string;
  isChagingContestProblemOrderActivate: boolean;
  problemsInfo: ProblemInfo[];
  setProblemsInfo: (problemsInfo: ProblemInfo[]) => void;
}

export default function ContestProblemList({
  cid,
  isChagingContestProblemOrderActivate,
  problemsInfo,
  setProblemsInfo,
}: ContestProblemListProps) {
  const router = useRouter();

  const handleChangeProblemOrder = (result: DropResult) => {
    if (!result.destination) return;
    const items = [...problemsInfo];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setProblemsInfo(items);
  };

  const handleGoToContestProblem = (id: string) => {
    router.push(`/contests/${cid}/problems/${id}`);
  };

  if (problemsInfo.length === 0) return <EmptyContestProblemListItem />;

  return (
    <div className="mb-14">
      {/* 드래그 영역 */}
      <DragDropContext onDragEnd={handleChangeProblemOrder}>
        {/* 드래그 놓을 수 있는 영역 */}
        <Droppable droppableId="DropLand">
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
                            isChagingContestProblemOrderActivate
                              ? provided.innerRef
                              : null
                          }
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div
                            onClick={() =>
                              handleGoToContestProblem(problem._id)
                            }
                            className="flex items-center gap-2 w-full border p-2 cursor-pointer hover:bg-gray-50 focus:bg-gray-50 rounded-sm shadow-sm"
                          >
                            {!isChagingContestProblemOrderActivate ? (
                              <span className="text-base text-[#333]">
                                {String.fromCharCode('A'.charCodeAt(0) + idx)}
                                <span className="text-gray-500">{')'}</span>
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
                            <span className="ml-1 text-[#0076C0] hover:underline focus:underline">
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
        </Droppable>
      </DragDropContext>
    </div>
  );
}
