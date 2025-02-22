import ExamDetailContentLoadingSkeleton from './ExamDetailContentLoadingSkeleton';

export default function ExamDetailPageLoadingSkeleton() {
  return (
    <div className="mt-6 mb-24 w-[21rem] xs:w-[90%] xl:w-[72.5%] mx-auto">
      <div className="flex flex-col pb-3 border-b border-[#e5e8eb]">
        <div className="skeleton w-[30rem] h-[2rem]" />
        <div className="mt-8 flex justify-between">
          <div className="flex gap-x-2 h-[1.25rem]">
            <div className="skeleton w-[17.5rem]" />
            <span className='hidden relative bottom-[0.055rem] font-thin before:content-["|"] 3md:block' />
            <div className="skeleton w-[20rem]" />
          </div>
          <div className="skeleton w-[7.5rem]" />
        </div>
      </div>

      <div className="mt-8 border-b">
        <ExamDetailContentLoadingSkeleton />
      </div>
    </div>
  );
}
