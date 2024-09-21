import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const mypageTabNameStore = create(
  devtools((set) => ({
    tabName: '',
    updateTabName: (newTabName: string) =>
      set(() => ({
        tabName: newTabName,
      })),
  })),
);
