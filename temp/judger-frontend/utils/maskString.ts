// 문자열 마스킹 함수
export const maskString = (str: string, start: number, end: number) => {
  // 문자열 길이가 start보다 작거나 같은 경우, 전체를 마스킹 처리
  if (str.length <= start) {
    return '*'.repeat(str.length);
  }

  // end가 문자열 길이보다 크면, 문자열 길이로 조정
  end = Math.min(end, str.length);

  // 시작 부분, 치환 부분, 끝 부분으로 나누어 처리
  const startPart = str.slice(0, start);
  const maskedPart = '*'.repeat(end - start);
  const endPart = str.slice(end);

  // 합쳐서 반환
  return startPart + maskedPart + endPart;
};

export const maskEmail = (email: string) => {
  const [localPart, domainPart] = email.split('@');

  // 로컬 부분이 충분히 길지 않은 경우, 전체를 마스킹 처리
  if (localPart.length < 3) {
    return '*'.repeat(localPart.length) + '@' + domainPart;
  }

  // 첫 번째/두 번째 글자와 마지막 글자를 제외하고 나머지를 마스킹 처리
  const startPart = localPart.slice(0, 2);
  const maskedPart = '*'.repeat(localPart.length - 2);
  const endPart = localPart.slice(-1);

  return startPart + maskedPart + endPart + '@' + domainPart;
};
