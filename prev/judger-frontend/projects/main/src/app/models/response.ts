import { IFile } from './file';

export interface IUploadResponse {
  uploaded?: boolean;
  url?: string;
  error?: Error;
  data?: IFile;
}

export interface IListData<T> {
  total: number;
  page: number;
  limit: number;
  documents: Array<T>;
}

export interface IResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}

export interface IListResponse<T> extends IResponse<IListData<T>> {
}
