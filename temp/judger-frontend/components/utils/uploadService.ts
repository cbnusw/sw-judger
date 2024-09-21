import { UploadedFileInfo } from '@/types/problem';
import axiosInstance from '@/utils/axiosInstance';

interface UploadResponse {
  uploaded: boolean;
  url: string;
  error: null | string;
  data: UploadedFileInfo;
}

export class UploadService {
  async upload(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('upload', file);

    const response = await axiosInstance.post<UploadResponse>(
      '/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  }
}
