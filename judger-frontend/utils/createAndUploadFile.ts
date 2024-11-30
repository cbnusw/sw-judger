import { UploadService } from '@/components/utils/uploadService';
import { getFileExtension } from './getFileExtension';

export const createAndUploadFile = async (
  code: string,
  language: string,
  uploadService: UploadService,
): Promise<string> => {
  try {
    const extension = getFileExtension(language);
    const fileName = `main${extension}`;
    const blob = new Blob([code.trim()], { type: 'text/plain' });
    const file = new File([blob], fileName, { type: 'text/plain' });

    const response = await uploadService.upload(file);
    return response.data.url; // 업로드된 파일의 URL 반환
  } catch (error) {
    throw new Error('파일 생성 및 업로드 실패');
  }
};
