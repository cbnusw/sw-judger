export default function NoticeListLoadingSkeleton() {
  return (
    <>
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
    </>
  );
}
