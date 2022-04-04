import { IUserInfo } from './user-info';
import { IPeriod } from './contest';
import { IProblem } from './problem';

export interface IAssignment {
  _id?: string;
  password?: string;
  course?: string;
  title?: string;
  content?: string;
  writer?: IUserInfo;
  problems?: Array<IProblem>;
  testPeriod: IPeriod;
  students?: Array<IUserInfo>;
  createdAt?: Date;
  updatedAt?: Date;
}
