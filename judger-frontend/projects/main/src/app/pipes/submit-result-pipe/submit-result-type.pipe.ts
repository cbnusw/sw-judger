import { Pipe, PipeTransform } from '@angular/core';
import { TSubmitResult } from '../../models/submit';

@Pipe({
  name: 'submitResultType'
})
export class SubmitResultTypePipe implements PipeTransform {

  transform(type: TSubmitResult): string {
    switch (type) {
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
