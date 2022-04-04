import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'result'
})
export class ResultPipe implements PipeTransform {

  transform(value): string {
    switch (value) {
      case 'compile':
        return '컴파일 오류';
      case 'runtime':
        return '런타임 오류';
      case 'timeout':
        return '시간 초과';
      case 'memory':
        return '메모리 초과';
      case 'wrong':
        return '오답';
      case 'done':
        return '정답';
      default:
        return 'Unknown';
    }
  }

}
