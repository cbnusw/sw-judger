export interface NoticeInfo {
  _id: string;
  title: string;
  content: string;
  writer: {
    _id: string;
    name: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// 공지사항 등록/수정 API 호출을 위한 인터페이스 정의
export interface CreateNoticeParams {
  title: string;
  content: string;
}
