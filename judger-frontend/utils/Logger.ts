import { ToastInfoStore } from '@/store/ToastInfo';

export const Logger = {
  addToast: (type: string, message: string) => {
    if (typeof window !== 'undefined') {
      const addToast = ToastInfoStore.getState().addToast;
      addToast(type, message);
    }
  },
};
