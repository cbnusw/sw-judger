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
  devtools((set) => ({
    toasts: [],
    addToast: (type: string, message: string) =>
      set((state) => ({
        toasts: [{ id: Date.now().toString(), type, message }, ...state.toasts],
      })),
    removeToast: (id: string) =>
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      })),
  })),
);
