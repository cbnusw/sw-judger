export default function UsersExamSubmitPageLoadingSkeleton() {
  return (
    <div className="mt-6 mb-24 w-[21rem] xs:w-[90%] xl:w-[72%] mx-auto">
      <div className="flex flex-col pb-3">
        <div className="flex items-center gap-x-2">
          <div className="skeleton w-[15rem] h-[3rem]" />
          <div
            className="skeleton w-[22.5rem] h-[2rem]"
            style={{ borderRadius: '9999px' }}
          />
        </div>
        <div className="mt-12 flex justify-between items-start gap-x-4">
          <div className="mt-[-0.75rem] w-full flex flex-col gap-y-2">
            <div
              className="skeleton w-1/2 h-[2.5rem]"
              style={{ borderRadius: '0.375rem' }}
            />
          </div>
          <div
            className="skeleton w-[10.5rem] h-[2.15rem] "
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

      <div className="mt-3">
        <div className="skeleton w-[15rem] h-[2rem]"></div>
      </div>
    </div>
  );
}
