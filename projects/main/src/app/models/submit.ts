import { PROGRAMMING_LANGUAGES, SUBMIT_RESULT } from '../constants';
import { IUserInfo } from './user-info';

export declare type TProgrammingLanguage = typeof PROGRAMMING_LANGUAGES[number];
export declare type TSubmitResult = typeof SUBMIT_RESULT[number];

export interface ISubmitResult {
  type?: TSubmitResult;
  memory?: number;
  time?: number;
}

export interface ISubmit {
  _id?: string;
  contest?: string;
  problem?: string;
  parent?: string;
  parentType?: string;
  user?: IUserInfo;
  source?: string;
  language?: TProgrammingLanguage;
  result?: ISubmitResult;
  createdAt?: Date;
}
