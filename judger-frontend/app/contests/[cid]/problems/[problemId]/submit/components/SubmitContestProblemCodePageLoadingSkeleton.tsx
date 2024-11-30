export default function SubmitContestProblemCodePageLoadingSkeleton() {
  return (
    <div className="mt-6 mb-24 w-[21rem] xs:w-[90%] xl:w-[73%] mx-auto">
      <div className="flex flex-col pb-3 border-b border-gray-300">
        <div className="flex items-end gap-x-2">
          <div className="skeleton w-[13rem] h-[3rem]" />
          <div className="skeleton w-[22.5rem] h-[2rem]" />
        </div>
        <div className="mt-8 flex justify-between">
          <div className="flex gap-x-2 h-[1.25rem]">
            <div className="skeleton w-[4rem]" />
            <span className='hidden relative bottom-[0.055rem] font-thin before:content-["|"] 3md:block' />
            <div className="skeleton w-[6rem]" />
            <span className='hidden relative bottom-[0.055rem] font-thin before:content-["|"] 3md:block' />
            <div className="skeleton w-[8.5rem]" />
          </div>
          <div className="skeleton w-[17.5rem]" />
        </div>
      </div>

      <div className="mt-9">
        <div className="flex flex-col gap-y-2">
          <div className="skeleton w-1/2 h-[1.5rem]" />
          <div className="skeleton w-1/6 h-[0.5rem]" />
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-y-2">
        <div className="skeleton w-[7rem] h-[1.5rem]" />
        <div className="skeleton h-[10rem]" />
      </div>

      <div className="mt-10 flex justify-end gap-x-2">
        <div
          className="skeleton w-[3.5rem] h-[2.15rem] "
          style={{ borderRadius: '0.35rem' }}
        />
        <div
          className="skeleton w-[3.5rem] h-[2.15rem] "
          style={{ borderRadius: '0.35rem' }}
        />
      </div>
    </div>
  );
}
