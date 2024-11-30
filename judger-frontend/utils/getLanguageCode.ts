export function getLanguageCode(language: string): string {
  switch (language) {
    case 'c':
      return 'c';
    case 'c++':
      return 'cpp';
    case 'java':
      return 'java';
    case 'javascript':
      return 'javascript';
    case 'python2':
    case 'python3':
      return 'python';
    case 'kotlin':
      return 'kotlin';
    case 'go':
      return 'go';
    default:
      return '알 수 없음';
  }
}
