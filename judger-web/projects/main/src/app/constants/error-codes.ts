const errors = {
  // 인증서버 오류
  INVALID_PASSWORD: '',     // 400 Error
  ACCESS_TOKEN_EXPIRED: '', // 401 Error
  USER_NOT_FOUND: '',       // 404 Error

  // 400 Errors
  AFTER_APPLYING_PERIOD: '',
  BEFORE_APPLYING_PERIOD: '',
  CONTEST_ENROLLED: '',
  FILE_NOT_UPLOADED: '',
  INVALID_PROBLEM_PUBLISH: '',
  IS_NOT_CONTESTANT: '',
  IS_NOT_TEST_PERIOD: '',
  FINISHED_CONTEST: '',
  PROGRESSING_CONTEST: '',
  YEAR_MONTH_REQUIRED: '',

  // 401 Errors
  LOGIN_REQUIRED: '',

  // 403 Errors
  FORBIDDEN: '',

  // 404 Errors
  CONTEST_NOT_FOUND: '',
  FILE_NOT_FOUND: '',
  NOT_FOUND: '',
  PROBLEM_NOT_FOUND: '',

  SERVER_ERROR: '',
};

Object.keys(errors).forEach(key => errors[key] = key);

export const ERROR_CODES = errors;
