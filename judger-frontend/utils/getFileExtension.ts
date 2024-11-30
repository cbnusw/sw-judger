export const getFileExtension = (language: string): string => {
  switch (language.toLowerCase()) {
    case 'c':
      return '.c';
    case 'c++':
      return '.cpp';
    case 'java':
      return '.java';
    case 'javascript':
      return '.js';
    case 'python2':
    case 'python3':
      return '.py';
    case 'kotlin':
      return '.kt';
    case 'go':
      return '.go';
    default:
      throw new Error('지원되지 않는 언어입니다.');
  }
};
