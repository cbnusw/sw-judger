import Loading from '@/app/components/Loading';

export default function MyPagelayoutLoadingSkeleton() {
  return (
    <div className="mt-6 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[21rem] xs:w-[90%] xl:w-[60rem] mx-auto">
        <div className="text-2xl font-bold tracking-wide lift-up">
          마이페이지
        </div>
        <div className="flex gap-8 mt-10">
          <div className="w-52">
            <div className="w-full text-[#4e5968] text-[17px] flex flex-col items-start gap-y-2 font-medium tracking-wide">
              <button
                className={`text-inherit px-4 py-[0.8rem] rounded-[8px] w-full text-start bg-opacity-5'
                }`}
              >
                프로필 정보
              </button>
              <button
                className={`text-inherit px-4 py-[0.8rem] rounded-[8px] w-full text-start bg-opacity-5'
                }`}
              >
                참가 내역
              </button>
            </div>
          </div>

          <div className="h-[22.5rem] flex justify-center items-center ml-5 w-full">
            <Loading />
          </div>
        </div>
      </div>
    </div>
  );
}
