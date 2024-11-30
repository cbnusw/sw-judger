export interface ExamInfo {
  problems: string[];
  students: {
    center: null;
    _id: string;
    no: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    university: string;
    position: null;
    role: string;
    joinedAt: string;
    updatedAt: string;
    __v: number;
    image?: null; // 옵셔널 필드 (일부 객체에만 존재)
  }[];
  _id: string;
  title: string;
  course: string;
  content: string;
  password: string;
  testPeriod: {
    start: string; // Date 타입으로 변환할 수도 있습니다.
    end: string; // Date 타입으로 변환할 수도 있습니다.
  };
  writer: {
    center?: any; // 'null'이거나 더 구체적인 타입이 필요할 수 있습니다.
    permissions: string[];
    _id: string;
    no: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    university: string;
    position: string;
    role: string;
    joinedAt: string; // Date 타입으로 변환할 수도 있습니다.
    updatedAt: string; // Date 타입으로 변환할 수도 있습니다.
    __v: number;
  };
  createdAt: string; // Date 타입으로 변환할 수도 있습니다.
  updatedAt: string; // Date 타입으로 변환할 수도 있습니다.
  __v: number;
}

export interface ExamEnrolledInfo {
  _id: string;
  title: string;
  course: string;
}

export interface ExamSubmitInfo {
  parentId: {
    _id: string;
    title: string;
  };
  parentType: string;
  result: {
    memory: number;
    time: number;
    type: string;
  };
  _id: string;
  problem: {
    _id: string;
    title: string;
  };
  source: string;
  language: string;
  user: {
    center: null;
    permissions: string[];
    _id: string;
    image: null;
    no: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    position: null;
    joinedAt: string;
    updatedAt: string;
    role: string;
    university: string;
    __v: number;
  };
  createdAt: string;
  __v: number;
  code: string;
}

// 시험 등록/수정 API 호출을 위한 인터페이스 정의
export interface RegisterExamParams {
  title: string;
  course: string;
  content: string;
  testPeriod: {
    start: string;
    end: string;
  };
  password: string;
}
