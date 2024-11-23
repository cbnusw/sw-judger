export interface PracticeSubmitInfo {
  parentId: string | null;
  parentType: string;
  result: {
    memory: number;
    time: number;
    type: string;
  };
  _id: string;
  problem: string;
  source: string;
  language: string;
  user: string;
  createdAt: string;
  __v: number;
  code: string;
}
