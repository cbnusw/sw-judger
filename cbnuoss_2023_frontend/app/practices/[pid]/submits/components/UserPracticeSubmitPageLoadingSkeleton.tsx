export default function UserPracticeSubmitPageLoadingSkeleton() {
  return (
    <div className="mt-6 mb-24 w-[21rem] xs:w-[90%] xl:w-[73%] mx-auto">
      <div className="flex flex-col pb-7">
        <div className="flex items-end gap-x-2">
          <div className="skeleton w-[13rem] h-[3rem]" />
          <div className="skeleton w-[22.5rem] h-[2rem]" />
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
