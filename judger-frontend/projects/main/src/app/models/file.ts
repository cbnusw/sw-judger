import { FILE_TYPES } from '../constants';
import { IUserInfo } from './user-info';

declare type TFileType = typeof FILE_TYPES[number];

export interface IFile {
  _id?: string;
  url?: string;
  filename?: string;
  mimetype?: string;
  size?: number;
  ref?: string;
  refModel?: TFileType;
  uploader?: IUserInfo;
  uploadedAt?: Date;
}
