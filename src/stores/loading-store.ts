import { create } from "zustand";

interface LoadingState {
  isLoading: boolean;
  loadingMessage: string | null;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  loadingMessage: null,
  startLoading: (message = "Loading...") => set({ isLoading: true, loadingMessage: message }),
  stopLoading: () => set({ isLoading: false, loadingMessage: null }),
}));

export const useLoading = () => useLoadingStore((state) => state);
export const useIsLoadingGlobal = () => useLoadingStore((state) => state.isLoading);
export const useLoadingMessageGlobal = () => useLoadingStore((state) => state.loadingMessage);
