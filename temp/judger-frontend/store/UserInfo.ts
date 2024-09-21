import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { UserInfo } from '@/types/user';

export interface StoreState {
  userInfo: UserInfo;
}

const initialState = {
  no: '',
  name: '',
  email: '',
  university: '',
  department: '',
  phone: '',
  role: '',
  isAuth: false,
};

export const userInfoStore = create(
  devtools((set) => ({
    userInfo: initialState,
    updateUserInfo: (newUserInfo: UserInfo) =>
      set((state: StoreState) => ({
        userInfo: { ...state.userInfo, ...newUserInfo },
      })),
    removeUserInfo: () =>
      set(() => ({
        userInfo: initialState,
      })),
  })),
);
