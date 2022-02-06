const httpErrors = require('http-errors');

const createError = err => {
  const e = httpErrors(err[0], err[1]);
  e.code = err[2];
  return e;
};

const errors = {
  // 400 Errors
  AFTER_APPLYING_PERIOD: [400, '신청기간이 지났습니다'],
  BEFORE_APPLYING_PERIOD: [400, '아직 신청기간이 아닙니다.'],
  AFTER_TEST_START: [400, '대회 시작 시간이 지났습니다.'],
  CONTEST_ENROLLED: [400, '이미 신청한 대회입니다.'],
  ASSIGNMENT_ENROLLED: [400, '이미 할당된 과제입니다.'],
  FILE_NOT_UPLOADED: [400, '파일 업로드에 실패했습니다.'],
  INVALID_PROBLEM_PUBLISH: [400, '잘못된 문제 공개 날짜입니다.'],
  IS_NOT_CONTEST_PROBLEM: [400, '대회의 문제가 아닙니다.'],
  IS_NOT_ASSIGNMENT_PROBLEM: [400, '과제의 문제가 아닙니다.'],
  IS_NOT_CONTESTANT: [400, '대회 참가자가 아닙니다.'],
  IS_NOT_TEST_PERIOD: [400, '대회 시간이 아닙니다.'],
  FINISHED_CONTEST: [400, '이미 종료된 테스트입니다.'],
  PROGRESSING_CONTEST: [400, '진행 중인 테스트입니다.'],
  YEAR_MONTH_REQUIRED: [400, '연월 정보가 필요합니다.'],
  ENDED_ASSIGNMENT: [400, '이미 마감된 과제입니다.'],
  // 401 Errors
  LOGIN_REQUIRED: [401, '로그인이 필요합니다.'],

  // 403 Errors
  FORBIDDEN: [403, '권한이 없는 요청입니다.'],

  // 404 Errors
  CONTEST_NOT_FOUND: [404, '찾을 수 없는 대회입니다.'],
  ASSIGNMENT_NOT_FOUND: [404, '찾을 수 없는 과제입니다.'],
  FILE_NOT_FOUND: [404, '찾을 수 없는 파일입니다.'],
  NOT_FOUND: [404, '찾을 수 없는 요청입니다.'],
  PROBLEM_NOT_FOUND: [404, '찾을 수 없는 문제입니다.'],
  SUBMIT_NOT_FOUND: [404, '찾을 수 없는 채점결과입니다.'],
  SERVER_ERROR: [500, '서버 에러.'],
};

Object.keys(errors).forEach(key => {
  errors[key] = createError([...errors[key], key]);
});

module.exports = errors;
