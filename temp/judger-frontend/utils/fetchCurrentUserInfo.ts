import axiosInstance from './axiosInstance';

// (로그인 한) 사용자 정보 조회
export const fetchCurrentUserInfo = async (updateUserInfo: any) => {
  return axiosInstance.get('/auth/me').then((response) => {
    const resData = response.data.data;
    const { _id, no, name, email, university, department, phone, role } =
      resData;
    updateUserInfo({
      _id,
      no,
      name,
      email,
      university,
      department,
      role,
      phone,
      isAuth: true,
    });
    return { ...resData, isAuth: true };
  });
};
