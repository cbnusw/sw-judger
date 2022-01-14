export const environment = {
  production: false,
  authHost: 'http://localhost:4003',
  apiHost: 'http://localhost:4003',
  apiVersion: 'v1',
  loginPageUrl: '/account/login',
  joinPageUrl: 'http://localhost:8080/account/join',
};

//   production: 프로덕션 버전에서는 environment.prod.ts 파일을 생성 후 true로 변경
//   authHost: 인증서버 주소
//   apiHost: API서버 주소
//   apiVersion: 'v1'
//   loginPageUrl: '/account/login'
//   joinPageUrl: 회원가입 페이지 리다이렉팅 주소
