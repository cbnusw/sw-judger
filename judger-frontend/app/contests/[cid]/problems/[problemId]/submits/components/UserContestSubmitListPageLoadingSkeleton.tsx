export default function UserContestSubmitListPageLoadingSkeleton() {
  return (
    <div className="mt-6 mb-24 w-[21rem] xs:w-[90%] xl:w-[73%] mx-auto">
      <div className="flex flex-col pb-3">
        <div className="flex items-end gap-x-2">
          <div className="skeleton w-[13rem] h-[3rem]" />
          <div className="skeleton w-[22.5rem] h-[2rem]" />
        </div>
        <div className="mt-7 flex justify-end items-center gap-x-4">
          <div className="skeleton w-[18rem] h-[1.25rem]" />
          <div
            className="skeleton w-[5.5rem] h-[2.15rem] "
            style={{ borderRadius: '0.35rem' }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <div className="skeleton h-[2rem]" />
        <div className="skeleton h-[2.15rem]" />
        <div className="skeleton h-[2.15rem]" />
        <div className="skeleton h-[2.15rem]" />
        <div className="skeleton h-[2.15rem]" />
        <div className="skeleton h-[2.15rem]" />
      </div>
    </div>
  );
}
