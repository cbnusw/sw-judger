import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Toast {
  id: string;
  type: string;
  message: string;
}

export interface ToastInfoStoreState {
  toasts: Toast[];
  addToast: (type: string, message: string) => void;
  removeToast: (id: string) => void;
}

export const ToastInfoStore = create<ToastInfoStoreState>()(
  devtools((set, get) => ({
    toasts: [],
    addToast: (type: string, message: string) => {
      const id = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // 완전히 중복된 토스트도 포함해서 모두 생성
      set((state) => ({
        toasts: [{ id, type, message }, ...state.toasts],
      }));

      // 개별 토스트를 3초 후에 제거
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        }));
      }, 3000);
    },
    removeToast: (id: string) =>
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      })),
  })),
);
