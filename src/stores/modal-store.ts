import { create } from "zustand";

export type ModalType = "deleteUser" | "billingUpgrade" | "editProfile" | "settingsConfirmation" | null;

interface ModalData {
  userId?: string;
  email?: string;
  callback?: () => void;
}

interface ModalState {
  type: ModalType;
  isOpen: boolean;
  data: ModalData;
  openModal: (type: ModalType, data?: ModalData) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  openModal: (type, data = {}) => set({ type, isOpen: true, data }),
  closeModal: () => set({ type: null, isOpen: false, data: {} }),
}));

export const useModal = () => useModalStore((state) => state);
