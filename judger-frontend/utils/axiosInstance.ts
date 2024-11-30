import axios from 'axios';
import { Logger } from './Logger';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access-token');
    if (accessToken) config.headers['x-access-token'] = accessToken;
    return config;
  },
  (error) => {
    // 요청 에러 처리
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    // 응답 데이터를 처리
    return response;
  },
  (error) => {
    // 응답 에러 처리
    if (error.response) {
      switch (error.response.status) {
        case 400:
          switch (error.response.data.code) {
            case 'IS_NOT_CONTESTANT':
              alert('대상자가 아닙니다.');
              if (typeof window !== 'undefined') window.history.back();
              return;
            case 'IS_NOT_TEST_PERIOD':
              alert('진행 시간이 아닙니다.');
              if (typeof window !== 'undefined') window.history.back();
              return;
          }
          break;
        case 401:
          // 401 Unauthorized 에러 처리
          localStorage.removeItem('access-token');
          localStorage.removeItem('refresh-token');
          localStorage.removeItem('activeAuthorization');
          if (typeof window !== 'undefined') window.location.href = '/login';
          break;
        case 403:
          switch (error.response.data.code) {
            case 'FORBIDDEN':
              alert('권한이 없는 요청이에요.');
              if (typeof window !== 'undefined') window.history.back();
              return;
          }
          break;
        case 404:
          switch (error.response.data.code) {
            case 'CONTEST_NOT_FOUND':
            case 'ASSIGNMENT_NOT_FOUND':
            case 'PROBLEM_NOT_FOUND':
            case 'ERR_BAD_REQUEST':
              alert('존재하지 않는 게시글이에요.');
              if (typeof window !== 'undefined') window.history.back();
              return;
          }
          break;
        case 500:
          // 500 Internal Server Error 에러 처리
          Logger.addToast('error', '서버에 오류가 발생했어요.');
          break;
        default:
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
