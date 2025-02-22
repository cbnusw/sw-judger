export default function ContestProblemListPageLoadingSkeleton() {
  return (
    <div className="mt-6 mb-24 w-[21rem] xs:w-[90%] xl:w-[72.5%] mx-auto">
      <div className="flex flex-col pb-3 border-b border-[#e5e8eb]">
        <div className="flex items-center gap-x-2">
          <div className="skeleton w-[10.5rem] h-[3rem]" />
          <div
            className="skeleton w-[22.5rem] h-[2rem]"
            style={{ borderRadius: '9999px' }}
          />
        </div>
        <div className="mt-6 flex justify-start">
          <div
            className="skeleton w-[5rem] h-[2.3rem] "
            style={{ borderRadius: '0.35rem' }}
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
