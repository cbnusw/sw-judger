
const notOperatorRoles = [
  'staff',    // 교직원(충북대 소속만)
  'student',  // 학생(충북대 소속만)
  'member',   // 충북대 소속 외 회원
];

const operatorRoles = [
  'admin',
  'operator',
];

const roles = [
  ...operatorRoles,
  ...notOperatorRoles,
];

const permissions = [
  'Contest',
  'Assignment',
  'Problem',
  'all',
  'qna',
];

const fileTypes = [
  'Contest',
  'Assignment',
  'Problem',
  'Submit'
];

const universities = [
  "충북대학교",
  "한국교통대학교",
  "건국대학교",
  "서원대학교",
  "청주대학교",
  "공군사관학교",
];

const parentTypes = ['Contest', 'Assignment'];


const programmingLanguages = [
  'c',
  'c++',
  'java',
  'python2',
  'python3',
  'kotlin',
  'go',
  'javascript'
];

const submitResults = [
  'compile',
  'runtime',
  'timeout',
  'memory',
  'wrong',
  'done'
];

const centers = [
  '사업지원팀',
  'SW전공교육센터',
  'SW기초교육센터',
  'SW융합교육센터',
  'SW융합교육센터',
  'SW산학협력센터',
  '오픈소스SW센터'
];


exports.OPERATOR_ROLES = operatorRoles;
exports.NOT_OPERATOR_ROLES = notOperatorRoles;
exports.ROLES = roles;
exports.PERMISSIONS = permissions;
exports.CENTERS = centers;
exports.FILE_TYPES = fileTypes;
exports.PROGRAMMING_LANGUAGES = programmingLanguages;
exports.SUBMIT_RESULTS = submitResults;
exports.PARENT_TYPES = parentTypes;
exports.UNIVERSITIES = universities;
