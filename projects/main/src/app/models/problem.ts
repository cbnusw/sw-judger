import { IFile } from './file';
import { IUserInfo } from './user-info';
import { IAssignment } from './assignment';
import { IContest } from './contest';

export interface IProblemOptions {
  maxRealTime: number;
  maxMemory: number;
}

export interface IInputOutput {
  inFile: IFile;
  outFile: IFile;
}

export interface IProblem {
  _id?: string;
  title?: string;
  content?: string;
  parentType?: string;
  parentId?: string;
  published?: Date;
  ioSet?: Array<IInputOutput>;
  options?: IProblemOptions;
  score?: number;
  writer?: IUserInfo;
}
