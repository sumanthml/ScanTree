import {
  useAuthStore,
} from "@/store/authStore";

export default function useAuth() {

  const {

    user,

    accessToken,

    isAuthenticated,

    isLoading,

    login,

    logout,

    restoreSession,

  } = useAuthStore();

  return {

    user,

    accessToken,

    isAuthenticated,

    isLoading,

    login,

    logout,

    restoreSession,
  };
}