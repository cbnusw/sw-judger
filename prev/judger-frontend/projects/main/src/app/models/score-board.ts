import { IContest } from './contest';
import { IProblem } from './problem';
import { IUserInfo } from './user-info';

export interface IScore {
  problem?: IProblem;
  right?: boolean;
  tries?: number;
  time?: number;
  score?: number;
}

export interface IScoreBoard {
  _id?: string;
  score?: number;
  penalty?: number;
  contest?: IContest;
  scores?: Array<IScore>;
  user?: IUserInfo;
  createdAt?: Date;
  updatedAt?: Date;
}
