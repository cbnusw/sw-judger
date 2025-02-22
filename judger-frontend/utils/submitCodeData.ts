import { SubmitCode } from '@/types/submit';

export const submitCodeData = async (
  parentId: string | null,
  parentType: string,
  problemId: string,
  uploadedFileUrl: string,
  language: string,
  submitCodeMutation: any,
  addToast: (type: string, message: string) => void,
): Promise<void> => {
  try {
    const submitCodeData: SubmitCode = {
      parentId,
      parentType,
      problem: problemId,
      source: uploadedFileUrl,
      language: language.toLowerCase(),
    };

    await submitCodeMutation.mutateAsync({ problemId, params: submitCodeData });
  } catch (error) {
    addToast('error', '코드 제출 중에 에러가 발생했어요');
    throw error;
  }
};
