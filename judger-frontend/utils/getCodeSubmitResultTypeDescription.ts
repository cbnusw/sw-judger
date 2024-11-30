export function getCodeSubmitResultTypeDescription(resultType: string): string {
  switch (resultType) {
    case 'compile':
      return '컴파일 에러';
    case 'runtime':
      return '런타임 에러';
    case 'timeout':
      return '시간 초과';
    case 'memory':
      return '메모리 초과';
    case 'wrong':
      return '오답';
    case 'done':
      return '정답';
    default:
      return '알 수 없음';
  }
}

export function getCodeSubmitResultTypeColor(resultType: string): string {
  switch (resultType) {
    case 'compile':
      return 'text-[#0f4c81]';
    case 'runtime':
      return 'text-[#5c4c87]';
    case 'timeout':
    case 'memory':
      return 'text-[#fa7268]';
    case 'wrong':
      return 'text-[#dd4124]';
    case 'done':
      return 'text-[#009874]';
    default:
      alert('Error: unknown [resultType]');
      return 'X';
  }
}

import { Languages } from '@/utils/CodeMirrorExtensionsImport';
const { cpp, java, javascript, python, go } = Languages;

export function getCodeExtension(language: string) {
  switch (language) {
    case 'C':
    case 'C++':
      return [cpp()];
    case 'Java':
    case 'Kotlin':
      return [java()];
    case 'JavaScript':
      return [javascript()];
    case 'Python2':
    case 'Python3':
      return [python()];
    case 'Go':
      return [go()];
    default:
      return [];
  }
}
