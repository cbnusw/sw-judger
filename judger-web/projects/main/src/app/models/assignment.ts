import { IUserInfo } from './user-info';
import { IFile } from './file';

export interface IAssignmentOptions {
  maxRealTime: number;
  maxMemory: number;
}

export interface IInputOutput {
  inFile: IFile;
  outFile: IFile;
}

export interface IAssignment {
  _id?: string;
  title?: string;
  course?: string;
  ioSet?: Array<IInputOutput>;
  deadline?: Date;
  writer?: IUserInfo;
}
