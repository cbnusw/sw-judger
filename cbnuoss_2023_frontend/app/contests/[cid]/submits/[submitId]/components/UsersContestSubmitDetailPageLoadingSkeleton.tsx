export default function UsersContestSubmitDetailPageLoadingSkeleton() {
  return (
    <div className="mt-6 mb-24 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[60rem] mx-auto">
        <div className="flex justify-end gap-x-2 pb-3">
          <div
            className="skeleton w-[6rem] h-[2.15rem] "
            style={{ borderRadius: '0.35rem' }}
          />
        </div>
        <div className="skeleton h-[15rem] border-y border-[#e4e4e4] border-t-2 border-t-gray-400"></div>

        <div className="mt-12 flex flex-col gap-y-2">
          <div className="skeleton h-[2rem]" />
          <div className="skeleton h-[2.15rem]" />
        </div>
      </div>
    </div>
  );
}
