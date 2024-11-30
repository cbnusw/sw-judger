export default function MyPagelayoutLoadingSkeleton() {
  return (
    <div className="mt-6 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[60rem] mx-auto">
        <div className="text-3xl font-semibold tracking-wide lift-up">
          마이페이지
        </div>
        <div className="flex gap-8 mt-10">
          <div className="w-52">
            <div className="flex flex-col items-start gap-[1.125rem] font-semibold tracking-wide">
              <div>프로필 정보</div>
              <div>참가 내역</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
