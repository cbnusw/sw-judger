export interface SubmitInfo {
  parentId: {
    isPassword: boolean;
    problems: string[];
    applyingPeriod: null;
    contestants: string[];
    students: string[];
    _id: string;
    title: string;
    course: string;
    content: string;
    testPeriod: {
      start: string;
      end: string;
    };
    writer: {
      _id: string;
      name: string;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  parentType: string;
  result: {
    memory: number;
    time: number;
    type: string;
  };
  _id: string;
  problem: {
    parentId: string;
    parentType: string;
    published: null;
    score: number;
    _id: string;
    title: string;
    content: string;
    ioSet: Array<{
      inFile: string;
      outFile: string;
    }>;
    options: {
      maxRealTime: number;
      maxMemory: number;
    };
    writer: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
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

export interface SubmitCode {
  parentId?: string;
  parentType: string;
  problem: string;
  source: string;
  language: string;
}
