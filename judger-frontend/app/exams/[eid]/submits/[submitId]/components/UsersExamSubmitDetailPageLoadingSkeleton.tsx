export default function UsersExamSubmitDetailPageLoadingSkeleton() {
  return (
    <div className="mt-6 mb-24 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[21rem] xs:w-[90%] xl:w-[60rem] mx-auto">
        <div className="flex justify-start gap-x-2 pb-3">
          <div className="skeleton w-[4rem] h-[1.25rem]" />
        </div>

        <div className="mt-3 skeleton h-[15rem] border-y border-[#e4e4e4] border-t-2 border-t-gray-400"></div>

        <div className="mt-12 flex flex-col gap-y-2">
          <div className="skeleton h-[2rem]" />
          <div className="skeleton h-[2.15rem]" />
        </div>
      </div>
    </div>
  );
}
