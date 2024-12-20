export default function ExamProblemListPageLoadingSkeleton() {
  return (
    <div className="mt-6 mb-24 w-[21rem] xs:w-[90%] xl:w-[72.5%] mx-auto">
      <div className="flex flex-col pb-[4.6rem] border-b border-gray-300">
        <div className="flex items-center gap-x-2">
          <div className="skeleton w-[10.5rem] h-[3rem]" />
          <div
            className="skeleton w-[22.5rem] h-[2rem]"
            style={{ borderRadius: '9999px' }}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-y-4">
        <div className="skeleton h-[2.625rem]" />
        <div className="skeleton h-[2.625rem]" />
        <div className="skeleton h-[2.625rem]" />
        <div className="skeleton h-[2.625rem]" />
        <div className="skeleton h-[2.625rem]" />
      </div>
    </div>
  );
}
