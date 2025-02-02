export function formatDateToYYMMDDHHMMSS(dateString: string): string {
  // Date 객체 생성
  const date = new Date(dateString);

  // 연도, 월, 일, 시간, 분을 추출
  const year = date.getFullYear().toString().slice(-2);
  const month = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더함
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // 각 부분을 두 자리 문자열로 변환 (예: '01', '02', ...)
  const monthStr = month.toString().padStart(2, '0');
  const dayStr = day.toString().padStart(2, '0');
  const hoursStr = hours.toString().padStart(2, '0');
  const minutesStr = minutes.toString().padStart(2, '0');
  const secondsStr = seconds.toString().padStart(2, '0');

  // 최종 형식으로 문자열 구성
  return `${year}/${monthStr}/${dayStr} ${hoursStr}:${minutesStr}:${secondsStr}`;
}

export function formatDateToYYMMDDHHMM(dateString: string): string {
  // Date 객체 생성
  const date = new Date(dateString);

  // 연도, 월, 일, 시간, 분을 추출
  const year = date.getFullYear().toString().slice(-2);
  const month = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더함
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // 각 부분을 두 자리 문자열로 변환 (예: '01', '02', ...)
  const monthStr = month.toString().padStart(2, '0');
  const dayStr = day.toString().padStart(2, '0');
  const hoursStr = hours.toString().padStart(2, '0');
  const minutesStr = minutes.toString().padStart(2, '0');

  // 최종 형식으로 문자열 구성
  return `${year}/${monthStr}/${dayStr} ${hoursStr}:${minutesStr}`;
}

export function formatDateToYYMMDD(dateString: string): string {
  // Date 객체 생성
  const date = new Date(dateString);

  // 연도, 월, 일을 추출
  const year = date.getFullYear().toString().slice(-2); // 연도의 마지막 두 자리
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth()는 0부터 시작하므로 1을 더함
  const day = date.getDate().toString().padStart(2, '0');

  // 'YY/MM/DD' 형식으로 문자열 구성
  return `${year}/${month}/${day}`;
}

export function formatDateToYYMMDDWithDot(dateString: string): string {
  // Date 객체 생성
  const date = new Date(dateString);

  // 연도, 월, 일을 추출
  const year = date.getFullYear().toString(); // 연도의 마지막 두 자리
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth()는 0부터 시작하므로 1을 더함
  const day = date.getDate().toString().padStart(2, '0');

  // 'YY/MM/DD' 형식으로 문자열 구성
  return `${year}. ${month}. ${day}`;
}

export interface TimeDifference {
  isPast: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const toUTCString = (localDateTime: string) => {
  const localDate = new Date(localDateTime);
  return localDate.toISOString();
};

// UTC 시간을 사용자의 지역 시간으로 변환하는 함수
export const convertUTCToLocalDateTime = (utcDateTimeString: string) => {
  const date = new Date(utcDateTimeString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
