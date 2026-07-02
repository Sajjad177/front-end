import { create } from "zustand";

export interface ToastNotification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
}

interface NotificationState {
  notifications: ToastNotification[];
  addNotification: (notification: Omit<ToastNotification, "id">) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (notification) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification = { ...notification, id };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    if (notification.duration !== 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, notification.duration || 4000);
    }
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearAll: () => set({ notifications: [] }),
}));

export const useNotifications = () => useNotificationStore((state) => state);
export const useActiveNotifications = () => useNotificationStore((state) => state.notifications);
export const useNotify = () => {
  const add = useNotificationStore((state) => state.addNotification);
  return {
    success: (msg: string) => add({ type: "success", message: msg }),
    error: (msg: string) => add({ type: "error", message: msg }),
    info: (msg: string) => add({ type: "info", message: msg }),
    warning: (msg: string) => add({ type: "warning", message: msg }),
  };
};
