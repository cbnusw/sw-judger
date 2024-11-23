import ContestProblemDetailPdfLoadingSkeleton from './ContestProblemDetailPdfLoadingSkeleton';

export default function ContestProblemDetailPageLoadingSkeleton() {
  return (
    <div className="mt-6 mb-24 w-[21rem] xs:w-[90%] xl:w-[72.5%] mx-auto">
      <div className="flex flex-col pb-3 border-b border-gray-300">
        <div className="skeleton w-[15rem] h-[2rem]" />
        <div className="mt-8 flex justify-between">
          <div className="flex gap-x-2 h-[1.25rem]">
            <div className="skeleton w-[4rem]" />
            <span className='hidden relative bottom-[0.055rem] font-thin before:content-["|"] 3md:block' />
            <div className="skeleton w-[6rem]" />
            <span className='hidden relative bottom-[0.055rem] font-thin before:content-["|"] 3md:block' />
            <div className="skeleton w-[7.5rem]" />
          </div>
          <div className="skeleton w-[17.5rem]" />
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-x-2 mb-[9rem]">
        <div
          className="skeleton w-[5.75rem] h-[2.15rem] "
          style={{ borderRadius: '0.35rem' }}
        />
        <div
          className="skeleton w-[5.75rem] h-[2.15rem] "
          style={{ borderRadius: '0.35rem' }}
        />
        <div
          className="skeleton w-[5.75rem] h-[2.15rem] "
          style={{ borderRadius: '0.35rem' }}
        />
      </div>

      <ContestProblemDetailPdfLoadingSkeleton />
    </div>
  );
}
