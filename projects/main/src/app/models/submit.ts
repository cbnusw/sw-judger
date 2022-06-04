import { PROGRAMMING_LANGUAGES, SUBMIT_RESULT } from '../constants';
import { IUserInfo } from './user-info';
import { IProblem } from './problem';

export declare type TProgrammingLanguage = typeof PROGRAMMING_LANGUAGES[number];
export declare type TSubmitResult = typeof SUBMIT_RESULT[number];

export interface ISubmitResult {
  type?: TSubmitResult;
  memory?: number;
  time?: number;
}

export interface ISubmit {
  _id?: string;
  problem?: IProblem;
  parentId?: string;
  parentType?: string;
  user?: IUserInfo;
  source?: string;
  language?: TProgrammingLanguage;
  result?: ISubmitResult;
  createdAt?: Date;
}
