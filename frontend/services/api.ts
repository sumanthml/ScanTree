import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";

/*
=====================================
AXIOS INSTANCE
=====================================
*/

const API = axios.create({
  baseURL: "https://scantree.onrender.com",
  timeout: 30000,
});

/*
=====================================
REQUEST INTERCEPTOR
— Attaches Firebase token to every
  request automatically
=====================================
*/

API.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Load dynamic backend URL if set by developer
      const storedUrl = await AsyncStorage.getItem("backend_url");
      if (storedUrl) {
        config.baseURL = storedUrl;
      }

      // Add localtunnel bypass header in case they use localtunnel
      config.headers["Bypass-Tunnel-Reminder"] = "true";

      const token = await AsyncStorage.getItem("access_token");

      // Let auth.ts pass its own header — don't override it
      if (token && !config.headers?.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      config.headers.Accept = "application/json";

      // Don't set Content-Type for FormData — let Axios handle boundary
      if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      }

      return config;
    } catch (error) {
      return config;
    }
  },
  (error) => Promise.reject(error)
);

/*
=====================================
RESPONSE INTERCEPTOR
— On 401: clears the stale token
  and triggers a navigation to /login
=====================================
*/

let _onUnauthorized: (() => void) | null = null;

/** Call once from _layout.tsx to register the logout redirect callback */
export function registerUnauthorizedHandler(callback: () => void) {
  _onUnauthorized = callback;
}

API.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const status = error.response?.status;
    const url = error.config?.url ?? "";

    // Only force logout on 401 if this is NOT the login/sync call itself
    // (we don't want a redirect loop when the user is actively logging in)
    const isAuthCall = url.includes("/auth/sync") || url.includes("/auth/me");

    if (status === 401 && !isAuthCall) {
      // Clear the stale session token
      await AsyncStorage.multiRemove(["access_token", "scantree_user", "scantree_active_profile"]);
      delete API.defaults.headers.common.Authorization;

      // Notify root layout to navigate to login
      _onUnauthorized?.();
    }

    return Promise.reject(error);
  }
);

export default API;
