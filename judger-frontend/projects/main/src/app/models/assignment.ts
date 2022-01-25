import { IUserInfo } from './user-info';
import { IPeriod } from './contest';
import { IProblem } from './problem';

export interface IAssignment {
  _id?: string;
  course?: string;
  title?: string;
  content?: string;
  writer?: IUserInfo;
  problems?: Array<IProblem>;
  testPeriod: IPeriod;
  contestants?: Array<IUserInfo>;
  createdAt?: Date;
  updatedAt?: Date;
}
