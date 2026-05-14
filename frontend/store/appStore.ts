// frontend/store/appStore.ts

import { create } from "zustand";

type Notification = {
  id: string;
  title: string;
  message: string;
  type:
    | "success"
    | "warning"
    | "danger"
    | "info";
  createdAt: string;
};

type AppState = {
  // GLOBAL UI
  sidebarCollapsed: boolean;

  // SEARCH
  globalSearch: string;

  // NOTIFICATIONS
  notifications: Notification[];

  unreadCount: number;

  // AI STATUS
  aiProcessing: boolean;

  // LOADING
  appLoading: boolean;

  // ACTIONS
  toggleSidebar: () => void;

  setGlobalSearch: (
    value: string
  ) => void;

  addNotification: (
    notification: Notification
  ) => void;

  removeNotification: (
    id: string
  ) => void;

  clearNotifications: () => void;

  setAIProcessing: (
    status: boolean
  ) => void;

  setAppLoading: (
    status: boolean
  ) => void;
};

const useAppStore = create<AppState>(
  (set) => ({
    // INITIAL STATES
    sidebarCollapsed: false,

    globalSearch: "",

    notifications: [],

    unreadCount: 0,

    aiProcessing: false,

    appLoading: false,

    // ACTIONS
    toggleSidebar: () =>
      set((state) => ({
        sidebarCollapsed:
          !state.sidebarCollapsed,
      })),

    setGlobalSearch: (value) =>
      set({
        globalSearch: value,
      }),

    addNotification: (notification) =>
      set((state) => ({
        notifications: [
          notification,
          ...state.notifications,
        ],

        unreadCount:
          state.unreadCount + 1,
      })),

    removeNotification: (id) =>
      set((state) => ({
        notifications:
          state.notifications.filter(
            (item) => item.id !== id
          ),
      })),

    clearNotifications: () =>
      set({
        notifications: [],
        unreadCount: 0,
      }),

    setAIProcessing: (status) =>
      set({
        aiProcessing: status,
      }),

    setAppLoading: (status) =>
      set({
        appLoading: status,
      }),
  })
);

export default useAppStore;