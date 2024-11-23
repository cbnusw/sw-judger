export default function ExamListLoadingSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-y-2">
        <div className="skeleton h-[2rem]" />
        <div className="skeleton h-[2.15rem]" />
        <div className="skeleton h-[2.15rem]" />
        <div className="skeleton h-[2.15rem]" />
        <div className="skeleton h-[2.15rem]" />
        <div className="skeleton h-[2.15rem]" />
      </div>

      <div className="mt-3 flex justify-between">
        <div className="skeleton w-[5rem] h-[2rem]"></div>
        <div className="skeleton w-[8rem] h-[2rem]"></div>
      </div>
    </>
  );
}
